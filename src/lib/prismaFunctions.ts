import { usePrisma } from "./prisma";

const prisma = usePrisma();

export async function prismaGetUser(email: string) {
  "use server";
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    console.error(e);
    return null;
  }
}
export async function prismaCreateUser(email: string, password: string) {
  "use server";
  try {
    return await prisma.user.create({ data: { email, password } });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function prismaGetTocos() {
  "use server";
  try {
    return await prisma.toco.findMany();
  } catch (e) {
    console.error(e);
    return null;
  }
}
