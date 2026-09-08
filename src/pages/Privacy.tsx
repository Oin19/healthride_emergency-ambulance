import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Privacy Policy — HealthRide</title>
      <meta name="description" content="How HealthRide collects, uses, and protects patient, location, medical, and insurance data used for ambulance dispatch." />
      <link rel="canonical" href="https://healthride-oin.lovable.app/privacy" />
      <meta property="og:title" content="Privacy Policy — HealthRide" />
      <meta property="og:description" content="How HealthRide handles patient, location, and medical data." />
      <meta property="og:url" content="https://healthride-oin.lovable.app/privacy" />
    </Helmet>
    <Navbar />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm">Last updated: March 23, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect personal information you provide when creating an account, including your name, phone number, email address, date of birth, blood type, medical history, insurance details, and emergency contacts. We also collect location data when you use our ambulance dispatch or transport scheduling services.</p>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is used to dispatch emergency services, match you with appropriate hospitals, pre-authorize insurance, and communicate with paramedics and healthcare providers. Location data is used solely for real-time tracking and routing.</p>

        <h2>3. Data Sharing</h2>
        <p>We share relevant medical and personal data only with dispatched ambulance crews, receiving hospitals, and insurance providers — strictly as needed to deliver emergency care. We do not sell your data to third parties.</p>

        <h2>4. Data Security</h2>
        <p>All data is encrypted in transit and at rest. Access to patient records is restricted to authorized medical and operational personnel only.</p>

        <h2>5. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:banerjeeoindrila40@gmail.com" className="text-accent">banerjeeoindrila40@gmail.com</a>.</p>

        <h2>6. Cookies & Analytics</h2>
        <p>We use essential cookies and local storage to keep you signed in, remember your language choice, and protect our forms from automated abuse. These cannot be switched off without breaking the service. With your consent we also collect anonymous usage statistics (pages visited, approximate region) to improve dispatch speed. You can accept or decline optional cookies in the banner shown on your first visit, and change your mind any time by clearing your browser storage for this site. We do not use advertising or cross-site tracking cookies.</p>

        <h2>7. Contact</h2>
        <p>For privacy-related inquiries, reach us at <a href="mailto:banerjeeoindrila40@gmail.com" className="text-accent">banerjeeoindrila40@gmail.com</a> or call +91 9330865494.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
