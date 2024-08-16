import { useContext } from "solid-js";
import { ClientSessionContext } from "~/contexts/session";

export const useClientSession = () => useContext(ClientSessionContext)!;
