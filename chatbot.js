import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";

// 🔑 Put your Gemini API key here
const genAI = new GoogleGenerativeAI("AIzaSyDuY4BCPDj7mhrbt0mBCatrNaklGCI-U2M");

// Your project knowledge (can be replaced with file loading later)
const projectNotes = `
Problem:
- No proof of erasure → buyers & auditors don’t trust.
- Wipes are complex & error-prone → risk of bricking.
- Wrong methods leave recoverable data (esp. SSD/NVMe).
- Too many fragmented tools across OS/storage types.
- “Did it really wipe?” doubt remains.
- SMEs struggle to show CSR/environmental responsibility.

Solution:
- Tamper-proof proof → Blockchain-anchored certificates + real-time logs.
- Correct erasure → Dual-phase sanitization (crypto-erase + firmware sanitize).
- Proof loop → Built-in forensic recovery test, auto re-wipe if needed.
- Unified tool → Works across Windows, Linux, Android, HDD/SSD/NVMe.
- CSR dashboard showing CO₂ saved, landfill reduction, devices recycled.
`;

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  console.log("🤖 Secure Data Erasure Chatbot");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const userInput = readlineSync.question("You: ");
    if (userInput.toLowerCase() === "exit") break;

    const prompt = `
You are a helpful chatbot that answers questions about a Secure Data Erasure System.
Here is the project context:
${projectNotes}

User question: ${userInput}
`;

    const result = await model.generateContent(prompt);
    console.log("Bot:", result.response.text());
  }
}

main();
