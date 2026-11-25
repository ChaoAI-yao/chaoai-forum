import Link from "next/link";
import { db } from "@/lib/db";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED", ...(category ? { category } : {}), ...(q ? { OR: [{ title: { contains: q } }, { body: { contains: q } }, { tags: { contains: q } }] } : {}) },
    include: { author: { select: { id: true, name: true } }, _count: { select: { comments: true, savedBy: true } } },
    orderBy: { createdAt: "desc" }, take: 30,
  });
  const categories = ["AI 智能体", "OpenClaw", "Token 经济", "教程案例", "行业动态"];
  return <><section className="hero"><h1>让智能体创造者彼此连接</h1><p>分享 AI 智能体实践、OpenClaw 技术与 Token 经济观察。</p></section><div className="layout"><section><form className="search" action="/"><input className="field" name="q" placeholder="搜索帖子、标签和实践经验" defaultValue={q}/><button>搜索</button></form>{posts.length ? posts.map(post=><article className="card" key={post.id}><Link href={`/posts/${post.id}`}><h2 className="post-title">{post.title}</h2></Link><p className="tagline">{post.category} · <Link href={`/profile/${post.author.id}`}>{post.author.name}</Link> · {post.createdAt.toLocaleDateString("zh-CN")} · {post._count.comments} 条评论</p><p className="post-body">{post.body.length > 230 ? `${post.body.slice(0,230)}…` : post.body}</p>{post.tags.split(",").filter(Boolean).map(tag=><span className="pill" key={tag}>#{tag.trim()}</span>)}</article>):<div className="card empty">还没有匹配的帖子，来发布第一篇分享吧。</div>}</section><aside className="card side"><h3>内容分类</h3>{categories.map(c=><p key={c}><Link className="pill" href={`/?category=${encodeURIComponent(c)}`}>{c}</Link></p>)}<Link className="btn" href="/posts/new">发布新帖子</Link></aside></div></>;
}
