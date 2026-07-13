import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Terms of Service — HealthRide</title>
      <meta name="description" content="The terms that govern your use of HealthRide's AI-powered ambulance dispatch and medical transport platform." />
      <link rel="canonical" href="https://healthride-oin.lovable.app/terms" />
      <meta property="og:title" content="Terms of Service — HealthRide" />
      <meta property="og:description" content="Terms governing use of HealthRide's ambulance dispatch platform." />
      <meta property="og:url" content="https://healthride-oin.lovable.app/terms" />
    </Helmet>
    <Navbar />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 23, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using HealthRide, you agree to these terms. If you do not agree, please do not use our services.</p>

        <h2>2. Service Description</h2>
        <p>HealthRide provides AI-powered emergency ambulance dispatch and non-emergency medical transport scheduling. We connect patients with nearby ambulances, hospitals, and medical transport providers.</p>

        <h2>3. User Responsibilities</h2>
        <p>You agree to provide accurate personal and medical information. Misuse of emergency dispatch services (e.g., false requests) may result in account suspension and legal action.</p>

        <h2>4. Medical Disclaimer</h2>
        <p>HealthRide is a dispatch and logistics platform, not a medical provider. All medical care is delivered by licensed ambulance services and hospitals. We do not provide medical advice or diagnosis.</p>

        <h2>5. Limitation of Liability</h2>
        <p>HealthRide is not liable for delays caused by traffic, weather, or circumstances beyond our control. Response times are estimates and not guarantees.</p>

        <h2>6. Payment & Insurance</h2>
        <p>Transport fees are communicated before or during dispatch. Insurance pre-authorization is offered as a convenience and does not guarantee coverage. Final billing is determined by your insurance provider and the hospital.</p>

        <h2>7. Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>

        <h2>8. Contact</h2>
        <p>Questions about these terms? Email <a href="mailto:banerjeeoindrila40@gmail.com" className="text-accent">banerjeeoindrila40@gmail.com</a>.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
