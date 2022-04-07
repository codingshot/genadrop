import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./profile.module.css";
import twitterIcon from "../../assets/icon-twitter-accent.svg";
import youtubeIcon from "../../assets/icon-youtube-accent.svg";
import instagramIcon from "../../assets/icon-instagram.svg";
import discordIcon from "../../assets/icon-discord-accent.svg";

const Profile = () => {
  const { account } = useContext(GenContext);
  const [state, setState] = useState({
    subscribe: false,
    email: "",
    twitter: "",
    discord: "",
    youtube: "",
    instagram: "",
  });
  const { subscribe, email, twitter, discord, youtube, instagram } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    handleSetState({ [name]: value });
  };

  const history = useHistory();

  const handleCancel = () => {
    handleSetState({
      subscribe: false,
      email: "",
      twitter: "",
      discord: "",
      youtube: "",
      instagram: "",
    });
    history.goBack();
  };

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
          <h3>Email</h3>
          <input type="email" value={email} name="email" onChange={handleInputChange} placeholder="me@gmail.com" />
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

          <div className={classes.option}>
            <label>
              <img src={twitterIcon} alt="" />
              <div>Twitter</div>
            </label>
            <input type="text" value={twitter} name="twitter" onChange={handleInputChange} />
          </div>

          <div className={classes.option}>
            <label>
              <img src={instagramIcon} alt="" />
              <div>Instagram</div>
            </label>
            <input type="text" value={instagram} name="instagram" onChange={handleInputChange} />
          </div>

          <div className={classes.option}>
            <label>
              <img src={youtubeIcon} alt="" />
              <div>Youtube</div>
            </label>
            <input type="text" value={youtube} name="youtube" onChange={handleInputChange} />
          </div>

          <div className={classes.option}>
            <label>
              <img src={discordIcon} alt="" />
              <div>Discord</div>
            </label>
            <input type="text" value={discord} name="discord" onChange={handleInputChange} />
          </div>

          <div className={classes.buttons}>
            <button type="button" className={classes.submit}>
              Save Changes
            </button>
            <button type="button" onClick={handleCancel} className={classes.cancel}>
              Cancel
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
