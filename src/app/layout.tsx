import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import MatchingStageJumper from "@/components/dev/MatchingStageJumper";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "행연",
  description: "관광지를 소개하는 동행 앱, 행연",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-200">
        <Providers>
          {process.env.NODE_ENV !== "production" ? <MatchingStageJumper /> : null}
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-cream shadow-xl">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
