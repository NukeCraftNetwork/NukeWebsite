import { JSX } from "solid-js";

type SvgProps = JSX.HTMLAttributes<HTMLDivElement> & {
  attr: Record<string, unknown>;
  href: string;
};
export default function Svg(props: SvgProps) {
  return (
    <svg {...props.attr} class={`${props.class || ""} text-inherit`}>
      <use href={props.href} />
    </svg>
  );
}
