"use client";

import Script from "next/script";

// 你可以将域名放在环境变量中，这里先直接使用你提供的域名
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC;

const PlausibleAnalytics = () => {
  return (
    <>
      {PLAUSIBLE_DOMAIN ? (
        <>
          <Script
            strategy="afterInteractive"
            data-domain={PLAUSIBLE_DOMAIN}
            src={PLAUSIBLE_SRC}
            defer
          />
          <Script
            id="plausible-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.plausible = window.plausible || function() { 
                  (window.plausible.q = window.plausible.q || []).push(arguments) 
                }
              `,
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlausibleAnalytics;
