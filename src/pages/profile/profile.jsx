import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./profile.module.css";
import twitterIcon from "../../assets/icon-twitter-accent.svg";
import instagramIcon from "../../assets/icon-instagram.svg";
import discordIcon from "../../assets/icon-discord-accent.svg";
import { readUserProfile } from "../../utils/firebase";
import { handleCancel, handleInputChange, handleSave } from "./profile-script";
import avatar from "../../assets/avatar.png";
import bg from "../../assets/bg.png";
import copyIcon from "../../assets/icon-copy.svg";
import { getConnectedChain } from "../../components/wallet/wallet-script";

const Profile = () => {
  const history = useHistory();
  const { account, dispatch, chainId } = useContext(GenContext);
  const [copied, setCopy] = useState(false);
  const copyRef = useRef(null);

  const handleCopy = (props) => {
    const { navigator } = props;
    navigator.clipboard.writeText(account);
  };

  const [state, setState] = useState({
    subscribe: false,
    username: "",
    email: "",
    twitter: "",
    discord: "",
    instagram: "",
  });

  const [validation, setValidation] = useState({
    isEmail: true,
    isTwitter: true,
    isDiscord: true,
    isInstagram: true,
  });

  const { subscribe, email, twitter, discord, username, instagram } = state;
  const { isEmail, isDiscord, isTwitter, isInstagram } = validation;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleSetValidation = (payload) => {
    setValidation((val) => ({ ...val, ...payload }));
  };

  const inputProps = { handleSetState, handleSetValidation };
  const saveProps = { account, state, dispatch, handleSetValidation, history };
  const cancelProps = { handleSetState, history };

  useEffect(() => {
    (async function updateProfile() {
      if (!account) return;
      const res = await readUserProfile(account);
      handleSetState(res);
    })();
  }, [account]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h1 className={classes.heading}>Profile Settings</h1>
        <div className={classes.images}>
          <div>
            {/** IMPORT FUNCTION TO BE IMPLEMENTED WHEN HANDLED FROM FIREBASE */}

            {/* <label htmlFor="inputTag" className={classes.uploadIcon}>
          <input type="file" id="inputTag" />
          <img src={uploadIcon} alt="" />
        </label> */}
          </div>
          <div className={classes.profile}>
            <img src={avatar} alt="" />
          </div>
          <div className={classes.banner}>
            <img src={bg} alt="" />
          </div>
        </div>
        <div className={classes.content}>
          <div className={classes.option}>
            <h3>Wallet Address</h3>
            <div
              className={classes.text}
              onMouseDown={() => setCopy(true)}
              onMouseUp={() => setCopy(false)}
              onClick={() => handleCopy({ navigator, copy: copyRef.xcurrent })}
            >
              <img className={classes.chain} src={getConnectedChain(chainId)} alt="" />
              <input className={account && classes.wallet} type="text" value={account} disabled />
              <img src={copyIcon} alt="" className={`${classes.copyIcon} ${copied && classes.active}`} />
            </div>

            <p>To update your address just change your account in your wallet.</p>
          </div>

          <div className={classes.option}>
            <h3>Username</h3>
            <input
              type="text"
              value={username}
              name="username"
              onChange={(event) => handleInputChange({ event, ...inputProps })}
            />
          </div>

          <div className={`${classes.option} ${!isEmail && classes.invalid}`}>
            <h3>Email</h3>
            <input
              type="email"
              value={email}
              name="email"
              onChange={(event) => handleInputChange({ event, ...inputProps })}
              placeholder="me@gmail.com"
            />
          </div>

          <div className={classes.option}>
            <h3>Email Subscription</h3>
            <div
              onClick={() => handleSetState({ subscribe: !subscribe })}
              className={`${classes.toggleButton} ${subscribe && classes.active}`}
            >
              <div className={classes.toggle} />
            </div>
            <p className={`${classes.warn} ${!subscribe && classes.active}`}>
              (You won&apos;t recieve ANY emails from GenaDrop if do not subscribe - including important ones related to
              your account security or purchases)
            </p>
          </div>

          <section className={classes.social}>
            <h2 className={classes.subheading}>Social Media</h2>

            <div className={`${classes.option} ${!isTwitter && classes.invalid}`}>
              <label>
                <img src={twitterIcon} alt="" />
                <div>Twitter</div>
              </label>
              <input
                type="text"
                value={`https://twitter.com/${twitter}`}
                name="twitter"
                onChange={(event) => handleInputChange({ event, ...inputProps })}
              />
            </div>

            <div className={`${classes.option} ${!isInstagram && classes.invalid}`}>
              <label>
                <img src={instagramIcon} alt="" />
                <div>Instagram</div>
              </label>
              <input
                type="text"
                value={`https://www.instagram.com/${instagram}`}
                name="instagram"
                onChange={(event) => handleInputChange({ event, ...inputProps })}
              />
            </div>

            <div className={`${classes.option} ${!isDiscord && classes.invalid}`}>
              <label>
                <img src={discordIcon} alt="" />
                <div>Discord</div>
              </label>
              <input
                type="text"
                value={`https://discord.com/users/${discord}`}
                name="discord"
                onChange={(event) => handleInputChange({ event, ...inputProps })}
              />
            </div>

            <div className={classes.buttons}>
              <button type="button" onClick={() => handleSave(saveProps)} className={classes.submit}>
                Save
              </button>
              <button type="button" onClick={() => handleCancel(cancelProps)} className={classes.cancel}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
