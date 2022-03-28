import React from 'react';
import { Chart } from 'react-charts';
import classes from './graph.module.css';

const Graph = ({ details }) => {
  // let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const prices = !details ? null : details.map((e) => {
    const date = new Date(e.txDate * 1000);
    return [date.getMonth(), e.price];
  });

  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: prices,
      },
    ],
    [],
  );
  const series = React.useMemo(
    () => ({
      showPoints: false,
    }),
    [],
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  const lineChart = (
    <div className={classes.chart}>
      {prices ? (
        <Chart data={data} series={series} axes={axes} />
      ) : (
        <img src="/assets/no-chart.svg" alt="" />
      )}
    </div>
  );

  return lineChart;
};

export default Graph;
