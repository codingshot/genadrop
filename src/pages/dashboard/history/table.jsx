
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
                            <th>TRANSACTION TYPE</th>
                            <th>NAME</th>
                            <th>TRANSACTION ID</th>
                            <th>TIME</th>
                            <th>UNIT PRICE</th>
                            <th>BUYER</th>
                            <th>SELLER</th>
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