'use client';
import { Shield } from '@phosphor-icons/react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" weight="fill" />
        </div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>
      <div className="glass-card-static p-8 space-y-6 text-text-secondary text-sm leading-relaxed">
        <p>Last updated: May 2026</p>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, including account details, profile information, and communications. We also automatically collect usage data, device information, and IP addresses.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">2. How We Use Your Information</h2>
          <p>Your information is used to provide and improve our services, match you with other users, process payments, send notifications, and ensure platform safety through AI moderation.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">3. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with service providers (payment processors, cloud infrastructure) and as required by law.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">4. Data Security</h2>
          <p>We implement industry-standard encryption, secure WebSocket connections, and regular security audits to protect your data.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">5. Your Rights</h2>
          <p>You have the right to access, correct, delete, or export your data at any time through your account settings.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-2">6. Contact</h2>
          <p>For privacy inquiries, contact us at privacy@chatvibe.app</p>
        </section>
      </div>
    </div>
  );
}
