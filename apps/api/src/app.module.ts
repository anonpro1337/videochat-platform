import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './config/prisma.module';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ChatModule } from './modules/chat/chat.module';
import { CallModule } from './modules/call/call.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LivestreamModule } from './modules/livestream/livestream.module';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { UploadModule } from './modules/upload/upload.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TranslationModule } from './modules/translation/translation.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './modules/health.controller';
import { config } from '@videochat/config';

@Module({
  imports: [
    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Queue
    BullModule.forRoot({
      redis: {
        host: new URL(config.redis.url).hostname,
        port: parseInt(new URL(config.redis.url).port || '6379'),
        password: config.redis.password,
      },
    }),

    // Internal modules
    PrismaModule,
    RedisModule,
    AuthModule,
    UserModule,
    MatchingModule,
    ChatModule,
    CallModule,
    PaymentModule,
    NotificationModule,
    LivestreamModule,
    FriendshipModule,
    ModerationModule,
    UploadModule,
    AnalyticsModule,
    TranslationModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
