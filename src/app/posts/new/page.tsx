import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
export default async function NewPost(){if(!await currentUser())redirect("/login");return <PostForm/>;}
