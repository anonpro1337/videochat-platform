import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Matching')
@Controller('matching')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Post('join/:type')
  @ApiOperation({ summary: 'Join matching queue' })
  async joinQueue(
    @CurrentUser('id') userId: string,
    @Param('type') type: 'VIDEO' | 'TEXT' | 'VOICE',
  ) {
    return this.matchingService.joinQueue(userId, type);
  }

  @Post('leave/:type')
  @ApiOperation({ summary: 'Leave matching queue' })
  async leaveQueue(
    @CurrentUser('id') userId: string,
    @Param('type') type: 'VIDEO' | 'TEXT' | 'VOICE',
  ) {
    return this.matchingService.leaveQueue(userId, type);
  }

  @Post('end/:matchId')
  @ApiOperation({ summary: 'End/Skip match' })
  async endMatch(@CurrentUser('id') userId: string, @Param('matchId') matchId: string) {
    return this.matchingService.endMatch(matchId, userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get match history' })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.matchingService.getMatchHistory(userId, page, limit);
  }
}
