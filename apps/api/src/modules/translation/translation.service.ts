import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { config } from '@videochat/config';

@Injectable()
export class TranslationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
  }

  async translate(text: string, targetLanguage: string, sourceLanguage?: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate the following text to ${targetLanguage}.${sourceLanguage ? ` Source language: ${sourceLanguage}.` : ''} Return only the translated text, no explanations.`,
          },
          { role: 'user', content: text },
        ],
        max_tokens: 500,
      });

      return {
        originalText: text,
        translatedText: response.choices[0].message.content || text,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
      };
    } catch {
      return {
        originalText: text,
        translatedText: text,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
      };
    }
  }

  async detectLanguage(text: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Detect the language of the following text. Return only the language code (e.g., "en", "es", "fr", "de", "zh", "ja", "ko", "ar", "hi", "pt").',
          },
          { role: 'user', content: text },
        ],
        max_tokens: 10,
      });

      return { text, detectedLanguage: response.choices[0].message.content || 'en' };
    } catch {
      return { text, detectedLanguage: 'en' };
    }
  }
}
