import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { mood } = await req.json();

    if (!mood) {
      return new Response("Missing mood", { status: 400 });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a JSON theme for a 3D plasma globe based on the mood: "${mood}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorDeep: { type: Type.STRING },
            colorMid: { type: Type.STRING },
            colorBright: { type: Type.STRING },
            shellColor: { type: Type.STRING },
            plasmaScale: { type: Type.NUMBER },
            plasmaBrightness: { type: Type.NUMBER },
            voidThreshold: { type: Type.NUMBER },
            description: { type: Type.STRING },
          },
          required: [
            "colorDeep",
            "colorMid",
            "colorBright",
            "shellColor",
            "plasmaScale",
            "plasmaBrightness",
            "voidThreshold",
            "description",
          ],
        },
      },
    });

    const text = result.text;

    if (!text) {
      console.error("Gemini returned empty text", result);
      return new Response("Empty Gemini response", { status: 502 });
    }

    try {
      return Response.json(JSON.parse(text));
    } catch (parseError) {
      console.error("JSON parse error for response:", text);
      return new Response("Invalid JSON from Gemini", { status: 502 });
    }
  } catch (error) {
    console.error("Generate-theme error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
}
