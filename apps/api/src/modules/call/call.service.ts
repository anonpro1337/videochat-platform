import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { config } from '@videochat/config';

@Injectable()
export class CallService {
  constructor(private prisma: PrismaService) {}

  async createCall(callerId: string, calleeId: string, type: 'VIDEO' | 'VOICE') {
    const channelName = `call_${callerId}_${calleeId}_${Date.now()}`;
    const agoraToken = this.generateAgoraToken(channelName);

    const call = await this.prisma.call.create({
      data: {
        callerId,
        calleeId,
        type,
        status: 'RINGING',
        roomId: channelName,
        agoraChannel: channelName,
      },
    });

    return { call, agoraToken, channelName };
  }

  async acceptCall(callId: string, userId: string) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });
    if (!call || call.calleeId !== userId) {
      throw new Error('Call not found or unauthorized');
    }

    const agoraToken = this.generateAgoraToken(call.agoraChannel!);

    await this.prisma.call.update({
      where: { id: callId },
      data: { status: 'CONNECTED', startedAt: new Date() },
    });

    return { call, agoraToken, channelName: call.agoraChannel };
  }

  async endCall(callId: string, userId: string) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });
    if (!call) throw new Error('Call not found');
    if (call.callerId !== userId && call.calleeId !== userId) {
      throw new Error('Unauthorized');
    }

    const duration = call.startedAt
      ? Math.floor((Date.now() - call.startedAt.getTime()) / 1000)
      : 0;

    return this.prisma.call.update({
      where: { id: callId },
      data: { status: 'ENDED', endedAt: new Date(), duration },
    });
  }

  async rejectCall(callId: string, userId: string) {
    const call = await this.prisma.call.findUnique({ where: { id: callId } });
    if (!call || call.calleeId !== userId) throw new Error('Call not found or unauthorized');

    return this.prisma.call.update({
      where: { id: callId },
      data: { status: 'REJECTED', endedAt: new Date() },
    });
  }

  private generateAgoraToken(channelName: string): string {
    const appId = config.agora.appId;
    const appCert = config.agora.appCertificate;
    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 7200;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    return RtcTokenBuilder.buildTokenWithUid(appId, appCert, channelName, uid, role, privilegeExpiredTs);
  }
}
