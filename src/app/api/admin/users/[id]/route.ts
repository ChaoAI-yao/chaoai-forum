import { NextResponse } from "next/server";
import { z } from "zod";
import { requestUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { error } from "@/lib/http";
const schema=z.object({isBanned:z.boolean()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const user=await requestUser(request);if(!user||user.role!=="ADMIN")return error("需要管理员权限",403);const {id}=await params;const form=await request.formData().catch(()=>null);let raw:unknown;try{raw=form?{isBanned:form.get("isBanned")==="true"}:await request.json();}catch{return error("请求格式错误");}const input=schema.safeParse(raw);if(!input.success)return error("用户状态无效");const updated=await db.user.update({where:{id},data:{isBanned:input.data.isBanned}}).catch(()=>null);if(!updated)return error("未找到用户",404);if(form)return NextResponse.redirect(new URL("/admin",request.url),303);return NextResponse.json({ok:true});}
