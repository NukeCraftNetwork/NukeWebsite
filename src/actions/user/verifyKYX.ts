import axios from "axios";
import { getCookie } from "vinxi/http";
import { investmentStep2Email } from "~/libs/emails";
import { BASE_URL } from "~/libs/variables";
import { UserInterestsQueryFnType } from "~/routes/api/users/[email]/interests";

export async function verifyKYX(email: string, type: string) {
  "use server";
  const obj = type === "business" ? { kyb: 1 } : { kyc: 1 };
  try {
    fetch(`${BASE_URL}/api/users/${email}`, {
      method: "PATCH",
      body: JSON.stringify(obj),
      credentials: "include",
      headers: {
        Cookie: `token=${getCookie("token")}`,
      },
    });
  } catch (e) {
    return console.error("Bruh");
  }
  const interests = await fetch(`${BASE_URL}/api/users/${email}/interests`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `token=${getCookie("token")}`,
    },
  });
  const data =
    (await interests.json()) as ExtractPromiseType<UserInterestsQueryFnType>;
  data.forEach(({ opportunityTitle }) => {
    axios.post(
      "https://api.brevo.com/v3/smtp/email",
      investmentStep2Email(email, opportunityTitle),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
  });
}
