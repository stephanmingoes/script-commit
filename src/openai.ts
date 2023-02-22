import { Configuration, OpenAIApi, CreateCompletionRequest } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const _openai = new OpenAIApi(configuration);

const PROMPT = (body: string) => {
  return `Generate and return an explicit and detailed commit message that carefully explains the changes 
  that was provided using the 'git diff --cached' command.
  Answer must be returned in this format -  git commit -m "{commit_message}"
  You can assume that the input paragraph will be provided as a string. The paragraph is below in double quotes.

"${body}"
`;
};
export async function generateMessage(body: string) {
  const prompt = PROMPT(body);
  const max_tokens = 1000;

  if (Math.floor(prompt.length / 4) + max_tokens > 4000)
    throw new Error("Prompt is too long to generate message.");

  const parameters: CreateCompletionRequest = {
    model: "text-davinci-003",
    prompt: prompt,
    n: 1,
    max_tokens: max_tokens,
    stream: false,
    stop: "\n\n",
    temperature: 0.7,
  };

  const response = await _openai.createCompletion(parameters);
  return response.data.choices[0].text;
}
