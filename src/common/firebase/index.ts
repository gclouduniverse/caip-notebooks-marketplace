import firebase from "firebase";
import "firebase/analytics";
import { FIREBASE_CONFIG } from "../constants";

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics().logEvent("app_loaded");

const FIREBASE_CNM = firebase;

export default FIREBASE_CNM;
