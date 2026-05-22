import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, type: string, title: string, body: string, data?: any) {
    const notification = await this.prisma.notification.create({
      data: { userId, type: type as any, title, body, data: data || {} },
    });

    await this.sendPushNotification(userId, title, body, data);
    return notification;
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async registerPushToken(userId: string, token: string, platform: string) {
    return this.prisma.userDevice.upsert({
      where: { userId_deviceId: { userId, deviceId: token } },
      update: { pushToken: token, platform, isActive: true },
      create: { userId, deviceId: token, pushToken: token, platform },
    });
  }

  private async sendPushNotification(userId: string, title: string, body: string, data?: any) {
    try {
      const devices = await this.prisma.userDevice.findMany({
        where: { userId, isActive: true, pushToken: { not: null } },
      });

      for (const device of devices) {
        if (device.pushToken) {
          // Send via FCM/APNs - implementation depends on push service
          // This is a placeholder for actual push notification logic
        }
      }
    } catch {
      // Silently fail push notifications
    }
  }
}
