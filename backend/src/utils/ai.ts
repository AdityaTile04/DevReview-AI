import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export interface AIReviewResult {
  summary: string;
  issues: {
    line?: number;
    message: string;
    severity: "low" | "medium" | "high";
  }[];
  suggestions: string[];
  score: number;
}

export const reviewCodeWithAi = async (
  code: string,
  language: string,
  framework?: string
): Promise<AIReviewResult> => {
  const prompt = `
    SYSTEM INSTRUCTION:
    You are a JSON-only API.
    
    CRITICAL RULES (DO NOT BREAK):
    - Output ONLY valid JSON.
    - Do NOT include markdown.
    - Do NOT include explanations.
    - Do NOT include comments.
    - Do NOT include text outside JSON.
    - Do NOT include code blocks.
    - Escape all quotes inside strings.
    - Never use backticks (\`).
    - Never include raw code inside strings.
    
    JSON SCHEMA (MUST MATCH EXACTLY):
    {
      "summary": string,
      "issues": [
        {
          "line": number | null,
          "message": string,
          "severity": "low" | "medium" | "high"
        }
      ],
      "suggestions": string[],
      "score": number
    }
    
    SCORING RULE:
    - Score must be an INTEGER between 0 and 100.
    
    ROLE:
    You are a senior software engineer performing a professional code review.
    
    TASK:
    Analyze the following ${language} code${
    framework ? ` using ${framework}` : ""
  }.
    Identify logic issues, security vulnerabilities, performance problems, and best-practice violations.
    
    INPUT CODE:
    ${code}
    
    OUTPUT:
    Return ONLY the JSON object that matches the schema.
    `;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return JSON.parse(response.choices[0].message.content!);
};
