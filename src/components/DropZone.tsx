import {
  JSX,
  Match,
  ParentProps,
  Show,
  Switch,
  createSignal,
  untrack,
} from "solid-js";
import { uploadFile } from "~/actions/cloudflare/r2(action)";
import { useClientSession } from "~/hooks/sessionHooks";

export default function DropZone(
  props: ParentProps & {
    callback?: (data: string) => void;
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
    name?: string;
    value?: string;
    fileType?: "public" | "private";
    placeholder?: string;
  }
) {
  const { editing } = useClientSession();
  const [url, setUrl] = createSignal(untrack(() => props.value));
  const [state, setState] = createSignal(0);
  const [isDragging, setIsDragging] = createSignal(false);
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }
  async function handleDrop(
    e: DragEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    }
  ) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setState(1);
    const files = e.dataTransfer?.files;
    if (!files) return;
    try {
      console.log("uploading to ", files[0], props.fileType);
      const data = await uploadFile(files[0], props.fileType);
      const url = data.secure_url || data.url;
      if (!url) throw new Error("URL not provided by server function");
      props.callback && props.callback(url);
      setUrl(url);
      setState(2);
    } catch (e) {
      console.error(e);
      setState(-1);
    }
  }
  return (
    <div
      class={props.class || "relative size-full"}
      classList={{
        "border-2 border-solid border-black": isDragging(),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {props.children}
      <Show when={editing()}>
        <div class="absolute left-0 top-0 flex size-full items-center justify-center bg-[rgba(0,0,0,0.75)]">
          <p class="text-center font-bold text-white">
            <Switch fallback={props.placeholder || "Drop New Image Here"}>
              <Match when={state() === 1}>Uploading...</Match>
              <Match when={state() === 2}>Uploaded!</Match>
              <Match when={state() === -1}>Something Went Wrong</Match>
            </Switch>
          </p>
        </div>
      </Show>
      <input type="hidden" value={url()} name={props.name || "url"} />
    </div>
  );
}
