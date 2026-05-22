import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CallService } from './call.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Calls')
@Controller('calls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CallController {
  constructor(private callService: CallService) {}

  @Post('create/:calleeId/:type')
  @ApiOperation({ summary: 'Create a new call' })
  async createCall(
    @CurrentUser('id') userId: string,
    @Param('calleeId') calleeId: string,
    @Param('type') type: 'VIDEO' | 'VOICE',
  ) {
    return this.callService.createCall(userId, calleeId, type);
  }

  @Post('accept/:callId')
  @ApiOperation({ summary: 'Accept incoming call' })
  async acceptCall(@CurrentUser('id') userId: string, @Param('callId') callId: string) {
    return this.callService.acceptCall(callId, userId);
  }

  @Post('end/:callId')
  @ApiOperation({ summary: 'End a call' })
  async endCall(@CurrentUser('id') userId: string, @Param('callId') callId: string) {
    return this.callService.endCall(callId, userId);
  }

  @Post('reject/:callId')
  @ApiOperation({ summary: 'Reject incoming call' })
  async rejectCall(@CurrentUser('id') userId: string, @Param('callId') callId: string) {
    return this.callService.rejectCall(callId, userId);
  }
}
