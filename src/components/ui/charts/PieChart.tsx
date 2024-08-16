import { SolidApexCharts } from "solid-apexcharts";
import { JSX, Show } from "solid-js";
import { Loading } from "../animations";

export default function PieChart(props: {
  class?: JSX.HTMLAttributes<HTMLDivElement>;
  series: number[];
  labels?: string[];
}) {
  return (
    <Show
      when={props.series.length}
      fallback={
        <Loading>
          <div class={`relative min-h-64 min-w-96 ${props.class || ""}`} />
        </Loading>
      }
    >
      <div class={`relative min-h-64 min-w-96 ${props.class || ""}`}>
        <SolidApexCharts
          type="donut"
          options={{
            labels: props.labels,
          }}
          width={"100%"}
          height={"100%"}
          series={props.series}
        />
      </div>
    </Show>
  );
}
