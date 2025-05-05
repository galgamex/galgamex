"use client";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import { useLocaleStore } from "@/stores/localeStore";
import { Globe, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export function LanguageDetectionAlert() {
  const [countdown, setCountdown] = useState(10); // countdown 10s and dismiss
  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState(locale);
  const {
    showLanguageAlert,
    setShowLanguageAlert,
    dismissLanguageAlert,
    getLangAlertDismissed,
  } = useLocaleStore();

  useEffect(() => {
    const detectedLang = navigator.language; // Get full language code, e.g., zh-HK
    const storedDismiss = getLangAlertDismissed();

    if (!storedDismiss) {
      // Check if the full language code is supported (e.g., zh-HK)
      let supportedLang = routing.locales.find((l) => l === detectedLang);

      // If full code isn't supported, check primary language (e.g., zh)
      if (!supportedLang) {
        const mainLang = detectedLang.split("-")[0]; // Get primary language code
        supportedLang = routing.locales.find((l) => l.startsWith(mainLang));
      }

      // If language still isn't supported, default to English
      setCurrentLocale(supportedLang || DEFAULT_LOCALE);
      setShowLanguageAlert(supportedLang !== locale);
    }
  }, [locale, getLangAlertDismissed, setCurrentLocale, setShowLanguageAlert]);

  // countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showLanguageAlert && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showLanguageAlert, countdown]);

  // dismiss alert after countdown = 0
  useEffect(() => {
    if (countdown === 0 && showLanguageAlert) {
      dismissLanguageAlert();
    }
  }, [countdown, showLanguageAlert, dismissLanguageAlert]);

  if (!showLanguageAlert) return null;

  const messages = require(`@/i18n/messages/${currentLocale}.json`);
  const alertMessages = messages.LanguageDetection;

  return (
    <Alert className="mb-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={dismissLanguageAlert}
      >
        <X className="h-4 w-4" />
      </Button>
      <Globe className="h-4 w-4" />
      <AlertTitle>
        {alertMessages.title}{" "}
        <span className=" mt-2 text-sm text-muted-foreground">
          {alertMessages.countdown.replace("{countdown}", countdown.toString())}
        </span>
      </AlertTitle>
      <AlertDescription>
        <div className="flex items-center gap-2">
          {alertMessages.description} <LocaleSwitcher />
        </div>
      </AlertDescription>
    </Alert>
  );
}
