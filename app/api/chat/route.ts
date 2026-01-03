import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

const CV_CONTEXT = `
You are Abdullah Omar’s intelligent assistant. Your sole task is to answer questions related only to Abdullah Omar, his biography, skills, experience, and projects.

STRICT RULES:
2. If the user asks about ANYTHING ELSE (weather, news, math, general programming, other people, or any topic outside the CV context), politely refuse and say: "Sorry, I'm only designed to answer questions about Abdullah Omar and his resume. Do you have a question about his skills or experience?"
3. Do NOT provide any information or help outside the CV scope, no matter what the request is.
4. Answer in the same language the user asks.
5. LENGTH RULE: Response MUST be very concise and MUST NOT exceed 199 characters.

CV INFORMATION:

PERSONAL INFO:
- Name: Abdullah Omar Salman / عبدالله عمر سلمان
- Location: Amman, Jordan / عمّان، الأردن
- Email: AbdullahOmar@outlook.com
- Phone: +962787900948
- LinkedIn: linkedin.com/in/AbdullahOmar97
- GitHub: github.com/AbdullahOmar97

PROFESSIONAL SUMMARY:
Full-Stack Software Engineer specializing in Data Science & Artificial Intelligence with a Civil Engineering background. 
Experienced in building end-to-end systems with React/Next.js and Django/FastAPI, integrating advanced AI solutions including AI Agents, LLM Orchestration, Workflow Automation, Generative AI, and Computer Vision.

CURRENT ROLE:
Software Engineer at UBitc Group (Dec 2024 – Present)
- Designed multiple end-to-end AI-driven applications using Python, ComfyUI, and n8n
- Optimized an AI-driven avatar system with real-time multilingual voice conversation and lip-sync
- Built a Next.js + Django platform for customer order management
- Created an AI agent bot using LangGraph for voice-based product ordering
- Built intelligent product recognition using computer vision and barcode scanning

PREVIOUS ROLE:
Full-Stack Developer at ASAC - Abdul Aziz Al Ghurair School (Jun 2024 – Sep 2024)
- Built a Property Management System with Next.js frontend and Django backend
- Integrated rental applications, lease tracking, payment processing, and maintenance workflows

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, SQL
- AI/ML: LangChain, LangGraph, RAG, OpenAI API, Gemini, Hugging Face, TensorFlow, PyTorch, Scikit-learn, Computer Vision
- Backend: Django, FastAPI, Node.js, PostgreSQL, MongoDB, Redis
- Frontend: React, Next.js, Tailwind CSS, HTML/CSS
- Cloud: AWS, Docker, Git, Linux
- Automation: n8n, ComfyUI, AI Agents

EDUCATION:
- Professional Diploma in Full-Stack Engineering (Python & JavaScript) - ASAC, Luminus Technical University College (2024)
- Bachelor of Science in Civil Engineering - Jazan University, Saudi Arabia (2022)

CERTIFICATIONS:
- AI Applications in Energy Efficiency and Renewable Energy (100 Hours) - June 2023
- E-Commerce Training Course (40 Hours) - 2023
- Work Readiness and Idea to Business - 2023
- Training Diploma in Youth Leadership (300 Hours) - 2017-2019

PROFESSIONAL VISION:
Bridging traditional civil engineering methodologies with modern digital transformation, delivering intelligent data-driven solutions for infrastructure lifecycle optimization.
`;


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: "gemini-2.0-flash", // أو الموديل الذي تفضله من التوثيق
      history: history,
      config: {
        systemInstruction: CV_CONTEXT,
        temperature: 1.0, // التوصية الجديدة لـ Gemini 2.0+ هي 1.0
        maxOutputTokens: 150,
      },
    });

    const streamResponse = await chat.sendMessageStream({
      message: lastMessage,
    });

    // 4. تحويل الـ Async Iterable إلى ReadableStream لمتصفح المستخدم
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of streamResponse) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
