import { NextResponse } from "next/server";
import { requestUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { error, isModerator } from "@/lib/http";
export async function GET(request:Request){const user=await requestUser(request);if(!user||!isModerator(user.role))return error("需要管理员权限",403);const posts=await db.post.findMany({where:{status:{in:["DRAFT","HIDDEN"]}},include:{author:{select:{id:true,name:true,email:true}}},orderBy:{updatedAt:"desc"},take:100});return NextResponse.json(posts);}
