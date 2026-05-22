import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import { RedisService } from '../../config/redis.service';
import { SupabaseService } from '../../config/supabase.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';
import { config } from '@videochat/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
    private supabase: SupabaseService,
  ) {}

  async register(dto: RegisterDto) {
    let supabaseUid: string;

    if (dto.supabaseToken) {
      const { data: { user: supabaseUser }, error } = await this.supabase.admin.auth.getUser(dto.supabaseToken);
      if (error || !supabaseUser) {
        throw new UnauthorizedException('Invalid Supabase token');
      }
      supabaseUid = supabaseUser.id;
    } else {
      supabaseUid = uuidv4();
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { username: dto.username },
        ],
      },
    });

    if (existing) {
      if (existing.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
      if (existing.username === dto.username) {
        throw new ConflictException('Username already taken');
      }
    }

    const user = await this.prisma.user.create({
      data: {
        supabaseUid,
        email: dto.email,
        phone: dto.phone,
        displayName: dto.displayName,
        username: dto.username,
        avatar: dto.avatar,
        deviceId: dto.deviceId,
        profile: {
          create: {
            interests: [],
            languages: [],
            photos: [],
            videos: [],
            vibeTags: [],
            socialLinks: {},
          },
        },
        settings: {
          create: {},
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
      isNewUser: true,
    };
  }

  async login(dto: LoginDto) {
    let supabaseUid: string;

    if (dto.supabaseToken) {
      const { data: { user: supabaseUser }, error } = await this.supabase.admin.auth.getUser(dto.supabaseToken);
      if (error || !supabaseUser) {
        throw new UnauthorizedException('Invalid Supabase token');
      }
      supabaseUid = supabaseUser.id;
    } else if (dto.email && dto.password) {
      const { data: { user: supabaseUser }, error } = await this.supabase.admin.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });
      if (error || !supabaseUser) {
        throw new UnauthorizedException('Invalid email or password');
      }
      supabaseUid = supabaseUser.id;
    } else {
      throw new UnauthorizedException('Provide either supabaseToken or email/password');
    }

    const user = await this.prisma.user.findUnique({
      where: { supabaseUid },
      include: { profile: true, settings: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please register first.');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Account is suspended');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'ONLINE',
        lastActive: new Date(),
        deviceId: dto.deviceId || user.deviceId,
        email: dto.email || user.email,
      },
    });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user,
      ...tokens,
      isNewUser: false,
    };
  }

  async guestLogin(deviceId?: string) {
    const guestId = `guest_${uuidv4().substring(0, 8)}`;
    const supabaseUid = `guest_${uuidv4()}`;

    const user = await this.prisma.user.create({
      data: {
        supabaseUid,
        displayName: `User_${guestId.substring(6)}`,
        username: guestId,
        isAnonymous: true,
        deviceId,
        profile: {
          create: {
            interests: [],
            languages: [],
            photos: [],
            videos: [],
            vibeTags: [],
            socialLinks: {},
          },
        },
        settings: {
          create: {},
        },
      },
      include: { profile: true, settings: true },
    });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, ...tokens, isNewUser: true };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: config.jwt.refreshSecret,
      });

      const stored = await this.redis.get(`refresh:${payload.sub}`);
      if (stored !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { profile: true },
      });

      if (!user || user.isBanned) {
        throw new UnauthorizedException('User not found or suspended');
      }

      const tokens = await this.generateTokens(user);
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return { user, ...tokens };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.redis.del(`refresh:${userId}`);
    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'OFFLINE' },
    });
    return { message: 'Logged out successfully' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.displayName && { displayName: dto.displayName }),
        ...(dto.bio && { bio: dto.bio }),
        ...(dto.avatar && { avatar: dto.avatar }),
        ...(dto.gender && { gender: dto.gender as any }),
        ...(dto.country && { country: dto.country }),
        ...(dto.language && { language: dto.language }),
      },
      include: { profile: true },
    });

    if (dto.interests) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: { interests: dto.interests },
      });
    }

    return user;
  }

  async getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        settings: true,
      },
    });
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: config.jwt.secret,
        expiresIn: config.jwt.expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: config.jwt.refreshSecret,
        expiresIn: config.jwt.refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string) {
    const sevenDays = 7 * 24 * 60 * 60;
    await this.redis.set(`refresh:${userId}`, token, 'EX', sevenDays);
  }
}
