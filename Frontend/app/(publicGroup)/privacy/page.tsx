import { Shield, Lock, Eye, Database, Users, Globe } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Last updated: August 8, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed text-muted-foreground">
              At GearUp, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our platform. Please read this policy carefully.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you register for an account, we collect your name, email address, phone number, and password.
                  If you choose to use Google authentication, we receive basic profile information from Google.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payment details are processed securely through Stripe. We do not store your complete credit card
                  information on our servers. We only retain the last 4 digits and expiration date for your reference.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We automatically collect information about your interactions with our platform, including IP address,
                  browser type, pages visited, time spent on pages, and device information.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">How We Use Your Information</h2>
            </div>
            <ul className="space-y-3 list-disc pl-6 text-muted-foreground">
              <li>To create and manage your account</li>
              <li>To process rental bookings and payments</li>
              <li>To communicate with you about your rentals, including confirmations and updates</li>
              <li>To provide customer support and respond to your inquiries</li>
              <li>To improve our services and develop new features</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To detect and prevent fraud and security threats</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          {/* Data Sharing */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Information Sharing</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may share your information in the following situations:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">With Providers</h4>
                <p className="text-sm text-muted-foreground">
                  When you make a booking, we share your name and contact information with the gear provider to
                  facilitate the rental.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">With Service Providers</h4>
                <p className="text-sm text-muted-foreground">
                  We use third-party services like Stripe for payments, Google for authentication, and analytics
                  providers to improve our platform.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2">For Legal Reasons</h4>
                <p className="text-sm text-muted-foreground">
                  We may disclose information if required by law, subpoena, or to protect our rights and safety.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Data Security</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-muted-foreground mt-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure password hashing using bcrypt</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Encrypted database storage</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data,
              we cannot guarantee absolute security.
            </p>
          </div>

          {/* Your Rights */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Your Privacy Rights</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Access", desc: "Request a copy of your data" },
                { title: "Correction", desc: "Update inaccurate information" },
                { title: "Deletion", desc: "Request data deletion" },
                { title: "Portability", desc: "Receive your data in a portable format" },
                { title: "Opt-out", desc: "Unsubscribe from marketing emails" },
                { title: "Withdraw Consent", desc: "Withdraw consent at any time" },
              ].map((right) => (
                <div key={right.title} className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-1">{right.title}</h4>
                  <p className="text-sm text-muted-foreground">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed mt-6">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@gearup.com" className="text-primary hover:underline">privacy@gearup.com</a>.
            </p>
          </div>

          {/* Cookies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie
              preferences through your browser settings. Note that disabling cookies may affect platform functionality.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not intended for users under 18 years of age. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact us
              immediately.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting
              the new policy on this page and updating the "Last updated" date. We encourage you to review this policy
              periodically.
            </p>
          </div>

          {/* Contact */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> <a href="mailto:privacy@gearup.com" className="text-primary hover:underline">privacy@gearup.com</a></p>
              <p><strong>Phone:</strong> +1 (234) 567-890</p>
              <p><strong>Address:</strong> GearUp Inc., 123 Market Street, San Francisco, CA 94102</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
