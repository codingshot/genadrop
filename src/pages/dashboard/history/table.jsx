
import React from "react";
import TableRow from "./tableRow";
import classes from "./table.module.css"
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
                            <th>Event</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Date</th>
                        </tr>
                        {this.props.data.map(function (d, i) {
                            return <TableRow key={i}
                                event={d.event}
                                price={d.price}
                                quantity={d.quantity}
                                from={d.from}
                                to={d.to}
                                date={d.date}
                            />
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Table;