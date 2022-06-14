import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Profile.module.css";
import twitterIcon from "../../assets/icon-twitter-accent.svg";
import instagramIcon from "../../assets/icon-instagram.svg";
import discordIcon from "../../assets/icon-discord-accent.svg";
import { readUserProfile } from "../../utils/firebase";
import { handleCancel, handleInputChange, handleSave } from "./Profile-Script";

const Profile = () => {
  const history = useHistory();
  const { account, dispatch } = useContext(GenContext);

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
  const saveProps = { account, state, dispatch, handleSetValidation };
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

        <div className={classes.option}>
          <h3>Wallet Address</h3>
          <p>To update your address just change your account in your wallet.</p>
          <input className={account && classes.wallet} type="text" value={account} disabled />
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
              value={discord}
              name="discord"
              onChange={(event) => handleInputChange({ event, ...inputProps })}
            />
          </div>

          <div className={classes.buttons}>
            <button type="button" onClick={() => handleSave(saveProps)} className={classes.submit}>
              Save Changes
            </button>
            <button type="button" onClick={() => handleCancel(cancelProps)} className={classes.cancel}>
              Cancel
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
