import { useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import DropZone from "~/components/DropZone";
import CloseButton from "~/components/ui/CloseButton";
import Form, { Input, TextInput } from "~/components/ui/form";
import { prismaCreateToco, prismaGetTocos } from "~/libs/prismaFunctions";

async function getData() {
  "use server";
  return await prismaGetTocos();
}
async function postData(formData: FormData) {
  "use server";
  return await prismaCreateToco(formData);
}

function Part() {
  const [type, setType] = createSignal("");
  const [printer, setPrinter] = createSignal("");
  return (
    <div class="flex flex-col gap-2">
      <Input
        type="boolean"
        name="partType"
        options={[
          { text: "Fabricated", value: "Fabricated" },
          { text: "Component", value: "Component" },
        ]}
        fn={(data) => setType(data)}
      />
      <Switch>
        <Match when={type().toLocaleLowerCase() === "fabricated"}>
          <Input
            type="multiple"
            title="Printer Type"
            name="printer"
            options={[{ text: "Plastic", value: "plastic" }]}
            fn={(data) => setPrinter(data)}
          />
          <Show when={printer()}>
            <Input type="text" title="Material" name="material" />
            <Input type="text" title="Cost Variable" name="costVariable" />
            <Input type="text" title="Time Variable" name="timeVariable" />
          </Show>
        </Match>
        <Match when={type().toLocaleLowerCase() === "component"}>
          <Input type="text" title="Link" name="link" />
          <Input type="number" title="Cost" name="cost" />
        </Match>
      </Switch>
    </div>
  );
}
function Component() {
  return (
    <div>
      <Input
        type="multiple"
        title="Children"
        name="children"
        options={[{ text: "U-000000", value: "U-000000" }]}
      />
      <Input
        type="multiple"
        title="Assembler Group"
        name="assemblerGroup"
        options={[{ text: "ASM1", value: "ASM1" }]}
      />
      <Input type="number" title="Assembly Time" name="assemblyTime" />
      <Input type="text" title="Additives" name="additives" />
    </div>
  );
}
function Product() {
  return (
    <div>
      <Input
        type="multiple"
        title="Component / Part"
        name="componentOrPart"
        options={[{ text: "U-000000", value: "U-000000" }]}
      />
      <Input type="number" title="Packaging Time" name="packagingTime" />
      <Input type="text" title="Packaging" name="packaging" />
      <Input type="text" title="Markup" name="markup" />
    </div>
  );
}

function CreateTocoPopup(props: {
  data: ExtractPromiseType<ReturnType<typeof prismaGetTocos>>;
}) {
  const [, setSearchParams] = useSearchParams();
  const [image, setImage] = createSignal<string | undefined>();
  const [files, setFiles] = createSignal<string[]>([]);
  const [type, setType] = createSignal("");
  async function handleSubmit(formData: FormData) {
    console.log(formData);
    await postData(formData);
  }
  return (
    <div class="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-xl p-5 shadow-xl">
      <CloseButton tr callback={() => setSearchParams({ popup: null })} />
      <Form asyncSuccessCallback={handleSubmit} returnFormData>
        <div class="flex flex-col gap-5">
          <div class="flex w-full justify-evenly gap-5">
            <div class="flex flex-col justify-evenly gap-2">
              <DropZone
                type="image"
                name="image"
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
              <Input
                title="Type"
                type="multiple"
                name="type"
                options={[
                  {
                    text: "Part",
                    value: "Part",
                  },
                  {
                    text: "Component",
                    value: "Component",
                  },
                  {
                    text: "Product",
                    value: "Product",
                  },
                ]}
                fn={(value) => setType(value)}
              />
            </div>
            <div class="flex w-56 flex-col justify-evenly gap-2">
              <Input type="text" title="Name" name="name" />
              <Input
                type="text"
                title="Unicode"
                placeholder="U-000000"
                value={`${type().charAt(0) || "X"}-${
                  props.data?.filter?.((el) => el.type === type()).length || "0"
                }`}
                name="unicode"
              />
            </div>
            <div class="flex flex-col justify-evenly gap-2">
              <DropZone
                type="any"
                name="files"
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
            <Match when={type().toLocaleLowerCase() === "part"}>
              <Part />
            </Match>
            <Match when={type().toLocaleLowerCase() === "component"}>
              <Component />
            </Match>
            <Match when={type().toLocaleLowerCase() === "product"}>
              <Product />
            </Match>
          </Switch>
          <div class="flex items-center justify-center">
            <Input type="text" title="Secrecy" name="secrecy" />
          </div>
          <Input
            fn={() => console.log("should submit")}
            type="submit"
            name=""
            value={"Submit"}
          />
        </div>
      </Form>
    </div>
  );
}
export default function Database() {
  const [search, setSearch] = createSignal("");
  const [searchParams, setSearchParams] = useSearchParams();
  const data = createQuery(() => ({ queryKey: ["tochi"], queryFn: getData }));
  return (
    <div>
      <div class="flex gap-2 p-2">
        <TextInput setValue={setSearch} />
        <button
          class="rounded-full bg-green-600 px-4 text-white"
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
        <CreateTocoPopup data={data} />
      </Show>
    </div>
  );
}
