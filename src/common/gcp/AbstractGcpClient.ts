import { getGoogleAuthInstance } from "../googleAuth";
import { API_KEY } from "../constants";

export abstract class AbstractGcpClient<T> {
  protected apiKey = API_KEY;

  protected getUrl(): string {
    throw new Error("getUrl of AbstractGcpClient need to be overriden");
  }

  protected generateBody(): string {
    return "";
  }

  /**
   * @returns true if success, false if not
   */
  protected async deploy() {
    try {
      const rawResponse = await fetch(this.getUrl(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: this.generateBody()
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  protected async execute(property: string) {
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
      if (object.error) {
        throw new Error(JSON.stringify(object.error));
      }
      return object[property] as T;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
