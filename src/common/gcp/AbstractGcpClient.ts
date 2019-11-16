import { getGoogleAuthInstance } from "../googleAuth";
import { GAPI_KEY } from "../constants";

export abstract class AbstractGcpClient<T> {
  private requestType: string;

  protected apiKey = GAPI_KEY;

  constructor(requestType: string = "GET") {
    this.requestType = requestType;
  }

  protected getUrl(): string {
    throw new Error("getUrl of AbstractGcpClient need to be overriden");
  }

  protected generateBody(): string {
    return "";
  }

  /**
   * @todo Add support for POST request
   */
  public async execute(property: string) {
    try {
      const gai = await getGoogleAuthInstance();
      const token: string = await gai.currentUser.get().getAuthResponse()
        .access_token;
      const response = await fetch(this.getUrl(), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
      const object = await response.json();
      if(object.error) {
        throw new Error(JSON.stringify(object.error))
      }
      debugger;
      return object[property] as T;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
