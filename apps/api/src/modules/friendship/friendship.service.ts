import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(requesterId: string, addresseeId: string) {
    const existing = await this.prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId, addresseeId } },
    });

    if (existing) {
      if (existing.status === 'BLOCKED') throw new Error('Cannot send request');
      if (existing.status === 'PENDING') throw new Error('Request already sent');
      if (existing.status === 'ACCEPTED') throw new Error('Already friends');
    }

    return this.prisma.friendship.create({
      data: { requesterId, addresseeId, status: 'PENDING' },
    });
  }

  async acceptRequest(userId: string, requesterId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId, addresseeId: userId } },
    });

    if (!friendship) throw new Error('Request not found');

    const updated = await this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' },
    });

    // Increment friend counts
    await Promise.all([
      this.prisma.userProfile.update({
        where: { userId },
        data: { friendCount: { increment: 1 } },
      }),
      this.prisma.userProfile.update({
        where: { userId: requesterId },
        data: { friendCount: { increment: 1 } },
      }),
    ]);

    return updated;
  }

  async rejectRequest(userId: string, requesterId: string) {
    return this.prisma.friendship.delete({
      where: { requesterId_addresseeId: { requesterId, addresseeId: userId } },
    });
  }

  async removeFriend(userId: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId },
        ],
        status: 'ACCEPTED',
      },
    });

    if (!friendship) throw new Error('Friendship not found');

    await this.prisma.friendship.delete({ where: { id: friendship.id } });

    await Promise.all([
      this.prisma.userProfile.update({
        where: { userId },
        data: { friendCount: { decrement: 1 } },
      }),
      this.prisma.userProfile.update({
        where: { userId: friendId },
        data: { friendCount: { decrement: 1 } },
      }),
    ]);

    return { message: 'Friend removed' };
  }

  async blockUser(blockerId: string, blockedId: string, reason?: string) {
    return this.prisma.blockedUser.create({
      data: { blockerId, blockedId, reason },
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return this.prisma.blockedUser.deleteMany({
      where: { blockerId, blockedId },
    });
  }

  async getFriends(userId: string, page = 1, limit = 20) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        status: 'ACCEPTED',
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        requester: { select: { id: true, displayName: true, avatar: true, status: true } },
        addressee: { select: { id: true, displayName: true, avatar: true, status: true } },
      },
    });

    return friendships.map((f) => ({
      id: f.id,
      friend: f.requesterId === userId ? f.addressee : f.requester,
      since: f.createdAt,
    }));
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: 'PENDING' },
      include: {
        requester: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }
}
