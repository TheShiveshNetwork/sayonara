import 'dotenv/config';
import readlineSync from 'readline-sync';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";

// ✅ Initialize Gemini with API Key
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-1.5-flash",  // you can also use gemini-1.5-pro
});

// ✅ Build a prompt template (keeps conversation coherent)
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful chatbot for Secure Data Erasure System. Answer clearly and concisely."],
  ["human", "{input}"],
]);

const conversation = new ConversationChain({
  llm: model,
  prompt,
});

console.log("🤖 Secure Data Erasure Chatbot Started! Type 'exit' to quit.\n");

async function chat() {
  while (true) {
    const userInput = readlineSync.question("You: ");
    if (userInput.toLowerCase() === "exit") {
      console.log("👋 Goodbye!");
      break;
    }

    try {
      const result = await conversation.call({ input: userInput });
      console.log("Bot:", result.response, "\n");
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }
}

chat();
