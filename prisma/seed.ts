import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD 未设置，跳过创建管理员。");
    return;
  }
  if (password.length < 12) throw new Error("管理员密码至少需要 12 个字符。");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", isBanned: false },
    create: { email, name: "社区管理员", passwordHash, role: "ADMIN" },
  });
  console.log(`管理员账户已就绪：${email}`);
}

main().finally(() => prisma.$disconnect());
