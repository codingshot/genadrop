import React from "react";
import { Chart } from "react-charts";
import classes from "./graph.module.css";

const Graph = ({ details }) => {
  const prices = !details
    ? null
    : details.map((e, i) => {
        const date = new Date(e.txDate * 1000);
        return [date.getMonth(), e.price];
      });

  const data = React.useMemo(
    () => [
      {
        label: "Series 1",
        data: prices,
      },
    ],
    []
  );
  const nodata = React.useMemo(() => [
    {
      label: "Series 1",
      data: [],
    },
  ]);
  const series = React.useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );

  const lineChart = (
    <>
      {prices ? (
        <div className={classes.chart}>
          <Chart data={data} series={series} axes={axes} />
        </div>
      ) : (
        <div className={classes.nodata}>No Price History Available</div>
      )}
    </>
  );

  return lineChart;
};

export default Graph;
