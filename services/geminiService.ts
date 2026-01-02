import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Acts as a high-precision Ephemeris Engine using Gemini 3 Pro.
 */
export const calculateMatrixData = async (
  location: any,
  dateTime: any,
  priceMatrix: any,
  timeMapping: any
) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        ROLE: High-Precision Temporal/Price Harmonic Engine (Gann-style Ephemeris).
        
        DATA CONTEXT:
        - GEOGRAPHIC_ANCHOR: Latitude ${location.latitude}, Longitude ${location.longitude}${location.direction}.
        - TEMPORAL_ANCHOR: ${dateTime.date} at ${dateTime.time} (${location.timezone}).
        - INTERVALS: ${dateTime.count || 24} data points with a step of ${dateTime.step} minutes.
        - CALCULATION_MODE: ${timeMapping.mode}.
        - PRECISION_SYSTEM: ${timeMapping.lahiri ? 'Lahiri/Sidereal (True Ayanamsa)' : 'Tropical (Standard)'}.
        - FINANCIAL_VECTOR: Low: ${priceMatrix.low}, High: ${priceMatrix.high}, Scale: ${priceMatrix.scale}.

        MATHEMATICAL OBJECTIVE:
        1. Calculate the astronomical position (Ecliptic Longitude) for the specified mode (${timeMapping.mode}) for each time interval.
        2. Map the calculated degree [0-360] to the Price Matrix using the provided High/Low range.
        3. Determine "Time Target" based on geometric squaring of the interval.
        4. Calculate "deltaAscPrice" as the variance between the mapped price-degree and the actual degree target.
        5. Flag "isSquare" if either the degree (asc) or the delta matches a perfect square harmonic (4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361).
        
        OUTPUT REQUIREMENT:
        - Return EXACTLY ${dateTime.count} entries.
        - "match": 'STRONG' if deltaAscPrice < 0.25, else 'NEUTRAL'.
        - "quantumNotes": Provide a brief professional technical insight (max 12 words) about the planetary/temporal confluence.
        
        FORMAT: JSON Array.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              dateTime: { type: Type.STRING, description: "Format: YYYY-MM-DD HH:MM" },
              asc: { type: Type.NUMBER, description: "Current calculated ecliptic degree" },
              timeTarget: { type: Type.NUMBER, description: "Geometric degree target" },
              deltaAscPrice: { type: Type.NUMBER, description: "Absolute variance" },
              deltaAscTime: { type: Type.NUMBER },
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

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Ephemeris Engine Critical Error:", error);
    return [];
  }
};