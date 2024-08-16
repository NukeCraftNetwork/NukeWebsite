import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import DropZone from "~/components/DropZone";
import { TextInput } from "~/components/ui/form";
import { prismaGetTocos } from "~/lib/prismaFunctions";

async function getData() {
  "use server";
  return await prismaGetTocos();
}
function CreateTocoPopup() {
  return (
    <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <DropZone>
        <div class="size-24 bg-black" />
      </DropZone>
    </div>
  );
}
export default function Database() {
  const [search, setSearch] = createSignal("");
  const data = createQuery(() => ({ queryKey: ["tochi"], queryFn: getData }));
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
      <div class="flex gap-2 p-2">
        <TextInput setValue={setSearch} />
        <button
          class="rounded-full bg-green-600 px-4 pb-1 text-white"
          onClick={() => setSearchParams({ popup: true })}
        >
          <h4 class="">+</h4>
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <For
          each={data.data?.filter(
            (el) => el.name.includes(search()) || el.unicode.includes(search())
          )}
        >
          {(el) => (
            <div class="flex items-center justify-between gap-2">
              <div class="flex gap-2">
                <div class="h-12 w-24 bg-black" />
                <p>{el.unicode}</p>
                <p>{el.name}</p>
              </div>
            </div>
          )}
        </For>
      </div>
      <Show when={searchParams.popup}>
        <CreateTocoPopup />
      </Show>
    </div>
  );
}
