import { useContext } from "solid-js";
import { ComputedVarsContext } from "~/contexts/computedVars";

export default function useComputedVars() {
  return useContext(ComputedVarsContext)!;
}
