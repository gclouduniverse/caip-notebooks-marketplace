import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import * as firebase from "firebase/app";
import "firebase/analytics";
import { GcpAuthHelper } from "./GcpAuthHelper";
import { DeployController } from "./DeployController";
import { FIREBASE_CONFIG, API_KEY  } from "./FireBaseConfig";



firebase.initializeApp(FIREBASE_CONFIG);

function assignDeployButtons() {
    const deployController = new DeployController(API_KEY);

    document
        .getElementById("deployFastAi")
        .addEventListener("click",
                         (e:Event) => {
                            firebase.analytics().logEvent("deploy_fastai_clicked");
                             deployController.showDeployDialog();
                         });

                
}

window.onload = function() {
    GcpAuthHelper.getInstance();
    assignDeployButtons();
    firebase.analytics().logEvent("app_loaded");
};
