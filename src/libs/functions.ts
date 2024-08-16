export function getClientCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift();
  return null;
}

// Objects passed by rederence
export function mergeObject(oldObj: object, newObj: object) {
  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    oldObj.push(...newObj);
  } else {
    oldObj = newObj;
  }
}

type Select = {
  [key: string]: boolean;
};
export function getSelect(url: URL): Select | undefined {
  const select: Select = {};
  if (url.searchParams.get("select")) {
    const selectReq: string[] = url.searchParams.get("select")!.split(",");
    selectReq?.forEach((el) => {
      if (el !== "password") {
        select[el] = true;
      }
    });
  }
  return JSON.stringify(select) !== "{}" ? select : undefined;
}

export function toLink(url: string) {
  if (url.includes("http://")) {
    return url.replaceAll("http://", "https://");
  }
  if (!url.includes("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function stringToDate(str: string): Date {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export function getSocialImage(social: string): string {
  if (social.toLowerCase() === "instagram") {
    return "/icons/socials/instagram.svg";
  }
  if (["x", "twitter"].includes(social.toLowerCase())) {
    return "/icons/socials/x.svg";
  }
  if (social.toLowerCase() === "facebook") {
    return "/icons/socials/facebook.svg";
  }
  if (social.toLowerCase() === "discord") {
    return "/icons/socials/discord.svg";
  }
  return "";
}

const encoder = new TextEncoder();
export async function hashPassword(password: string, i: number) {
  if (i === 0) return password;
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const newPassowrd = Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashPassword(newPassowrd, i - 1);
}