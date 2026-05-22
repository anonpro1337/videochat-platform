import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TranslationService } from './translation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Translation')
@Controller('translate')
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Post()
  @ApiOperation({ summary: 'Translate text' })
  async translate(@Body() body: { text: string; targetLanguage: string; sourceLanguage?: string }) {
    return this.translationService.translate(body.text, body.targetLanguage, body.sourceLanguage);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect language' })
  async detect(@Body() body: { text: string }) {
    return this.translationService.detectLanguage(body.text);
  }
}
