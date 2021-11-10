import React, { useState } from 'react'
import classes from './wallet.module.css';

function ConnectWallet() {
    let [wallet, setWallet] = useState('Connect Wallet');

    const toggleWallet = (e) => {
        wallet === 'Connect Wallet' ? setWallet('0x987...654') : setWallet('Connect Wallet')

    };

    return (
        <button className={classes.button} onClick={(event) => toggleWallet(event)}>{wallet}</button>
    )
}

export default ConnectWallet;