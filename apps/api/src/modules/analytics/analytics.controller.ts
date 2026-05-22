import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('track/:event')
  @ApiOperation({ summary: 'Track analytics event' })
  async trackEvent(@CurrentUser('id') userId: string, @Param('event') event: string) {
    return this.analyticsService.trackEvent(userId, event);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getStats(@CurrentUser('id') userId: string) {
    return this.analyticsService.getUserStats(userId);
  }
}
