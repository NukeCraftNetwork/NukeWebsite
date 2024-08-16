import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import { Suspense } from "solid-js";
import { QueryClientProvider } from "@tanstack/solid-query";
import { QueryClient } from "@tanstack/query-core";
import { ClientSessionProvider } from "./contexts/session";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { MetaProvider } from "@solidjs/meta";
import Metadata from "./components/metadata/Metadata";
import { ComputedVarsProvider } from "./contexts/computedVars";

// TODO: Integrations for KYC/KYB/Docusign
// TODO: Security updates
// TODO: Check that isDeleted does not break anything (add other tables for deletions and put stuff there as transaction)
// TODO: isDeleted and isPublished must be respected
// TODO: Zod validation both in front and backend (possibly with common classes)
// TODO: Images should ALWAYS have a parent relative with fixed dimensions
// TODO: Introduce session??
// TODO: Fixxare register thing. It must redirect to registration in case not all the info are provided
// TODO: FormData or JSON. Validation on FormData in case
// TODO: Images should be preloaded from local env and loaded onSubmit with other data
// TODO: Metti cosa che faccia vedere che opportunita is public
// TODO: The business sticky
// TODO: PDF Scroll
// TODO: Vercel cache

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
                <ClientSessionProvider>
                  <Metadata />
                  <SolidQueryDevtools />
                  <div class="text-main">{props.children}</div>
                </ClientSessionProvider>
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
