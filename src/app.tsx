import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import { Suspense } from "solid-js";
import { QueryClientProvider } from "@tanstack/solid-query";
import { QueryClient } from "@tanstack/query-core";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { MetaProvider } from "@solidjs/meta";
import Metadata from "./components/metadata/Metadata";
import { ComputedVarsProvider } from "./contexts/computedVars";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      gcTime: 1000 * 60 * 5,
    },
  },
});
export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>
          <MetaProvider>
            <QueryClientProvider client={queryClient}>
              <ComputedVarsProvider>
                <Metadata />
                <SolidQueryDevtools />
                <div class="text-main">{props.children}</div>
              </ComputedVarsProvider>
            </QueryClientProvider>
          </MetaProvider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
