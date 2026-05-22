'use client';
import { FileText } from '@phosphor-icons/react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" weight="fill" />
        </div>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
      </div>
      <div className="glass-card-static p-8 space-y-6 text-text-secondary text-sm leading-relaxed">
        <p>Last updated: May 2026</p>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Acceptance of Terms</h2>
          <p>By using ChatVibe, you agree to these terms. If you do not agree, do not use the service. You must be at least 18 years old or 13+ with parental consent.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. User Conduct</h2>
          <p>You agree not to: harass others, share explicit content, spam, impersonate others, attempt to hack the platform, or violate any applicable laws.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. Moderation</h2>
          <p>We use AI-powered moderation to detect and prevent harmful behavior. Violations may result in warnings, temporary mutes, or permanent bans.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Subscriptions & Payments</h2>
          <p>Premium subscriptions auto-renew unless cancelled. Refunds are handled per our refund policy. Coin purchases are final and non-refundable.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. Limitation of Liability</h2>
          <p>ChatVibe is provided &quot;as is&quot; without warranties. We are not liable for user interactions or third-party services.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. Contact</h2>
          <p>For legal inquiries: legal@chatvibe.app</p>
        </section>
      </div>
    </div>
  );
}
