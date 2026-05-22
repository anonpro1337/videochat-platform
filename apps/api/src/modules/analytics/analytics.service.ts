import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(userId: string, event: string, properties?: Record<string, unknown>) {
    // In production, send to PostHog
    console.log(`[Analytics] User ${userId}: ${event}`, properties);
    return { tracked: true };
  }

  async getUserStats(userId: string) {
    const [matchCount, messageCount, callCount, friendCount] = await Promise.all([
      this.prisma.match.count({
        where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      }),
      this.prisma.message.count({ where: { senderId: userId } }),
      this.prisma.call.count({
        where: { OR: [{ callerId: userId }, { calleeId: userId }] },
      }),
      this.prisma.friendship.count({
        where: {
          OR: [{ requesterId: userId }, { addresseeId: userId }],
          status: 'ACCEPTED',
        },
      }),
    ]);

    return { matchCount, messageCount, callCount, friendCount };
  }
}
