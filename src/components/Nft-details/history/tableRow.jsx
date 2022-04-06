import React, { useContext, useEffect, useState } from 'react';
import classes from './tableRow.module.css';
import saleIcon from '../../../assets/sale-icon.png';
import transferIcon from '../../../assets/transfer-icon.png';
import mintIcon from '../../../assets/mint-icon.png';
import { GenContext } from '../../../gen-state/gen.context';
import { useParams } from 'react-router-dom';

const TableRow = (data) => {
  const [explorerLink, setExplorerLink] = useState('');
  const [isMainnet, setIsMainnet] = useState(false);
  const { collections } = useContext(GenContext);
  const { collectionName } = useParams();

  function breakAddress(address = '', width = 6) {
    if (!address) return '--';
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const icons = [saleIcon, transferIcon, mintIcon];
  const getDate = () => {
    const date = new Date(data.date.seconds * 1000);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const formattedDate = `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
  };
  const icon = () => {
    let icon = '';
    switch (data.event) {
      case 'Sale':
        icon = icons[0];
        break;
      case 'Transfer':
        icon = icons[1];
        break;
      case 'Minting':
        icon = icons[2];
        break;
      default:
        break;
    }
    return icon;
  };

  useEffect(() => {
    if (Object.keys(collections).length) {
      const collectionsFound = collections.find(
        (col) => col.name === collectionName
      );
      setIsMainnet(collectionsFound.mainnet);
      console.log(data);
      viewOnExplorer();
    }
  }, [collections]);

  const viewOnExplorer = () => {
    if (isMainnet === true)
      return setExplorerLink(`https://algoexplorer.io/tx/${data.txId}`);
    else if (isMainnet === false)
      return setExplorerLink(`https://testnet.algoexplorer.io/tx/${data.txId}`);
  };

  return (
    <tr>
      <td>
        <span className={classes.icon}>
          <img src={icon()} alt='' />
        </span>
        {data.event}
      </td>
      <td>
        {!data.txId ? (
          '--'
        ) : (
          <a rel='noopener noreferrer' target='_blank' href={explorerLink}>
            {data.txId}
          </a>
        )}
      </td>
      <td>{getDate(data.date)}</td>
      <td>{!data.price ? '--' : data.price}</td>
      <td>{breakAddress(data.from)}</td>
      <td>{breakAddress(data.to)}</td>
    </tr>
  );
};

export default TableRow;
