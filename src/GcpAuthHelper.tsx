const SIGN_IN_BTN_ID: string = "signInBtn";
const SIGN_OUT_BTN_ID: string = "signOutBtn";
const USER_NAME_LABEL_ID: string = "userNameText";
const TOKEN_COOKIE_NAME: string = "token";

import * as Cookies from 'es-cookie';
import * as firebase from "firebase/app";
import "firebase/auth";


export class GcpAuthHelper {

    private static instance: GcpAuthHelper;
    private signInBtn: HTMLElement;
    private signOutBtn: HTMLElement;
    private userNameLabel: HTMLElement;
    private authProvider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();

    private constructor() {
        this.signInBtn = document.getElementById(SIGN_IN_BTN_ID);
        this.signInBtn.addEventListener("click", (e:Event) => this.onSignInClick());

        this.signOutBtn = document.getElementById(SIGN_OUT_BTN_ID);
        this.signOutBtn.addEventListener("click", (e:Event) => this.onSignOutClick());

        this.userNameLabel = document.getElementById(USER_NAME_LABEL_ID);

        this.authProvider.addScope("https://www.googleapis.com/auth/compute");
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

    public getAuthToken(): string {
        if (this.isUserSignedIn()) {
            return Cookies.get(TOKEN_COOKIE_NAME);
        }
        return null;
    }

    public signOut(): void {
        Cookies.remove(TOKEN_COOKIE_NAME);
        firebase.auth().signOut();
    }

    public signIn(): void {
        firebase.auth().signInWithPopup(this.authProvider).then(function(result: firebase.auth.UserCredential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credentials: firebase.auth.OAuthCredential = result.credential;
            var token: string = credentials.accessToken;
            // The signed-in user info.
            var user: firebase.User = result.user;
            Cookies.set(TOKEN_COOKIE_NAME, token);
            alert(token);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            alert(errorMessage);
        });
    }

    private onSignedOut(): void {
        this.signInBtn.classList.add("visible");
        this.signOutBtn.classList.add("invisible");
        this.userNameLabel.classList.add("invisible");
        this.userNameLabel.nodeValue = "";
    }

    private onSignedIn(user: firebase.User): void {
        this.signInBtn.classList.add("invisible");
        this.signOutBtn.classList.add("visible");
        this.userNameLabel.classList.add("visible");
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