import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { config } from '@videochat/config';

@Injectable()
export class ModerationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
  }

  async moderateText(text: string) {
    try {
      const response = await this.openai.moderations.create({ input: text });
      const result = response.results[0];

      return {
        isExplicit: result.flagged,
        toxicityScore: result.categories.harassment ? 0.9 : 0,
        sexualScore: result.categories.sexual ? 0.9 : 0,
        violenceScore: result.categories.violence ? 0.9 : 0,
        spamScore: result.categories.harassment ? 0.5 : 0,
        flaggedLabels: Object.entries(result.categories)
          .filter(([, v]) => v)
          .map(([k]) => k),
        isSafe: !result.flagged,
      };
    } catch {
      // If moderation fails, allow content through
      return { isExplicit: false, isSafe: true, flaggedLabels: [] };
    }
  }

  async moderateImage(imageUrl: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for: nudity, violence, drugs, weapons, hate symbols. Return JSON: { "isExplicit": bool, "categories": string[], "confidence": number, "description": string }',
              },
              { type: 'image_url', image_url: { url: imageUrl, detail: 'low' } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        isExplicit: result.isExplicit || false,
        categories: result.categories || [],
        confidence: result.confidence || 0,
        description: result.description || '',
      };
    } catch {
      return { isExplicit: false, categories: [], confidence: 0, description: '' };
    }
  }

  async moderateVideoFrame(frameUrl: string) {
    return this.moderateImage(frameUrl);
  }

  async getModerationQueue(page = 1, limit = 20) {
    // In production, this would fetch from DB
    return { page, limit, items: [], total: 0 };
  }

  async takeAction(reportId: string, action: 'WARN' | 'MUTE' | 'BAN' | 'DISMISS', moderatorId: string) {
    // Process moderation action
    return { reportId, action, moderatorId, processedAt: new Date() };
  }
}
