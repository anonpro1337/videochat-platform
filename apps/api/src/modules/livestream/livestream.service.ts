import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class LivestreamService {
  constructor(private prisma: PrismaService) {}

  async startStream(userId: string, title: string, category?: string, tags?: string[]) {
    return this.prisma.livestream.create({
      data: {
        userId,
        title,
        category,
        tags: tags || [],
        status: 'LIVE',
        startedAt: new Date(),
      },
    });
  }

  async endStream(streamId: string, userId: string) {
    const stream = await this.prisma.livestream.findFirst({
      where: { id: streamId, userId },
    });

    if (!stream) throw new Error('Stream not found or unauthorized');

    return this.prisma.livestream.update({
      where: { id: streamId },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
      },
    });
  }

  async getLiveStreams(page = 1, limit = 20) {
    return this.prisma.livestream.findMany({
      where: { status: 'LIVE' },
      orderBy: { viewerCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }

  async getStream(streamId: string) {
    return this.prisma.livestream.findUnique({
      where: { id: streamId },
      include: {
        user: { select: { id: true, displayName: true, avatar: true, profile: true } },
      },
    });
  }

  async incrementViewerCount(streamId: string) {
    return this.prisma.livestream.update({
      where: { id: streamId },
      data: { viewerCount: { increment: 1 } },
    });
  }

  async sendGift(streamId: string, senderId: string, giftId: string, quantity: number) {
    // Simplified gift sending
    return { success: true, streamId, senderId, giftId, quantity };
  }
}
