import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const optimizeCodeWithAi = async (
  code: string,
  language: string
): Promise<string> => {
  const prompt = `
You are a senior software engineer.

TASK:
Rewrite and optimize the following ${language} code.
- Fix bugs
- Improve readability
- Improve performance
- Follow best practices

RULES:
- Output ONLY code
- No explanations
- No markdown
- No backticks

INPUT CODE:
${code}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return response.choices[0].message.content || "";
};
