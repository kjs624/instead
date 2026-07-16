import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대신 기부 — 함께 나누는 따뜻한 기부",
  description: "낯선 사람이 나 대신 기부해주고, 함께 모아서 기부하고, 오프라인 선행을 기록하는 따뜻한 기부 커뮤니티",
  openGraph: {
    title: "대신 기부",
    description: "혼자가 아니어도 괜찮아요. 당신 대신, 혹은 당신과 함께 기부할게요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
