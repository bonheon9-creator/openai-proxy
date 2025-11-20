import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ========== CORS 완전 허용 ==========
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// JSON 파서
app.use(express.json());

// ========== 테스트용 엔드포인트 ==========
app.get("/test", (req, res) => {
    res.json({ status: "OK", message: "Proxy is alive." });
});

// ========== OpenAI Chat Completion Proxy ==========
app.post("/v1/chat/completions", async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({
            error: "Proxy error",
            details: error.message
        });
    }
});

// ========== 서버 실행 ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
