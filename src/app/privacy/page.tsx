"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap/config";
import GraphicBackground from "@/components/background/GraphicBackground";
import AnimatedTypographyLayer from "@/components/typography/AnimatedTypographyLayer";
import BlobBackground from "@/components/background/BlobBackground";

export default function PrivacyPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <GraphicBackground />
      <AnimatedTypographyLayer />
      <BlobBackground />

      {/* Back Arrow Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-8 left-8 z-20 p-3 text-black transition-colors hover:text-accent"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-12 py-20 bg-transparent">
        <div
          ref={containerRef}
          style={{padding:"1rem"}}
          className="w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-sm border-[3px] border-black p-12"
        >
          <h1
            className="text-5xl font-bold tracking-tight mb-8"
            style={{ fontFamily: "var(--font-oxanium)" }}
          >
            PRIVACY POLICY
          </h1>

          <p className="text-sm text-gray-500 mb-8 uppercase tracking-wider">
            Last updated: January 2025
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                1. Information We Collect
              </h2>
              <p className="leading-relaxed">
                NaviR collects the following information to provide our bookmark
                navigation service:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  <strong>Account Information:</strong> Email address, username,
                  and encrypted password when you create an account.
                </li>
                <li>
                  <strong>Bookmark Data:</strong> URLs, titles, and organization
                  of your bookmarks for cloud synchronization.
                </li>
                <li>
                  <strong>Settings:</strong> Your theme preferences and display
                  settings.
                </li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain the NaviR service</li>
                <li>To synchronize your bookmarks across devices</li>
                <li>To save and apply your personalization settings</li>
                <li>To send important service-related notifications</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                3. Data Storage & Security
              </h2>
              <p className="leading-relaxed">
                Your data is stored securely on our servers. We use
                industry-standard encryption for passwords and secure HTTPS
                connections for all data transmission. We do not sell, trade, or
                share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                4. Chrome Extension
              </h2>
              <p className="leading-relaxed">
                The NaviR Chrome extension stores authentication tokens locally
                using Chrome&apos;s secure storage API. The extension only
                communicates with navir.icu servers to sync your bookmarks and
                settings. We do not track your browsing history or collect any
                data beyond what is necessary for the service.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                5. Your Rights
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Access and download your data at any time</li>
                <li>Delete your account and all associated data</li>
                <li>Update or correct your personal information</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 uppercase"
                style={{ fontFamily: "var(--font-oxanium)" }}
              >
                6. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
                <a
                  href="mailto:privacy@navir.icu"
                  className="text-accent hover:underline font-bold"
                >
                  a1691357101@gmail.com
                </a>
              </p>
            </section>
          </div>

         
        </div>
      </div>
    </main>
  );
}
