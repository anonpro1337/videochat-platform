import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, settings: true },
    });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });
  }

  async searchUsers(query: string, page = 1, limit = 20) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
        isBanned: false,
      },
      select: { id: true, displayName: true, username: true, avatar: true, status: true, country: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updateStatus(userId: string, status: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any, lastActive: new Date() },
    });
  }

  async getOnlineUsers(page = 1, limit = 20) {
    return this.prisma.user.findMany({
      where: { status: 'ONLINE', isBanned: false },
      select: { id: true, displayName: true, username: true, avatar: true, country: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async suggestUsers(userId: string, page = 1, limit = 20) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) return [];

    return this.prisma.user.findMany({
      where: {
        id: { not: userId },
        isBanned: false,
        status: 'ONLINE',
        ...(user.country && { country: user.country }),
      },
      select: { id: true, displayName: true, username: true, avatar: true, status: true, country: true },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
