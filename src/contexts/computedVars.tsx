import { JSX, ParentProps, createContext } from "solid-js";
import { COUNTRIES_DATA } from "~/libs/variables";

type ComputedVarsContextType = {
  COUNTRIES_DATA_NATIONALITIES: {
    text: () => JSX.Element;
    value: string;
  }[];
  COUNTRIES_DATA_NATIONS: {
    text: () => JSX.Element;
    value: string;
  }[];
  COUNTRIES_DATA_PREFIXES: {
    text: () => JSX.Element;
    value: string;
  }[];
};

export const ComputedVarsContext = createContext<ComputedVarsContextType>();
export const ComputedVarsProvider = (props: ParentProps) => {
  const COUNTRIES_DATA_NATIONALITIES = COUNTRIES_DATA.map((el) => ({
    text: () => (
      <div class="flex gap-2">
        <p>{el.emoji}</p>
        <p class="whitespace-nowrap">{el.nationality}</p>
      </div>
    ),
    value: el.nationality,
  }));
  const COUNTRIES_DATA_NATIONS = COUNTRIES_DATA.map((el) => ({
    text: () => (
      <div class="flex gap-2">
        <p>{el.emoji}</p>
        <p class="whitespace-nowrap">{el.name}</p>
      </div>
    ),
    value: el.name,
  }));
  const COUNTRIES_DATA_PREFIXES = COUNTRIES_DATA.map((el) => ({
    text: () => (
      <div class="flex gap-2">
        <p>{el.emoji}</p>
        <p class="whitespace-nowrap">+{el.phonePrefix}</p>
      </div>
    ),
    value: `+${el.phonePrefix}`,
  })).sort((a, b) => parseInt(a.value) - parseInt(b.value));

  return (
    <ComputedVarsContext.Provider
      value={{
        COUNTRIES_DATA_NATIONALITIES,
        COUNTRIES_DATA_NATIONS,
        COUNTRIES_DATA_PREFIXES,
      }}
    >
      {props.children}
    </ComputedVarsContext.Provider>
  );
};
