const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { description } = req.body;

  const prompt = `
You are an Etsy SEO expert.

Generate:
1. Title (max 140 characters)
2. 13 tags
3. Optimized description

Product:
${description}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json({
    result: response.choices[0].message.content,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));