import { JSX, Setter, Show, createMemo, createSignal } from "solid-js";
import { z } from "zod";
import { customNumberSchema } from "~/libs/zodSchemas";

type InputType = {
  title?: JSX.Element | string;
  placeholder?: string;
  error?: string;
  setError?: Setter<string>;

  name?: string;
  required?: boolean;
};

const commonMainStyle = "flex flex-col gap-1 items-center";
const commonInputStyle =
  "relative flex justify-between items-center gap-5 border-b-2 border-solid pb-1 transition-all duration-[0.25s] w-full";
const inputStyle = "w-full h-full";

export function EditDateTimeInput(
  props: InputType & {
    value?: string | undefined;
    setValue?: (val: string) => void;
  }
) {
  const [localValue, setLocalValue] = createSignal<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = createSignal("");
  const valid = createMemo(() => {
    const validation = props.value
      ? z.string().safeParse(props.value)
      : z.string().safeParse(localValue());
    if (localValue() || props.value) {
      setError(validation.error?.errors[0].message || props.error || "");
      props.setError &&
        props.setError(
          validation.error?.errors[0].message || props.error || ""
        );
    }
    return validation.success;
  });
  return (
    <div class={commonMainStyle}>
      <p class="w-full">{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": error() !== "",
          "border-gray text-gray": error() === "",
          "border-main text-main": valid(),
        }}
      >
        <input
          type="datetime-local"
          name={props.name || "dateTime"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value)
              : setLocalValue(e.target.value);
          }}
          required={props.required}
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

export function EditNumberInput(
  props: InputType & {
    value?: string | number | undefined;
    setValue?: (val: number) => void;
    min?: number;
    max?: number;
  }
) {
  const [localValue, setLocalValue] = createSignal(0);
  const [error /*, setError*/] = createSignal("");
  const [valid] = createSignal(true);
  /*
  ALWAYS VALID
  const valid = createMemo(() => {
    const validation = props.value
      ? customNumberSchema.safeParse(props.value)
      : customNumberSchema.safeParse(localValue());
    if (localValue() || props.value) {
      setError(validation.error?.errors[0].message || props.error || "");
      props.setError &&
        props.setError(
          validation.error?.errors[0].message || props.error || ""
        );
    }
    return validation.success;
  });
  */
  return (
    <div class={commonMainStyle}>
      <p class="w-full">{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": error() !== "",
          "border-gray text-gray": error() === "",
          "border-main text-main": valid(),
        }}
      >
        <input
          type="string"
          name={props.name || "number"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            const validatedNumber = customNumberSchema.safeParse(
              e.target.value
            );
            const data = validatedNumber.data!;
            props.setValue ? props.setValue(data) : setLocalValue(data);
          }}
          placeholder={props.placeholder}
          min={props.min || 0}
          max={props.max || undefined}
          required={props.required}
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

export function EditTextInput(
  props: InputType & {
    value?: string | undefined;
    setValue?: (val: string) => void;
  }
) {
  const [localValue, setLocalValue] = createSignal("");
  const [error, setError] = createSignal("");
  const valid = createMemo(() => {
    const validation = props.value
      ? z.string().safeParse(props.value)
      : z.string().safeParse(localValue());
    if (localValue() || props.value) {
      setError(validation.error?.errors[0].message || props.error || "");
      props.setError &&
        props.setError(
          validation.error?.errors[0].message || props.error || ""
        );
    }
    return validation.success;
  });
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": error() !== "",
          "border-gray text-gray": error() === "",
          "border-main text-main": valid(),
        }}
      >
        <input
          type="datetime-local"
          name={props.name || "dateTime"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value)
              : setLocalValue(e.target.value);
          }}
          required={props.required}
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}
