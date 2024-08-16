import { Opportunity } from "@prisma/client";
import { BASE_URL } from "./variables";
import axios from "axios";
import { AxiosAggr } from "~/types/data";
import { FullOpportunityType } from "~/routes/api/opportunities/[opportunity](api)";
import { OpportunityCommentsType } from "~/routes/api/opportunities/[opportunity](api)/comments";
import { getCookie } from "vinxi/http";
import { isServer } from "solid-js/web";
import { UserInterestsQueryFnType } from "~/routes/api/users/[email]/interests";
import { UserVehiclesQueryFnType } from "~/routes/api/users/[email]/vehicles";
import { SpecVehiclesQueryFn } from "~/routes/api/opportunities/[opportunity](api)/vehicle";
import { SpecUserQueryFnType } from "~/routes/api/users/[email]";
import { MainFundType } from "~/routes/api/funds/[fund]";
import { FaqsQueryFnType } from "~/routes/api/faqs";
import { AggrViewsType } from "~/routes/api/views(api)";
import { UsersQueryFnType } from "~/routes/api/users";
import { UserPaymentsQueryFn } from "~/routes/api/users/[email]/userPayments";
import { UserTermSheetsQueryFnType } from "~/routes/api/users/[email]/termSheets";
import { UserSignaturesQueryFnType } from "~/routes/api/users/[email]/signatures";

function getSpecificCookie(str: string) {
  "use server";
  return getCookie(str);
}
export function getHeaders() {
  if (isServer) {
    return {
      headers: {
        withCredentials: true,
        Cookie: `token=${getSpecificCookie("token")}`,
      },
    };
  }
  return { headers: { withCredentials: true } };
}

export async function opportunitiesQueryFn(): Promise<{
  [key: string]: Opportunity[];
}> {
  try {
    const data = await axios.get(`${BASE_URL}/api/opportunities`, getHeaders());
    return data.data as { [key: string]: Opportunity[] };
  } catch (e) {
    console.error("Error Fetching Opportunities");
    return {};
  }
}

export async function aggrViewsQueryFn(
  date: string | undefined,
  selectTotal: "total" | "projects"
): Promise<AggrViewsType[]> {
  try {
    const data = await axios.get(
      `${BASE_URL}/api/views?date=${date}&select=${selectTotal}`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error(
      "Error Fetching Aggr Views Date: ",
      date,
      " Total: ",
      selectTotal
    );
    return [];
  }
}
export async function specCountViewsQueryFn(
  opportunity: string
): Promise<number> {
  try {
    const data = await axios.get(
      `${BASE_URL}/api/opportunities/${opportunity}/views?return=count`,
      getHeaders()
    );
    return data.data as number;
  } catch (e) {
    console.error("Error Fetching Spec Count Views");
    return 0;
  }
}
export async function aggrCommentsQueryFn(): Promise<AxiosAggr[]> {
  try {
    const data = await axios.get(`${BASE_URL}/api/comments`, getHeaders());
    return data.data as AxiosAggr[];
  } catch (e) {
    console.error("Error Fetching Aggr Comments");
    return [];
  }
}
export async function specCountCommentsQueryFn(
  opportunity: string
): Promise<number> {
  if (!opportunity) return 0;
  try {
    const data = await axios.get(
      `${BASE_URL}/api/opportunities/${opportunity}/comments?return=count`,
      getHeaders()
    );
    return data.data as number;
  } catch (e) {
    console.error("Could not get comments");
    return 0;
  }
}
export async function specCommentsQueryFn(
  opportunity: string
): OpportunityCommentsType {
  if (!opportunity) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/opportunities/${opportunity}/comments`,
      getHeaders()
    );
    return data.data as OpportunityCommentsType;
  } catch (e) {
    console.error("Could not get comments");
    return [];
  }
}

export async function specOpportunityQueryFn(
  opportunity: string
): FullOpportunityType {
  if (!opportunity) return null;
  try {
    const data = await axios.get(
      `${BASE_URL}/api/opportunities/${opportunity}`,
      getHeaders()
    );
    data.data.closing = data.data.closing ? new Date(data.data.closing) : "";
    data.data.dateOfCreation = data.data.dateOfCreation
      ? new Date(data.data.dateOfCreation)
      : "";
    return data.data as FullOpportunityType;
  } catch (e) {
    console.error("Could not full opportunity\n", e);
    return null;
  }
}

export async function usersQueryFn(type: string): UsersQueryFnType {
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users?type=${type}`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get interests");
    return [];
  }
}

export async function userInterestsQueryFn(
  email: string
): UserInterestsQueryFnType {
  if (!email) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${email}/interests`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get interests");
    return [];
  }
}

export async function specUsersQueryFn(email: string): SpecUserQueryFnType {
  if (!email) return null;
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${email}`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get users");
    return null;
  }
}

export async function specVehiclesQueryFn(title: string): SpecVehiclesQueryFn {
  if (!title) return null;
  try {
    const data = await axios.get(
      `${BASE_URL}/api/opportunities/${title}/vehicle`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get opportunity vehicles");
    return null;
  }
}

export async function userVehiclesQueryFn(
  user: string
): UserVehiclesQueryFnType {
  if (!user) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${user}/vehicles`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get opportunity vehicles");
    return [];
  }
}

export async function specificFundQueryFn(title: string): MainFundType {
  if (!title) return null;
  try {
    const data = await axios.get(
      `${BASE_URL}/api/funds/${title}`,
      getHeaders()
    );
    return data.data;
  } catch (e) {
    console.error("Could not get main fund");
    return null;
  }
}

export async function faqsQueryFn(): FaqsQueryFnType {
  try {
    const data = await axios.get(`${BASE_URL}/api/faqs`, getHeaders());
    return data.data;
  } catch (e) {
    console.error("Could not get main fund");
    return [];
  }
}

export async function userPaymentsQueryFn(email: string): UserPaymentsQueryFn {
  if (!email) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${email}/userPayments`,
      getHeaders()
    );
    return data.data as ExtractPromiseType<UserPaymentsQueryFn>;
  } catch (e) {
    console.error("Could not get comments");
    return [];
  }
}

export async function userTermSheetsQuery(email: string) {
  if (!email) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${email}/termSheets`,
      getHeaders()
    );
    return data.data as ExtractPromiseType<UserTermSheetsQueryFnType>;
  } catch (e) {
    console.error("Could not get TermSheets");
    return [];
  }
}

export async function userSignaturesQuery(email: string) {
  if (!email) return [];
  try {
    const data = await axios.get(
      `${BASE_URL}/api/users/${email}/signatures`,
      getHeaders()
    );
    return data.data as ExtractPromiseType<UserSignaturesQueryFnType>;
  } catch (e) {
    console.error("Could not get Signatures");
    return [];
  }
}
