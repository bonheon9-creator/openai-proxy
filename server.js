import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const rsp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'] || ''
      },
      body: JSON.stringify(req.body)
    });
    const data = await rsp.text();
    res.status(rsp.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => console.log('proxy running on 3000'));
