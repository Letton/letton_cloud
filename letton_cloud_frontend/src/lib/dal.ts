import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { User } from "@/api/dto/auth.dto";

export const verifySession = cache(async () => {
  const token = (await cookies()).get("_token")?.value;
  if (!token) {
    redirect("/auth");
  }
  try {
    const user = (await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    )) as User;

    if (!user) {
      redirect("/auth");
    }
    return { isAuth: true, userId: user.id };
  } catch {
    redirect("/auth");
  }
});
