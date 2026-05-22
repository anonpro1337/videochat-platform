# ChatVibe - Enterprise Video Chat Platform

A production-ready random video chat + social discovery platform built with modern technologies.

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query |
| **Mobile** | React Native Expo (planned) |
| **Backend** | NestJS, TypeScript, Socket.IO, Redis, PostgreSQL, Prisma |
| **Video** | WebRTC, Agora SDK, STUN/TURN |
| **AI** | OpenAI, Hive Moderation |
| **Payments** | Stripe, Razorpay |
| **Infra** | AWS, Docker, Kubernetes, Cloudflare |
| **Auth** | Firebase Auth, JWT |
| **Analytics** | PostHog, Google Analytics |

## Architecture

```
videochat-platform/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   ├── api/          # NestJS REST API
│   ├── socket/       # Socket.IO signaling server
│   ├── mobile/       # React Native Expo app (TBD)
│   └── admin/        # Admin dashboard
├── packages/
│   ├── config/       # Shared configuration
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Shared utilities
│   └── ui/           # Shared UI components
├── infra/
│   ├── docker/       # Docker & nginx configs
│   ├── k8s/          # Kubernetes manifests
│   └── terraform/    # Infrastructure as code
└── .github/          # CI/CD pipelines
```

## Features

- **Random Video Chat** - One-on-one video matching with WebRTC
- **Text Chat** - Real-time messaging with typing indicators
- **Gender/Country Filters** - Find people who match your preferences
- **AI Moderation** - Toxicity, nudity, and spam detection
- **Friend System** - Send requests, build your network
- **Match History** - Track your connections
- **Push Notifications** - Real-time alerts
- **Coins & Subscriptions** - Monetization via Stripe/Razorpay
- **Livestreaming** - Go live and earn gems
- **Admin Dashboard** - User management, analytics, moderation
- **PWA Support** - Install as a mobile app
- **AI Translation** - Real-time chat translation
- **Anonymous Mode** - Join without signing up

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/videochat-platform.git
cd videochat-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Fill in your values
```

4. Start the database:
```bash
docker compose up postgres redis -d
```

5. Run database migrations:
```bash
pnpm db:migrate
pnpm db:seed
```

6. Start development servers:
```bash
pnpm dev
```

This starts:
- Web App: http://localhost:3000
- API: http://localhost:4000
- Socket Server: http://localhost:4001
- Swagger Docs: http://localhost:4000/api/docs

### Docker Deployment

```bash
docker compose up -d --build
```

### Kubernetes Deployment

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/
```

## API Documentation

Swagger documentation is available at `/api/docs` when the API server is running.

### Key Endpoints

- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Sign in
- `POST /api/v1/auth/guest` - Guest login
- `POST /api/v1/matching/join/:type` - Join match queue
- `POST /api/v1/matching/end/:matchId` - End match
- `POST /api/v1/chat/message` - Send message
- `POST /api/v1/calls/create/:calleeId/:type` - Start call
- `POST /api/v1/payments/create-intent` - Purchase coins

### WebSocket Events

- `match:join` / `match:leave` - Queue management
- `match:found` - Match notification
- `signal:send` / `signal:receive` - WebRTC signaling
- `chat:message` / `chat:typing` - Chat events
- `call:offer` / `call:answer` / `call:ice-candidate` - Call signaling
- `stream:join` / `stream:leave` - Livestream events

## Environment Variables

See `.env.example` for all required variables.

### Required for Production

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - JWT signing keys
- `FIREBASE_*` - Firebase Admin SDK credentials
- `AGORA_APP_ID` / `AGORA_APP_CERTIFICATE` - Agora credentials
- `OPENAI_API_KEY` - For AI moderation
- `STRIPE_SECRET_KEY` - Payment processing
- `AWS_*` - S3 file storage

## Security

- JWT with refresh token rotation
- Rate limiting via @nestjs/throttler
- reCAPTCHA integration
- FingerprintJS device fingerprinting
- AI-powered content moderation
- HTTPS enforced in production
- CORS configured for web app origin
- Helmet security headers
- Input validation with class-validator

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
