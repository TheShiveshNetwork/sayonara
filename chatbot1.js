import 'dotenv/config';
import readlineSync from 'readline-sync';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("🤖 Secure Data Erasure Chatbot Started! Type 'exit' to quit.\n");

async function chat() {
  while (true) {
    const userInput = readlineSync.question("You: ");
    if (userInput.toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      break;
    }

    try {
      const result = await model.generateContent(userInput);
      console.log("Bot:", result.response.text(), "\n");
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }
}

chat();
