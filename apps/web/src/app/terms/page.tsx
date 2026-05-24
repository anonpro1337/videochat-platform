'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen px-5 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Acceptance</h2>
          <p>By using Vibechat, you agree to these terms. If you do not agree, please do not use the service.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">User Conduct</h2>
          <p>You agree to treat all users with respect. Harassment, hate speech, and inappropriate content are strictly prohibited.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
        </section>
      </div>
    </div>
  );
}
