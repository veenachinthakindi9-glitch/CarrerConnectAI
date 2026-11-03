require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testAI() {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: "Generate one simple frontend developer interview question."
        }
      ]
    });

    console.log("AI WORKING!");
    console.log(response.choices[0].message.content);

  } catch (error) {
    console.log("AI ERROR:", error.message);
  }
}

testAI();