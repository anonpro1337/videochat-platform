import { Controller, Post, Get, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Moderation')
@Controller('moderation')
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @Post('check/text')
  @ApiOperation({ summary: 'Check text content' })
  async checkText(@Body() body: { text: string }) {
    return this.moderationService.moderateText(body.text);
  }

  @Post('check/image')
  @ApiOperation({ summary: 'Check image content' })
  async checkImage(@Body() body: { imageUrl: string }) {
    return this.moderationService.moderateImage(body.imageUrl);
  }

  @Get('queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERATOR', 'ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get moderation queue' })
  async getQueue(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.moderationService.getModerationQueue(page, limit);
  }

  @Post('action/:reportId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MODERATOR', 'ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Take moderation action' })
  async takeAction(
    @Param('reportId') reportId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { action: 'WARN' | 'MUTE' | 'BAN' | 'DISMISS' },
  ) {
    return this.moderationService.takeAction(reportId, body.action, userId);
  }
}
