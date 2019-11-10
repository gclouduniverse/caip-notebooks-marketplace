import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as firebase from "firebase/app";
import { GcpAuthHelper } from "./GcpAuthHelper";

const firebaseConfig = {
    apiKey: "AIzaSyBTT0Ux3VVjAINFqHO6Qa0b1qP_Rdd7H5c",
    authDomain: "caip-notebooks-marketplace.firebaseapp.com",
    databaseURL: "https://caip-notebooks-marketplace.firebaseio.com",
    projectId: "caip-notebooks-marketplace",
    storageBucket: "caip-notebooks-marketplace.appspot.com",
    messagingSenderId: "619676931792",
    appId: "1:619676931792:web:c51ff848dc026d0319f0d5",
    measurementId: "G-KQQ8QNBPGQ"
  };

firebase.initializeApp(firebaseConfig);

// class GoogleComputeClient {

//     constructor() {
//         let btn = document.getElementById("testBtn");
//         btn.addEventListener("click", (e:Event) => this.onProjectsClick());
//     }

//     onProjectsClick() {
        
//         alert(Cookies.get('token'));
//         var request: gapi.client.HttpRequest<any> = gapi.client.request(
//               {
//                   "path": "https://compute.googleapis.com/compute/v1/projects/trading-systems-252219/zones/us-west1-b/instances",
//                   "method": "GET",
//                   "headers": {
//                     "Authorization": "Bearer " + Cookies.get('token'),
//                     "Accept": "application/json"
//                   }
//               }
//           );
//           request.execute((jsonResp) => {
//               alert(jsonResp);
//           });
//     }

// }

window.onload = function() {
    GcpAuthHelper.getInstance();
};
