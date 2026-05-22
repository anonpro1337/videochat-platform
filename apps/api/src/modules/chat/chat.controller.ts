import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send a message' })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() body: { matchId: string; type: string; content: string },
  ) {
    return this.chatService.sendMessage(body.matchId, userId, body.type, body.content);
  }

  @Get('messages/:matchId')
  @ApiOperation({ summary: 'Get messages for a match' })
  async getMessages(
    @Param('matchId') matchId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getMessages(matchId, page, limit);
  }

  @Delete('message/:messageId')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(@CurrentUser('id') userId: string, @Param('messageId') messageId: string) {
    return this.chatService.deleteMessage(messageId, userId);
  }
}
