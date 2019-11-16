import firebase from "firebase";
import { FIREBASE_CONFIG } from "../constants";

firebase.initializeApp(FIREBASE_CONFIG);

const FIREBASE_CNM = firebase;

export default FIREBASE_CNM;
