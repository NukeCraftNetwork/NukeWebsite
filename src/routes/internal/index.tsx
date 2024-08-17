import { For } from "solid-js";
import UILink from "~/components/ui/buttons";

const BUTTONS = [
  { title: "My Work", href: "./myWork" },
  { title: "Manufacture", href: "./manufacture" },
  { title: "Database", href: "./database" },
  { title: "Accident R.", href: "myWork" },
  { title: "Inventory", href: "myWork" },
  { title: "Machines", href: "myWork" },
  { title: "Variables", href: "myWork" },
  { title: "History", href: "myWork" },
  { title: "Graphs", href: "myWork" },
  { title: "Groups", href: "myWork" },
];
export default function InternalHomepage() {
  return (
    <div class="grid grid-cols-2">
      <div class="flex flex-col items-center justify-center gap-5">
        <div class="size-64 rounded-full border-4 border-solid border-yellow-500 bg-black" />
        <div class="flex flex-col gap-2">
          <h3>Username</h3>
          <For each={["Ceo", "Engineer"]}>
            {(el) => <h4 class="uppercase">{el}</h4>}
          </For>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-5">
        <For each={BUTTONS}>
          {(el) => (
            <UILink href={el.href}>
              <h4>{el.title}</h4>
            </UILink>
          )}
        </For>
      </div>
    </div>
  );
}
