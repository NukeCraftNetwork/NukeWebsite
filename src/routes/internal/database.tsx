import { A, useSearchParams } from "@solidjs/router";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { log } from "console";
import { createEffect, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ClosingX from "~/components/ClosingX";
import { PopIn } from "~/components/ui/animations";
import { TextInput } from "~/components/ui/form";
import { convertTime } from "~/libs/functions";
import { GeneralElement, getGeneralElements } from "~/libs/queryFunctions";
import { STRAPI_BASE_URL } from "~/libs/variables";

function FileSystemIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="#000000"
    >
      <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z" />
    </svg>
  );
}
function ParentIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      enable-background="new 0 0 32 32"
      id="Stock_cut"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <polyline
          fill="none"
          points="20,27 1,27 1,7    19,7 21,5 31,5 31,16  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <polygon
          fill="none"
          points="1,7 1,3 19,3    21,5 19,7  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
        <line
          fill="#CCCCCC"
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
          x1="25"
          x2="25"
          y1="30"
          y2="15"
        />
        <polyline
          fill="none"
          points="31,21 25,15    19,21  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </g>
    </svg>
  );
}
function ChildrenIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      enable-background="new 0 0 32 32"
      id="Stock_cut"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <desc />

      <g>
        <polyline
          fill="none"
          points="9,27 1,27 1,7    19,7 21,5 31,5 31,27 23,27  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />

        <polygon
          fill="none"
          points="1,7 1,3 19,3    21,5 19,7  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />

        <line
          fill="none"
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
          x1="16"
          x2="16"
          y1="14"
          y2="29"
        />
        <polyline
          fill="none"
          points="10,23 16,29    22,23  "
          stroke="#000000"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          stroke-width="2"
        />
      </g>
    </svg>
  );
}
function InventoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-full"
      viewBox="0 -0.5 24 24"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 23V10C4 9.4477 4.44772 8.99999 5 8.99999H19C19.5523 8.99999 20 9.4477 20 10V23H4zM18 11H6V23H18V11zM1 23C0.447715 23 0 22.5523 0 22V6.6439C0 5.85962 0.458406 5.14771 1.17239 4.82317L11.1724 0.27772C11.6982 0.03869 12.3018 0.03869 12.8276 0.27772L22.8276 4.82317C23.5416 5.14771 24 5.85962 24 6.6439V22C24 22.5523 23.5523 23 23 23H1zM6 13H18V15H6V13zM6 21H18V23H6V21zM6 17H18V19H6V17z"
        fill="#000000"
      />
    </svg>
  );
}

type NodeData = {
  craftable: number;
  raw: number;
  minimal: number;
  prodCost: number;
  clientCost: number;
};
const baseNodeData = {
  craftable: 0,
  raw: 0,
  minimal: 0,
  prodCost: 0,
  clientCost: 0,
};
function WarehouseInfo(props: {
  name: string;
  unicode: string;
  img: string;
  stock: number;
  discount: string;
}) {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = createStore<NodeData>(baseNodeData);

  type Node = {
    val: number;
    children?: Node[];
  } | null;
  function getStats(current: Node): number {
    let val = current?.val || 0;
    current?.children?.forEach((el) => (val += getStats(el)));
    return val;
  }
  createEffect(() => {
    const node5: Node = { val: 6 };
    const node4: Node = { val: 5 };
    const node3: Node = { val: 4, children: [node4, node5] };
    const node2: Node = { val: 3 };
    const node1: Node = { val: 2, children: [node3] };
    const node0: Node = { val: 1, children: [node1, node2] };
    getStats(node0);
  });
  return (
    <Show when={searchParams.info === props.name}>
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray border-2 border-solid border-darkGray z-10 p-10 flex flex-col gap-2">
        <div class="absolute top-2 right-2">
          <ClosingX callback={() => setSearchParams({ info: null })} />
        </div>
        <div class="flex gap-5 items-center">
          <div class="relative size-44">
            <img
              class="size-full object-contain"
              src={props.img}
              alt={props.name}
            />
          </div>
          <h4>{props.name}</h4>
          <h4>{props.unicode}</h4>
        </div>
        <div>
          <p>In Stock: {props.stock}</p>
          <p>Craftable: {data.craftable}</p>
          <p>Raw Lead Time: {data.raw}</p>
          <p>Minimal Lead Time: {data.minimal}</p>
          <p>Raw Cost: {data.prodCost}</p>
          <p>Price To Client: {data.clientCost}</p>
          <p>Current Discount: {props.discount}</p>
        </div>
      </div>
    </Show>
  );
}

