// app/api/tts/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "ar";

  if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

  const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text
  )}&tl=${lang}&client=tw-ob`;

  try {
    const response = await fetch(googleTTSUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0", // ضروري لإقناع جوجل بأن الطلب ليس من "بوت"
      },
    });

    if (!response.ok) throw new Error("Failed to fetch from Google");

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
