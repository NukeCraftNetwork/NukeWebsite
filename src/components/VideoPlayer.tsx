import { createEffect, createSignal } from "solid-js";

export default function VideoPlayer(props: { url: string; trackUrl?: string }) {
  let ref: HTMLVideoElement | undefined;
  const [updatedUrl, setUpdatedUrl] = createSignal("");
  createEffect(() => {
    setUpdatedUrl(props.url);
    ref!.load();
  });
  return (
    <video ref={ref} class="max-h-[70dvh] w-full" controls>
      <source src={updatedUrl()} type="video/mp4" />
      <track
        src={props.trackUrl || undefined}
        kind="captions"
        srclang="en"
        label="English"
      />
    </video>
  );
}
