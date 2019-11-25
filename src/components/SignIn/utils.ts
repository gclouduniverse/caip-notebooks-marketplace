import FIREBASE_CNM from "../../common/firebase";
import { getGoogleAuthInstance } from "../../common/googleAuth";

/**
 *
 * @param cb Callback for sign in
 * @todo Add normal error catching
 */
export const signIn = async (cb: () => void) => {
  try {
    const googleAuth = await getGoogleAuthInstance();
    if(!googleAuth) throw new Error("Can't initialize google api")
    googleAuth.signIn();
    googleAuth.isSignedIn.listen((isSignedIn: boolean) => {
      if (isSignedIn) {
        const { access_token } = googleAuth.currentUser.get().getAuthResponse();
        const cred = FIREBASE_CNM.auth.GoogleAuthProvider.credential(
          null,
          access_token
        );
        FIREBASE_CNM.auth().setPersistence(
          FIREBASE_CNM.auth.Auth.Persistence.LOCAL
        );
        FIREBASE_CNM.auth().signInWithCredential(cred);
      }
      cb();
    });
  } catch (e) {
    console.log(e);
  }
};

/**
 *
 * @param cb
 * @todo Add normal error catching
 */
export const signOut = async (cb: () => void) => {
  try {
    const googleAuth = await getGoogleAuthInstance();
    if(!googleAuth) throw new Error("Can't initialize google api")
    googleAuth.signOut();
    FIREBASE_CNM.auth().signOut();
    cb();
  } catch (e) {
    console.log(e);
  }
};

export const getSignBtnText = (isLoading: boolean, isSignedIn: boolean) => {
  if (isLoading) {
    return "Loading";
  }
  return isSignedIn ? "Sign out" : "Sign in";
};
