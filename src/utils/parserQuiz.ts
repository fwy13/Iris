import { ImageData } from "./parserDocx";

type ImageMap = {
    [key: string]: {
        data: string;
        w: number;
        h: number;
    };
};
export type QuizQuestion = {
    number: number;
    question: string;
    answer: string[];
    right: number[];
    rw: boolean;
};
export function parseQuizText(
    text: string,
    images: ImageData[]
): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    const questionPattern = /^Câu (\d+)[:.]\s*(.+)/;
    const standardAnswerPattern = /^([*])?\s*([A-Da-d])[.:]\s*(.+)/; // A. A: a. a:
    const parenAnswerPattern = /^([*])?\s*([a-d])\)\s*(.+)/; // a) a). *a) *a).

    let currentQuestion: QuizQuestion | null = null;
    let questionNumber = 0;
    let isCollectingQuestion = false;

    for (const line of lines) {
        const questionMatch = line.match(questionPattern);
        if (questionMatch) {
            if (currentQuestion) {
                questions.push(currentQuestion);
            }
            questionNumber = parseInt(questionMatch[1]);
            currentQuestion = {
                number: questionNumber,
                question: questionMatch[2].trim(),
                answer: [],
                right: [],
                rw: false,
            };
            isCollectingQuestion = true;
            continue;
        }

        if (isCollectingQuestion && currentQuestion) {
            if (
                line.match(standardAnswerPattern) ||
                line.match(parenAnswerPattern)
            ) {
                isCollectingQuestion = false;
            } else {
                currentQuestion.question += "\n" + line.trim();
                continue;
            }
        }
        const imageMap: ImageMap = {};
        images.forEach((img: ImageData) => {
            imageMap[img.id] = {
                data: img.data || "",
                w: img.width || 0,
                h: img.height || 0,
            };
        });

        if (currentQuestion) {
            currentQuestion.question = currentQuestion.question.replace(
                /\[img:([^\]]+)\]/g,
                (match, imgPath) => {
                    const imgData = imageMap[imgPath];
                    const scale = 0.4;
                    return imgData
                        ? `<img src="${imgData.data}" style="width: ${
                              imgData.w * scale
                          }px; height: ${imgData.h * scale}px;"/>`
                        : match;
                }
            );
        }

        const standardAnswerMatch = line.match(standardAnswerPattern);
        if (standardAnswerMatch && currentQuestion) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, star, letter, content] = standardAnswerMatch;
            const upperLetter = letter.toUpperCase();
            const index = upperLetter.charCodeAt(0) - "A".charCodeAt(0);

            currentQuestion.answer.push(content.trim());
            if (star === "*") {
                currentQuestion.right.push(index);
            }
            continue;
        }

        const parenAnswerMatch = line.match(parenAnswerPattern);
        if (parenAnswerMatch && currentQuestion) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, star, letter, content] = parenAnswerMatch;
            const index = letter.charCodeAt(0) - "a".charCodeAt(0);

            currentQuestion.rw = true;
            currentQuestion.answer.push(content.trim());
            if (star === "*") {
                currentQuestion.right.push(index);
            }
        }
    }
    if (currentQuestion) {
        questions.push(currentQuestion);
    }

    return questions;
}
