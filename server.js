const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/generate", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const { description } = req.body;

    const prompt = `
You are an Etsy SEO expert.

Generate Etsy listing content for the product below.

STRICT REQUIREMENTS:

1. TITLE:
- Max 140 characters
- Keyword-rich but natural

2. TAGS:
- EXACTLY 13 tags
- Each tag MUST be under 20 characters
- NO numbering
- NO bullet points
- Each tag on a NEW LINE
- Only plain text

3. DESCRIPTION:
- Clear, engaging, and sales-focused
- Highlight benefits
- Easy to read

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

TITLE:
<your title here>

TAGS:
tag one
tag two
tag three

DESCRIPTION:
<your description here>

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
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({
      error: error.message || "Server error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));