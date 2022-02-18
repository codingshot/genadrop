import React, { useContext, useState } from 'react'
import classes from './wallet.module.css';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { GenContext } from '../../gen-state/gen.context';
import { setConnector, setAccount, setNotification } from '../../gen-state/gen.actions';


import { ethers } from "ethers";
import Web3Modal from "web3modal";


function ConnectWallet() {
  const { dispatch, connector, account } = useContext(GenContext);
  const [dropdown, setDropdown] = useState(false);
  function breakAddress(address = "", width = 6) {
    return `${address.slice(0, width)}...${address.slice(-width)}`
  }

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
      // const clear = await web3Modal.clearCachedProvider();
      dispatch(setAccount(''));
      dispatch(setConnector())
      setDropdown(false)
    }
  }


  const toggleWallet = async (e) => {
    // bridge url
    // const bridge = "https://bridge.walletconnect.org";

    let connector
    try {
      connector = await web3Modal.connect();
      dispatch(setNotification('connected successfully'))
      // feedbacktype: success
      //await web3Modal.toggleModal();
    } catch (error) {
      dispatch(setNotification('connection failed'))
      //   feedbacktype: error
      return
    }


    console.log('ec2? Meta??', connector)

    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    console.log('info', provider, signer)

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
          dispatch(setNotification('No connected'))
          // feedbacktype: warn              

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
      <div className={classes.container}>
        <div onClick={() => setDropdown(!dropdown)} className={classes.connected}><div className={classes.icon} />Connected</div>
        <div className={`${classes.dropdown} ${dropdown && classes.active}`}>
          <div className={classes.address}>
            {breakAddress(account)}
          </div>
          <div onClick={disconnect} className={classes.disconnect}>disconnet</div>
        </div>
      </div>
      :
      <div className={classes.connect} onClick={toggleWallet}>Connect Wallet</div>
    )
  )
}

export default ConnectWallet;