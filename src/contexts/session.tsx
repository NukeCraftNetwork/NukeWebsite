import { createQuery } from "@tanstack/solid-query";
import Cookies from "js-cookie";
import {
  Accessor,
  ParentProps,
  Setter,
  createContext,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";
import { specUsersQueryFn, userInterestsQueryFn } from "~/libs/queryFunctions";
import { SpecUserType } from "~/routes/api/users/[email]";

type ClientSessionContextType = {
  userData:
    | SpecUserType
    | {
        username: string;
        email: string;
        role: number;
      };
  setUserData: SetStoreFunction<{
    username: string;
    email: string;
    role: number;
  }>;
  editing: Accessor<boolean>;
  setEditing: Setter<boolean>;
  saveFn: Accessor<() => void>;
  setSaveFn: Setter<() => void>;
  userInterests:
    | Accessor<
        Map<
          string,
          {
            id: number;
            opportunityTitle: string;
            userEmail: string;
            creationDate: Date;
            type: string;
            interestValue: string | null;
            feedback: string | null;
          }
        >
      >
    | undefined;
  sensibleEnabled: Accessor<boolean>;
  setSensibleEnabled: Setter<boolean>;
};

function getSomething() {
  "use server";
  const { username, email, role } = JSON.parse(getCookie("userData") || "{}");
  return { username, email, role };
}

export const ClientSessionContext = createContext<ClientSessionContextType>();
export const ClientSessionProvider = (props: ParentProps) => {
  let username, email, role;

  if (!isServer) {
    const clientData = JSON.parse(Cookies.get("userData") || " {}");
    username = clientData.username;
    email = clientData.email;
    role = clientData.role;
  } else {
    const serverData = getSomething();
    username = serverData.username;
    email = serverData.email;
    role = serverData.role;
  }

  const [userData, setUserData] = createStore({
    username: username || "Guest",
    email: email || "",
    role: parseInt(role || "0"),
  });
  const userDataQuery = createQuery(() => ({
    queryKey: ["users", email],
    queryFn: () => specUsersQueryFn(email),
  }));
  createEffect(() => {
    if (userDataQuery.data) setUserData(userDataQuery.data);
  });

  const [editing, setEditing] = createSignal(false);
  const [saveFn, setSaveFn] = createSignal(() => {});
  const [sensibleEnabled, setSensibleEnabled] = createSignal(false);

  const userInterests = email
    ? createQuery(() => ({
        queryKey: ["users", email, "interests"],
        queryFn: () => userInterestsQueryFn(email),
      }))
    : { data: [] };
  const mappedUserInterests = createMemo(() => {
    const map = new Map<
      string,
      ExtractPromiseType<typeof userInterests.data>
    >();
    userInterests.data?.forEach((el) => {
      map.set(el.opportunityTitle || el.fundTitle, el);
    });
    return map;
  });

  createEffect(() => {
    if (sensibleEnabled())
      setTimeout(() => setSensibleEnabled(false), 60 * 1000);
  });

  return (
    <ClientSessionContext.Provider
      value={{
        userData,
        setUserData,
        editing,
        setEditing,
        saveFn,
        setSaveFn,
        userInterests: mappedUserInterests,
        sensibleEnabled,
        setSensibleEnabled,
      }}
    >
      {props.children}
    </ClientSessionContext.Provider>
  );
};
