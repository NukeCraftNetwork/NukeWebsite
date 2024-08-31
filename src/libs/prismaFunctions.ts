import { useFtp } from "./ftp";
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

export async function prismaCreateToco(formData: FormData) {
  "use server";
  console.log(formData);
  const obj = {} as Record<string, unknown>;

  const ftp = await useFtp();
  if (!ftp) {
    throw new Error("FTP connection failed");
  }

  Array.from(formData.keys()).forEach((key) => {
    const data = formData.getAll(key);
    const pData = [] as unknown[];
    data.forEach(async (el) => {
      if (el instanceof File) {
        await ftp?.uploadFrom(await el.text(), `${formData.get("unicode")}`);
        pData.push(secure_url);
      }
    });
    obj[key] = pData.length === 1 ? pData[0] : pData;
  });

  console.log(obj);
  try {
    return await prisma.toco.create({ data: { ...obj } });
  } catch (e) {
    console.error(e);
    return null;
  }
}
