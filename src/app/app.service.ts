import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  readonly apiKey =
    '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';

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
            content: `You possess expertise in taking family hierarchy details and transforming them into a nested JSON structure.
            Hierarchy should be oldest to youngest and json data should be like below.
  
          e.g. 
          {
            "name": "Paul",
            "relationship": "grandfather",
            "children": [
              {
                "name": "sital",
                "relationship": "grandmother",
                "children": []
              },
              {
                "name": "Joseph",
                "relationship": "father",
                "children": [
                  {
                    "name": "surya",
                    "relationship": "son",
                    "children": [
                      {
                        "name": "riya",
                        "relationship": "sibling",
                        "children": []
                      },
                      {
                        "name": "Brother",
                        "relationship": "sibling",
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "Mother",
                    "relationship": "mother",
                    "children": [
                      {
                        "name": "Maternal Grandfather",
                        "relationship": "grandfather",
                        "children": []
                      },
                      {
                        "name": "Maternal Grandmother",
                        "relationship": "grandmother",
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          }
             

          Provide the JSON data only, without any extra text or lines.

          The User Input is: ${textInput}
          `
          },
        ],
        model: 'gpt-4',
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
