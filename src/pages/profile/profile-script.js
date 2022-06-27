import { setLoader, setNotification } from "../../gen-state/gen.actions";
import { writeUserProfile } from "../../utils/firebase";
import * as PS from "./profile-script";

export const handleValidate = (state) => {
  const discordRegex = /^.{3,32}#[0-9]{4}$/;
  const twitterRegex = /^[A-Za-z0-9_]{1,15}$/;
  const instagramRegex = /^(?:[\w][\.]{0,1})*[\w]/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const status = {
    isDiscord: true,
    isEmail: true,
    isTwitter: true,
    isEmail: true,
  };

  if (discordRegex.test(state.discord) || !state.discord) {
    status.isDiscord = true;
  } else {
    status.isDiscord = false;
  }
  if (emailRegex.test(state.email) || !state.email) {
    status.isEmail = true;
  } else {
    status.isEmail = false;
  }
  if (twitterRegex.test(state.twitter) || !state.twitter) {
    status.isTwitter = true;
  } else {
    status.isTwitter = false;
  }
  if (instagramRegex.test(state.instagram) || !state.instagram) {
    status.isInstagram = true;
  } else {
    status.isInstagram = false;
  }

  return { ...status };
};

export const getValidName = (name) => {
  let first = name.charAt(0).toUpperCase();
  let rest = name.substring(1);
  return `is${first + rest}`;
};

export const handleSave = async ({ account, state, dispatch, handleSetValidation, history }) => {
  const validate = PS.handleValidate(state);
  let isValid = Object.values(validate).every((i) => i === true);
  if (isValid) {
    dispatch(setLoader("saving..."));
    const res = await writeUserProfile(state, account);
    if (res) {
      dispatch(
        setNotification({
          message: "Your profile has been saved",
          type: "success",
        })
      );
    } else {
      dispatch(
        setNotification({
          message: "Unable to save profile data",
          type: "error",
        })
      );
    }
    dispatch(setLoader(""));
  } else {
    dispatch(
      setNotification({
        message: "invalid input",
        type: "error",
      })
    );
  }
  handleSetValidation(validate);
  history.goBack();
};

export const handleInputChange = ({ event, handleSetState, handleSetValidation }) => {
  let { name, value } = event.target;
  if (name === "twitter") {
    value = value.split("https://twitter.com/")[1];
  } else if (name === "instagram") {
    value = value.split("https://www.instagram.com/")[1];
  }
  if (!value) value = "";
  handleSetState({ [name]: value });
  handleSetValidation({ [PS.getValidName(name)]: true });
};

export const handleCancel = ({ handleSetState, history }) => {
  handleSetState({
    subscribe: false,
    email: "",
    twitter: "",
    discord: "",
    username: "",
    instagram: "",
  });
  history.goBack();
};
