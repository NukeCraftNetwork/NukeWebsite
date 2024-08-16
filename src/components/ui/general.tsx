import { JSX, Match, ParentProps, Switch } from "solid-js";

export function Main(
  props: ParentProps & {
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
    style?: string | JSX.CSSProperties;
  }
) {
  return (
    <main
      class={`min-h-screen min-w-screen ${props.class}`}
      style={props.style}
    >
      {props.children}
    </main>
  );
}

type GeneralProps = ParentProps & {
  placeholder?: boolean;
};
export function Tag(props: GeneralProps) {
  return (
    <Switch
      fallback={
        <div class="h-8 w-20 rounded-xl bg-darkGray px-5 py-1 uppercase" />
      }
    >
      <Match when={!props.placeholder}>
        <div class="rounded-full bg-gray px-5 py-1 uppercase">
          {props.children}
        </div>
      </Match>
    </Switch>
  );
}

export function Image(props: GeneralProps) {
  return (
    <Switch
      fallback={<div class="aspect-square size-full rounded-xl bg-darkGray" />}
    >
      <Match when={!props.placeholder}>{props.children}</Match>
    </Switch>
  );
}
