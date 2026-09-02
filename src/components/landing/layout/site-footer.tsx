import { BrandMark } from "@/components/landing/layout/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand" href="#top" aria-label="Notifyr home">
        <BrandMark />
        <span>Notifyr</span>
      </a>
      <p>Know when the web changes.</p>
      <p className="site-footer__meta">Public URLs · Email alerts · Built for the open web</p>
    </footer>
  );
}
