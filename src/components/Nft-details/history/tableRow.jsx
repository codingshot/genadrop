import React from 'react';
import classes from './tableRow.module.css';
import saleIcon from '../../../assets/sale-icon.png';
import transferIcon from '../../../assets/transfer-icon.png';
import mintIcon from '../../../assets/mint-icon.png';

const TableRow = (data) => {

    function breakAddress(address = "", width = 6) {
        if (!address)
            return "--";
        return `${address.slice(0, width)}...${address.slice(-width)}`
    }

    const icons = [saleIcon, transferIcon, mintIcon]
    const getDate = () => {
        const date = new Date(data.date.seconds * 1000)
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        return formattedDate
    }
    const icon = () => {
        let icon = ""
        switch (data.event) {
            case "Sale":
                icon = icons[0];
                break;
            case "Transfer":
                icon = icons[1];
                break;
            case "Minting":
                icon = icons[2];
                break;


        }
        return icon
    }

    return (
        <tr>
            <td><span className={classes.icon} ><img src={icon()} alt="" /></span> {data.event} </td>
            {/* <td>{!data.quantity ? "--" : data.quantity}</td> */}
            <td>{!data.txId ? "--" : breakAddress(data.txId)}</td>
            <td>{getDate(data.date)}</td>
            <td>{!data.price ? "--" : data.price}</td>
            <td>{breakAddress(data.from)}</td>
            <td>{breakAddress(data.to)}</td>
        </tr>)

};

export default TableRow;