import { GAPI_KEY, GAPI_CLIENT_ID } from "../../common/constants";
import FIREBASE_CNM from "../../common/firebase";

const GAPI_SCOPE =
  "https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only";
const GAPI_DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

declare var gapi: any;

/**
 *
 * @param cb Callback for sign in
 * @todo Add normal error catching
 */
export const signIn = async (cb: () => void) => {
  try {
    await loadGapi();
    const clientData = {
      apiKey: GAPI_KEY,
      clientId: GAPI_CLIENT_ID,
      scope: GAPI_SCOPE,
      discoveryDocs: GAPI_DISCOVERY_DOCS
    };
    await gapi.client.init(clientData);
    const googleAuth = await gapi.auth2.getAuthInstance();
    googleAuth.signIn();
    googleAuth.isSignedIn.listen(async () => {
      const { access_token } = googleAuth.currentUser.get().getAuthResponse();
      const cred = FIREBASE_CNM.auth.GoogleAuthProvider.credential(
        null,
        access_token
      );
      FIREBASE_CNM.auth().setPersistence(
        FIREBASE_CNM.auth.Auth.Persistence.LOCAL
      );
      await FIREBASE_CNM.auth().signInWithCredential(cred);
      cb();
    });
  } catch (e) {
    console.log(e);
  }
};

const loadGapi = () => {
  return new Promise(resolve => {
    gapi.load("client:auth2", () => {
      resolve();
    });
  });
};

export const getSignBtnText = (isLoading: boolean, isSignedIn: boolean) => {
  if (isLoading) {
    return "Loading";
  }
  return isSignedIn ? "Sign out" : "Sign in";
};
