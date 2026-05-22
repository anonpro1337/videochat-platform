import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../config/prisma.service';
import { RedisService } from '../../config/redis.service';

interface MatchQueueEntry {
  userId: string;
  type: 'VIDEO' | 'TEXT' | 'VOICE';
  genderFilter?: string[];
  countryFilter?: string[];
  languageFilter?: string[];
  interests?: string[];
  premiumOnly?: boolean;
  joinedAt: number;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private readonly QUEUE_PREFIX = 'match:queue:';
  private readonly MATCH_TTL = 60; // 60 seconds in queue before timeout

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async joinQueue(userId: string, type: 'VIDEO' | 'TEXT' | 'VOICE', filters?: Partial<MatchQueueEntry>) {
    const key = `${this.QUEUE_PREFIX}${type}`;
    const entry: MatchQueueEntry = {
      userId,
      type,
      joinedAt: Date.now(),
      ...filters,
    };

    await this.redis.sadd(key, JSON.stringify(entry));
    await this.redis.zadd('match:users', Date.now(), userId);
    this.logger.log(`User ${userId} joined ${type} queue`);

    return this.tryMatch(entry);
  }

  async leaveQueue(userId: string, type: 'VIDEO' | 'TEXT' | 'VOICE') {
    const key = `${this.QUEUE_PREFIX}${type}`;
    const entries = await this.redis.smembers(key);

    for (const entry of entries) {
      const parsed: MatchQueueEntry = JSON.parse(entry);
      if (parsed.userId === userId) {
        await this.redis.srem(key, entry);
        await this.redis.zrem('match:users', userId);
        this.logger.log(`User ${userId} left ${type} queue`);
        return true;
      }
    }
    return false;
  }

  private async tryMatch(entry: MatchQueueEntry): Promise<{ matched: boolean; matchId?: string; partnerId?: string }> {
    const key = `${this.QUEUE_PREFIX}${entry.type}`;
    const entries = await this.redis.smembers(key);
    const candidates: MatchQueueEntry[] = entries
      .map((e) => JSON.parse(e))
      .filter((e) => e.userId !== entry.userId);

    for (const candidate of candidates) {
      if (this.isCompatible(entry, candidate)) {
        // Remove both from queue
        await this.redis.srem(key, JSON.stringify(entry));
        await this.redis.srem(key, JSON.stringify(candidate));
        await this.redis.zrem('match:users', entry.userId);
        await this.redis.zrem('match:users', candidate.userId);

        // Create match in DB
        const match = await this.prisma.match.create({
          data: {
            user1Id: entry.userId,
            user2Id: candidate.userId,
            type: entry.type,
            status: 'ACTIVE',
          },
        });

        this.logger.log(`Match created: ${entry.userId} <-> ${candidate.userId} (${entry.type})`);
        return { matched: true, matchId: match.id, partnerId: candidate.userId };
      }
    }

    return { matched: false };
  }

  private isCompatible(a: MatchQueueEntry, b: MatchQueueEntry): boolean {
    if (a.type !== b.type) return false;

    // Gender filter check
    if (a.genderFilter?.length && b.userId) {
      // Would need to check actual gender from DB
    }

    // Country filter check
    if (a.countryFilter?.length && b.countryFilter?.length) {
      const overlap = a.countryFilter.some((c) => b.countryFilter?.includes(c));
      if (!overlap) return false;
    }

    // Interest overlap check
    if (a.interests?.length && b.interests?.length) {
      const overlap = a.interests.some((i) => b.interests?.includes(i));
      if (!overlap) return false;
    }

    return true;
  }

  async endMatch(matchId: string, userId: string) {
    const match = await this.prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'ENDED',
        endedAt: new Date(),
        isSkipped: true,
        skippedBy: userId,
      },
    });

    // Calculate duration
    if (match.startedAt) {
      const duration = Math.floor((Date.now() - match.startedAt.getTime()) / 1000);
      await this.prisma.match.update({
        where: { id: matchId },
        data: { duration },
      });
    }

    return match;
  }

  async getMatchHistory(userId: string, page = 1, limit = 20) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user1: { select: { id: true, displayName: true, avatar: true } },
        user2: { select: { id: true, displayName: true, avatar: true } },
      },
    });
  }

  // Clean up stale queue entries every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupStaleEntries() {
    const now = Date.now();
    for (const type of ['VIDEO', 'TEXT', 'VOICE'] as const) {
      const key = `${this.QUEUE_PREFIX}${type}`;
      const entries = await this.redis.smembers(key);

      for (const entry of entries) {
        const parsed: MatchQueueEntry = JSON.parse(entry);
        if (now - parsed.joinedAt > this.MATCH_TTL * 1000) {
          await this.redis.srem(key, entry);
          await this.redis.zrem('match:users', parsed.userId);
        }
      }
    }
  }
}
