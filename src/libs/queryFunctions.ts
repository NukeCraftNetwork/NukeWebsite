import axios from "axios";
import { STRAPI_BASE_URL } from "./variables";

type File = { data?: { attributes: { url: string } } };
type Time = {
  amount: number;
  timeUnitMeasure: "seconds" | "minutes" | "hours";
};
type RawRequirements = {
  element: { data: { id: number } };
  quantity: number;
}[];
type Requirements = {
  element: GeneralElement;
  quantity: number;
}[];
type ComponentType = {
  __component: "component";
  time: Time;
  otherComponents: Requirements;
};
type ProductType = {
  __component: "product";
  markup: number;
  isMarkupAbsolute: boolean;
  roundUp: boolean;
  discount: number;
  isDiscountAbsolute: boolean;
  time: Time;
  otherComponents: Requirements;
};
type BoughtPartType = {
  __component: "bought-part";
  link: string;
  cost: number;
};
type MadePartType = {
  __component: "made-part";
  volume: number;
  time: Time;
};
type GeneralType = {
  __component: "product" | "component" | "bought-part" | "made-part";
  time?: Time;
  otherComponents?: Requirements;
  markup?: number;
  isMarkupAbsolute?: boolean;
  roundUp?: boolean;
  discount?: number;
  isDiscountAbsolute?: boolean;
  link?: string;
  cost?: number;
  volume?: number;
};
export type GeneralElement<
  T extends
    | "product"
    | "component"
    | "bought-part"
    | "made-part"
    | undefined = undefined
> = {
  unicode: string;
  name: string;
  stock: number;
  img: File;
  files: File;
  type: T extends "product"
    ? ProductType
    : T extends "component"
    ? ComponentType
    : T extends "bought-part"
    ? BoughtPartType
    : T extends "made-part"
    ? MadePartType
    : GeneralType;
  discount: string;
  id: number;
};
type RawGeneralElement = Exclude<GeneralElement, Requirements> &
  RawRequirements;
function fixRequirements(
  element: RawGeneralElement | GeneralElement,
  map: Map<number, RawGeneralElement | GeneralElement>
) {
  console.log("Mau have other componenets...");
  element.type.otherComponents?.forEach((req, i) => {
    console.log("Checking requirement ", req);
    if (req.element.data) {
      console.log("Needs to be replaced");
      element.type.otherComponents![i] = {
        quantity: req.quantity,
        element: map.get(req.element.data.id),
      };
      console.log(
        "With ",
        {
          quantity: req.quantity,
          element: map.get(req.element.data.id),
        },
        req.element.data.id
      );
      fixRequirements(element.type.otherComponents![i].element, map);
    }
  });
}
export async function getGeneralElements(): Promise<GeneralElement[]> {
  try {
    const data = await axios.get(
      `${STRAPI_BASE_URL}/api/general-elements?populate[img][fields]=url&populate[files][fields]=url&populate[type][populate][otherComponents][populate][element][fields]=id&populate[type][populate][time][populate]=*`
    );
    const map = new Map<number, RawGeneralElement>();
    data.data.data.forEach(
      (el: {
        id: number;
        attributes: {
          type?: { __component: string }[];
          requirements: RawRequirements;
        };
      }) => {
        const type = el.attributes.type?.[0];
        delete el.attributes.type;
        const pObj = { ...el.attributes, type, id: el.id };
        if (pObj.type) {
          pObj.type["__component"] =
            pObj.type["__component"].split(".").at(-1) ||
            pObj.type["__component"];
        }
        map.set(pObj.id, pObj as unknown as RawGeneralElement);
      }
    );
    const parsedData: RawGeneralElement[] = Array.from(map)
      .flat()
      .filter((_el, i) => i % 2 !== 0);
    parsedData.forEach((element) => {
      fixRequirements(element!, map);
    });
    return parsedData;
  } catch (e) {
    console.error("Error Fetching General Elements: ", e);
    return [];
  }
}
