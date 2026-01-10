import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateNewTheme(currentMood: string) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Generate a JSON theme for a 3D plasma globe based on the mood: "${currentMood}".
Include hex colors for Deep, Mid, Bright, and Shell.
Include numeric values for:
- scale (0.05 to 0.4)
- brightness (0.5 to 3.0)
- void threshold (0.0 to 0.5).`,
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
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", text);
        return null;
    }
  } catch (error) {
    console.error("Gemini theme generation failed:", error);
    return null;
  }
}
