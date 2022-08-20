import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { setCollectionName, setCurrentUser, setNotification } from "../../gen-state/gen.actions";
import { handleResetCreate } from "../../utils";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = ({ dispatch }) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const { displayName, email, uid } = result.user;
      dispatch(setCurrentUser({ displayName, email, uid }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(
        setNotification({
          type: "error",
          message: "something went wrong! Please try again.",
        })
      );
    });
};

export const getCurrentUser = ({ dispatch }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { displayName, email, uid, photoURL } = user;
      dispatch(setCurrentUser({ displayName, email, uid, photoURL }));
    } else {
      dispatch(setCurrentUser(null));
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
