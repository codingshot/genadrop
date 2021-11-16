import React, { useState } from 'react'
import classes from './wallet.module.css';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

function ConnectWallet() {
    let [wallet, setWallet] = useState('Connect Wallet');
    const [connector, setConnector] = useState();
    const [selectedAcount, setAccount] = useState('');

    function breakAddress(address="", width=6) {
        return `${address.slice(0, width)}...${address.slice(-width)}`
    }
    
    function disconnect() {
        if (connector) {
            connector.killSession();
            setWallet('Connect Wallet');
            setAccount('');
            setConnector();
        }
    }

    const toggleWallet = async (e) => {
        // bridge url
        const bridge = "https://bridge.walletconnect.org";

        // create new connector
        const connector = new WalletConnect({
            bridge: bridge,
            qrcodeModal: QRCodeModal,
        });

        await setConnector(connector);

        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession();
        }

        // Subscribe to connection events
        connector.on("connect", (error, payload) => {
            if (error) {
            throw error;
            }
        
            // Get provided accounts
            const { accounts } = payload.params[0];
            setAccount(accounts[0]);
        });

        connector.on("session_update", (error, payload) => {
            if (error) {
              throw error;
            }
          
            // Get updated accounts 
            const { accounts } = payload.params[0];
            setAccount(accounts[0]);
        });

        if (connector.connected) {
            const { accounts } = connector;
            setAccount(accounts[0]);
        }

        connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error;
            }
        });
    };

    return (
        (selectedAcount ? 
            <div className={classes.condected}>
                <div className={classes.address}>
                {breakAddress(selectedAcount)}
                </div>
                <div className={classes.discornect} onClick={disconnect}>
                    disconnect
                </div>
            </div>
            : <button className={classes.button} onClick={toggleWallet}>{wallet}</button>
        )
        
    )
}

export default ConnectWallet;