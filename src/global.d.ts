/// <reference types="@solidjs/start/env" />

// Utility types
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;
type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;
type OptionType = {
  value: string | number;
  text: string;
};
type BaseFormInputType = {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  validationErrorMsg?: string;
  fn?: (data: string) => void;
};
type FormInputType =
  | (BaseFormInputType & {
      type: "text" | "phone" | "file" | "email" | "password";
      options?: never;
    })
  | (BaseFormInputType & {
      type: "checkbox" | "multiple" | "boolean";
      options: OptionType[];
    });
