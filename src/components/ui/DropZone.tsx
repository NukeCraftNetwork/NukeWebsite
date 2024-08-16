import { randomUUID } from "crypto";
import { JSX, ParentProps, createEffect, createSignal } from "solid-js";

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
  const id = randomUUID();
  const [files, setFiles] = createSignal<FileList | undefined>(undefined);
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log(2);
  }
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log(1);
  }
  async function handleDrop(
    e: DragEvent & {
      target: Element;
    }
  ) {
    e.preventDefault();
    e.stopPropagation();
    setFiles(e.dataTransfer?.files);
  }
  createEffect(() => {
    if (!files()?.length) return;
    (document.getElementById(id) as HTMLInputElement).files = files()!;
  });
  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <label
        for={id}
        class={
          props.class ||
          "relative size-full hover:border-2 border-solid border-black"
        }
        onDrop={handleDrop}
      >
        {props.children}
      </label>
      <input type="file" multiple id={id} name={props.name || "files"} />
    </div>
  );
}
