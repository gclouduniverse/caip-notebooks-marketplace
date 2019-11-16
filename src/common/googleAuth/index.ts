import { GAPI_KEY, GAPI_CLIENT_ID } from "../../common/constants";

declare var gapi: any;

const GAPI_SCOPE =
  "https://www.googleapis.com/auth/compute https://www.googleapis.com/auth/cloud-platform.read-only";
const GAPI_DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];

const GAPI_CLIENT_DATA = {
  apiKey: GAPI_KEY,
  clientId: GAPI_CLIENT_ID,
  scope: GAPI_SCOPE,
  discoveryDocs: GAPI_DISCOVERY_DOCS
};

const loadGapi = () => {
  return new Promise(resolve => {
    gapi.load("client:auth2", () => {
      resolve();
    });
  });
};

let GOOGLE_AUTH_INSTANCE: any | null = null;

export const getGoogleAuthInstance = async () => {
  try {
    if (GOOGLE_AUTH_INSTANCE) {
      return GOOGLE_AUTH_INSTANCE;
    }
    await loadGapi();
    await gapi.client.init(GAPI_CLIENT_DATA);
    GOOGLE_AUTH_INSTANCE = await gapi.auth2.getAuthInstance();
    return GOOGLE_AUTH_INSTANCE;
  } catch (e) {
    return [];
  }
};
