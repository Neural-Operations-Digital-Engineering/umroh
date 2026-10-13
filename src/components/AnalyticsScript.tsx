import Script from "next/script";

export default function AnalyticsScript() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null;

  return (
    <>
      {/*
        strategy="lazyOnload" defers both the GA script tag and its inline init
        until the page is fully loaded and idle. This means it runs after all
        critical resources (LCP image, fonts, JS bundles) have been processed.

        Trade-off vs "afterInteractive": the very first pageview fired by gtag()
        may be delayed by ~1–3 seconds on slow connections. For a travel/inquiry
        site where conversions happen via WhatsApp links (not SPA navigation),
        this is an acceptable trade-off. If accurate first-paint attribution
        becomes important, revert to "afterInteractive".
      */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
