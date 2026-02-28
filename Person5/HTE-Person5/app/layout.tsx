import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AccessibilitySettings, AccessibilitySettingsTrigger } from "@/components/ui/AccessibilitySettings";
import { Header } from "@/components/ui/Header";
import { ProgressDashboard } from "@/components/ui/ProgressDashboard";

export const metadata: Metadata = {
  title: "FocusFlow 3D",
  description: "AI-powered adaptive learning for neurodivergent students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AccessibilitySettings>
            <Header>
              <ProgressDashboard embedded />
              <AccessibilitySettingsTrigger />
            </Header>
            {children}
          </AccessibilitySettings>
        </Providers>
      </body>
    </html>
  );
}
