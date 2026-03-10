import { GoogleGenAI, Type } from "@google/genai";
import { DisasterType, DrillScenario, UserRole } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const drillSchema = {
  type: Type.OBJECT,
  properties: {
    scenario: {
      type: Type.STRING,
      description: "A detailed, immersive disaster scenario set in an Indian school context. It should be 1-2 sentences long."
    },
    questions: {
      type: Type.ARRAY,
      description: "A list of 3 multiple-choice questions related to the scenario.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionText: {
            type: Type.STRING,
            description: "The question text."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers (strings). One must be correct.",
            items: { type: Type.STRING }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer from the options list."
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation (1-2 sentences) of why the answer is correct and others are wrong."
          }
        },
        required: ["questionText", "options", "correctAnswer", "explanation"]
      }
    }
  },
  required: ["scenario", "questions"]
};

export const generateDrillScenario = async (disasterType: DisasterType, userRole: UserRole): Promise<DrillScenario | null> => {
  try {
    let ageGroupPrompt = '';
    switch (userRole) {
      case UserRole.STUDENT_PRIMARY:
        ageGroupPrompt = 'The target audience is a young child in grades 1-5 (age 6-10). Use very simple language and relatable situations for a child.';
        break;
      case UserRole.STUDENT_SECONDARY:
        ageGroupPrompt = 'The target audience is a teen in grades 6-12 (age 11-17). The scenario can be slightly more complex.';
        break;
      case UserRole.STUDENT_COLLEGE:
        ageGroupPrompt = 'The target audience is a young adult college student (age 18+). The questions can be more technical.';
        break;
      case UserRole.GUEST:
      default:
        ageGroupPrompt = 'The target audience is an adult (parent or teacher). The scenario should be appropriate for a guardian or administrator.';
        break;
    }

    const prompt = `Generate a virtual disaster drill for Indian school students. The disaster is an ${disasterType}. ${ageGroupPrompt} The scenario should be engaging and the questions should test practical safety knowledge. Create exactly 3 questions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: drillSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    if (data.questions && data.questions.length === 3) {
      return data as DrillScenario;
    } else {
      console.error("Generated scenario does not have exactly 3 questions.", data);
      return null;
    }

  } catch (error) {
    console.error("Error generating drill scenario:", error);
    return null;
  }
};