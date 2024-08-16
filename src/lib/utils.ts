import { useSession } from "vinxi/http";

export const getSession = () =>
  useSession({
    password:
      process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace",
  });
