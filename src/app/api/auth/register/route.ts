import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, setSession } from "@/lib/auth";
import { error } from "@/lib/http";
const schema=z.object({name:z.string().trim().min(2).max(40),email:z.string().trim().email().max(254),password:z.string().min(10).max(128)});
export async function POST(request:Request){try{const input=schema.safeParse(await request.json());if(!input.success)return error("请检查昵称、邮箱和密码（密码至少 10 位）");const {name,password}=input.data;const email=input.data.email.toLowerCase();if(await db.user.findUnique({where:{email},select:{id:true}}))return error("该邮箱已注册",409);const passwordHash=await bcrypt.hash(password,12);const user=await db.user.create({data:{name,email,passwordHash},select:{id:true}});await setSession(await createSession(user.id));return NextResponse.json({ok:true},{status:201});}catch{return error("注册暂时不可用",500);}}
