import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as firebase from "firebase/app";
import { GcpAuthHelper, API_KEY } from "./GcpAuthHelper";
import { DeployController } from "./DeployController";

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "caip-notebooks-marketplace.firebaseapp.com",
    databaseURL: "https://caip-notebooks-marketplace.firebaseio.com",
    projectId: "caip-notebooks-marketplace",
    storageBucket: "caip-notebooks-marketplace.appspot.com",
    messagingSenderId: "619676931792",
    appId: "1:619676931792:web:c51ff848dc026d0319f0d5",
    measurementId: "G-KQQ8QNBPGQ"
  };

firebase.initializeApp(firebaseConfig);

function assignDeployButtons() {
    const deployController = new DeployController(API_KEY);

    document
        .getElementById("deployFastAi")
        .addEventListener("click",
                         (e:Event) => deployController.showDeployDialog());

                
}

window.onload = function() {
    GcpAuthHelper.getInstance();
    assignDeployButtons();
};
