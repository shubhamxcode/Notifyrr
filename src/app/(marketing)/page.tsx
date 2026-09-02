import { FinalCtaSection } from "@/components/landing/sections/final-cta-section";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { ScenarioStrip } from "@/components/landing/sections/scenario-strip";
import { UnderTheHoodSection } from "@/components/landing/sections/under-the-hood-section";
import { UseCasesSection } from "@/components/landing/sections/use-cases-section";
import { WorkflowSection } from "@/components/landing/sections/workflow-section";
import { SiteFooter } from "@/components/landing/layout/site-footer";
import { SiteHeader } from "@/components/landing/layout/site-header";

export default function Home() {
  return (
    <div className="landing-page">
      <SiteHeader />
      <main>
        <HeroSection />
        <ScenarioStrip />
        <WorkflowSection />
        <UseCasesSection />
        <UnderTheHoodSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
