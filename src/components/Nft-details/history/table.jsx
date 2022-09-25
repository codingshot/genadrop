import React from "react";
import TableRow from "./tableRow";
import classes from "./table.module.css";

const Table = (props) => (
  <div className={classes.container}>
    <table className={classes.table}>
      <tr>
        <th>TRANSACTION TYPE</th>
        <th>NAME</th>
        <th>TRANSACTION ID</th>
        <th>TIME</th>
        <th>UNIT PRICE</th>
        <th>BUYER</th>
        <th>SELLER</th>
      </tr>
      {props.data.map((d, i) => (
        <TableRow
          key={i}
          event={d.type}
          price={Number(d.price)?.toFixed(2)}
          quantity={1}
          from={d.seller}
          to={d.buyer}
          date={d.txDate}
          txId={d.txId}
          chain={props.chain}
        />
      ))}
    </table>
  </div>
);

export default Table;
