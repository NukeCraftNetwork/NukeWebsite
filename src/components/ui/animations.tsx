import { JSX, ParentProps } from "solid-js";

type PopInProps = ParentProps & {
  class?: JSX.HTMLAttributes<HTMLElement>["class"];
  index?: number;
};

type LoadingProps = ParentProps & {
  max?: boolean;
  full?: boolean;
};
export function PopIn(props: PopInProps) {
  return (
    <div
      class={`${props.class || ""} animate-popIn opacity-0`}
      style={{
        "animation-delay": props.index ? `${props.index * 50}ms` : "0ms",
      }}
    >
      {props.children}
    </div>
  );
}
export function Loading(props: LoadingProps) {
  return (
    <div
      class="size-fit animate-pulse select-none overflow-hidden rounded-xl bg-darkGray text-transparent"
      classList={{
        "w-full h-full": props.full,
        "w-max h-max": props.max,
      }}
    >
      {props.children}
    </div>
  );
}
