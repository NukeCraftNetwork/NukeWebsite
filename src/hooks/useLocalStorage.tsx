import { createSignal, onCleanup, onMount } from "solid-js";

export default function useLocalStorage() {
  console.log("Rending");
  const [value, setValue] = createSignal(new Map<string, unknown>());
  function handleLocalStorage() {
    console.log("update storage");
    const map = new Map<string, unknown>();
    console.log(window.localStorage, Object.keys(window.localStorage));
    Object.keys(window.localStorage).forEach((key) => {
      console.log(
        "reding localstorage: ",
        key,
        JSON.parse(localStorage.getItem(key)!)
      );
      map.set(key, JSON.parse(localStorage.getItem(key)!));
    });
    setValue(map);
  }
  onMount(() => {
    window.addEventListener("storage", handleLocalStorage);
  });
  onCleanup(() => window.removeEventListener("storage", handleLocalStorage));

  return value;
}
