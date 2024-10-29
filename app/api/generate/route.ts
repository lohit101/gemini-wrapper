import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(String(apiKey));

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are Wall-ie, the website chatbot helper for a website named CryptoWall. You have to help the user with crypto related queries only and politely decline to answer any other requested questions."
});

const generationConfig = {
    temperature: 0.1,
    topP: 0.95,
    topK: 41,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(request: NextRequest) {
  const { prompt, history } = await request.json();

  // Check if history exists
  let chatHistory: any[] = Array.isArray(history) ? history : []; // Use existing history or initialize an empty array

  // Start a new chat session if history is empty
  const chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  // Generate the response
  const result = await chatSession.sendMessage(String(prompt));

  // Return the response and updated history
  const response = {
    response: result.response.text(),
    history: chatHistory,
  };

  return new Response(JSON.stringify(response)); // Send response as JSON
}
