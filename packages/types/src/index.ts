// ============================================================
// Core Domain Types
// ============================================================

// --- Users ---
export type AuthProvider = 'google' | 'apple' | 'facebook' | 'phone' | 'guest';
export type UserRole = 'user' | 'moderator' | 'admin' | 'superadmin';
export type UserStatus = 'online' | 'offline' | 'away' | 'busy';
export type AccountTier = 'free' | 'premium' | 'vip';

export interface IUser {
  id: string;
  firebaseUid: string;
  email?: string;
  phone?: string;
  displayName: string;
  username: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  role: UserRole;
  tier: AccountTier;
  status: UserStatus;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dateOfBirth?: string;
  country?: string;
  language?: string;
  isVerified: boolean;
  isAnonymous: boolean;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  isBanned: boolean;
  banReason?: string;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IUserProfile {
  id: string;
  userId: string;
  interests: string[];
  languages: string[];
  photos: string[];
  videos: string[];
  bio: string;
  occupation?: string;
  education?: string;
  height?: number;
  relationshipStatus?: string;
  socialLinks: Record<string, string>;
  vibeTags: string[];
  isLive: boolean;
  liveStreamId?: string;
  followerCount: number;
  followingCount: number;
  friendCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- Auth ---
export interface IAuthRequest {
  provider: AuthProvider;
  token?: string;
  phone?: string;
  otp?: string;
  deviceId?: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
  isNewUser: boolean;
}

export interface ITokenPayload {
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// --- Matching ---
export type MatchStatus = 'pending' | 'matched' | 'rejected' | 'blocked';
export type MatchType = 'video' | 'text' | 'voice';

export interface IMatchRequest {
  userId: string;
  matchType: MatchType;
  genderFilter?: string[];
  countryFilter?: string[];
  languageFilter?: string[];
  isPremiumOnly?: boolean;
}

export interface IMatch {
  id: string;
  users: [string, string];
  type: MatchType;
  status: MatchStatus;
  startedAt: string;
  endedAt?: string;
  duration: number;
  isSkipped: boolean;
  skippedBy?: string;
  reason?: string;
  createdAt: string;
}

// --- Messages ---
export type MessageType = 'text' | 'image' | 'gif' | 'system' | 'reaction' | 'gift';

export interface IMessage {
  id: string;
  matchId: string;
  senderId: string;
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
  translation?: string;
  moderated: boolean;
  isSafe: boolean;
  createdAt: string;
}

// --- Calls ---
export type CallStatus = 'ringing' | 'connecting' | 'connected' | 'ended' | 'missed' | 'rejected';
export type CallType = 'video' | 'voice';

export interface ICall {
  id: string;
  callerId: string;
  calleeId: string;
  type: CallType;
  status: CallStatus;
  startedAt?: string;
  endedAt?: string;
  duration: number;
  isPrivate: boolean;
  roomId?: string;
  agoraChannel?: string;
  createdAt: string;
}

// --- Livestream ---
export type StreamStatus = 'idle' | 'live' | 'ended';

export interface ILivestream {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: StreamStatus;
  viewerCount: number;
  giftCount: number;
  totalGems: number;
  isAdult: boolean;
  category?: string;
  tags: string[];
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

// --- Friends ---
export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface IFriendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Notifications ---
export type NotificationType =
  | 'match'
  | 'message'
  | 'friend_request'
  | 'friend_accepted'
  | 'follow'
  | 'like'
  | 'gift'
  | 'stream_start'
  | 'mention'
  | 'system'
  | 'moderation';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// --- Payments & Coins ---
export type Currency = 'usd' | 'inr' | 'eur' | 'gbp';
export type PaymentProvider = 'stripe' | 'razorpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionType = 'purchase' | 'gift' | 'reward' | 'subscription' | 'withdrawal';

export interface ICoinPackage {
  id: string;
  coins: number;
  bonusCoins: number;
  price: number;
  currency: Currency;
  isPopular: boolean;
  isBestValue: boolean;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  tier: AccountTier;
  price: number;
  currency: Currency;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular: boolean;
}

export interface IPayment {
  id: string;
  userId: string;
  provider: PaymentProvider;
  providerPaymentId?: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  coins?: number;
  subscriptionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// --- Moderation ---
export type ReportReason = 'nudity' | 'harassment' | 'spam' | 'underage' | 'violence' | 'other';
export type ModerationAction = 'warn' | 'mute' | 'ban' | 'dismiss';

export interface IReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  matchId?: string;
  messageId?: string;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  aiFlags: IAIModerationResult;
  status: 'pending' | 'reviewed' | 'resolved';
  action?: ModerationAction;
  reviewedById?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface IAIModerationResult {
  isExplicit: boolean;
  toxicityScore: number;
  nudityScore: number;
  violenceScore: number;
  spamScore: number;
  isUnderage: boolean;
  flaggedLabels: string[];
  suggestedAction: ModerationAction;
  confidence: number;
}

// --- Analytics ---
export interface IAnalyticsEvent {
  event: string;
  userId: string;
  sessionId: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

// --- WebSocket Events ---
export interface ISocketEvent<T = unknown> {
  event: string;
  data: T;
  room?: string;
  userId?: string;
}

export interface ISignalingData {
  type: 'offer' | 'answer' | 'ice-candidate' | 'hangup' | 'mute' | 'unmute' | 'camera-off' | 'camera-on';
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  callId?: string;
  userId?: string;
}

// --- Realtime Translation ---
export interface ITranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

// --- API Response ---
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// --- Pagination ---
export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// --- Face Verification ---
export interface IFaceVerificationResult {
  verified: boolean;
  confidence: number;
  livenessScore: number;
  imageUrl: string;
}
