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
      <div class="flex flex-col gap-5 justify-center items-center">
        <div class="w-64 h-64 rounded-full bg-black border-4 border-solid border-yellow-500"></div>
        <div class="flex flex-col gap-2">
          <h3>Username</h3>
          <For each={["Ceo", "Engineer"]}>
            {(el) => <h4 class="uppercase">{el}</h4>}
          </For>
        </div>
      </div>
      <div class="flex flex-wrap gap-5 justify-center items-center">
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
