import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { setCollectionName, setCurrentUser, setIsUser, setNotification } from "../../gen-state/gen.actions";
import { handleResetCreate } from "../../utils";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = ({ dispatch, handleSetState = () => {} }) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const { displayName, email, uid } = result.user;
      dispatch(setCurrentUser({ displayName, email, uid }));
      handleSetState({ isSignIn: false });
    })
    .catch(({ code }) => {
      switch (code) {
        case "auth/popup-closed-by-user":
          dispatch(
            setNotification({
              type: "error",
              message: "Popup closed by user",
            })
          );
          handleSetState({ isSignIn: false });
          break;
        case "auth/cancelled-popup-request":
          dispatch(
            setNotification({
              type: "error",
              message: "Popup request cancelled",
            })
          );
          handleSetState({ isSignIn: false });
          break;
        default:
          dispatch(
            setNotification({
              type: "error",
              message: "Something went wrong!. Try again",
            })
          );
          handleSetState({ isSignIn: false });
          break;
      }
    });
};

export const getCurrentUser = ({ dispatch }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { displayName, email, uid, photoURL } = user;
      dispatch(setCurrentUser({ displayName, email, uid, photoURL }));
      dispatch(setIsUser("true"));
    } else {
      dispatch(setCurrentUser(null));
      dispatch(setIsUser("false"));
    }
  });
};

export const logOut = ({ currentPlan, dispatch }) => {
  signOut(auth)
    .then(() => {
      dispatch(setCurrentUser(null));
      if (currentPlan !== "free") {
        handleResetCreate({ dispatch });
        dispatch(setCollectionName("New Collection"));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
