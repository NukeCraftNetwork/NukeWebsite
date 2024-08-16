import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";
const PDFViewerUnwrapped = clientOnly(() => import("./PDFViewerUnwrapped"));

export default function PDFViewer(props: { url: string }) {
  return (
    <Suspense>
      <PDFViewerUnwrapped {...props} />
    </Suspense>
  );
}
