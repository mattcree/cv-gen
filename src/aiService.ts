import { Configuration, OpenAIApi } from "openai";

const API_KEY = "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";

const configuration = new Configuration({
  apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);

export const prompt = async (promptString: string): Promise<string[]> => {
  return await openai
    .createCompletion("text-davinci-002", {
      prompt: promptString,
      temperature: 1,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0
    })
    .then(async (response) => {
      const choices = response.data.choices ?? [];
      const choiceText = choices.map((it) => it.text ?? "");
      return choiceText;
    });
};

export interface AIService {
  prompt: (promptString: string) => Promise<string[]>;
}
