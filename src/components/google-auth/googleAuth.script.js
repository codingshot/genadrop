import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { setCurrentUser, setNotification } from "../../gen-state/gen.actions";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signInWithGoogle = ({ dispatch }) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // // The signed-in user info.
      const { displayName, email, uid } = result.user;
      dispatch(setCurrentUser({ displayName, email, uid }));
      // ...
    })
    .catch((error) => {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // // ...
      dispatch(
        setNotification({
          type: "error",
          message: error.message,
        })
      );
    });
};

export const getCurrentUser = ({ dispatch }) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const { displayName, email, uid } = user;
      dispatch(setCurrentUser({ displayName, email, uid }));

      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};
