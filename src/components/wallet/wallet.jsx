import React, { useContext, useState } from 'react'
import classes from './wallet.module.css';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { GenContext } from '../../gen-state/gen.context';
import { setConnector, setAccount } from '../../gen-state/gen.actions';


import { ethers } from "ethers";
import Web3Modal from "web3modal";


function ConnectWallet() {
    let [wallet, setWallet] = useState('Connect Wallet');
    const { dispatch, connector, account } = useContext(GenContext);


    function breakAddress(address = "", width = 6) {
        return `${address.slice(0, width)}...${address.slice(-width)}`
    }

    // temporarily get image

    // let fileHandle;
    // const pickerOpts = {
    //     types: [
    //         {
    //             description: 'Images',
    //             accept: {
    //                 'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    //             }
    //         },
    //     ],
    //     excludeAcceptAllOption: true,
    //     multiple: false
    // };

    // async function getTheFile() {
    //     // open file picker
    //     [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    //     // get file contents
    //     const fileData = await fileHandle.getFile();
    //     // console.log('filedata', typeof fileData)
    //     // let filez = {}

    //     // const data = await zip.loadAsync(fileData)
        
    //     // const files = data.files['metadata.json']
    //     // const metadataString = await files.async('string')
    //     // const metadata = JSON.parse(metadataString)
    //     // console.log(metadata)
    //     console.log(fileData)
    //     try {
    //         let drt = await minter.createNFT(fileData);
    //         console.log(drt)
    //         let name = fileData.name.split('.')[0];
    //         await mintToCelo(drt, name)
    //     } catch (error) {
    //         console.log('pioli', error)
    //     }
    // }

    const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              137: 'https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym',
              4160: "https://api.testnet.algoexplorer.io",
            },
            rpcUrl: ""
          }
        }
      }
      
      const web3Modal = new Web3Modal({
        // network: "mainnet", // optional
        // cacheProvider: true, // optional
        providerOptions // required
      });

      async function disconnect() {
        if (connector) {
            const clear = await web3Modal.clearCachedProvider();
            setWallet('Connect Wallet');
            dispatch(setAccount(''));
            dispatch(setConnector())
        }
    }


    const toggleWallet = async (e) => {
        // bridge url
        // const bridge = "https://bridge.walletconnect.org";

          let connector
          try {
            connector = await web3Modal.connect();
            //await web3Modal.toggleModal();
          } catch (error) {
              alert(error)
              return
          }
          
          
          console.log('ec2? Meta??', connector)
          
          const provider = new ethers.providers.Web3Provider(connector);
          const signer = provider.getSigner();
          console.log('info', provider, signer)

        // create new connector
        // const connector = new WalletConnect({
        //     bridge: bridge,
        //     qrcodeModal: QRCodeModal,
        // });

        if (provider.connection.url === 'metamask') {
            await dispatch(setConnector(provider));
            const account = await signer.getAddress();
            dispatch(setAccount(account));
        } else {
            await dispatch(setConnector(connector));
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
            console.log('ppp', provider, signer)
            const { accounts } = connector;
            dispatch(setAccount(accounts[0]));
        }

        connector.on("disconnect", (error, payload) => {
            if (error) {
                throw error;
            }
        });
        }
        // check if already connected
        

        
    };

    return (
        (account ?
            <div className={classes.condected}>
                <div className={classes.address}>
                    {breakAddress(account)}
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