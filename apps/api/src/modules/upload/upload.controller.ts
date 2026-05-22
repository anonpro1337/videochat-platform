import { Controller, Post, Get, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor() {}

  @Post('avatar')
  @ApiOperation({ summary: 'Upload avatar image' })
  async uploadAvatar(@CurrentUser('id') userId: string, @Body() body: { image: string }) {
    // In production, upload to S3 and return URL
    return { url: `https://cdn.chatvibe.app/avatars/${userId}` };
  }

  @Post('photo')
  @ApiOperation({ summary: 'Upload profile photo' })
  async uploadPhoto(@CurrentUser('id') userId: string, @Body() body: { image: string }) {
    return { url: `https://cdn.chatvibe.app/photos/${userId}` };
  }
}
