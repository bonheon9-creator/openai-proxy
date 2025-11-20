import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// JSON 처리
app.use(express.json());

// CORS 허용
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// Proxy 라우터
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
        res.status(500).json({ error: "Proxy error", details: error.message });
    }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
