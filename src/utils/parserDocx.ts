import JSZip from "jszip";
import { Dispatch, SetStateAction } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ImageData = {
    id: string;
    data?: string;
    target?: string;
    contentType: string;
    width?: number;
    height?: number;
};
export type Relationship = {
    Id: string;
    Type: string;
    Target: string;
    ContentType?: string;
};


export const getImagesFromDrawingNodes = (
    drawingNodes: HTMLCollectionOf<Element>,
    relationships: any
): ImageData[] => {
    const images: ImageData[] = [];
    for (let i = 0; i < drawingNodes.length; i++) {
        const drawingNode = drawingNodes[i];
        const blipNode = drawingNode.getElementsByTagName("a:blip")[0];
        if (!blipNode) continue;
        const embedAttr = blipNode.attributes.getNamedItem("r:embed");
        if (!embedAttr) continue;
        const relationshipId = embedAttr.value;
        const imageInfo = relationships[relationshipId];
        if (!imageInfo) continue;

        images.push({
            id: imageInfo.Id,
            target: imageInfo.Target,
            contentType: imageInfo.ContentType,
        });
    }
    return images;
};

export const extractTextFromDocx = async (
    arrayBuffer: ArrayBuffer,
    setImages: Dispatch<SetStateAction<ImageData[]>>
): Promise<string> => {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");

    if (!documentXml) {
        throw new Error("Could not find document.xml in the DOCX file");
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, "application/xml");
    const paragraphNodes = xmlDoc.getElementsByTagName("w:p");
    const relationships = await parseRelationships(zip);

    const result: string[] = [];
    const images: ImageData[] = [];
    const imageFiles = Object.keys(zip.files).filter((path) =>
        path.startsWith("word/media/")
    );
    for (const imagePath of imageFiles) {
        const imageFile = zip.files[imagePath];
        const imageData = await imageFile.async("base64");
        const extension = imagePath.split(".").pop()?.toLowerCase() || "png";
        const img = new Image();
        img.src = `data:image/${extension};base64,${imageData}`;

        await new Promise((resolve) => {
            img.onload = () => resolve(null);
        });
        images.push({
            id: imageFile.name.slice(5),
            data: `data:image/${extension};base64,${imageData}`,
            contentType: `image/${extension}`,
            width: img.naturalWidth,
            height: img.naturalHeight,
        });
    }
    setImages(images);
    for (let i = 0; i < paragraphNodes.length; i++) {
        const paragraphNode = paragraphNodes[i];
        let paragraphText = "";
        const lencolor = paragraphNode.getElementsByTagName("w:color").length;
        for (let j = 0; j < lencolor; j++) {
            const colorNode = paragraphNode.getElementsByTagName("w:color")[j];
            if (colorNode.getAttribute("w:val") === "FF0000") {
                paragraphText += "*";
                break;
            }
        }
        const textNodes = paragraphNode.getElementsByTagName("w:t");
        for (let j = 0; j < textNodes.length; j++) {
            paragraphText += textNodes[j].textContent;
        }

        const drawingNodes = paragraphNode.getElementsByTagName("w:drawing");
        const paragraphImages = getImagesFromDrawingNodes(
            drawingNodes,
            relationships
        );
        const textComment = paragraphText.match(
            /^(Câu|câu)\s\d+[:.]|^[aA]\.|^[A-Da-d]\./
        );
        if (!textComment && !paragraphText.includes("*")) {
            result.push(
                `${paragraphText.trim()} ${
                    paragraphImages.length > 0
                        ? `[img:${paragraphImages[0].target}]`
                        : ""
                }`
            );
        } else if (paragraphText.trim()) {
            result.push(paragraphText.trim());
        }
    }
    return result.join("\n");
};

export const parseRelationships = async (
    zip: JSZip
): Promise<Record<string, Relationship>> => {
    const relsXml = await zip
        .file("word/_rels/document.xml.rels")
        ?.async("text");
    if (!relsXml) return {};
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(relsXml, "application/xml");
    const relationships: Record<string, Relationship> = {};

    const relationshipNodes = xmlDoc.getElementsByTagName("Relationship");
    for (let i = 0; i < relationshipNodes.length; i++) {
        const node = relationshipNodes[i];
        const id = node.getAttribute("Id");
        const type = node.getAttribute("Type");
        const target = node.getAttribute("Target");

        if (id && type && target) {
            relationships[id] = {
                Id: id,
                Type: type,
                Target: target,
                ContentType: type.includes("image")
                    ? type.split("/").pop()
                    : undefined,
            };
        }
    }
    return relationships;
};
