import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { config } from '@videochat/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private razorpay: Razorpay;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2024-06-20' });
    this.razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }

  async createStripePaymentIntent(userId: string, amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { userId },
    });

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  }

  async createRazorpayOrder(userId: string, amount: number, currency: string) {
    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `rcpt_${userId}_${Date.now()}`,
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency };
  }

  async purchaseCoins(userId: string, packageId: string, provider: 'STRIPE' | 'RAZORPAY') {
    const coinPackage = await this.prisma.coinPackage.findUnique({ where: { id: packageId } });
    if (!coinPackage) throw new Error('Package not found');

    const totalCoins = coinPackage.coins + coinPackage.bonusCoins;

    if (provider === 'STRIPE') {
      return this.createStripePaymentIntent(userId, coinPackage.price, coinPackage.currency);
    } else {
      return this.createRazorpayOrder(userId, coinPackage.price, coinPackage.currency);
    }
  }

  async handleStripeWebhook(body: any, signature?: string) {
    if (!config.stripe.webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    if (!signature) {
      throw new UnauthorizedException('Missing Stripe signature');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        typeof body === 'string' ? body : JSON.stringify(body),
        signature,
        config.stripe.webhookSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        const pi = event.data.object as Stripe.PaymentIntent;
        const userId = pi.metadata.userId;
        const amount = pi.amount / 100;
        const currency = pi.currency;

        await this.prisma.payment.create({
          data: {
            userId,
            provider: 'STRIPE',
            providerPaymentId: pi.id,
            type: 'PURCHASE',
            amount,
            currency: currency.toUpperCase(),
            status: 'COMPLETED',
            coins: Math.floor(amount * 10),
          },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { coins: { increment: Math.floor(amount * 10) } },
        });
      }

      return { received: true };
    } catch (err: any) {
      throw new UnauthorizedException(`Stripe webhook verification failed: ${err.message}`);
    }
  }

  async handleRazorpayWebhook(body: any, signature?: string) {
    if (!signature) {
      throw new UnauthorizedException('Missing Razorpay signature');
    }

    const expectedSig = require('crypto')
      .createHmac('sha256', config.razorpay.keySecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSig) {
      throw new UnauthorizedException('Invalid Razorpay signature');
    }

    const payment = body.payload?.payment?.entity;
    const userId = payment?.notes?.userId;

    if (payment?.status === 'captured' && userId) {
      const amount = payment.amount / 100;
      await this.prisma.payment.create({
        data: {
          userId,
          provider: 'RAZORPAY',
          providerPaymentId: payment.id,
          type: 'PURCHASE',
          amount,
          currency: payment.currency.toUpperCase(),
          status: 'COMPLETED',
          coins: Math.floor(amount * 10),
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: { coins: { increment: Math.floor(amount * 10) } },
      });
    }

    return { received: true };
  }

  async getCoinPackages() {
    return this.prisma.coinPackage.findMany({ where: { isActive: true } });
  }

  async createSubscription(userId: string, planId: string, provider: 'STRIPE' | 'RAZORPAY') {
    const plan = await this.prisma.coinPackage.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    // For Stripe: create subscription
    if (provider === 'STRIPE') {
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(plan.price * 100),
        currency: plan.currency.toLowerCase(),
        recurring: { interval: 'month' },
        product_data: { name: plan.name },
      });

      return { priceId: price.id };
    }

    // For Razorpay: create recurring payment
    return this.createRazorpayOrder(userId, plan.price, plan.currency);
  }

  async getUserTransactions(userId: string, page = 1, limit = 20) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
