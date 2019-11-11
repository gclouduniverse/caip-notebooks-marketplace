const SIGN_IN_BTN_ID: string = "signInBtn";
const SIGN_OUT_BTN_ID: string = "signOutBtn";
const USER_NAME_LABEL_ID: string = "userNameText";
const TOKEN_COOKIE_NAME: string = "token";

import * as Cookies from 'es-cookie';
import * as firebase from "firebase/app";
import "firebase/auth";

export const API_KEY = "";

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

    private initAuth() {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                "apiKey": API_KEY,
                "clientId": "619676931792-tuq9skcpv2aal08bgr9d644vt0f2iqg5.apps.googleusercontent.com",
                "scope": "https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only",
                "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
            }).then(() => {
                console.log(1111);
                this.googleAuth = gapi.auth2.getAuthInstance();
            }, (e) => {
                console.log(e);
            });
        });
    }

    public static getInstance(): GcpAuthHelper {
        if (!GcpAuthHelper.instance) {
            GcpAuthHelper.instance = new GcpAuthHelper();
            firebase.auth().onAuthStateChanged((user) => GcpAuthHelper.instance.onAuthStateChanged(user));
        }
        return GcpAuthHelper.instance;
    }

    public isUserSignedIn(): boolean {
        if (!this.googleAuth) {
            return this.isFirebaseSignedIn();
        }
        return this.isGapiSignedIn() && this.isFirebaseSignedIn();
    }

    private isGapiSignedIn(): boolean {
        if (!!this.googleAuth) {
            return !!this.googleAuth.isSignedIn.get();
        } else {
            return false;
        }
    }

    private isFirebaseSignedIn(): boolean {
        return !!firebase.auth().currentUser;
    }

    public getAuthToken(): string {
        if (this.isUserSignedIn()) {
            // firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            //     // Send token to your backend via HTTPS
            //     // ...
            //     console.log("correct token: " + idToken);
            //   }).catch(function(error) {
            //     console.log("error token: " + error);
            //   });
            //   console.log("cookie's token: " + Cookies.get(TOKEN_COOKIE_NAME));
            //   return Cookies.get(TOKEN_COOKIE_NAME);
            return this.googleAuth.currentUser.get().getAuthResponse().access_token
        }
        return null;
    }

    public signOut(): void {
        Cookies.remove(TOKEN_COOKIE_NAME);
        firebase.auth().signOut();
        const GoogleAuth = gapi.auth2.getAuthInstance();
        GoogleAuth.signOut();
        this.onSignedOut();
    }

    private signInFirebase() {
        const accessToken: string = this.googleAuth.currentUser.get().getAuthResponse().access_token;
        var cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
        firebase.auth().signInWithCredential(cred);
    }

    public signIn(): void {
        // if (!this.isGapiSignedIn()) {
        //     if (!!this.googleAuth) {
        //         this.googleAuth.signIn().then(() => {
        //             if (!this.isFirebaseSignedIn()) {
        //                 this.signInFirebase();
        //             }
        //         });
        //     } else {
        //         this.initAuth(() => {
        //             this.googleAuth.signIn().then(() => {
        //                 if (!this.isFirebaseSignedIn()) {
        //                     this.signInFirebase();
        //                 }
        //             });
        //         });
        //     }
        // } else {
        //     if (!this.isFirebaseSignedIn()) {
        //         this.signInFirebase();
        //     }
        // }
        gapi.load('client:auth2', () => {
            gapi.client.init({
                "apiKey": API_KEY,
                "clientId": "619676931792-tuq9skcpv2aal08bgr9d644vt0f2iqg5.apps.googleusercontent.com",
                "scope": "https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only",
                "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
            }).then(() => {
                this.googleAuth = gapi.auth2.getAuthInstance();

                // Listen for sign-in state changes.
                console.log(1);
                console.log(!!this.googleAuth.currentUser.get());
                console.log(this.googleAuth.isSignedIn.get());
                if (!!this.googleAuth.isSignedIn.get()) {
                    console.log(this.googleAuth.currentUser.get().getAuthResponse());
                    const accessToken: string = this.googleAuth.currentUser.get().getAuthResponse().access_token;
                    var cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
                    firebase.auth().signInWithCredential(cred).then(function(user) {
                        console.log("super!");
                    });
                } else {
                    this.googleAuth.signIn();
                    // console.log(2);
                    this.googleAuth.isSignedIn.listen((isSignedIn: any) => {

                        console.log(3);
                        const user = this.googleAuth.currentUser.get();
                        console.log(user.getAuthResponse(true));
                        
                        const accessToken: string = this.googleAuth.currentUser.get().getAuthResponse().access_token;
                        var cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
                        firebase.auth().signInWithCredential(cred).then(function(user) {
                            console.log("super!");
                        });
                        // this.updateSigninStatus(isSignedIn);
                        // var cred = firebase.auth.GoogleAuthProvider.credential(null, gapiAccessToken);
                    });
                    console.log(this.googleAuth.currentUser.get().getAuthResponse());
                } 
            });
       });

    //     var GoogleAuth; // Google Auth object.
    //     gapi.load('client:auth2', function() {
    //         gapi.client.init({
    //             'apiKey': "",
    //             'clientId': "619676931792-tuq9skcpv2aal08bgr9d644vt0f2iqg5.apps.googleusercontent.com",
    //             'scope': 'https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only',
    //             'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
    //         }).then(function () {
    //             GoogleAuth = gapi.auth2.getAuthInstance();

    //             // Listen for sign-in state changes.
    //             console.log(1);
    //             console.log(!!GoogleAuth.currentUser.get());
    //             console.log(GoogleAuth.isSignedIn.get());
    //             if (!!GoogleAuth.isSignedIn.get()) {
    //                 console.log(GoogleAuth.currentUser.get().getAuthResponse());
    //                 const accessToken: string = GoogleAuth.currentUser.get().getAuthResponse().access_token;
    //                 var cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
    //                 firebase.auth().signInWithCredential(cred).then(function(user) {
    //                     console.log("super!");
    //                 });
    //             } else {
    //                 GoogleAuth.signIn();
    //                 // console.log(2);
    //                 GoogleAuth.isSignedIn.listen((isSignedIn: any) => {

    //                     console.log(3);
    //                     const user = GoogleAuth.currentUser.get();
    //                     console.log(user.getAuthResponse(true));
                        
    //                     const accessToken: string = GoogleAuth.currentUser.get().getAuthResponse().access_token;
    //                     var cred = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
    //                     firebase.auth().signInWithCredential(cred).then(function(user) {
    //                         console.log("super!");
    //                     });
    //                     this.updateSigninStatus(isSignedIn);
    //                     // var cred = firebase.auth.GoogleAuthProvider.credential(null, gapiAccessToken);
    //                 });
    //                 console.log(GoogleAuth.currentUser.get().getAuthResponse());
    //             }
                
                
    //         });
    //    });
    }

    private onSignedOut(): void {
        // this.signInBtn.classList.add("visible");
        this.signOutBtn.classList.add("invisible");
        this.userNameLabel.classList.add("invisible");
        this.userNameLabel.nodeValue = "";
    }

    private onSignedIn(user: firebase.User): void {
        // this.signInBtn.classList.add("invisible");
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