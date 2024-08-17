import { Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { useDecodedParams } from "~/hooks/decodedURI";

export default function Metadata() {
  const params = useDecodedParams();
  return (
    <>
      <Title>
        NukEngineering{" "}
        <Show when={params().opportunity}>| {params().opportunity}</Show>
      </Title>
      <Meta property="og:site_name" content="NukEngineering" />
      <Meta property="og:description" content="Nuke Webapp" />
    </>
  );
}
