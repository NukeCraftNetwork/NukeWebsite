import { A } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import Svg from "./images/svg";
import { NAVBAR_TRANSITION } from "~/libs/tailwindStyle";
import { useClientSession } from "~/hooks/sessionHooks";

export default function Navbar() {
  const { userData, editing, setEditing, saveFn } = useClientSession();
  const [open, setOpen] = createSignal(true);
  return (
    <nav
      id="navbar"
      class={`fixed left-0 top-0 z-10 flex h-auto w-screen justify-center bg-main p-2 text-white ${NAVBAR_TRANSITION} md:h-screen md:w-[var(--nav-w)] md:flex-col md:justify-between md:p-6`}
    >
      <div class="flex h-full flex-col justify-between">
        <button
          class="absolute right-0 top-3 translate-x-1/2 rounded-full bg-white p-2"
          onClick={() => {
            document
              .querySelector("body")
              ?.style.setProperty("--nav-w", !open() ? "15rem" : "5rem");
            setOpen(!open());
          }}
        >
          <Svg
            class={`size-4 ${
              !open() ? "rotate-180" : "rotate-0"
            } transition-transform duration-200 ease-in`}
            attr={{
              viewBox: "0 0 6 10",
            }}
            href="/icons/navbar/arrow.svg#arrow"
          />
        </button>
        <div class="flex flex-col items-center gap-2 md:gap-10">
          <A class="flex w-max shrink-0 grow justify-center md:w-full" href="/">
            <Svg
              attr={{
                style:
                  "shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd",
                viewBox: `0 0 ${open() ? "362.469 98.383" : "72.9 98.383"} `,
              }}
              href="/icons/mainLogo.svg#logo"
              class={`h-12`}
            />
          </A>
          <div class="flex flex-wrap justify-center gap-5 md:grid md:flex-col">
            <A
              class="flex gap-2 transition-all duration-200 ease-in-out"
              activeClass="text-activeLink"
              end={true}
              href="/"
            >
              <Svg
                class="size-6 shrink-0  text-inherit"
                attr={{
                  style:
                    "shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd",
                  viewBox: "0 0 14 14",
                }}
                href="/icons/navbar/opportunities.svg#opportunities"
              />
              <p
                class="overflow-hidden transition-all duration-200 ease-in"
                classList={{ "size-0": !open() }}
              >
                Opportunities
              </p>
            </A>
            <Show when={true}>
              <A
                class="flex gap-2 transition-all duration-200 ease-in-out"
                activeClass="text-activeLink"
                end={true}
                href="/fund"
              >
                <Svg
                  class="size-6 shrink-0 text-inherit"
                  attr={{ viewBox: "0 0 16 16" }}
                  href="/icons/navbar/fund.svg#fund"
                />
                <p
                  class="overflow-hidden whitespace-nowrap transition-all duration-200 ease-in"
                  classList={{ "size-0": !open() }}
                >
                  Valeureux Fund
                </p>
              </A>
              <A
                class="flex gap-2  transition-all duration-200 ease-in-out"
                activeClass="text-activeLink"
                end={true}
                href="/profile"
              >
                <Svg
                  class="size-6 shrink-0  text-inherit"
                  attr={{ viewBox: "0 0 20 20" }}
                  href="/icons/navbar/settings.svg#settings"
                />
                <p
                  class="overflow-hidden transition-all duration-200 ease-in"
                  classList={{ "size-0": !open() }}
                >
                  Profile
                </p>
              </A>
              <A
                class="flex gap-2  transition-all duration-200 ease-in-out"
                activeClass="text-activeLink"
                end={true}
                href="/faqs"
              >
                <Svg
                  class="size-6 shrink-0 text-inherit"
                  attr={{ viewBox: "0 0 18 18" }}
                  href="/icons/navbar/analytics.svg#analytics"
                />
                <p
                  class="overflow-hidden transition-all duration-200 ease-in"
                  classList={{ "size-0": !open() }}
                >
                  FAQ & Support
                </p>
              </A>
              <Show when={userData.role >= 3}>
                <A
                  class=" flex gap-2 transition-all duration-200 ease-in-out"
                  activeClass="text-activeLink"
                  end={true}
                  href="/analytics"
                >
                  <Svg
                    class="size-6 shrink-0  text-inherit"
                    attr={{ viewBox: "0 0 16 16" }}
                    href="/icons/navbar/faq.svg#faq"
                  />
                  <p
                    class="overflow-hidden transition-all duration-200 ease-in"
                    classList={{ "size-0": !open() }}
                  >
                    Analytics
                  </p>
                </A>
              </Show>
            </Show>
          </div>
        </div>
        <Show when={userData.role >= 3}>
          <div
            class="my-2 flex items-center justify-center gap-2"
            classList={{ "flex-col": !open() }}
          >
            <button
              onClick={() => {
                setEditing(!editing());
              }}
            >
              <small class="rounded-md bg-blue-400 px-2 py-1">EDIT</small>
            </button>
            <button
              onClick={() => {
                try {
                  saveFn()();
                } catch (e) {
                  console.error("Could not complete saveFn: ", e);
                }
              }}
            >
              <small class="rounded-md bg-green-400 px-2 py-1">SAVE</small>
            </button>
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              <small class="rounded-md bg-red px-2 py-1">CANCEL</small>
            </button>
          </div>
        </Show>
      </div>
      <div class="hidden flex-col items-center gap-2 border-t-2 border-solid border-white pt-10 md:flex">
        <A
          class="aspect-square w-16 rounded-full border-2 border-solid border-white p-3"
          activeClass="text-activeLink"
          href="https://www.linkedin.com/company/valeureux-fonds/"
          target="_blank"
        >
          <Svg
            attr={{
              viewBox: "0 0 72 72",
            }}
            href="/icons/linkedin.svg#linkedin"
          />
        </A>
      </div>
    </nav>
  );
}
