'use client';

export default function SafetyPage() {
  return (
    <div className="min-h-screen px-5 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Safety Guidelines</h1>
      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Stay Safe</h2>
          <p>Never share personal information like your address, phone number, or financial details with other users.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Report Abuse</h2>
          <p>Use the in-app reporting feature to flag inappropriate behavior. Our moderation team reviews all reports within 24 hours.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">AI Moderation</h2>
          <p>Our platform uses AI-powered moderation to detect and prevent harmful content in real-time.</p>
        </section>
      </div>
    </div>
  );
}
