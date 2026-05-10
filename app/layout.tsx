import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { RainBackground } from "@/components/rain-background";
import { FloatAudioButton } from "@/components/float-audio-button";
import { Footer } from "@/components/footer";
import { PageTransitionProvider } from "@/components/page-transition";
import { InitialLoader } from "@/components/initial-loader";
import { ClickEffect } from "@/components/click-effect";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PageFadeIn } from "@/components/page-fade-in";

export const metadata: Metadata = {
  title: "朱美阳 | AI训练师 / 大模型数据专家",
  description:
    "朱美阳个人网站 — 2年AI训练师经验，6个大模型核心项目全流程实操，覆盖消费级语音助手与车载智能交互。",
  keywords: ["朱美阳", "AI训练师", "大模型数据专家", "NLP", "SFT", "个人站点"],
  openGraph: {
    title: "朱美阳 | AI训练师 / 大模型数据专家",
    description:
      "6个大模型核心项目全流程实操，覆盖消费级语音助手与车载智能交互。累计处理超15万条NLP/语音/多模态数据。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PageTransitionProvider>
          <InitialLoader />
          <ClickEffect />
          <RainBackground />
          <ConditionalNavbar />
          <PageFadeIn>{children}</PageFadeIn>
          <FloatAudioButton />
          <ScrollToTop />
          <Footer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
