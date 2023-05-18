/* eslint-disable array-callback-return */
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

import classes from "./graph.module.css";

Chart.register(...registerables);

const Graph = ({ details }) => {
  const dates = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const prices = [];
  if (details) {
    // sort transactions buy date first
    details.sort((a, b) => {
      return a.txDate - b.txDate;
    });

    details.map((e) => {
      if (e.type === "Listing" || e.type === "Sale") {
        const date = new Date(e.txDate * 1000);

        dates.push(`${date.getDate()}/${months[date.getMonth()]}`);
        prices.push(e.price);
      }
    });
  }

  const data = {
    labels: dates,
    datasets: [
      {
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
