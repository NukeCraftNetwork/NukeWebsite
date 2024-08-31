/// <reference types="@solidjs/start/env" />

// Utility types
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;
type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;
type OptionType = {
  value: string | number;
  text: string;
};
type BaseInputType = {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  validationErrorMsg?: string;
  value?: unknown;
  fn?: (data: string) => void;
};
type InputType =
  | (BaseInputType & {
      type:
        | "text"
        | "number"
        | "phone"
        | "file"
        | "email"
        | "password"
        | "submit";
      options?: never;
    })
  | (BaseInputType & {
      type: "checkbox" | "multiple" | "boolean";
      options: OptionType[];
    });
