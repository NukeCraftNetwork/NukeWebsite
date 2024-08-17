import { useSearchParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import DropZone from "~/components/DropZone";
import { FormGeneralInput, TextInput } from "~/components/ui/form";
const Form = clientOnly(() => import("~/components/ui/form"));
import { prismaGetTocos } from "~/libs/prismaFunctions";

async function getData() {
  "use server";
  return await prismaGetTocos();
}

function Part() {
  return (
    <div>
      <FormGeneralInput
        type="boolean"
        name="partType"
        options={[
          { text: "Fabricated", value: "fabricated" },
          { text: "Component", value: "component" },
        ]}
      />
    </div>
  );
}
function CreateTocoPopup() {
  const [image, setImage] = createSignal<string | undefined>();
  const [files, setFiles] = createSignal<string[]>([]);
  const [type, setType] = createSignal("");
  return (
    <div class="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-5">
      <Form>
        <div class="flex flex-col gap-5">
          <div class="flex w-full justify-evenly gap-5">
            <div class="flex flex-col justify-evenly gap-2">
              <DropZone
                type="image"
                previewCallback={(data) => setImage(data[0])}
              >
                <div class="relative size-56">
                  <Show
                    when={image()}
                    fallback={
                      <div class="flex size-full items-center justify-center rounded-md border-2 border-dashed border-black text-center transition-all hover:border-solid hover:bg-gray">
                        <p>
                          Drop Image <br /> Or <br /> Click Here
                        </p>
                      </div>
                    }
                  >
                    <div
                      class={`relative size-full border-2 border-solid border-black bg-contain bg-center bg-no-repeat`}
                      style={{ "background-image": `url('${image()}')` }}
                    >
                      <p class="absolute bottom-0 left-0 w-full bg-black p-1 text-center text-white">
                        <a href={image()} target="_blank">
                          View Image Here
                        </a>
                      </p>
                    </div>
                  </Show>
                </div>
              </DropZone>
              <FormGeneralInput
                title="Type"
                type="multiple"
                name="type"
                options={[
                  {
                    text: "Part",
                    value: "part",
                  },
                  {
                    text: "Component",
                    value: "component",
                  },
                  {
                    text: "Product",
                    value: "product",
                  },
                ]}
                fn={(data) => console.log(data)}
              />
            </div>
            <div class="flex flex-col justify-evenly gap-2">
              <FormGeneralInput type="text" title="Name" name="name" />
              <FormGeneralInput
                type="text"
                title="Unicode"
                placeholder="U-000000"
                name="unicode"
              />
            </div>
            <div class="flex flex-col justify-evenly gap-2">
              <DropZone
                type="any"
                previewCallback={(data) => setFiles(data)}
                multiple
              >
                <div class="relative size-56">
                  <Show
                    when={files().length}
                    fallback={
                      <div class="flex size-full items-center justify-center rounded-md border-2 border-dashed border-black text-center transition-all hover:border-solid hover:bg-gray">
                        <p>
                          Drop Files <br /> Or <br /> Click Here
                        </p>
                      </div>
                    }
                  >
                    <div class="flex size-full flex-col items-center justify-center rounded-md border-2 border-solid border-black bg-gray text-center  transition-all">
                      <For each={files()}>
                        {(el) => (
                          <p>
                            {(() => {
                              const name = el.split(".");
                              if (name[0].length < 10) return el;
                              return name
                                .map((el, i) =>
                                  i === 0
                                    ? `${el.slice(0, 12)}...${el.slice(
                                        el.length - 3,
                                        el.length
                                      )}`
                                    : el
                                )
                                .join(".");
                            })()}
                          </p>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </DropZone>
              <p>Cost: 10000 EURI</p>
            </div>
          </div>
          <Switch>
            <Match when={type() === "part"}>
              <Part />
            </Match>
          </Switch>
          <div class="flex items-center justify-center">
            <FormGeneralInput type="text" title="Secrecy" name="secrecy" />
          </div>
        </div>
      </Form>
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
