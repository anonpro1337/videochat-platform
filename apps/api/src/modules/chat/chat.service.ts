import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(matchId: string, senderId: string, type: string, content: string) {
    return this.prisma.message.create({
      data: {
        matchId,
        senderId,
        type: type as any,
        content,
      },
      include: {
        sender: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }

  async getMessages(matchId: string, page = 1, limit = 50) {
    return this.prisma.message.findMany({
      where: { matchId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        sender: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const msg = await this.prisma.message.findUnique({ where: { id: messageId } });
    if (!msg || msg.senderId !== userId) {
      throw new Error('Message not found or unauthorized');
    }
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });
  }
}