export default function Database() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = createStore({ id: "", name: "" });
  const data = createQuery(() => ({
    queryKey: ["generalElements"],
    queryFn: getGeneralElements,
  }));
  function getStats(
    element: GeneralElement,
    amount: number,
    deltaAmount: number
  ) {
    if (deltaAmount < 0) deltaAmount = 0;
    /*
    const data = {
      craftable: 0,
      rawLeadTime: 0,
      minimalLeadTime: 0,
      rawCost: 0,
    };*/
    // TODO: Table for basic elements
    const data = {
      craftable: "",
      raw: 0,
      minimal: 0,
      prodCost: 0,
    };
    console.log(element.name, amount, deltaAmount);
    element.type.otherComponents?.forEach((child) => {
      const { craftable, raw, minimal } = getStats(
        child.element,
        amount * child.quantity,
        deltaAmount * (child.quantity - child.element.stock)
      );

      data.craftable = `${data.craftable}${craftable}`;
      let convTime = 0;
      if (child.element.type.time) {
        convTime += convertTime(
          child.element.type.time?.amount,
          child.element.type.time?.timeUnitMeasure
        );
      }
      data.raw += convTime * child.quantity + raw;
      let remaining = child.quantity - child.element.stock;
      if (remaining < 0) remaining = 0;
      data.minimal += convTime * remaining + minimal;
      console.log(child.element);
    });
    if (
      element.type.__component === "bought-part" ||
      element.type.__component === "made-part"
    ) {
      data.craftable = `${element.name}=${amount};`;
    }
    return data;
  }
  createEffect(() => {
    const element = data.data?.filter(
      (el) => el.name === decodeURI(searchParams.info || "")
    )![0];
    if (!element) return;
    const initialTime = convertTime(
      element.type.time!.amount,
      element.type.time!.timeUnitMeasure
    );
    const calcData = getStats(element, 1, element.stock ? 0 : 1);
    calcData.raw += initialTime;
    calcData.minimal += initialTime;
    console.log(`FINALONE: `, calcData);
  });
  return (
    <div>
      <div class="p-5">
        <h1 class="text-center uppercase">Database</h1>
        <div class="flex gap-5 p-5">
          <TextInput
            setValue={(id) => setSearch({ id, name: "n0p3" })}
            placeholder="Search By ID"
          />
          <TextInput
            setValue={(name) => setSearch({ name, id: "n0p3" })}
            placeholder="Search By Name"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2 px-10">
        <For
          each={data.data?.filter(
            (el) =>
              el.name.toLowerCase().includes(search.name.toLowerCase()) ||
              el.unicode.toLowerCase().includes(search.id.toLowerCase())
          )}
        >
          {(el, i) => (
            <>
              <WarehouseInfo
                name={el.name}
                unicode={el.unicode}
                img={`${STRAPI_BASE_URL}${el.img.data?.attributes.url}` || ""}
                stock={el.stock}
                discount={el.discount}
              />
              <PopIn
                class="flex items-center justify-between gap-5 bg-gray"
                index={i()}
              >
                <div class="flex items-center gap-5 ">
                  <div class="relative h-16 w-24 ">
                    <img
                      class="size-full object-cover"
                      src={`${STRAPI_BASE_URL}${el.img.data?.attributes.url}`}
                      alt="Element Main"
                    />
                  </div>
                  <small>{el.unicode}</small>
                  <p>{el.name}</p>
                </div>
                <div class="flex h-12  gap-5">
                  <A
                    class="shrink-0"
                    href={`${STRAPI_BASE_URL}${el.files.data?.attributes.url}`}
                    download
                  >
                    <FileSystemIcon />
                  </A>
                  <ParentIcon />
                  <ChildrenIcon />
                  <button
                    class="size-full"
                    onClick={() => setSearchParams({ info: el.name })}
                  >
                    <InventoryIcon />
                  </button>
                </div>
              </PopIn>
            </>
          )}
        </For>
      </div>
    </div>
  );
}
