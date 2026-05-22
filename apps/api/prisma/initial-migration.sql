-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "AccountTier" AS ENUM ('FREE', 'PREMIUM', 'VIP');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AWAY', 'BUSY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('VIDEO', 'TEXT', 'VOICE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'SKIPPED', 'REPORTED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'GIF', 'SYSTEM', 'REACTION', 'GIFT');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('VIDEO', 'VOICE');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('RINGING', 'CONNECTING', 'CONNECTED', 'ENDED', 'MISSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH', 'MESSAGE', 'FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'FOLLOW', 'LIKE', 'GIFT', 'STREAM_START', 'MENTION', 'SYSTEM', 'MODERATION');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'RAZORPAY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'GIFT', 'REWARD', 'SUBSCRIPTION', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('IDLE', 'LIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('NUDITY', 'HARASSMENT', 'SPAM', 'UNDERAGE', 'VIOLENCE', 'HATE_SPEECH', 'IMPERSONATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('WARN', 'MUTE', 'BAN', 'DISMISS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseUid" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "coverPhoto" TEXT,
    "bio" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "tier" "AccountTier" NOT NULL DEFAULT 'FREE',
    "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE',
    "gender" "Gender",
    "dateOfBirth" TIMESTAMP(3),
    "country" TEXT,
    "language" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "gems" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpiresAt" TIMESTAMP(3),
    "deviceId" TEXT,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[],
    "languages" TEXT[],
    "photos" TEXT[],
    "videos" TEXT[],
    "bio" TEXT NOT NULL DEFAULT '',
    "occupation" TEXT,
    "education" TEXT,
    "height" INTEGER,
    "relationshipStatus" TEXT,
    "socialLinks" JSONB NOT NULL DEFAULT '{}',
    "vibeTags" TEXT[],
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "liveStreamId" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "friendCount" INTEGER NOT NULL DEFAULT 0,
    "faceVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "showLocation" BOOLEAN NOT NULL DEFAULT false,
    "showAge" BOOLEAN NOT NULL DEFAULT true,
    "allowFriendRequests" BOOLEAN NOT NULL DEFAULT true,
    "allowMessages" BOOLEAN NOT NULL DEFAULT true,
    "notificationSounds" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'en',
    "autoTranslate" BOOLEAN NOT NULL DEFAULT false,
    "blurNudity" BOOLEAN NOT NULL DEFAULT true,
    "saveChatHistory" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "platform" TEXT,
    "pushToken" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "FriendStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "type" "MatchType" NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "isSkipped" BOOLEAN NOT NULL DEFAULT false,
    "skippedBy" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "translation" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "moderated" BOOLEAN NOT NULL DEFAULT false,
    "isSafe" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "callerId" TEXT NOT NULL,
    "calleeId" TEXT NOT NULL,
    "type" "CallType" NOT NULL DEFAULT 'VIDEO',
    "status" "CallStatus" NOT NULL DEFAULT 'RINGING',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "roomId" TEXT,
    "agoraChannel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "coins" INTEGER,
    "subscriptionId" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerSubId" TEXT,
    "tier" "AccountTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "bonusCoins" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isBestValue" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "reference" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livestream" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "status" "StreamStatus" NOT NULL DEFAULT 'IDLE',
    "viewerCount" INTEGER NOT NULL DEFAULT 0,
    "giftCount" INTEGER NOT NULL DEFAULT 0,
    "totalGems" INTEGER NOT NULL DEFAULT 0,
    "isAdult" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "tags" TEXT[],
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livestream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "gems" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivestreamGift" (
    "id" TEXT NOT NULL,
    "livestreamId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalGems" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LivestreamGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "matchId" TEXT,
    "messageId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "evidence" TEXT[],
    "aiFlags" JSONB,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "action" "ModerationAction",
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "reason" TEXT NOT NULL,
    "duration" INTEGER,
    "modId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportedMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "aiScore" DOUBLE PRECISION,
    "isActioned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseUid_key" ON "User"("supabaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_supabaseUid_idx" ON "User"("supabaseUid");

-- CreateIndex
CREATE INDEX "User_country_idx" ON "User"("country");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_refreshToken_key" ON "UserSession"("refreshToken");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_refreshToken_idx" ON "UserSession"("refreshToken");

-- CreateIndex
CREATE INDEX "UserDevice_userId_idx" ON "UserDevice"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDevice_userId_deviceId_key" ON "UserDevice"("userId", "deviceId");

-- CreateIndex
CREATE INDEX "Friendship_requesterId_idx" ON "Friendship"("requesterId");

-- CreateIndex
CREATE INDEX "Friendship_addresseeId_idx" ON "Friendship"("addresseeId");

-- CreateIndex
CREATE INDEX "Friendship_status_idx" ON "Friendship"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_requesterId_addresseeId_key" ON "Friendship"("requesterId", "addresseeId");

-- CreateIndex
CREATE INDEX "Match_user1Id_idx" ON "Match"("user1Id");

-- CreateIndex
CREATE INDEX "Match_user2Id_idx" ON "Match"("user2Id");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_createdAt_idx" ON "Match"("createdAt");

-- CreateIndex
CREATE INDEX "Message_matchId_idx" ON "Message"("matchId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Call_callerId_idx" ON "Call"("callerId");

-- CreateIndex
CREATE INDEX "Call_calleeId_idx" ON "Call"("calleeId");

-- CreateIndex
CREATE INDEX "Call_status_idx" ON "Call"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_tier_idx" ON "Subscription"("tier");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Livestream_userId_idx" ON "Livestream"("userId");

-- CreateIndex
CREATE INDEX "Livestream_status_idx" ON "Livestream"("status");

-- CreateIndex
CREATE INDEX "Livestream_category_idx" ON "Livestream"("category");

-- CreateIndex
CREATE INDEX "LivestreamGift_livestreamId_idx" ON "LivestreamGift"("livestreamId");

-- CreateIndex
CREATE INDEX "Report_reportedUserId_idx" ON "Report"("reportedUserId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "ModerationLog_userId_idx" ON "ModerationLog"("userId");

-- CreateIndex
CREATE INDEX "ModerationLog_createdAt_idx" ON "ModerationLog"("createdAt");

-- CreateIndex
CREATE INDEX "BlockedUser_blockerId_idx" ON "BlockedUser"("blockerId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerId_blockedId_key" ON "BlockedUser"("blockerId", "blockedId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_callerId_fkey" FOREIGN KEY ("callerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_calleeId_fkey" FOREIGN KEY ("calleeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livestream" ADD CONSTRAINT "Livestream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationLog" ADD CONSTRAINT "ModerationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

