import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requestUser } from "@/lib/auth";
import { error } from "@/lib/http";
const schema=z.object({body:z.string().trim().min(1).max(3000)});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const user=await requestUser(request);if(!user)return error("请先登录",401);const {id:postId}=await params;const post=await db.post.findUnique({where:{id:postId},select:{status:true}});if(!post||post.status!=="PUBLISHED")return error("未找到可评论的帖子",404);const input=schema.safeParse(await request.json());if(!input.success)return error("评论内容不能为空或过长");const comment=await db.comment.create({data:{body:input.data.body,postId,authorId:user.id},select:{id:true}});return NextResponse.json(comment,{status:201});}
