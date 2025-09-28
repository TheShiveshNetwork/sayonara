// app/api/chat/route.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";

interface ChatRequest {
  message: string;
  conversationId?: string;
}

interface ChatResponse {
  response: string;
  conversationId: string;
  success: boolean;
  error?: string;
}

// Store conversations in memory (in production, use Redis or a database)
const conversations = new Map<string, ConversationChain>();

const initializeModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: "gemini-2.5-flash",
    temperature: 0.7,
  });
};

const createConversation = () => {
  const model = initializeModel();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful chatbot for Secure Data Erasure System. Answer clearly and concisely. Provide practical guidance about data security, erasure methods, compliance standards, and system features."],
    ["human", "{input}"],
  ]);

  return new ConversationChain({
    llm: model,
    prompt,
  });
};

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationId } = body;

    // Validation
    if (!message?.trim()) {
      return new Response(JSON.stringify({
        response: '',
        conversationId: conversationId || '',
        success: false,
        error: 'Message is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate conversation ID if not provided
    const currentConversationId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get or create conversation
    let conversation = conversations.get(currentConversationId);
    if (!conversation) {
      conversation = createConversation();
      conversations.set(currentConversationId, conversation);
      
      // Clean up old conversations (keep only last 50)
      if (conversations.size > 50) {
        const oldestKey = conversations.keys().next().value;
        if (oldestKey) conversations.delete(oldestKey);
      }
    }

    // Get response from the chatbot
    const result = await conversation.call({ input: message });

    const response: ChatResponse = {
      response: result.response,
      conversationId: currentConversationId,
      success: true
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    
    const errorResponse: ChatResponse = {
      response: '',
      conversationId: '',
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}