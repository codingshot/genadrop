import React, { useContext, useRef, useState } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useHistory } from 'react-router-dom';
import classes from './wallet.module.css';
import { GenContext } from '../../gen-state/gen.context';
import {
  setConnector, setAccount, setNotification, setChainId,
} from '../../gen-state/gen.actions';
import userIcon from '../../assets/user.svg';
import switchIcon from '../../assets/icon-switch.svg';
import copyIcon from '../../assets/icon-copy.svg';
import disconnectIcon from '../../assets/icon-disconnect.svg';
import polygonIcon from '../../assets/icon-polygon.svg';
import algoIcon from '../../assets/icon-algo.svg';
import nearIcon from '../../assets/icon-near.svg';
import celoIcon from '../../assets/icon-celo.svg';

const chainIcon = {
  Polygon: polygonIcon,
  'Polygon Testnet': polygonIcon,
  Algorand: algoIcon,
  Near: nearIcon,
  Celo: celoIcon,
};

const chains = [
  { label: 'Algorand', networkId: 4160, symbol: 'ALGO' },
  { label: 'Celo', networkId: 42220, symbol: 'CGLD' },
  { label: 'Polygon', networkId: 137, symbol: 'MATIC' },
  { label: 'Polygon Testnet', networkId: 80001, symbol: 'MATIC' },
  { label: 'Near', networkId: 1313161555, symbol: 'NEAR' },
];

function ConnectWallet({ setToggleNav }) {
  const history = useHistory();
  const {
    dispatch, connector, account, chainId,
  } = useContext(GenContext);
  const [dropdown, setDropdown] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [clipboardState, setClipboardState] = useState('Copy Address');
  const [network, setNetwork] = useState('mainnet');

  const clipboardRef = useRef(null);

  function breakAddress(address = '', width = 6) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          137: 'https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym',
          4160: 'https://node.testnet.algoexplorerapi.io',
        },
        rpcUrl: '',
      },
    },
  };

  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    // cacheProvider: true, // optional
    providerOptions, // required
  });

  async function disconnect() {
    if (connector) {
      // const clear = await web3Modal.clearCachedProvider();
      dispatch(setAccount(''));
      dispatch(setConnector());
      dispatch(setChainId(''));
      setDropdown(false);
      // history.push('/marketplace');
      setToggleDropdown(false);
    }
  }

  const toggleWallet = async () => {
    // bridge url
    // const bridge = "https://bridge.walletconnect.org";

    let connector;
    try {
      connector = await web3Modal.connect();
      // feedbacktype: success
      // await web3Modal.toggleModal();
    } catch (error) {
      dispatch(setNotification('connection failed ❌️'));
      //   feedbacktype: error
      return;
    }

    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();

    if (provider.connection.url === 'metamask') {
      await dispatch(setConnector(provider));
      await dispatch(setChainId(window.ethereum.networkVersion));
      const account = await signer.getAddress();
      dispatch(setAccount(account));
      connector.on('accountsChanged', (accounts) => {
        dispatch(setAccount(accounts[0]));
      });
      connector.on('chainChanged', () => {
        const Web3Provider = new ethers.providers.Web3Provider(connector);
        dispatch(setConnector(Web3Provider));
      });
      connector.on('networkChanged', (networkId) => {
        dispatch(setChainId(networkId));
      });
    } else {
      await dispatch(setConnector(connector));
      if (!connector.connected) {
        // create new session
        await connector.createSession();
      }
      // Subscribe to connection events
      connector.on('connect', (error, payload) => {
        console.log('connecting flight');
        if (error) {
          dispatch(setNotification('No connected'));
          // feedbacktype: warn

          throw error;
        }

        // Get provided accounts
        const { accounts } = payload.params[0];
        console.log(payload.params, accounts);
        dispatch(setAccount(accounts[0]));
      });

      connector.on('session_update', (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts
        const { accounts } = payload.params[0];
        dispatch(setAccount(accounts[0]));
      });

      if (connector.connected) {
        const { accounts } = connector;
        dispatch(setChainId(connector.chainId));

        dispatch(setAccount(accounts[0]));
      }

      connector.on('disconnect', (error, payload) => {
        if (error) {
          throw error;
        }
      });
    }
    // check if already connected
  };

  const handleSwitch = async () => {
    if (network === 'mainnet') {
      setNetwork('testnet');
    } else {
      setNetwork('mainnet');
    }
    setToggleDropdown(!toggleDropdown);
  };

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    setClipboardState('Copied');
    setTimeout(() => {
      setClipboardState('Copy Address');
    }, 850);
  };

  const getConnectedChain = () => {
    const c = chains.find((c) => c.networkId === chainId);
    if (!c) return;
    return c.label;
  };

  return (
    (account
      ? (
        <div className={classes.container}>
          <div onClick={() => setDropdown(!dropdown)} className={classes.connected}>
            <div
              onClick={
              () => { setToggleDropdown(false); setToggleNav(false); }
}
              className={classes.chain}
            >
              <img src={chainIcon[getConnectedChain()]} alt="" />
            </div>
            <div onClick={() => setToggleDropdown(!toggleDropdown)} className={classes.address}>
              <span>{breakAddress(account)}</span>
            </div>
            <div className={`${classes.dropdown} ${toggleDropdown && classes.active}`}>
              <div
                onClick={
                () => handleCopy({ navigator, clipboard: clipboardRef.current })
}
                className={classes.option}
              >
                <div>{clipboardState}</div>
                {' '}
                <img src={copyIcon} alt="" />
                <input style={{ display: 'none' }} ref={clipboardRef} type="text" defaultValue={account} />
              </div>
              <div onClick={handleSwitch} className={classes.option}>
                <div>
                  Switch to
                  {' '}
                  {network === 'mainnet' ? 'Testnet' : 'Mainnet'}
                </div>
                {' '}
                <img src={switchIcon} alt="" />
              </div>
              <div onClick={disconnect} className={classes.option}>
                <div>Disconnect</div>
                {' '}
                <img src={disconnectIcon} alt="" />
              </div>
            </div>
          </div>
          <div className={classes.network}>{network === 'mainnet' ? 'Mainnet' : 'Testnet'}</div>
          <div onClick={() => { setToggleDropdown(false); history.push(`/me/${account}`); setToggleNav(false); }} className={classes.user}>
            <img src={userIcon} alt="" />
          </div>
        </div>
      )
      : <div className={classes.connect} onClick={toggleWallet}>Connect Wallet</div>
    )
  );
}

export default ConnectWallet;
