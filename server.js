import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 헬스 체크용
app.get("/", (req, res) => {
    res.send("OK: Proxy is running.");
});

// 프록시 엔드포인트
app.post("/v1/chat/completions", async (req, res) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Missing API Key" });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: "Proxy error", details: error.message });
    }
});

// Render는 고정 포트(3000) 사용 ❌
// Render가 제공하는 PORT 사용해야 함 ⬇️
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on ${PORT}`));
