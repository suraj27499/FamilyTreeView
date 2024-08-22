import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly apiKey = '';

  searchPrompt(
    textInput: string
  ): Promise<{ question: string; answer: string | null }> {
    const openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true,
    });

    return openai.chat.completions
      .create({
        messages: [
          {
            role: 'user',
            content: `You possess expertise in taking family hierarchy details and transforming them into an array structure.
             
            user input e.g.
            i am Manmeet, my father name is Roop chand, he has 3 brothers named Samrat Singh ,Dhyan Chand, Sushil Singh, my grandfathers name is Ram singh

            expexted output e.g.
            [
              { "key": 0, "name": "Ram singh", "gender": "M", "birthYear": "", "relationship": "grandfather" },
              { "key": 1, "parent": 0, "name": "Roop chand", "gender": "M", "birthYear": "", "relationship": "father" },
              { "key": 2, "parent": 0, "name": "Samrat Singh", "gender": "M", "birthYear": "", "relationship": "uncle" },
              { "key": 3, "parent": 0, "name": "Dhyan Chand", "gender": "M", "birthYear": "", "relationship": "uncle" },
              { "key": 4, "parent": 0, "name": "Sushil Singh", "gender": "M", "birthYear": "", "relationship": "uncle" },
              { "key": 5, "parent": 1, "name": "Manmeet", "gender": "M", "birthYear": "", "relationship": "son" }
            ]
          Provide the array data only, without any extra text or lines.

          The User Input is: ${textInput}
          `,
          },
        ],
        model: 'gpt-3.5-turbo',
      })
      .then((response) => {
        const output = response.choices[0].message.content;

        const chat = {
          question: textInput,
          answer: output,
        };

        return chat;
      });
  }
}
