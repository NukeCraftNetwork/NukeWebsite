import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

export default function UILink(props: ParentProps & { href: string }) {
  return (
    <A
      class="border-2 border-solid border-yellow-300 bg-blue-800 shadow-xl text-white py-1 px-4 rounded-md"
      href={props.href}
    >
      {props.children}
    </A>
  );
}
