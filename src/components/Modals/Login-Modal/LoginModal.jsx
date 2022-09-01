import { useContext, useState } from "react";
import classes from "./LoginModal.module.css";
import { ReactComponent as FolderIcon } from "../../../assets/icon-folder.svg";
import { ReactComponent as GoogleIcon } from "../../../assets/icon-google.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { signInWithGoogle } from "../../google-auth/googleAuth.script";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { setCollectionName } from "../../../gen-state/gen.actions";
import { ReactComponent as LoadingIcon } from "../../../assets/icon-loading.svg";

const LoginModal = () => {
  const { dispatch, isUser, collectionName } = useContext(GenContext);
  const [state, setState] = useState({
    toggleModal: true,
    isSignIn: false,
  });

  const { toggleModal, isSignIn } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSignIn = () => {
    handleSetState({ isSignIn: true });
    signInWithGoogle({ dispatch, handleSetState });
  };

  const handleClose = () => {
    handleSetState({ toggleModal: false, isSignIn: false });
    if (!collectionName) {
      dispatch(setCollectionName("New Collection"));
    }
  };

  return (
    <div className={`${classes.container} ${isUser === "false" && toggleModal && classes.active}`}>
      <div className={classes.card}>
        <CloseIcon onClick={handleClose} className={classes.closeBtn} />
        <div className={classes.heading}>
          Sign in to continue using <span>Genadrop</span>
        </div>
        <FolderIcon className={classes.logoHead} />
        <div onClick={!isSignIn ? handleSignIn : () => {}} className={classes.signinBtn}>
          <div className={`${classes.overlayer} ${isSignIn && classes.active}`}>
            <LoadingIcon className={classes.loadingIcon} />
          </div>
          <GoogleIcon />
          <div>sign in with google</div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
