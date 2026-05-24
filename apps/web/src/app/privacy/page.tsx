'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-5 py-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Data Collection</h2>
          <p>We collect minimal data required to provide our video chat services: account information, usage data, and communication metadata.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Data Usage</h2>
          <p>Your data is used solely for matching you with conversation partners, improving our AI matching algorithm, and maintaining platform safety.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Data Protection</h2>
          <p>All communications are encrypted in transit. We employ industry-standard security measures to protect your personal information.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
          <p>For privacy inquiries, please contact our support team.</p>
        </section>
      </div>
    </div>
  );
}
