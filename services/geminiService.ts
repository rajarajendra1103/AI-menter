
import { GoogleGenAI, Type } from "@google/genai";
import { NoteData, CompilerAnalysis, KeywordDetail } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateNotes = async (topic: string): Promise<NoteData> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate comprehensive programming notes for the topic: "${topic}". 
    The output must strictly follow this JSON format. Use Mermaid syntax for the flowchart.
    Include an "Exam" section with 3-5 challenging multiple choice questions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          types: { type: Type.ARRAY, items: { type: Type.STRING } },
          syntax: { type: Type.STRING },
          flowchartMermaid: { type: Type.STRING },
          exampleProgram: { type: Type.STRING },
          errorProneProgram: { type: Type.STRING },
          howToUse: { type: Type.STRING },
          restrictions: { type: Type.STRING },
          useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-based)" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["concept", "syntax", "flowchartMermaid", "exampleProgram", "errorProneProgram", "howToUse", "restrictions", "useCases", "quiz"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getLanguageKeywords = async (language: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `List the most important reserved keywords and built-in functions for the programming language: ${language}. Return them as a simple JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const getKeywordExplanation = async (language: string, keyword: string): Promise<KeywordDetail> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the keyword or built-in "${keyword}" in the language ${language}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          concept: { type: Type.STRING },
          howToUse: { type: Type.STRING },
          whereToUse: { type: Type.STRING },
          example: { type: Type.STRING }
        },
        required: ["keyword", "concept", "howToUse", "whereToUse", "example"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeCode = async (code: string, language: string, input: string): Promise<CompilerAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a visualizer compiler for the following code:
    Language: ${language}
    Input: ${input}
    Code:
    ${code}

    Perform a deep execution analysis and return a structured JSON response. 
    - stateTable: A step-by-step trace of variable changes. 'variables' should be an array of {name: string, value: string} objects.
    - asciiFlow: A simple text/ASCII visualization of the control path.
    - mermaidChart: Advanced flow of logic (Mermaid string).
    - narration: Array of human-readable steps.
    - executionLogic: A detailed explanation of the logic, AND include a relatable real-world analogy/example for better understanding.
    - animationData: Specific sequence for UI nodes highlighting (variables, loops).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          asciiFlow: { type: Type.STRING },
          stateTable: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                line: { type: Type.INTEGER },
                variables: { 
                  type: Type.ARRAY, 
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["name", "value"]
                  }
                },
                description: { type: Type.STRING }
              },
              required: ["step", "line", "variables", "description"]
            }
          },
          executionLogic: { type: Type.STRING },
          mermaidChart: { type: Type.STRING },
          narration: { type: Type.ARRAY, items: { type: Type.STRING } },
          output: { type: Type.STRING },
          animationData: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING }
                  },
                  required: ["id", "label", "type"]
                }
              },
              highlightSequence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nodeId: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["nodeId"]
                }
              }
            },
            required: ["nodes", "highlightSequence"]
          }
        },
        required: ["asciiFlow", "stateTable", "executionLogic", "mermaidChart", "narration", "output", "animationData"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
