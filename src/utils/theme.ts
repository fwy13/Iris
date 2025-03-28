// lib/monaco-config.ts
import * as monaco from "monaco-editor";

export const configureCustomLanguage = () => {
    // Đăng ký ngôn ngữ tùy chỉnh
    monaco.languages.register({ id: "myCustomLang" });

    // Thiết lập tokenizer
    monaco.languages.setMonarchTokensProvider("myCustomLang", {
        defaultToken: "",
        tokenPostfix: ".mylang",

        keywords: [
            "Câu",
            "câu",
            "A.",
            "B.",
            "C.",
            "D.",
            "*A.",
            "*B.",
            "*C.",
            "*D.",
        ],

        tokenizer: {
            root: [
                // Câu hỏi (màu xanh dương, in đậm)
                [/^(Câu|câu)\s\d+[:.]/, "custom-question"],

                // Đáp án thường (màu đỏ)
                [/^[A-Da-d][.)]/, "custom-answer"],

                // Đáp án đặc biệt có dấu * (màu tím)
                [/^[*][A-Da-d][.)]/, "special-answer"],

                // Ảnh (màu cam)
                [/\[img:\d+\]/, "image-marker"],

                // Text thường
                [/[a-zÀ-ỹ]+/, "custom-text"],

                // Số
                [/[0-9]+/, "custom-number"],
            ],
        },
    });

    // Định nghĩa theme với màu sắc tùy chỉnh
    monaco.editor.defineTheme("my-custom-theme", {
        base: "vs",
        inherit: true,
        rules: [
            {
                token: "custom-question",
                foreground: "0066CC",
                fontStyle: "bold",
            },
            { token: "custom-answer", foreground: "CC0000" },
            {
                token: "special-answer",
                foreground: "9900FF",
                fontStyle: "bold",
            },
            { token: "image-marker", foreground: "FF6600" },
            { token: "custom-text", foreground: "333333" },
            { token: "custom-number", foreground: "098658" },
        ],
        colors: {
            "editor.foreground": "#000000",
            "editor.background": "#f9f9f9",
        },
    });
};
