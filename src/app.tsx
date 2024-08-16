import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ParentProps, Suspense } from "solid-js";
import "./app.css";
import { ComputedVarsProvider } from "./contexts/computedVars";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

function Contexts(props: ParentProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 1,
        gcTime: 1000 * 60 * 5,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ComputedVarsProvider>{props.children}</ComputedVarsProvider>
    </QueryClientProvider>
  );
}
export default function App() {
  return (
    <Router
      root={(props) => (
        <Contexts>
          <main class="min-h-screen flex flex-col gap-5 bg-blue-400">
            <nav class="absolute top-0 left-0 w-full flex h-14 justify-between">
              <A href="/">
                <p>Logo deplorevole</p>
              </A>
              <A
                href="/me"
                class="border-1 border-solid border-white bg-blue-800 rounded-full py-1 pl-1 pr-4 flex gap-2 items-center"
              >
                <div class="w-10 h-10 bg-black rounded-full"></div>
                <p class="text-white">Biasimabile</p>
              </A>
            </nav>
            <div class="pt-14 min-h-[100dvh]">
              <Suspense>{props.children}</Suspense>
            </div>
          </main>
        </Contexts>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
