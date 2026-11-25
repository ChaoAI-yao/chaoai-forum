import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requestUser } from "@/lib/auth";
import { error } from "@/lib/http";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const user=await requestUser(request);if(!user)return error("请先登录",401);const {id:postId}=await params;const post=await db.post.findUnique({where:{id:postId},select:{status:true}});if(!post||post.status!=="PUBLISHED")return error("未找到帖子",404);const existing=await db.savedPost.findUnique({where:{userId_postId:{userId:user.id,postId}}});if(existing)await db.savedPost.delete({where:{userId_postId:{userId:user.id,postId}}});else await db.savedPost.create({data:{userId:user.id,postId}});return NextResponse.json({saved:!existing});}
