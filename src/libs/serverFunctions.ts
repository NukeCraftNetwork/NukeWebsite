import { action, redirect } from "@solidjs/router";
import z from "zod";
import { prismaCreateUser, prismaGetUser } from "./prismaFunctions";
import bcrypt from "bcrypt";
import { getSession } from "./utils";

export const loginOrRegister = action(async (formData: FormData) => {
  "use server";
  const username = z
    .string()
    .min(3)
    .safeParse(String(formData.get("username")));
  const password = z
    .string()
    .min(8)
    .safeParse(String(formData.get("password")));
  const loginType = String(formData.get("loginType"));
  if (username.error || password.error)
    return new Error("Username or password are invalid");

  let user = null;
  user = await prismaGetUser(username.data);
  if (loginType === "login") {
    if (!user || password !== user.password) throw new Error("Invalid login");
  } else {
    if (user) throw new Error("User already exists");
    user = await prismaCreateUser(
      username.data,
      bcrypt.hashSync(password.data, 10)
    );
  }
  try {
    (await getSession()).update((d) => {
      d.userId = user.id;
    });
  } catch (err) {
    return err as Error;
  }
  return redirect("/");
});
