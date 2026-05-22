import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search users' })
  async searchUsers(@Param('query') query: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.searchUsers(query, page, limit);
  }

  @Patch('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status' })
  async updateStatus(@CurrentUser('id') userId: string, @Query('status') status: string) {
    return this.userService.updateStatus(userId, status);
  }

  @Get('online')
  @ApiOperation({ summary: 'Get online users' })
  async getOnlineUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.getOnlineUsers(page, limit);
  }

  @Get('suggestions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user suggestions' })
  async getSuggestions(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.userService.suggestUsers(userId, page, limit);
  }
}
