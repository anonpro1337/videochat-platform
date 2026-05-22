import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, onlineUsers, totalMatches, totalRevenue, pendingReports] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { status: 'ONLINE' } }),
      this.prisma.match.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      onlineUsers,
      totalMatches,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingReports,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, displayName: true, username: true, email: true, role: true, tier: true, status: true, isBanned: true, coins: true, createdAt: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async banUser(userId: string, reason: string, duration?: number) {
    const banExpiresAt = duration ? new Date(Date.now() + duration * 60000) : null;
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true, banReason: reason, banExpiresAt },
    });
  }

  async unbanUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: false, banReason: null, banExpiresAt: null },
    });
  }

  async getRevenueAnalytics(startDate: string, endDate: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return payments;
  }

  async getModerationQueue(page = 1, limit = 20) {
    return this.prisma.report.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reporter: { select: { id: true, displayName: true } },
        reported: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }

  async resolveReport(reportId: string, action: string, moderatorId: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: 'RESOLVED', action: action as any, reviewedById: moderatorId, resolvedAt: new Date() },
    });
  }
}
