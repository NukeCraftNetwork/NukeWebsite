import { Show, createEffect, createSignal } from "solid-js";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.mjs";

export default function PDFViewerUnwrapped(props: { url: string }) {
  const [canvas, setCanvas] = createSignal(
    <canvas class="w-full" id="pdfViewerParent" />
  );
  // TODO: Test this with two different documents selecting
  async function canvasSetup(url: string) {
    try {
      const element = document.createElement("canvas");
      element.style.width = "100%";
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument(url).promise;

      // Get the first page
      const page = await pdf.getPage(1);

      // Set up the canvas
      const viewport = page.getViewport({ scale: 1 });
      if (!element) return;
      element.height = viewport.height;
      element.width = viewport.width;
      const ctx = element.getContext("2d");

      if (!ctx) {
        console.error("Failed to get canvas 2D context");
        return;
      }

      // Render the page
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      setCanvas(element);
    } catch (error) {
      console.error(error);
    }
  }
  createEffect(() => {
    canvasSetup(props.url);
  });

  return <Show when={canvas()}>{canvas()}</Show>;
}
