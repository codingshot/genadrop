import React, { useContext, useState } from 'react'
import classes from './wallet.module.css';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { GenContext } from '../../gen-state/gen.context';
import { setConnector, setAccount } from '../../gen-state/gen.actions';
import { ethers } from "ethers";
const minter = require('../utils/arc_ipfs');


function ConnectWallet() {
    let [wallet, setWallet] = useState('Connect Wallet');
    const [celoAccount, setCeloAccount] = useState('')
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
    let mintCollectionAbi = [
        "function createCollection(string memory _name, string memory _symbol) public {}",
        "function collectionsOf(address user) public view returns (address[] memory)"
    ];
    let mintAbi = [
        "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}"
    ];

     async function initializeContract(name) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const signer = await provider.getSigner();
        signer.getAddress().then((data) => setCeloAccount(data))
        const collectionContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, mintCollectionAbi, signer);
        let tx = await collectionContract.createCollection(name, name)
        await tx.wait();
        let getCollectionAddresses = await collectionContract.collectionsOf(celoAccount);
        let collectionAddresses = [...getCollectionAddresses];
        const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
        return contract;
      }

    async function mintToCelo(assets, name) {
        if (typeof window.ethereum !== 'undefined') {
            const contract = await initializeContract(name);
            let collection_id = {};
            let uris = assets.map((asset) => asset.url);
            let ids = assets.map((asset) => {
                let uintArray = asset.metadata.toLocaleString();
                return parseInt(uintArray.slice(0,7).replace(/,/g, ''));
            })
            let amounts = new Array(ids.length).fill(1);
            let tx;
            try {
                tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
                console.log(tx)
            } catch (error) {
                console.log(error);
                return;
            }
            for (let nfts = 0; nfts < ids.length; nfts++) {
                collection_id[ids[nfts]] = assets[nfts]['url']
              }
            const collectionHash = await minter.pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection${ids[0]}` } })
            let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
            console.log(`collection${ids[0]}`)
            await minter.write.writeUserData(`collection${ids[0]}`, collectionUrl)
            alert(`https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`)
        } else {
            alert('download metamask');
        }
    }

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
            let drt = await minter.createNFT(fileData);
            console.log(drt)
            let name = fileData.name.split('.')[0];
            await mintToCelo(drt, name)
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
                <div className={classes.discornect} onClick={disconnect}>
                    disconnect
                </div>
            </div>
            : <button className={classes.button} onClick={toggleWallet}>{wallet}</button>
        )

    )
}

export default ConnectWallet;