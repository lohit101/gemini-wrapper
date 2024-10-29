import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(String(apiKey));

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "You are the website chatbot helper for a website named CryptoWall. You have to help the user with crypto related queries only and politely decline to answer any other requested questions."
});

const generationConfig = {
    temperature: 0.1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(request: Request) {
    const { prompt } = await request.json();

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(prompt || "Tell me a funny joke.");
    return new Response(result.response.text());
}

export async function GET() {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage("Tell me how i can invest in crypto in brief");
    return new Response(result.response.text());
}
