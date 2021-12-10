import React, { useContext, useState } from 'react'
import classes from './wallet.module.css';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { GenContext } from '../../gen-state/gen.context';
import { setConnector, setAccount } from '../../gen-state/gen.actions';
const minter = require('../utils/arc_ipfs');

function ConnectWallet() {
    let [wallet, setWallet] = useState('Connect Wallet');
    const { dispatch, connector, account } = useContext(GenContext);

    function breakAddress(address = "", width = 6) {
        return `${address.slice(0, width)}...${address.slice(-width)}`
    }

    function disconnect() {
        if (connector) {
            connector.killSession();
            setWallet('Connect Wallet');
            dispatch(setAccount(''));
            dispatch(setConnector())
        }
    }

    // temporarily get image

    let fileHandle;
    const pickerOpts = {
        types: [
            {
                description: 'Images',
                accept: {
                    'image/*': ['.png', '.gif', '.jpeg', '.jpg']
                }
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false
    };

    async function getTheFile() {
        // open file picker
        [fileHandle] = await window.showOpenFilePicker(pickerOpts);

        // get file contents
        const fileData = await fileHandle.getFile();
        // console.log('filedata', typeof fileData)
        // let filez = {}

        // const data = await zip.loadAsync(fileData)
        
        // const files = data.files['metadata.json']
        // const metadataString = await files.async('string')
        // const metadata = JSON.parse(metadataString)
        // console.log(metadata)
        console.log(fileData)
        try {
            let drt = await minter.createNFT(fileData, account, connector);
            console.log(drt)
        } catch (error) {
            console.log('pioli', error)
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

        await dispatch(setConnector(connector));

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
            console.log(payload.params, accounts)
            dispatch(setAccount(accounts[0]));




        });

        connector.on("session_update", (error, payload) => {
            if (error) {
                throw error;
            }

            // Get updated accounts 
            const { accounts } = payload.params[0];
            dispatch(setAccount(accounts[0]));
        });

        if (connector.connected) {
            const { accounts } = connector;
            dispatch(setAccount(accounts[0]));
        }

        connector.on("disconnect", (error, payload) => {
            if (error) {
                throw error;
            }
        });
    };

    return (
        (account ?
            <div className={classes.condected}>
                <div className={classes.address}>
                    {breakAddress(account)}
                </div>
                <div className={classes.discornect} onClick={getTheFile}>
                    disconnect
                </div>
            </div>
            : <button className={classes.button} onClick={toggleWallet}>{wallet}</button>
        )

    )
}

export default ConnectWallet;