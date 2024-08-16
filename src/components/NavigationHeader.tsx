import { For, JSX } from "solid-js";
import Svg from "./images/svg";

export default function NavigationHeader(props: {
  links: JSX.Element[];
  currentPage: string;
}) {
  return (
    <div class="flex gap-2">
      <Svg
        attr={{ viewBox: "0 0 16 18" }}
        href="/icons/home.svg#home"
        class={`h-5 text-darkGray`}
      />
      <p>&gt;</p>
      <For each={props.links}>
        {(link) => (
          <>
            {link}
            <p>&gt;</p>
          </>
        )}
      </For>
      <p class="break-words">{props.currentPage}</p>
    </div>
  );
}
