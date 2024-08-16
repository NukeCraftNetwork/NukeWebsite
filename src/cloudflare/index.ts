import { Env } from "../../worker-configuration";
import { parse } from "cookie";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Headers": "Authorization",
  "Access-Control-Allow-Methods": "PUT,DELETE,GET",
  "Access-Control-Allow-Origin": "https://valeureux.bysproject.co.uk",
  "Content-Disposition": `attachment`,
};

async function verify(
  jwt: string | null,
  role: number,
  env: string
): Promise<{
  status: number;
  email?: string;
  hashedEmail?: string;
  role?: number;
  username?: string;
}> {
  if (!jwt) return { status: 400, hashedEmail: "NaU" };
  const data = await fetch(
    `${
      env.startsWith("http://localhost")
        ? "http://localhost:3000"
        : "https://valeureux.bysproject.co.uk"
    }/api/jwt/${jwt}?role=${role}`
  );
  let json = {};
  try {
    json = await data.json();
  } catch (e) {
    console.error(e);
    return { status: data.status };
  }
  return { status: data.status, ...json };
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const authorization =
      request.headers.get("Authorization") ||
      parse(request.headers.get("Cookie") || "")["token"];
    const headers = new Headers();
    Object.keys(corsHeaders).forEach((key) =>
      headers.set(key, corsHeaders[key])
    );
    const [type, key] = url.pathname.slice(1).split("/");
    const isPrivate = type === "private";
    const bucket = isPrivate ? env.PRIVATE : env.PUBLIC;
    const { method } = request;
    if (method === "OPTIONS") {
      return new Response("", { headers });
    } else if (method === "PUT") {
      // Everyone can upload pictures
      const userData = await verify(authorization, 0, env.BASE_URL);
      /*
      if (userData.status !== 200)
        return new Response("", { status: userData.status });
      */
      const file = (await request.formData()).get("file") as File;
      if (!file) return new Response("", { status: 400 });
      const data = await bucket.put(
        [userData.hashedEmail, Date.now(), key].join("_"),
        await file.arrayBuffer()
      );
      return new Response(
        JSON.stringify({
          secure_url: `${
            env.BASE_URL || "https://r2.valeureux.bysproject.co.uk"
          }/${isPrivate ? "private" : "public"}/${data!.key}`,
          url: "",
        }),
        { status: 200 }
      );
    } else if (method === "GET") {
      // Only registered people can request data
      if (isPrivate) {
        const userData = await verify(authorization, 3, env.BASE_URL);
        if (userData.status !== 200)
          return new Response("", { status: userData.status });
      }
      const object = await bucket.get(key);
      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      headers.set("etag", object.httpEtag);
      object.writeHttpMetadata(headers);

      return new Response(object.body, {
        headers,
      });
    } else if (method === "DELETE") {
      // User must be admin for deleting images
      const userData = await verify(authorization, 3, env.BASE_URL);
      if (userData.status !== 200)
        return new Response("", { status: userData.status });
      await bucket.delete(key);
      return new Response("Deleted!");
    }
    return new Response("", { status: 405 });
  },
};
