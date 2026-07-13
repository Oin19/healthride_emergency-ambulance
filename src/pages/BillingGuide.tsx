import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const BillingGuide = () => (
  <div className="min-h-screen flex flex-col">
    <Helmet>
      <title>Ambulance Insurance & Medicare Coverage Guide — HealthRide</title>
      <meta name="description" content="How ambulance billing, insurance coverage, and Medicare work for emergency and non-emergency medical transport — and how HealthRide's AI pre-authorization simplifies it." />
      <link rel="canonical" href="https://healthride-oin.lovable.app/billing-guide" />
      <meta property="og:title" content="Ambulance Insurance & Medicare Coverage Guide — HealthRide" />
      <meta property="og:description" content="Understand ambulance billing, insurance coverage, and how HealthRide's AI pre-authorization simplifies emergency transport costs." />
      <meta property="og:url" content="https://healthride-oin.lovable.app/billing-guide" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Understanding Ambulance Insurance and Medicare Coverage",
        "description": "A plain-language guide to ambulance billing, insurance eligibility, and Medicare coverage for emergency and non-emergency medical transport.",
        "author": { "@type": "Organization", "name": "HealthRide" },
        "publisher": { "@type": "Organization", "name": "HealthRide" }
      })}</script>
    </Helmet>
    <Navbar />
    <main className="flex-1 pt-24 pb-16">
      <article className="container mx-auto px-4 max-w-3xl prose prose-neutral dark:prose-invert">
        <h1 className="font-display text-3xl font-bold text-foreground">Understanding Ambulance Insurance and Medicare Coverage</h1>
        <p className="text-muted-foreground">A plain-language guide to how ambulance billing works, when insurance covers a ride, and how HealthRide's AI pre-authorization removes surprises before you arrive at the hospital.</p>

        <h2>Does insurance pay for an ambulance?</h2>
        <p>In most cases, insurance covers <strong>medically necessary</strong> ambulance transport — meaning any other form of transport would endanger your health. For emergencies (heart attack, stroke, serious trauma), coverage is almost universal. For non-emergency rides (dialysis, hospital transfers, appointments), coverage depends on your plan and prior authorization.</p>

        <h2>Does Medicare pay for ambulance service?</h2>
        <p>Medicare Part B covers ground ambulance transport to the nearest appropriate medical facility when it is medically necessary. Patients typically owe 20% of the Medicare-approved amount after the Part B deductible. Air ambulance is covered only when ground transport cannot reach you in time or the terrain makes it impossible.</p>

        <h2>Emergency vs. non-emergency transport</h2>
        <ul>
          <li><strong>Emergency (911 / 102):</strong> covered under most plans without prior authorization.</li>
          <li><strong>Non-emergency scheduled:</strong> requires prior authorization from your insurer. HealthRide submits this automatically before dispatch.</li>
        </ul>

        <h2>Indian insurance schemes HealthRide supports</h2>
        <p>HealthRide checks eligibility across <strong>Ayushman Bharat (PM-JAY)</strong>, <strong>CGHS</strong>, <strong>ESI</strong>, <strong>Swasthya Sathi</strong>, and major private insurers before the ambulance arrives, so you know the out-of-pocket amount up front.</p>

        <h2>How HealthRide's AI pre-authorization works</h2>
        <ol>
          <li>You request a ride and share your insurance details once (stored in your profile).</li>
          <li>Our AI matches the case type, hospital, and policy rules to check coverage.</li>
          <li>Pre-authorization is sent to the receiving hospital while the ambulance is en route.</li>
          <li>On arrival, admission is faster and billing is transparent — no surprise charges.</li>
        </ol>

        <h2>Frequently asked questions</h2>
        <h3>Will I be billed if my insurance denies coverage?</h3>
        <p>Yes — you remain responsible for the ambulance charge. HealthRide displays the estimated cost before dispatch so you can decide.</p>

        <h3>What documents should I keep ready?</h3>
        <p>Your insurance card or policy number, a government ID, and any hospital referral for scheduled transport.</p>
      </article>
    </main>
    <Footer />
  </div>
);

export default BillingGuide;