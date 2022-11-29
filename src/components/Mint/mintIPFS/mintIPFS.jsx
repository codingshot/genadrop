import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { setNotification } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import classes from "./mintIpfs.module.css";

const MintIpfs = () => {
  const [state, setState] = useState({
    ipfsLink: "",
  });
  const { ipfsLink } = state;
  const { dispatch } = useContext(GenContext);
  const history = useHistory();

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const validateLink = () => {
    if (ipfsLink === "") {
      return dispatch(setNotification({ message: "Please insert a link", type: "error" }));
    }
    if (ipfsLink.includes("ipfs://")) {
      history.push("/mint/ipfs/minter", { data: ipfsLink });
    } else {
      dispatch(setNotification({ message: "Invalid IPFS Link", type: "error" }));
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>Mint Using IPFS</h1>
        <h6 className={classes.subTitle}>Mint your NFT directly using your IPFS Link</h6>
      </div>
      <div className={classes.inputWrapper}>
        <h6 className={classes.inputHeader}>Enter IPFS Link</h6>
        <div className={classes.input}>
          <input
            onChange={(e) => handleSetState({ ipfsLink: e.target.value })}
            type="text"
            placeholder="ipfs://bafybeidlkqhddsjrdue7y3dy27pu5d7ydyemcls4z24szlyik3we7vqvam"
          />
          <button onClick={validateLink} className={classes.mintButton} type="button">
            Mint
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintIpfs;
