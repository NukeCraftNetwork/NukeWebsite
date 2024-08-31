import {
  For,
  JSX,
  Match,
  Setter,
  Show,
  Switch,
  children,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { ZodType, z } from "zod";
import { emailSchema, mustContain, passwordSchema } from "~/libs/zodSchemas";
import { PopIn } from "./animations";
import { AxiosError } from "axios";
import { useComputedVars } from "~/hooks/computedVarsHook";

type LocalInputType = {
  title?: JSX.Element | string;
  placeholder?: string;
  error?: string;
  setError?: Setter<string>;
  value?: string;
  setValue?: (val: string) => void;
  name?: string;
  required?: boolean;
};
type CheckboxInputType = LocalInputType & {
  options: OptionType[];
  defaultActive?: number;
};
type SubmitType = {
  text: string;
  loading?: boolean;
  fn?: () => void;
  error?: string;
};

const commonSvgStyle = "grow-1 shrink-0";
const commongSvgProps = {
  class: commonSvgStyle,
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
};
const commonMainStyle = "flex flex-col gap-1";
const commonInputStyle =
  "flex justify-between items-center gap-5 transition-all duration-[0.25s] border-2 border-solid rounded-xl";
const inputStyle = "w-full h-full p-2 rounded-xl";

function EmailInput(props: LocalInputType) {
  const [localValue, setLocalValue] = createSignal("");
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  const valid = createMemo(() => {
    const validation = props.value
      ? emailSchema.safeParse(props.value)
      : emailSchema.safeParse(localValue());
    if (localValue() || props.value) {
      setLocalError(validation.error?.errors[0].message || props.error || "");
      props.setError?.(
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
          "border-gray text-gray": error() !== "",
          "border-main text-main": valid(),
        }}
      >
        <input
          name={props.name || "email"}
          class={`${inputStyle}`}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value.toLowerCase())
              : setLocalValue(e.target.value.toLowerCase());
          }}
          type="email"
          data-type="email"
          placeholder={props.placeholder}
          required={props.required}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
        <div class="pr-2">
          <svg
            {...commongSvgProps}
            classList={{
              "text-red": error() !== "",
              "text-black": error() === "",
            }}
          >
            <use href="/icons/email.svg#email" />
          </svg>
        </div>
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}
function PasswordInput(props: LocalInputType) {
  const [localValue, setLocalValue] = createSignal("");
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  const valid = createMemo(() => {
    const validation = props.value
      ? passwordSchema.safeParse(props.value)
      : passwordSchema.safeParse(localValue());
    if (localValue() || props.value) {
      setLocalError(validation.error?.errors[0].message || props.error || "");
      props.setError?.(
        validation.error?.errors[0].message || props.error || ""
      );
    }
    return validation.success;
  });
  const [view, setView] = createSignal(false);
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": !!error(),
          "border-main text-main": valid(),
        }}
      >
        <input
          name={props.name || "password"}
          class={`${inputStyle}`}
          value={props.value || localValue()}
          onInput={(e) => {
            props.setValue?.(e.target.value) || setLocalValue(e.target.value);
          }}
          type={view() ? "text" : "password"}
          data-type="password"
          placeholder={props.placeholder}
          minLength={8}
          required={props.required}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
        <button onClick={() => setView(!view())} tabIndex={-1} type="button">
          <div class="pr-2">
            <svg
              {...commongSvgProps}
              classList={{
                "text-red": !error(),
                "text-black": !!error(),
              }}
            >
              <use href="/icons/password.svg#password" />
            </svg>
          </div>
        </button>
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}
export function TextInput(props: LocalInputType) {
  const [localValue, setLocalValue] = createSignal("");
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": !!error(),
          "border-main text-main": !error(),
        }}
      >
        <input
          name={props.name || "text"}
          class={`${inputStyle}`}
          value={props.value || localValue()}
          onInput={(e) => {
            props.setValue?.(e.target.value) || setLocalValue(e.target.value);
          }}
          type="text"
          data-type="text"
          placeholder={props.placeholder}
          required={props.required}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function NumberInput(props: LocalInputType & { minTicket?: number }) {
  const [localValue, setLocalValue] = createSignal("");
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": !!error(),
          "border-main text-main": !error(),
        }}
      >
        <input
          name={props.name || "number"}
          class={`${inputStyle}`}
          value={props.value || localValue()}
          onInput={(e) => {
            props.setValue?.(e.target.value) || setLocalValue(e.target.value);
          }}
          type="number"
          data-type="number"
          placeholder={props.placeholder}
          required={props.required}
          min={props.minTicket}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function PhoneInput(props: LocalInputType) {
  const { COUNTRIES_DATA_PREFIXES } = useComputedVars();
  const [prefix, setPrefix] = createSignal("");
  const [localValue, setLocalValue] = createSignal("");
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  const phone = createMemo(() => `${prefix()}${localValue()}`);
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={`${commonInputStyle} relative`}
        classList={{
          "border-red text-red": !!error(),
          "border-main text-main": !error(),
        }}
      >
        <input
          type="hidden"
          data-type="phone"
          name={props.name}
          value={phone()}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
        <MultipleChoicesInput
          name={"phonePrefix"}
          options={COUNTRIES_DATA_PREFIXES.map((el) => ({
            text: el.text()!.toString(),
            value: el.value,
          }))}
          placeholder={"+00"}
          setValue={(val) => setPrefix(`${val} `)}
          class="border-none"
        />
        <input
          class={`${inputStyle} grow`}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue?.(e.target.value);
            setLocalValue(e.target.value);
          }}
          type="tel"
          placeholder={props.placeholder}
          required
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function CheckboxInput(props: CheckboxInputType) {
  const [state, setState] = createSignal<string | number>();
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div class={"flex justify-evenly gap-2"}>
        <input
          type="hidden"
          data-type="checkbox"
          data-options={JSON.stringify(props.options)}
          name={props.name || "radio"}
          value={state()}
          required={props.required}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
        <For each={props.options}>
          {(opt) => (
            <div class="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  opt.value === state() ? setState("") : setState(opt.value)
                }
                class="relative size-5 shrink-0 grow rounded-md border-2 border-solid transition-all"
                classList={{
                  "border-main bg-gray": opt.value === state(),
                  "border-darkGray bg-white": opt.value !== state(),
                }}
              >
                <Show when={opt.value === state()}>
                  <PopIn>
                    <svg
                      class="grow"
                      width="100%"
                      height="100%"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 5L8 15l-5-4"
                      />
                    </svg>
                  </PopIn>
                </Show>
              </button>
              <label for={opt.value.toString()}>
                <p>{opt.text}</p>
              </label>
            </div>
          )}
        </For>
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function MultipleChoicesInput(
  props: CheckboxInputType & {
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
  }
) {
  const [state, setState] = createSignal("");
  const [open, setOpen] = createSignal(false);
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  let lastInteract = Date.now();
  function handleOpen(bool: boolean) {
    if (Date.now() - lastInteract < 333) return;
    lastInteract = Date.now();
    setOpen(bool);
  }
  return (
    <div class="relative">
      <p>{props.title}</p>
      <div
        class={`${commonInputStyle} w-full ${props.class || ""}`}
        classList={{
          "border-main text-main": !error(),
          "border-red text-red": !!error(),
        }}
      >
        <input
          value={state()}
          onFocus={() => handleOpen(true)}
          onInput={(e) => setState(e.target.value)}
          name={props.name || "text"}
          class={` ${inputStyle} cursor-pointer`}
          type="text"
          data-type="multiple"
          data-options={JSON.stringify(props.options)}
          placeholder={props.placeholder}
          required={props.required}
          onClick={() => {
            handleOpen(!open());
          }}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
      </div>
      <Show when={open()}>
        <PopIn class="absolute left-0 top-full z-10 w-full">
          <ul class="flex max-h-36 w-full flex-col overflow-auto rounded-xl bg-main p-2 text-white">
            <For
              each={props.options.filter((el) =>
                el.value
                  .toString()
                  .toLowerCase()
                  .includes(state().toLowerCase())
              )}
            >
              {(el) => (
                <button
                  onClick={() => {
                    setState(el.value.toString());
                    setOpen(false);
                    props.setValue?.(el.value.toString());
                  }}
                >
                  {el.text}
                </button>
              )}
            </For>
          </ul>
        </PopIn>
      </Show>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function BooleanInput(
  props: CheckboxInputType & {
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
  }
) {
  const [state, setState] = createSignal<string | number>();
  const [localError, setLocalError] = createSignal("");
  const error = () => props.error || localError();
  createEffect(() => state() && props.setValue?.(state()!.toString()));
  return (
    <div class="relative flex flex-col gap-1">
      <p>{props.title}</p>
      <div
        class={`grid w-full grid-cols-2 ${props.class || ""}`}
        classList={{
          "border-main text-main": !error(),
          "border-red text-red": !!error(),
        }}
      >
        <button
          type="button"
          class="border-2 border-solid transition-all"
          classList={{
            "border-main": state() === props.options[0].value,
            "border-gray": state() !== props.options[0].value,
          }}
          onClick={() => setState(props.options[0].value)}
        >
          <p>{props.options[0].text}</p>
        </button>
        <button
          type="button"
          class="border-2 border-solid transition-all"
          classList={{
            "border-main": state() === props.options[1].value,
            "border-gray": state() !== props.options[1].value,
          }}
          onClick={() => setState(props.options[1].value)}
        >
          <p>{props.options[1].text}</p>
        </button>
        <input
          type="hidden"
          data-type={"boolean"}
          data-options={JSON.stringify(props.options)}
          name={props.name}
          value={state()}
          on:validationError={(err: CustomEvent) =>
            setLocalError(err.detail.message)
          }
        />
      </div>
      <Show when={error()}>
        <small class="animate-fadeIn text-red">{error()}</small>
      </Show>
    </div>
  );
}

function SubmitInput(props: SubmitType) {
  const [text, setText] = createSignal("");
  let interval: NodeJS.Timeout;
  createEffect(() => {
    if (props.loading) {
      return (interval = setInterval(() => {
        setText((text) => (text === "..." ? "" : text + "."));
      }, 250));
    }
    clearInterval(interval);
  });
  return (
    <button
      class={"w-full rounded-xl bg-main p-3 text-white disabled:bg-darkGray"}
      onClick={() => props.fn?.()}
      disabled={props.error ? true : false}
    >
      <p>{props.loading ? text() : props.text}</p>
    </button>
  );
}

export function Input(props: InputType) {
  return (
    <Switch
      fallback={
        <TextInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
        />
      }
    >
      <Match when={props.type === "submit"}>
        <SubmitInput
          text={(props.value as string | undefined) || "Submit!"}
          fn={() => props.fn?.("")}
        />
      </Match>
      <Match when={props.type === "boolean"}>
        <BooleanInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
          options={props.options!}
        />
      </Match>
      <Match when={props.type === "multiple"}>
        <MultipleChoicesInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
          options={props.options!}
        />
      </Match>
      <Match when={props.type === "checkbox"}>
        <CheckboxInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
          options={props.options!}
        />
      </Match>
      <Match when={props.type === "phone"}>
        <PhoneInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
        />
      </Match>
      <Match when={props.type === "number"}>
        <NumberInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
        />
      </Match>
      <Match when={props.type === "password"}>
        <PasswordInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
        />
      </Match>
      <Match when={props.type === "email"}>
        <EmailInput
          title={props.title}
          placeholder={props.placeholder}
          value={props.value as string | undefined}
          name={props.name}
          required={props.required}
          setValue={(data) => props.fn?.(data)}
        />
      </Match>
    </Switch>
  );
}

export default function Form(props: {
  children: JSX.Element;
  autocomplete?: "off" | "on";
  class?: JSX.HTMLAttributes<HTMLElement>["class"];
  successCallback?: (
    inputValues: Record<string, FormDataEntryValue> | FormData
  ) => void;
  asyncSuccessCallback?: (
    inputValues: Record<string, FormDataEntryValue> | FormData
  ) => Promise<void>;
  errorCallback?: () => void;
  submitText?: string;
  errorMessages?: Record<string, Record<string, string>>;
  returnFormData?: boolean;
}) {
  const defaultErrorMessages: Record<string, Record<string, string>> = {
    "401": { "0": "Authorization Failed" },
    "403": { "0": "You don't have access to this action" },
    "404": { "0": "Not Found" },
    "409": { "0": "Duplicated Data" },
    "500": { "0": "Something went wrong" },
  };

  const [formError, setFormError] = createSignal("");
  const [errors, setErrors] = createSignal([""]);

  const validInputs = [] as HTMLInputElement[];
  const resolved = children(() => props.children).toArray() as HTMLDivElement[];
  resolved.forEach((input) => {
    // The following function doesn't exist on the server
    input.querySelectorAll?.("input").forEach((element) => {
      const el = element as HTMLInputElement;
      if (el.dataset.type) {
        validInputs.push(el);
      }
    });
  });

  createEffect(() => {
    setErrors(Array.from({ length: validInputs.length }, () => ""));
  });

  // TODO: Error messages should be arrays since there are multiple validation steps
  function getSchema() {
    const obj: Record<string, ZodType> = {};
    validInputs.forEach((el, i) => {
      if (el.dataset.type === "phone" && el.required) {
        obj[el.name] = z.string().regex(/^\+\d{1,3} \d{7,14}$/, {
          message: `${i}-${
            el.dataset.validationErrorMsg ||
            `Please insert a valid ${el.title?.toLowerCase() || "value"}`
          }`,
        });
      } else if (el.type === "file" && el.required) {
        const MAX_SIZE = 1024 * 1024 * 100;
        obj[el.name] = z
          .custom<File>()
          .refine((file) => file && file.name && file.size, {
            message: `${i}-${
              el.dataset.validationErrorMsg || "This file is required"
            }`,
          })
          .refine((file) => !file.name.includes("/"), {
            message: `${i}-${
              el.dataset.validationErrorMsg || "File name must not include '/'"
            }`,
          })
          .refine((file) => file && file.size <= MAX_SIZE, {
            message: `${i}-${
              el.dataset.validationErrorMsg ||
              "The maximum size of the file is 100MB"
            }`,
          });
      } else if (el.type === "multiple" && el.required) {
        const arr = JSON.parse(el.dataset.options!) as OptionType[];
        if (arr) {
          const values = arr.map((el) => el.value.toString().toLowerCase());
          obj[el.name] = z
            .string()
            .refine((val) => values.includes(val.toLowerCase()), {
              message: `${i}-${
                el.dataset.validationErrorMsg ||
                `Please insert a valid ${el.title?.toLowerCase() || "value"}`
              }`,
            });
        }
      } else if (el.type === "text" && el.required) {
        obj[el.name] = z.string().min(1, {
          message: `${i}-${
            el.dataset.validationErrorMsg ||
            `Please insert a valid ${el.title?.toLowerCase() || "value"}`
          }`,
        });
      } else if (el.type === "checkbox" && el.required) {
        const arr = JSON.parse(el.dataset.options!) as OptionType[];
        if (arr) {
          const values = arr.map((el) => el.value.toString().toLowerCase());
          obj[el.name] = z
            .string()
            .refine((val) => values.includes(val.toLowerCase()), {
              message: `${i}-${
                el.dataset.validationErrorMsg ||
                `Please insert a valid ${el.title?.toLowerCase() || "value"}`
              }`,
            });
        }
      } else if (el.type === "email" && el.required) {
        obj[el.name] = z.string().email({
          message: `${i}-${
            el.dataset.validationErrorMsg || `Invalid email provided`
          }`,
        });
      } else if (el.type === "password" && el.required) {
        obj[el.name] = z
          .string()
          .min(8, {
            message: `${i}-${
              el.dataset.validationErrorMsg ||
              `The password should be at least 8 chars long`
            }`,
          })
          .refine((val) => mustContain.some((c) => val.includes(c)), {
            message: `${i}-${
              el.dataset.validationErrorMsg ||
              `The password must contain one of the following characters: ${mustContain.join(
                " "
              )}`
            }`,
          })
          .refine((val) => /[A-Z]/.test(val), {
            message: `${i}-${
              el.dataset.validationErrorMsg ||
              `The passwrord should contain at least a upper case letter`
            }`,
          });
      }
    });
    return obj;
  }
  async function handleSubmit(e: Event) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const obj: Record<string, FormDataEntryValue> = {};
    validInputs.forEach((el) => {
      obj[el.name] = data.get(el.name)!;
    });
    const result = z.object(getSchema()).safeParse(obj);
    if (!result.success) {
      const errorList = JSON.parse(result.error.message);
      errorList.map((el: { message: string }) => {
        const prevErrs = errors();
        const splittedMsg = el.message.split("-");
        prevErrs[parseInt(splittedMsg[0])] = splittedMsg[1];
        setErrors([...prevErrs]);
      });
      return props.errorCallback?.();
    }
    Object.keys(obj).map((key) => {
      if (!obj[key] || obj[key] === "undefined") {
        delete obj[key];
      }
    });
    let finalObj: Record<string, FormDataEntryValue> | FormData = obj;
    if (props.returnFormData) {
      const tempForm = new FormData();
      Object.keys(obj).forEach((key) => tempForm.append(key, obj[key]));
      finalObj = tempForm;
    }
    // Handling callbacks
    if (props.successCallback) {
      props.successCallback(finalObj);
    }
    if (props.asyncSuccessCallback) {
      try {
        await props.asyncSuccessCallback(finalObj);
      } catch (e) {
        if (e instanceof AxiosError) {
          const status = e.response!.status.toString();
          const code = e.response?.data.code?.toString() || "0";
          const error =
            props.errorMessages && props.errorMessages[status][code];
          return setFormError(
            error || defaultErrorMessages[status][code] || "Error"
          );
        }
        console.error(e);
      }
    }
  }
  createEffect(() => {
    errors().forEach((message, i) => {
      if (message) {
        const evt = new CustomEvent("validationError", {
          detail: { message },
        });
        validInputs[i].dispatchEvent(evt);
      }
    });
  });
  return (
    <form
      autocomplete={props.autocomplete || "off"}
      class={props.class}
      onSubmit={handleSubmit}
    >
      {resolved}
      <Show when={formError()}>
        <small class="animate-fadeIn text-red">{formError()}</small>
      </Show>
    </form>
  );
}
