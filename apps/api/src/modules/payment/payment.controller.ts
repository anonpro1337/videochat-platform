import { Controller, Post, Get, Query, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  async createIntent(
    @CurrentUser('id') userId: string,
    @Body() body: { amount: number; currency: string },
  ) {
    return this.paymentService.createStripePaymentIntent(userId, body.amount, body.currency);
  }

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order' })
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body() body: { amount: number; currency: string },
  ) {
    return this.paymentService.createRazorpayOrder(userId, body.amount, body.currency);
  }

  @Post('purchase-coins')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase coin package' })
  async purchaseCoins(
    @CurrentUser('id') userId: string,
    @Body() body: { packageId: string; provider: 'STRIPE' | 'RAZORPAY' },
  ) {
    return this.paymentService.purchaseCoins(userId, body.packageId, body.provider);
  }

  @Get('packages')
  @ApiOperation({ summary: 'Get coin packages' })
  async getPackages() {
    return this.paymentService.getCoinPackages();
  }

  @Post('stripe-webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleStripeWebhook(req.body, signature);
  }

  @Post('razorpay-webhook')
  @ApiOperation({ summary: 'Razorpay webhook handler' })
  async razorpayWebhook(
    @Req() req: any,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentService.handleRazorpayWebhook(req.body, signature);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user transactions' })
  async getTransactions(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.paymentService.getUserTransactions(userId, page, limit);
  }
}
