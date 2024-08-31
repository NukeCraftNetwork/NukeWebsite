import { JSX, ParentProps, createMemo, createSignal, Show } from "solid-js";
import { convertImg } from "~/libs/functions";

export default function DropZone(
  props: ParentProps & {
    previewCallback?: (data: string[]) => void;
    type: "image" | "any";
    class?: JSX.HTMLAttributes<HTMLElement>["class"];
    name?: string;
    multiple?: boolean;
  }
) {
  const acceptTypes = createMemo(() => {
    if (props.type === "image") {
      return {
        preferred: [".avif", "webp"],
        accepted: [".png", ".jpg", ".jpeg"],
        full: [".avif", ".webp", ".png", ".jpg", ".jpeg"],
      };
    }
    return null;
  });
  const [isDragging, setIsDragging] = createSignal(false);
  const [localError, setLocalError] = createSignal("");
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
  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (!files) return;
    try {
      handleOnChange(files);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleOnChange(files: FileList | null) {
    if (!files) return alert("No file was provided to upload");
    const fileList: File[] = [];
    for (const file of Array.from(files)) {
      if (!acceptTypes()) {
        fileList.push(file);
      } else {
        if (
          !acceptTypes()!.full.some(
            (acpt) => acpt === `.${file.type.split("/").at(-1)}`
          )
        ) {
          throw new Error(`File type not allowed ${file.type}`);
        }
        let bestFile: File | null = null;
        // Map over the preferred types and convert images
        const convertedFiles = await Promise.all(
          acceptTypes()!.preferred.map(async (attempt) => {
            const newImg = await convertImg(
              file,
              `${props.type}/${attempt.replaceAll(".", "")}`
            );
            return newImg;
          })
        );
        // Find the smallest file from the converted ones
        for (const newImg of convertedFiles) {
          if (!bestFile || newImg.size < bestFile.size) {
            bestFile = newImg;
          }
        }
        bestFile && fileList.push(bestFile);
      }
    }
    const dataTransfer = new DataTransfer();
    fileList.forEach((file) => dataTransfer.items.add(file));
    const inputElement = document.getElementById(
      `dropZoneInput_${props.name}`
    ) as HTMLInputElement;
    inputElement.files = dataTransfer.files;
    if (!props.previewCallback) return;
    if (props.type === "image") {
      props.previewCallback(fileList.map((el) => URL.createObjectURL(el)));
    } else {
      props.previewCallback(fileList.map((el) => el.name));
    }
  }

  return (
    <label
      for={`dropZoneInput_${props.name}`}
      class={props.class || "relative cursor-pointer"}
      classList={{
        "border-2 border-solid border-black": isDragging(),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {props.children}
      <input
        class="hidden"
        type="file"
        data-type="file"
        id={`dropZoneInput_${props.name}`}
        name={props.name || "url"}
        multiple={props.multiple}
        accept={acceptTypes()?.full.join(", ")}
        onChange={(e) => handleOnChange(e.target.files)}
        on:validationError={(err: CustomEvent) =>
          setLocalError(err.detail.message)
        }
      />
      <Show when={localError()}>
        <small class="animate-fadeIn text-red">{localError()}</small>
      </Show>
    </label>
  );
}
