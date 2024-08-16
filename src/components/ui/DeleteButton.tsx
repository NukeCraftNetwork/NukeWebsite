import { Show, createSignal } from "solid-js";
import { TextInput } from "./form";
import { PopIn } from "./animations";

export default function DeleteButton(props: {
  deleteCheck: string;
  deleteFn: () => void;
}) {
  const [popup, setPopup] = createSignal(false);
  const [deleteCheck, setDeleteCheck] = createSignal("");
  function handleDelete() {
    if (deleteCheck() === props.deleteCheck) {
      props.deleteFn();
      setPopup(false);
    }
  }
  return (
    <>
      <Show when={popup()}>
        <PopIn class="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-xl border-2 border-solid border-main bg-white p-4">
          <p>
            Type <b>{props.deleteCheck}</b> to delete!
          </p>
          <TextInput setValue={(val) => setDeleteCheck(val)} />
          <button
            type="button"
            class="rounded-xl bg-red px-5 py-2 text-white"
            onClick={handleDelete}
          >
            <p>Delete!</p>
          </button>
        </PopIn>
      </Show>
      <button
        class="rounded-xl bg-red px-5 py-2 text-white"
        onClick={() => setPopup(true)}
        type="button"
      >
        <p>Delete!</p>
      </button>
    </>
  );
}
