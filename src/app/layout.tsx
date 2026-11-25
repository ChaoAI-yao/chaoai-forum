import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "潮 AI 社区",
  description: "AI 智能体、OpenClaw 技术与 Token 经济交流社区",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><header className="topbar"><a className="brand" href="/">潮 AI <span>社区</span></a><nav><a href="/">广场</a><a href="/posts/new">发布</a><a href="/login">登录</a><a href="/register">注册</a><a href="/admin">管理</a></nav></header><main className="container">{children}</main><footer>潮 AI 智能体社区 · 分享实践，连接创造者</footer></body></html>;
}
