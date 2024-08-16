import {
  For,
  JSX,
  Match,
  Setter,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { ZodType, z } from "zod";
import { emailSchema, mustContain, passwordSchema } from "../../lib/zodSchemas";
import { AxiosError } from "axios";
import useComputedVars from "../../hooks/computerVars";

type InputType = {
  title?: JSX.Element | string;
  placeholder?: string;
  error?: string;
  setError?: Setter<string>;
  value?: string;
  setValue?: (val: string) => void;
  name?: string;
  required?: boolean;
};
type Option = {
  value: string | number;
  text: () => string | JSX.Element;
};
type CheckboxInputType = InputType & {
  options: Option[];
  defaultActive?: number;
};
type FileInputType = InputType & {
  multiple?: boolean;
  withDropZone?: boolean;
  setValue?: (val: File) => void;
};
type SubmitType = {
  type?: string;
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

export function EmailInput(props: InputType) {
  const [localValue, setLocalValue] = createSignal("");
  const [error, setError] = createSignal("");
  const valid = createMemo(() => {
    const validation = props.value
      ? emailSchema.safeParse(props.value)
      : emailSchema.safeParse(localValue());
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
          "border-gray text-gray": error() !== "",
          "border-blue-800 text-blue-800": valid(),
        }}
      >
        <input
          name={props.name || "email"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value.toLowerCase())
              : setLocalValue(e.target.value.toLowerCase());
          }}
          type="email"
          placeholder={props.placeholder}
          required={props.required}
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
      <Show when={props.error || error()}>
        <small class="animate-fadeIn text-red">{props.error || error()}</small>
      </Show>
    </div>
  );
}
export function PasswordInput(props: InputType) {
  const [localValue, setLocalValue] = createSignal("");
  const [error, setError] = createSignal("");
  const valid = createMemo(() => {
    const validation = props.value
      ? passwordSchema.safeParse(props.value)
      : passwordSchema.safeParse(localValue());
    if (localValue() || props.value) {
      setError(validation.error?.errors[0].message || props.error || "");
      props.setError &&
        props.setError(
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
          "border-red text-red": error() !== "",
          "border-blue-800 text-blue-800": valid(),
        }}
      >
        <input
          name={props.name || "password"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value)
              : setLocalValue(e.target.value);
          }}
          type={view() ? "text" : "password"}
          placeholder={props.placeholder}
          minLength={8}
          required={props.required}
        />
        <button onClick={() => setView(!view())} tabIndex={-1} type="button">
          <div class="pr-2">
            <svg
              {...commongSvgProps}
              classList={{
                "text-red": error() !== "",
                "text-black": error() === "",
              }}
            >
              <use href="/icons/password.svg#password" />
            </svg>
          </div>
        </button>
      </div>
      <Show when={props.error || error()}>
        <small class="animate-fadeIn text-red">{props.error || error()}</small>
      </Show>
    </div>
  );
}
export function TextInput(props: InputType) {
  const [localValue, setLocalValue] = createSignal("");
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": Boolean(props.error),
          "border-blue-800 text-blue-800": !props.error,
        }}
      >
        <input
          name={props.name || "text"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value)
              : setLocalValue(e.target.value);
          }}
          type="text"
          placeholder={props.placeholder}
          required={props.required}
        />
      </div>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function NumberInput(props: InputType & { minTicket?: number }) {
  const [localValue, setLocalValue] = createSignal("");
  console.log(props);
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={commonInputStyle}
        classList={{
          "border-red text-red": Boolean(props.error),
          "border-blue-800 text-blue-800": !props.error,
        }}
      >
        <input
          name={props.name || "number"}
          class={inputStyle}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue
              ? props.setValue(e.target.value)
              : setLocalValue(e.target.value);
          }}
          type="number"
          placeholder={props.placeholder}
          required={props.required}
          min={props.minTicket}
        />
      </div>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function PhoneInput(props: InputType) {
  const { COUNTRIES_DATA_PREFIXES } = useComputedVars();

  const [prefix, setPrefix] = createSignal("");
  const [localValue, setLocalValue] = createSignal("");
  const phone = createMemo(() => `${prefix()}${localValue()}`);
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div
        class={`${commonInputStyle} relative`}
        classList={{
          "border-red text-red": Boolean(props.error),
          "border-blue-800 text-blue-800": !props.error,
        }}
      >
        <input type="hidden" name={props.name} value={phone()} />
        <MultipleChoicesInput
          name={"phonePrefix"}
          options={COUNTRIES_DATA_PREFIXES}
          placeholder={"+00"}
          setValue={(val) => setPrefix(`${val} `)}
          class="border-none"
        />
        <input
          class={`${inputStyle} grow`}
          value={props.value ? props.value : localValue()}
          onInput={(e) => {
            props.setValue && props.setValue(e.target.value);
            setLocalValue(e.target.value);
          }}
          type="tel"
          placeholder={props.placeholder}
          required
        />
      </div>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function CheckboxInput(props: CheckboxInputType) {
  const [state, setState] = createSignal<string | number>();
  return (
    <div class={commonMainStyle}>
      <p>{props.title}</p>
      <div class={"flex justify-evenly gap-2"}>
        <input
          type="hidden"
          name={props.name || "radio"}
          value={state()}
          required={props.required}
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
                  "border-blue-800 bg-gray": opt.value === state(),
                  "border-darkGray bg-white": opt.value !== state(),
                }}
              >
                <Show when={opt.value === state()}>
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
                </Show>
              </button>
              <label for={opt.value.toString()}>
                <p>{opt.text()}</p>
              </label>
            </div>
          )}
        </For>
      </div>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function FileInput(props: FileInputType) {
  const [state, setState] = createSignal<File>();
  function handleChange(files: FileList) {
    props.setValue && props.setValue(files[0]);
    setState(files[0]);
  }
  return (
    <>
      <label
        for={`fileUpload_${props.name}`}
        class="flex w-full items-center  gap-2 overflow-hidden rounded-md border-2 border-solid border-blue-800 bg-gray hover:cursor-pointer "
      >
        <span class="h-full shrink-0 bg-blue-800 px-4 py-1 text-white">
          Upload
        </span>
        <span class="w-full whitespace-nowrap px-2 text-center">
          {state()?.name || props.title}
        </span>
        <input
          class="hidden"
          id={`fileUpload_${props.name}`}
          type="file"
          name={props.name}
          multiple={props.multiple}
          onChange={(e) => handleChange(e.target.files!)}
        />
      </label>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </>
  );
}

