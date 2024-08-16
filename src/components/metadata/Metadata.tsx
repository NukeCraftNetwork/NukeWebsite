import { Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { useDecodedParams } from "~/hooks/decodedURI";

export default function Metadata() {
  const params = useDecodedParams();
  return (
    <>
      <Title>
        Valeureux{" "}
        <Show when={params().opportunity}>| {params().opportunity}</Show>
      </Title>
      <Meta property="og:site_name" content="Valeureux" />
      <Meta
        property="og:description"
        content="Valeureux Fund Managing Webapp"
      />
    </>
  );
}
