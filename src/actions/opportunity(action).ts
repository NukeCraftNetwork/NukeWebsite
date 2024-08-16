import axios from "axios";
import { z } from "zod";
import { BASE_URL } from "~/libs/variables";

export type CommentType = {
  title: string;
  description?: string;
};
export const addComment = async ({ title, description }: CommentType) => {
  "use server";
  const validated = z.string().max(50).safeParse(title);
  if (!validated.success) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 400,
    });
  }
  const updatedData = await axios.patch(
    `${BASE_URL}/api/opportunities/1`,
    JSON.stringify({
      questions: [{ title, description: description || "" }],
    })
  );
  return new Response(JSON.stringify(updatedData.data), { status: 200 });
};
