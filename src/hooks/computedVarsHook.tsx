import { useContext } from "solid-js";
import { ComputedVarsContext } from "~/contexts/computedVars";

export function useComputedVars() {
  return useContext(ComputedVarsContext)!;
}
