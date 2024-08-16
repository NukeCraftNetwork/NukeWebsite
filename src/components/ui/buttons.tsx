import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

export default function UILink(props: ParentProps & { href: string }) {
  return (
    <A
      class="rounded-md border-2 border-solid border-yellow-300 bg-blue-800 px-4 py-1 text-white shadow-xl"
      href={props.href}
    >
      {props.children}
    </A>
  );
}
