import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ✔ 최신 OpenAI API endpoint 사용
const OPENAI_URL = "https://api.openai.com/v1/responses";

app.post("/v1/chat/completions", async (req, res) => {
    try {
        const response = await fetch(OPENAI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: req.body.model,
                input: req.body.messages[1].content
            })
        });

        const data = await response.json();

        // Tampermonkey가 이해할 수 있는 구조로 변환
        res.json({
            choices: [
                {
                    message: {
                        content: data.output_text
                    }
                }
            ]
        });

    } catch (error) {
        res.status(500).json({
            error: "Proxy error",
            details: error.message
        });
    }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
