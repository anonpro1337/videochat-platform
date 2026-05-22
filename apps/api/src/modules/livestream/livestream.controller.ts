import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LivestreamService } from './livestream.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Livestream')
@Controller('livestream')
export class LivestreamController {
  constructor(private livestreamService: LivestreamService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a livestream' })
  async startStream(
    @CurrentUser('id') userId: string,
    @Query('title') title: string,
    @Query('category') category?: string,
    @Query('tags') tags?: string,
  ) {
    return this.livestreamService.startStream(userId, title, category, tags?.split(','));
  }

  @Post('end/:streamId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'End a livestream' })
  async endStream(@CurrentUser('id') userId: string, @Param('streamId') streamId: string) {
    return this.livestreamService.endStream(streamId, userId);
  }

  @Get('live')
  @ApiOperation({ summary: 'Get live streams' })
  async getLiveStreams(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.livestreamService.getLiveStreams(page, limit);
  }

  @Get(':streamId')
  @ApiOperation({ summary: 'Get stream details' })
  async getStream(@Param('streamId') streamId: string) {
    return this.livestreamService.getStream(streamId);
  }
}
