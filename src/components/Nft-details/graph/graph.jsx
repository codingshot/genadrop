import React, { useEffect } from "react";
import classes from "./graph.module.css";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const Graph = ({ details }) => {
  let dates = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let prices = [];
  if (details) {
    details.map((e, i) => {
      const date = new Date(e.txDate * 1000);

      dates.push(date.getDate() + "/" + months[date.getMonth()]);
      prices.push(e.price);
    });
  }

  // console.log(dates, prices);
  const data = {
    labels: dates,
    datasets: [
      {
        // label: "First dataset",
        data: prices,
        fill: true,
        backgroundColor: "#dbf0ff",
        borderColor: "#0d99ff",
      },
    ],
  };

  const options = {
    plugins: {
      responsive: true,
      legend: {
        display: false,
      },
    },
  };
  return (
    <>
      {prices ? (
        <div className={classes.chart}>
          <Line data={data} width={null} height={80} options={options} />
        </div>
      ) : (
        <div className={classes.nodata}>No Price History Available</div>
      )}
    </>
  );
};

export default Graph;
