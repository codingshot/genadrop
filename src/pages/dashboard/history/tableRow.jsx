import React from 'react';
import classes from './tableRow.module.css';
const TableRow = (data) => {

    const address = (address) => {
        const begining = address.slice(0, 9);
        const end = address.slice(-2);
        return (

            <>
                <span className={classes.begining}>{begining}</span>
                <span className={classes.end}>{end}</span>
            </>
        )
    }

    const icons = ["/assets/sale-icon.png", "/assets/transfer-icon.png", "/assets/mint-icon.png"]
    const icon = () => {
        let icon = ""
        switch (data.event) {
            case "Sale":
                icon = icons[0];
                break;
            case "Transfer":
                icon = icons[1];
                break;
            case "Minted":
                icon = icons[2];
                break;


        }
        return icon
    }

    return (
        <tr>
            <td>
                <img src={icon()} alt="" />
                {data.event}
            </td>
            <td>{data.price}</td>
            <td>{data.quantity}</td>
            <td>{address(data.from)}</td>
            <td>{address(data.to)}</td>
            <td>{data.date}</td>
        </tr>)

};

export default TableRow;