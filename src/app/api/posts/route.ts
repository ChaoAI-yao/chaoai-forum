import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requestUser } from "@/lib/auth";
import { error } from "@/lib/http";
const schema=z.object({title:z.string().trim().min(3).max(160),body:z.string().trim().min(2).max(20000),category:z.string().trim().min(1).max(40),tags:z.string().max(200).optional(),draft:z.union([z.literal("on"),z.literal("true"),z.literal(true)]).optional()});
export async function GET(request:Request){const url=new URL(request.url);const q=url.searchParams.get("q")?.trim();const category=url.searchParams.get("category")?.trim();const posts=await db.post.findMany({where:{status:"PUBLISHED",...(category?{category}:{}),...(q?{OR:[{title:{contains:q}},{body:{contains:q}},{tags:{contains:q}}]}:{})},include:{author:{select:{id:true,name:true}},_count:{select:{comments:true,savedBy:true}}},orderBy:{createdAt:"desc"},take:50});return NextResponse.json(posts);}
export async function POST(request:Request){const user=await requestUser(request);if(!user)return error("请先登录",401);const input=schema.safeParse(await request.json());if(!input.success)return error("帖子内容格式不正确");const post=await db.post.create({data:{...input.data,tags:(input.data.tags||"").split(",").map(t=>t.trim()).filter(Boolean).join(","),status:input.data.draft?"DRAFT":"PUBLISHED",authorId:user.id},select:{id:true}});return NextResponse.json(post,{status:201});}
