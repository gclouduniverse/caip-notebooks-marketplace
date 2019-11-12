import { API_KEY, CLIENT_ID } from "./FireBaseConfig";
import * as firebase from "firebase/app";
import "firebase/auth";

const SIGN_IN_BTN_ID: string = "signInBtn";
const SIGN_OUT_BTN_ID: string = "signOutBtn";
const USER_NAME_LABEL_ID: string = "userNameText";

declare var gapi: any;


export class GcpAuthHelper {

    private static instance: GcpAuthHelper;
    private signInBtn: HTMLElement;
    private signOutBtn: HTMLElement;
    private userNameLabel: HTMLElement;
    private authProvider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
    private googleAuth: any;

    private constructor() {
        this.signInBtn = document.getElementById(SIGN_IN_BTN_ID);
        this.signInBtn.addEventListener("click", (e:Event) => this.onSignInClick());

        this.signOutBtn = document.getElementById(SIGN_OUT_BTN_ID);
        this.signOutBtn.addEventListener("click", (e:Event) => this.onSignOutClick());

        this.userNameLabel = document.getElementById(USER_NAME_LABEL_ID);

        this.authProvider.addScope("https://www.googleapis.com/auth/compute");
        this.authProvider.addScope("https://www.googleapis.com/auth/cloud-platform.read-only");
    }

    public static getInstance(): GcpAuthHelper {
        if (!GcpAuthHelper.instance) {
            GcpAuthHelper.instance = new GcpAuthHelper();
            firebase.auth().onAuthStateChanged((user) => GcpAuthHelper.instance.onAuthStateChanged(user));
        }
        return GcpAuthHelper.instance;
    }

    public isUserSignedIn(): boolean {
        return !!firebase.auth().currentUser;
    }

    public getAuthToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => { 
            this.signIn().then(() => {
                resolve(this.googleAuth.currentUser.get().getAuthResponse().access_token);
            }).catch(e => reject(e));
        });
    }

    public signOut(): void {
        firebase.auth().signOut();
        const GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.signOut();
        this.onSignedOut();
    }

    private loadGapi(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!!this.googleAuth) {
                resolve();
            } else {
                gapi.load('client:auth2', () => {
                    resolve();
                });
            }
        });
    }

    private initGapi(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!!this.googleAuth) {
                resolve();
            } else {
                gapi.client.init({
                    "apiKey": API_KEY,
                    "clientId": CLIENT_ID,
                    "scope": "https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only",
                    "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
                }).then(() => resolve());
            }
        });
    }

    private instantiateGoogleAuth(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!!this.googleAuth) {
                resolve();
            } else {
                this.googleAuth = gapi.auth2.getAuthInstance();
                resolve();
            }
        });
    }

    private signInGapi(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!!this.googleAuth.isSignedIn.get()) {
                resolve();
            } else {
                this.googleAuth.signIn();
                this.googleAuth.isSignedIn.listen((isSignedIn: any) => {
                    resolve();
                });
            }
        });
    }

    private signInFirebase(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isUserSignedIn()) {
                const accessToken: string = this.googleAuth.currentUser.get().getAuthResponse().access_token;
                const cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
                firebase.auth().signInWithCredential(cred).then((user) => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public signIn(): Promise<void> {
        return this.loadGapi().then(
            () => {
                return this.initGapi();
            }
        ).then(() => {
            return this.instantiateGoogleAuth();
        }).then(() => {
            return this.signInGapi();
        }).then(() => {
            return this.signInFirebase()
        }).then(() => {
            this.onSignedIn(firebase.auth().currentUser);
        }).catch(e => {
            alert("sign in error: " + e);
        });
    }

    private onSignedOut(): void {
        this.signInBtn.classList.remove("d-none");
        this.signOutBtn.classList.add("d-none");
        this.userNameLabel.classList.add("d-none");
        this.userNameLabel.nodeValue = "";
    }

    private onSignedIn(user: firebase.User): void {
        this.signInBtn.classList.add("d-none");
        this.signOutBtn.classList.remove("d-none");
        this.userNameLabel.classList.remove("d-none");
        this.userNameLabel.textContent = "Logged In as: " + user.displayName;
    }

    private onAuthStateChanged(user: firebase.User): void {
        if (this.isUserSignedIn()) {
            this.onSignedIn(user);
        } else {
            this.onSignedOut();
        }
    }

    private onSignInClick(): void {
        this.signIn();
    }

    private onSignOutClick(): void {
        this.signOut();
    }
}