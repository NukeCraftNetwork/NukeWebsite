import { getCookie } from "vinxi/http";
import { WORKER_URL } from "../../libs/variables";

export async function uploadFile(
  file: File,
  folder: string = "public"
): Promise<{ secure_url?: string; url?: string }> {
  "use server";
  const formData = new FormData();
  formData.append("file", file);
  const headers = new Headers();
  headers.append("Authorization", getCookie("token") || "");
  const response = await fetch(`${WORKER_URL}/${folder}/${file.name}`, {
    method: "PUT",
    body: formData,
    headers,
  });
  let json = {};
  try {
    json = await response.json();
  } catch (e) {
    console.error(e);
  }
  console.log("From worker> ", json, response);
  return json;
}
