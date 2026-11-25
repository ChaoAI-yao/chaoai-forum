"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setBusy(true); setMessage(""); const data=Object.fromEntries(new FormData(e.currentTarget));
    if(mode==="register"&&data.password!==data.confirmPassword){setMessage("两次输入的密码不一致");setBusy(false);return;}
    const res=await fetch(`/api/auth/${mode}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}); const result=await res.json(); setBusy(false);
    if(!res.ok){setMessage(result.error||"操作失败");return;} router.push("/");router.refresh();
  }
  return <form className="card form" onSubmit={submit}><h1>{mode==="login"?"欢迎回来":"创建社区账号"}</h1>{mode==="register"&&<><label className="label">昵称</label><input className="field" name="name" required maxLength={40}/></>}<label className="label">邮箱</label><input className="field" type="email" name="email" required maxLength={254}/><label className="label">密码</label><input className="field" type="password" name="password" required minLength={10} autoComplete={mode==="login"?"current-password":"new-password"}/>{mode==="register"&&<><label className="label">确认密码</label><input className="field" type="password" name="confirmPassword" required minLength={10}/></>}{message&&<p className="error">{message}</p>}<button disabled={busy}>{busy?"请稍候…":mode==="login"?"登录":"注册"}</button></form>;
}
