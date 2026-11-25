import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, setSession } from "@/lib/auth";
import { error } from "@/lib/http";
const schema=z.object({email:z.string().trim().email().max(254),password:z.string().min(1).max(128)});
export async function POST(request:Request){try{const input=schema.safeParse(await request.json());if(!input.success)return error("邮箱或密码格式不正确");const user=await db.user.findUnique({where:{email:input.data.email.toLowerCase()}});if(!user||user.isBanned||!await bcrypt.compare(input.data.password,user.passwordHash))return error("邮箱或密码错误",401);await setSession(await createSession(user.id));return NextResponse.json({ok:true});}catch{return error("登录暂时不可用",500);}}
