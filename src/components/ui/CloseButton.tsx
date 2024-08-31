export default function CloseButton(props: {
  callback: () => void;
  tl?: boolean;
  tr?: boolean;
  bl?: boolean;
  br?: boolean;
}) {
  return (
    <button
      class="absolute"
      classList={{
        "right-2 top-2": props.tr,
        "left-2 top-2": props.tl,
        "right-2 botttom-2": props.br,
        "left-2 bottom-2": props.bl,
      }}
      onClick={() => props.callback()}
    >
      <p>✖</p>
    </button>
  );
}
