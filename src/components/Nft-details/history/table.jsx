import React from 'react';
import TableRow from './tableRow';
import classes from './table.module.css';

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <table className={classes.table}>
          <tbody>
            <tr>
              <th>TRANSACTION TYPE</th>
              {/* <th>NAME</th> */}
              <th>TRANSACTION ID</th>
              <th>TIME</th>
              <th>UNIT PRICE</th>
              <th>BUYER</th>
              <th>SELLER</th>
            </tr>
            {this.props.data.map((d, i) => (
              <TableRow
                key={i}
                event={d.type}
                price={d.price}
                quantity={1}
                from={d.seller}
                to={d.buyer}
                date={d.txDate}
                txId={d.txId}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
