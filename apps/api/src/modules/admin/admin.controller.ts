import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 20, @Query('search') search?: string) {
    return this.adminService.getUsers(page, limit, search);
  }

  @Post('users/ban/:userId')
  @ApiOperation({ summary: 'Ban a user' })
  async banUser(@Param('userId') userId: string, @Body() body: { reason: string; duration?: number }) {
    return this.adminService.banUser(userId, body.reason, body.duration);
  }

  @Post('users/unban/:userId')
  @ApiOperation({ summary: 'Unban a user' })
  async unbanUser(@Param('userId') userId: string) {
    return this.adminService.unbanUser(userId);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  async getRevenue(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.adminService.getRevenueAnalytics(startDate, endDate);
  }

  @Get('moderation')
  @ApiOperation({ summary: 'Get moderation queue' })
  async getModeration(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getModerationQueue(page, limit);
  }

  @Post('moderation/resolve/:reportId')
  @ApiOperation({ summary: 'Resolve a report' })
  async resolveReport(
    @Param('reportId') reportId: string,
    @CurrentUser('id') moderatorId: string,
    @Body() body: { action: string },
  ) {
    return this.adminService.resolveReport(reportId, body.action, moderatorId);
  }
}
