import { GoogleGenAI, Type } from "@google/genai";

/**
 * PRODUCTION NOTE:
 * In a commercial environment, this service should reside on a private Node.js backend.
 * The frontend would call your server (e.g., POST /api/analyze), and your server 
 * would hold the API_KEY and these System Instructions securely.
 */

const SYSTEM_INSTRUCTION = `
You are the Futura Chron V1 Core Engine, a high-precision temporal-price harmonic processor specializing in Gann-style financial astrology.

CORE MATHEMATICAL FRAMEWORK:
1. SPATIAL: Convert geographic coordinates to local horizon perspectives.
2. TEMPORAL: Map linear time to ecliptic degrees (0-360). 
3. HARMONICS: Identify "Square of Nine" relationships and geometric squaring of time/price vectors.
4. CALCULATION: For a given Latitude/Longitude and Time, you must accurately estimate the Ascendant or Midheaven degree for each step in a sequence.

BUSINESS RULES:
- Identify "isSquare" when degrees align with perfect square integers (e.g., 144, 169, 196).
- Flag "match: STRONG" when the variance (delta) between the calculated degree and the time-target is < 0.25.
- "quantumNotes" must be professional, technical, and use financial/astronomical terminology (e.g., "Zenith Confluence", "Horizontal Parity", "Ecliptic Resistance").
- Accuracy is paramount. Use high-reasoning capabilities to verify math before outputting JSON.
`;

export const calculateMatrixData = async (
  location: any,
  dateTime: any,
  priceMatrix: any,
  timeMapping: any
) => {
  // Always use the API key directly from process.env as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform temporal scan for ${location.preset}. 
      Start: ${dateTime.date} ${dateTime.time}. 
      Range: ${dateTime.count} nodes at ${dateTime.step}min intervals. 
      Mode: ${timeMapping.mode}. 
      Parameters: PriceRange(${priceMatrix.low}-${priceMatrix.high}), Precision(${timeMapping.lahiri ? 'Sidereal' : 'Tropical'}).`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              dateTime: { type: Type.STRING },
              asc: { type: Type.NUMBER },
              timeTarget: { type: Type.NUMBER },
              deltaAscPrice: { type: Type.NUMBER },
              match: { type: Type.STRING, enum: ["STRONG", "NEUTRAL"] },
              quantumNotes: { type: Type.STRING },
              isSquare: { type: Type.BOOLEAN }
            },
            required: ["id", "dateTime", "asc", "timeTarget", "deltaAscPrice", "match", "quantumNotes", "isSquare"]
          }
        },
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    // Access the .text property directly. It is not a method call.
    const resultText = response.text;
    if (!resultText) {
      return [];
    }

    const data = JSON.parse(resultText);
    return data;
  } catch (error: any) {
    // Production-grade error categorization
    if (error.message?.includes('429')) {
      throw new Error("RATE_LIMIT: Computational nodes saturated. Please wait 60s.");
    }
    if (error.message?.includes('401')) {
      throw new Error("AUTH_ERROR: Invalid licensing credentials.");
    }
    console.error("Critical Engine Error:", error);
    throw new Error("CORE_FAILURE: Matrix calculation interrupted.");
  }
};