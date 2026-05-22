import { Controller, Post, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FriendshipService } from './friendship.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Friends')
@Controller('friends')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post('request/:userId')
  @ApiOperation({ summary: 'Send friend request' })
  async sendRequest(@CurrentUser('id') userId: string, @Param('userId') targetId: string) {
    return this.friendshipService.sendRequest(userId, targetId);
  }

  @Post('accept/:userId')
  @ApiOperation({ summary: 'Accept friend request' })
  async acceptRequest(@CurrentUser('id') userId: string, @Param('userId') requesterId: string) {
    return this.friendshipService.acceptRequest(userId, requesterId);
  }

  @Post('reject/:userId')
  @ApiOperation({ summary: 'Reject friend request' })
  async rejectRequest(@CurrentUser('id') userId: string, @Param('userId') requesterId: string) {
    return this.friendshipService.rejectRequest(userId, requesterId);
  }

  @Delete('remove/:friendId')
  @ApiOperation({ summary: 'Remove friend' })
  async removeFriend(@CurrentUser('id') userId: string, @Param('friendId') friendId: string) {
    return this.friendshipService.removeFriend(userId, friendId);
  }

  @Get()
  @ApiOperation({ summary: 'Get friends list' })
  async getFriends(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.friendshipService.getFriends(userId, page, limit);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get pending requests' })
  async getRequests(@CurrentUser('id') userId: string) {
    return this.friendshipService.getPendingRequests(userId);
  }
}
