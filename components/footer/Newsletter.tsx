"use client";

import { Button } from "@/components/ui/button";
import { normalizeEmail, validateEmail } from "@/lib/email";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const t = useTranslations("Footer.Newsletter");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const normalizedEmailAddress = normalizeEmail(email);
    const { isValid, error } = validateEmail(normalizedEmailAddress);

    if (!isValid) {
      setSubscribeStatus("error");
      setErrorMessage(error || t("defaultErrorMessage"));
      setTimeout(() => setSubscribeStatus("idle"), 5000);
      return;
    }

    try {
      setSubscribeStatus("loading");

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmailAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorMessage"));
      }

      setSubscribeStatus("success");
      setEmail("");
      setErrorMessage("");
      setTimeout(() => setSubscribeStatus("idle"), 5000);
    } catch (error) {
      setSubscribeStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t("errorMessage2")
      );
      setTimeout(() => setSubscribeStatus("idle"), 5000);
    }
  };
  return (
    <div className="">
      <h4 className="mb-3 font-semibold">{t("title")}</h4>
      <p className="text-sm mb-3">{t("description")}</p>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-64">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-3 py-2 bg-gray-200 text-black text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={subscribeStatus === "loading"}
          />
        </div>
        <Button type="submit" disabled={subscribeStatus === "loading"}>
          {subscribeStatus === "loading" ? (
            t("subscribing")
          ) : (
            <>
              {t("subscribe")} <Send className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
        {subscribeStatus === "success" && (
          <p className="text-xs text-green-600 mt-1">{t("subscribed")}</p>
        )}
        {subscribeStatus === "error" && (
          <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
