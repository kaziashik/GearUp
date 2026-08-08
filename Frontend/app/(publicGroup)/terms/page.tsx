import { FileText, AlertTriangle, CheckCircle, XCircle, Scale, CreditCard } from "lucide-react";

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
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
              Welcome to GearUp. By accessing or using our platform, you agree to be bound by these Terms of Service.
              Please read them carefully before using our services.
            </p>
          </div>

          {/* Agreement to Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account or using GearUp, you agree to comply with and be legally bound by these Terms of
              Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          {/* Eligibility */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold mb-2">Age Requirement</p>
                  <p className="text-sm text-muted-foreground">
                    You must be at least 18 years old to use GearUp. By using our platform, you represent that you meet
                    this age requirement and have the legal capacity to enter into binding agreements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Responsibilities */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">3. Account Responsibilities</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <p className="font-semibold">Account Security</p>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities under your account.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <p className="font-semibold">Accurate Information</p>
                  <p className="text-sm text-muted-foreground">
                    You must provide accurate and complete information when creating your account and keep it updated.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-1" />
                <div>
                  <p className="font-semibold">Prohibited Actions</p>
                  <p className="text-sm text-muted-foreground">
                    You may not share your account, use multiple accounts, or impersonate others.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">4. Rental Terms & Conditions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">4.1 Booking Process</h3>
                <ul className="space-y-2 list-disc pl-6 text-muted-foreground">
                  <li>Browse gear listings and select your desired items</li>
                  <li>Choose rental dates and complete checkout</li>
                  <li>Receive confirmation email with pickup/delivery details</li>
                  <li>Coordinate with provider for equipment transfer</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">4.2 Cancellation Policy</h3>
                <div className="p-4 rounded-lg border bg-card space-y-2 text-sm">
                  <p className="text-muted-foreground"><strong>Free Cancellation:</strong> Cancel up to 24 hours before rental start for a full refund</p>
                  <p className="text-muted-foreground"><strong>Late Cancellation:</strong> Within 24 hours incurs 50% fee</p>
                  <p className="text-muted-foreground"><strong>No-Show:</strong> No refund if you fail to pick up equipment</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">4.3 Equipment Care</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for the proper care and use of rented equipment. Normal wear and tear is expected,
                  but you must:
                </p>
                <ul className="space-y-2 list-disc pl-6 text-muted-foreground mt-3">
                  <li>Use equipment as intended and follow safety guidelines</li>
                  <li>Return equipment clean and in the same condition</li>
                  <li>Report any damage or issues immediately</li>
                  <li>Pay for repairs or replacement if damaged due to misuse or negligence</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">5. Payment Terms</h2>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                All payments are processed securely through Stripe. By making a booking, you agree to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Payment Authorization</h4>
                  <p className="text-sm text-muted-foreground">
                    You authorize GearUp to charge your payment method for rental fees, deposits, and any applicable damages.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Service Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    A service fee is added to each booking to cover platform operations and customer support.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Refunds</h4>
                  <p className="text-sm text-muted-foreground">
                    Refunds are processed within 5-7 business days to your original payment method.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Disputes</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact support within 14 days of rental completion to dispute charges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. Provider Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you list gear on GearUp, you agree to:
            </p>
            <ul className="space-y-3 list-disc pl-6 text-muted-foreground">
              <li>Provide accurate descriptions and photos of your gear</li>
              <li>Maintain equipment in good, safe working condition</li>
              <li>Honor confirmed bookings and provide timely communication</li>
              <li>Set fair pricing and availability</li>
              <li>Pay the 15% platform service fee on completed rentals</li>
              <li>Comply with local laws and regulations for equipment rental</li>
            </ul>
          </div>

          {/* Prohibited Conduct */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. Prohibited Conduct</h2>
            <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <p className="font-semibold mb-3">You may not use GearUp to:</p>
              <ul className="space-y-2 list-disc pl-6 text-muted-foreground">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post false, misleading, or fraudulent listings</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Attempt to bypass payment or fee structures</li>
                <li>Scrape, data mine, or reverse engineer the platform</li>
                <li>Upload malware or malicious code</li>
              </ul>
            </div>
          </div>

          {/* Liability */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">8. Limitation of Liability</h2>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-muted-foreground leading-relaxed">
                GearUp is a marketplace platform connecting renters and providers. We do not own or control the listed
                equipment. To the maximum extent permitted by law, GearUp is not liable for:
              </p>
              <ul className="space-y-2 list-disc pl-6 text-muted-foreground mt-3">
                <li>Quality, safety, or condition of rented equipment</li>
                <li>Conduct or actions of users (renters or providers)</li>
                <li>Injuries or damages resulting from equipment use</li>
                <li>Lost profits, data, or business opportunities</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our total liability shall not exceed the amount you paid through the platform in the 12 months preceding
                the claim.
              </p>
            </div>
          </div>

          {/* Dispute Resolution */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the
              rules of the American Arbitration Association. You waive the right to participate in class actions.
            </p>
          </div>

          {/* Termination */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. Account Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion if you violate these terms,
              engage in fraudulent activity, or for any other reason. You may delete your account at any time through
              your account settings.
            </p>
          </div>

          {/* Changes to Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may modify these Terms of Service at any time. We will notify users of significant changes via email or
              platform notification. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by the laws of the State of California, United States, without regard
              to conflict of law principles.
            </p>
          </div>

          {/* Contact */}
          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> <a href="mailto:legal@gearup.com" className="text-primary hover:underline">legal@gearup.com</a></p>
              <p><strong>Phone:</strong> +1 (234) 567-890</p>
              <p><strong>Address:</strong> GearUp Inc., 123 Market Street, San Francisco, CA 94102</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