export function MultipleChoicesInput(
  props: CheckboxInputType & {
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
  }
) {
  const [state, setState] = createSignal("");
  const [open, setOpen] = createSignal(false);
  return (
    <div class="relative">
      <p>{props.title}</p>
      <div
        class={`${commonInputStyle} w-full ${props.class || ""}`}
        classList={{
          "border-blue-800 text-blue-800": !props.error,
          "border-red text-red": Boolean(props.error),
        }}
      >
        <input
          value={state()}
          onFocus={() => setOpen(true)}
          onInput={(e) => setState(e.target.value)}
          name={props.name || "text"}
          class={`${inputStyle} cursor-pointer`}
          type="text"
          placeholder={props.placeholder}
          required={props.required}
          onClick={() => {
            setOpen(!open());
          }}
        />
      </div>
      <Show when={open()}>
        <ul class="flex max-h-36 w-full flex-col overflow-auto rounded-xl bg-blue-800 p-2 text-white">
          <For
            each={props.options.filter((el) =>
              el.value.toString().toLowerCase().includes(state().toLowerCase())
            )}
          >
            {(el) => (
              <button
                onClick={() => {
                  setState(el.value.toString());
                  setOpen(false);
                  props.setValue && props.setValue(el.value.toString());
                }}
              >
                {el.text()}
              </button>
            )}
          </For>
        </ul>
      </Show>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function BooleanInput(
  props: CheckboxInputType & {
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
  }
) {
  const [state, setState] = createSignal<string | number>();
  return (
    <div class="relative flex flex-col gap-1">
      <p>{props.title}</p>
      <div
        class={`grid grid-cols-2 w-full ${props.class || ""}`}
        classList={{
          "border-blue-800 text-blue-800": !props.error,
          "border-red text-red": Boolean(props.error),
        }}
      >
        <button
          type="button"
          class="border-2 border-solid transition-all"
          classList={{
            "border-blue-800": state() === props.options[0].value,
            "border-gray": state() !== props.options[0].value,
          }}
          onClick={() => setState(props.options[0].value)}
        >
          <p>{props.options[0].text()}</p>
        </button>
        <button
          type="button"
          class="border-2 border-solid transition-all"
          classList={{
            "border-blue-800": state() === props.options[1].value,
            "border-gray": state() !== props.options[1].value,
          }}
          onClick={() => setState(props.options[1].value)}
        >
          <p>{props.options[1].text()}</p>
        </button>
        <input type="hidden" name={props.name} value={state()}></input>
      </div>
      <Show when={props.error}>
        <small class="animate-fadeIn text-red">{props.error}</small>
      </Show>
    </div>
  );
}

export function SubmitInput(props: SubmitType) {
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
  function handleSubmit() {
    props.fn && props.fn();
  }
  const CLASS =
    "w-full rounded-xl bg-blue-800 p-3 text-white disabled:bg-darkGray";
  return (
    <Show
      when={props.type === "button"}
      fallback={
        <input
          type={"submit"}
          class={CLASS}
          value={props.loading ? text() : props.text}
          onSubmit={handleSubmit}
          disabled={props.error ? true : false}
        />
      }
    >
      <button
        type={"button"}
        class={CLASS}
        onClick={handleSubmit}
        disabled={props.error ? true : false}
      >
        <p>{props.loading ? text() : props.text}</p>
      </button>
    </Show>
  );
}

export function Form(props: {
  inputs: {
    name: string;
    title?: string;
    placeholder?: string;
    required?: boolean;
    options?: Option[];
    type:
      | "text"
      | "phone"
      | "checkbox"
      | "file"
      | "multiple"
      | "email"
      | "password"
      | "boolean";
    validationErrorMsg?: string;
  }[];
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
  createEffect(() => {
    setErrors(Array.from({ length: props.inputs.length }, () => ""));
  });

  // TODO: Error messages should be arrays since there are multiple validation steps
  function getSchema() {
    const obj: Record<string, ZodType> = {};
    props.inputs.forEach((el, i) => {
      if (el.type === "phone" && el.required) {
        obj[el.name] = z.string().regex(/^\+\d{1,3} \d{7,14}$/, {
          message: `${i}-${
            el.validationErrorMsg ||
            `Please insert a valid ${el.title?.toLowerCase() || "value"}`
          }`,
        });
      } else if (el.type === "file" && el.required) {
        const MAX_SIZE = 1024 * 1024 * 100;
        obj[el.name] = z
          .custom<File>()
          .refine((file) => file && file.name && file.size, {
            message: `${i}-${el.validationErrorMsg || "This file is required"}`,
          })
          .refine((file) => !file.name.includes("/"), {
            message: `${i}-${
              el.validationErrorMsg || "File name must not include '/'"
            }`,
          })
          .refine((file) => file && file.size <= MAX_SIZE, {
            message: `${i}-${
              el.validationErrorMsg || "The maximum size of the file is 100MB"
            }`,
          });
      } else if (el.type === "multiple" && el.required) {
        const arr = el.options;
        if (arr) {
          const values = arr.map((el) => el.value.toString().toLowerCase());
          obj[el.name] = z
            .string()
            .refine((val) => values.includes(val.toLowerCase()), {
              message: `${i}-${
                el.validationErrorMsg ||
                `Please insert a valid ${el.title?.toLowerCase() || "value"}`
              }`,
            });
        }
      } else if (el.type === "text" && el.required) {
        obj[el.name] = z.string().min(1, {
          message: `${i}-${
            el.validationErrorMsg ||
            `Please insert a valid ${el.title?.toLowerCase() || "value"}`
          }`,
        });
      } else if (el.type === "checkbox" && el.required) {
        const arr = el.options;
        if (arr) {
          const values = arr.map((el) => el.value.toString().toLowerCase());
          obj[el.name] = z
            .string()
            .refine((val) => values.includes(val.toLowerCase()), {
              message: `${i}-${
                el.validationErrorMsg ||
                `Please insert a valid ${el.title?.toLowerCase() || "value"}`
              }`,
            });
        }
      } else if (el.type === "email" && el.required) {
        obj[el.name] = z.string().email({
          message: `${i}-${el.validationErrorMsg || `Invalid email provided`}`,
        });
      } else if (el.type === "password" && el.required) {
        obj[el.name] = z
          .string()
          .min(8, {
            message: `${i}-${
              el.validationErrorMsg ||
              `The password should be at least 8 chars long`
            }`,
          })
          .refine((val) => mustContain.some((c) => val.includes(c)), {
            message: `${i}-${
              el.validationErrorMsg ||
              `The password must contain one of the following characters: ${mustContain.join(
                " "
              )}`
            }`,
          })
          .refine((val) => /[A-Z]/.test(val), {
            message: `${i}-${
              el.validationErrorMsg ||
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
    props.inputs.forEach((el) => {
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
      return props.errorCallback && props.errorCallback();
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
  return (
    <form
      autocomplete={props.autocomplete}
      class={props.class}
      onSubmit={handleSubmit}
    >
      <For each={props.inputs}>
        {(el, i) => (
          <Switch>
            <Match when={el.type === "text"}>
              <TextInput
                title={el.title}
                placeholder={el.placeholder}
                name={el.name}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
                required={el.required}
              />
            </Match>
            <Match when={el.type === "phone"}>
              <PhoneInput
                title={el.title}
                placeholder={el.placeholder}
                name={el.name}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
                required={el.required}
              />
            </Match>
            <Match when={el.type === "checkbox"}>
              <CheckboxInput
                title={el.title}
                placeholder={el.placeholder}
                name={el.name}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
                options={(el.options as Option[]) || []}
                defaultActive={-1}
                required={el.required}
              />
            </Match>
            <Match when={el.type === "file"}>
              <FileInput
                withDropZone
                multiple={false}
                name={el.name}
                title={el.title}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
              />
            </Match>
            <Match when={el.type === "multiple"}>
              <MultipleChoicesInput
                title={el.title}
                name={el.name}
                options={el.options || []}
                placeholder={el.placeholder}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
              />
            </Match>
            <Match when={el.type === "email"}>
              <EmailInput
                title={el.title}
                name={el.name}
                placeholder={el.placeholder}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
              />
            </Match>
            <Match when={el.type === "password"}>
              <PasswordInput
                title={el.title}
                name={el.name}
                placeholder={el.placeholder}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
              />
            </Match>
            <Match when={el.type === "boolean"}>
              <BooleanInput
                title={el.title}
                name={el.name}
                options={el.options || []}
                placeholder={el.placeholder}
                error={errors()[i()]}
                setValue={() => {
                  const oldErrs = errors();
                  oldErrs[i()] = "";
                  setErrors([...oldErrs]);
                }}
              />
            </Match>
          </Switch>
        )}
      </For>
      <SubmitInput text={props.submitText || "Submit"} />{" "}
      <Show when={formError()}>
        <small class="animate-fadeIn text-red">{formError()}</small>
      </Show>
    </form>
  );
}
