import { SolidApexCharts } from "solid-apexcharts";
import { JSX, Show } from "solid-js";
import { Loading } from "../animations";

export default function AreaChart(props: {
  class?: JSX.HTMLAttributes<HTMLDivElement>;
  title: string;
  subTitle?: string;
  labels: string[];
  series: number[];
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
      <div class={`min-h-64 min-w-96 ${props.class || ""}`}>
        <SolidApexCharts
          type="area"
          options={{
            chart: { zoom: { enabled: true } },
            dataLabels: { enabled: false },
            stroke: {
              curve: "smooth",
            },
            title: {
              text: props.title,
              align: "left",
            },
            subtitle: props.subTitle
              ? {
                  text: props.subTitle,
                  align: "left",
                }
              : undefined,
            labels: props.labels,
          }}
          series={[{ name: props.title, data: props.series }]}
          width={"100%"}
          height={"100%"}
        />
      </div>
    </Show>
  );
}
