import { Header } from '@/features/landing/components/Header';
import { Footer } from '@/features/landing/components/Footer';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal | SportologyPlus',
  description: 'Privacy Policy, Terms of Service, and Refund Policy for SportologyPlus.com',
};

const legalSections = [
  { id: 'privacy-policy', title: 'Privacy Policy' },
  { id: 'terms-of-service', title: 'Terms of Service' },
  { id: 'refund-policy', title: 'Refund & Cancellation Policy' },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Legal Center</h1>
            <p className="mt-4 text-xl text-gray-600">Everything you need to know about our policies and terms.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left Sidebar */}
            <aside className="lg:col-span-1 sticky top-24 h-fit">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">On this page</h2>
              <nav className="space-y-2">
                {legalSections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-gray-600 hover:text-primary font-medium transition-colors"
                  >
                    {section.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Right Content */}
            <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
              <div className="prose prose-lg max-w-none">
                {/* Privacy Policy */}
                <section id="privacy-policy" className="mb-16 scroll-mt-24">
                  <h2 className="!text-4xl !font-bold !mb-6 !text-gray-900 !border-b !pb-4">Privacy Policy</h2>
                  <div className="space-y-6">
                    <p>At SportologyPlus.com, we are committed to protecting your privacy and the security of your data. This policy explains how we collect, use, and protect your personal information on our website.</p>
                    
                    <h3 className="!text-2xl !font-semibold !pt-4">What data is collected:</h3>
                    <ul>
                      <li>Name, email, phone number, date of birth, gender, university, specialized sport.</li>
                      <li>Program data: Weight, height, athletic goals, allergies, health history.</li>
                      <li>Payment data: Only through secure payment gateways; not stored by us.</li>
                      <li>Your activity on the platform: Pages visited, courses, time on the platform.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">How your data is used:</h3>
                    <ul>
                      <li>To create your account, manage your subscription, and provide services or digital certificates.</li>
                      <li>To improve the quality of our services and user experience.</li>
                      <li>To respond to your inquiries and provide technical support.</li>
                      <li>To send relevant notifications or offers (with the option to unsubscribe at any time).</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Sharing data with third parties:</h3>
                    <ul>
                      <li>Secure and certified payment gateways.</li>
                      <li>Certified specialists to provide training or consulting services.</li>
                      <li>Official legal authorities if required by law.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Data security:</h3>
                    <ul>
                      <li>Protection of communications via SSL encryption.</li>
                      <li>Storage of sensitive data in encrypted databases.</li>
                      <li>Granting access only to authorized employees, on a need-to-know basis.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Your rights:</h3>
                    <ul>
                      <li>Correct any inaccurate data in your account.</li>
                      <li>Unsubscribe from messages or newsletters.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Cookies:</h3>
                    <p>We use cookies only to improve the browsing experience, and you can control their settings through your browser.</p>

                    <h3 className="!text-2xl !font-semibold !pt-4">Children under 16:</h3>
                    <p>We do not knowingly collect data from children under 16. If we discover such a case, the account is immediately deleted.</p>

                    <h3 className="!text-2xl !font-semibold !pt-4">Policy updates:</h3>
                    <p>This policy may be updated from time to time, and you will be notified of any material changes via email or the platform.</p>

                    <h3 className="!text-2xl !font-semibold !pt-4">Contact:</h3>
                    <p>For any inquiries or requests related to privacy and data, please contact us at: <a href="mailto:privacy@sportologyplus.com" className="text-primary hover:underline">privacy@sportologyplus.com</a></p>
                  </div>
                </section>

                {/* Terms of Service */}
                <section id="terms-of-service" className="mb-16 scroll-mt-24">
                  <h2 className="!text-4xl !font-bold !mb-6 !text-gray-900 !border-b !pb-4">Terms of Service</h2>
                  <div className="space-y-6">
                    <p>By using SportologyPlus.com, you agree to be bound by all the terms and conditions set forth below in all your dealings with us.</p>

                    <h3 className="!text-2xl !font-semibold !pt-4">Eligibility and Registration:</h3>
                    <ul>
                      <li>You must be at least 16 years old, or have the consent of a guardian if you are younger.</li>
                      <li>You must enter correct and up-to-date data when creating an account.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Services Offered:</h3>
                    <ul>
                      <li>We offer specialized courses, training and nutrition programs, psychological consultations, and specialized electronic content.</li>
                      <li>Access to services depends on the type of package or active subscription.</li>
                      <li>We do not guarantee specific results, as they depend on your personal commitment and individual circumstances.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Payment and Subscriptions:</h3>
                    <ul>
                      <li>All prices are inclusive of taxes and are updated regularly on the website.</li>
                      <li>Subscriptions are automatically renewed, and you can cancel them at any time from your account settings.</li>
                      <li>In case of payment failure, you will be notified, and you will have a 7-day grace period to update your payment method before the service is suspended.</li>
                    </ul>
                  </div>
                </section>

                {/* Refund and Cancellation Policy */}
                <section id="refund-policy" className="scroll-mt-24">
                  <h2 className="!text-4xl !font-bold !mb-6 !text-gray-900 !border-b !pb-4">Refund and Cancellation Policy</h2>
                  <div className="space-y-6">
                    <h3 className="!text-2xl !font-semibold !pt-4">First: General Conditions:</h3>
                    <ul>
                      <li>All SportologyPlus.com products and services are fully digital (online courses, training programs, consultations, nutrition plans, etc.).</li>
                      <li>Once the account is activated, login data is sent, the first session is attended, or the content is viewed, the customer is considered to have benefited from the digital service.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Second: Refund Policy:</h3>
                    <ul>
                      <li>The customer has the right to request a full refund of the amount paid within the first 3 days of purchasing the service or course, provided that they have not received a full part of the service content (such as downloading all lessons, watching most of the videos, or attending the service in full).</li>
                      <li>If more than 10% of the course/program/service time or content has been used or consumed, you are not entitled to a refund.</li>
                      <li>The refund will be processed through the same payment method within 14 days of the request being approved.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Third: Cases where a refund is not accepted:</h3>
                    <ul>
                      <li>Receiving the full service or more than 10% of it.</li>
                      <li>A refund request due to the customer personal preference without a technical reason or a real problem with the service.</li>
                      <li>Refund requests after more than 3 days from the purchase.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Fourth: Technical Problems:</h3>
                    <p>If the customer faces a real technical problem that prevents them from benefiting from the service (platform crash or unprocessed payment failure), the support team is committed to resolving the issue or refunding the amount if the solution is not possible within 7 working days.</p>

                    <h3 className="!text-2xl !font-semibold !pt-4">Fifth: How to Request:</h3>
                    <ul>
                      <li>The customer must send the refund request to the email: <a href="mailto:support@sportologyplus.com" className="text-primary hover:underline">support@sportologyplus.com</a> or through the contact form on the website with an explanation of the case and the reasons for the request.</li>
                      <li>The customer service team will review the request and respond within a maximum of 3 working days.</li>
                    </ul>

                    <h3 className="!text-2xl !font-semibold !pt-4">Sixth: Exceptions:</h3>
                    <ul>
                      <li>Promotional offers/discounts on specific courses or packages may have a different refund policy, which will be clearly stated during the purchase.</li>
                      <li>For any inquiries, we are happy to communicate with you before or after the purchase at: <a href="mailto:support@sportologyplus.com" className="text-primary hover:underline">support@sportologyplus.com</a></li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}