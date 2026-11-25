import { NextResponse } from "next/server";
import { z } from "zod";
import { requestUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { error, isModerator } from "@/lib/http";
const schema=z.object({status:z.enum(["PUBLISHED","HIDDEN","DRAFT"])});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const user=await requestUser(request);if(!user||!isModerator(user.role))return error("需要管理员权限",403);const {id}=await params;const form=await request.formData().catch(()=>null);let raw:unknown;try{raw=form?{status:form.get("status")}:await request.json();}catch{return error("请求格式错误");}const input=schema.safeParse(raw);if(!input.success)return error("审核状态无效");const post=await db.post.update({where:{id},data:{status:input.data.status}}).catch(()=>null);if(!post)return error("未找到帖子",404);if(form)return NextResponse.redirect(new URL("/admin",request.url),303);return NextResponse.json({ok:true});}
