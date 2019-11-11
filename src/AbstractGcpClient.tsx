import { GcpAuthHelper } from './GcpAuthHelper';


export abstract class AbstractGcpClient<T> {

    private gcpAuthHelper: GcpAuthHelper;
    private requestType: string;

    constructor(requestType: string = "GET") {
        this.gcpAuthHelper = GcpAuthHelper.getInstance();
        this.requestType = requestType;
    }

    protected getUrl(): string {
        throw new Error("getUrl of AbstractGcpClient need to be overriden"); 
    }

    protected generateBody(): string {
        return "";
    }

    public execute(callback: (jsonResponse: T) => any): void {
        const cookie: string = this.gcpAuthHelper.getAuthToken();
        if (!cookie) {
            throw new Error("Client is not signed in."); 
        }
        // var request: gapi.client.HttpRequest<any> = gapi.client.request(
        //     {
        //         "path": this.getUrl(),
        //         "method": "GET",
        //         "headers": {
        //           "Authorization": "Bearer " + cookie,
        //           "Accept": "application/json"
        //         }
        //     }
        // );
        // request.execute(callback);
        // (async () => {
        //     const baseUrl = this.getUrl();
        //     var options = {
        //         uri: baseUrl,
                // headers: {
                //     "Authorization": "Bearer " + cookie,
                //     "Accept": "application/json"
                // }
        //     };
          
        //     const result: T = await request.get(options);
        //     callback(result);
        //   })();
        const request = new XMLHttpRequest();
        request.open(this.requestType, this.getUrl());
        request.setRequestHeader("Authorization", "Bearer " + cookie);
        request.setRequestHeader("Accept", "application/json");
        request.onreadystatechange = (e) => {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                // console.log(request.responseText);
                var response: T = JSON.parse(request.responseText);
                callback(response);
            }
        }
        if (this.requestType == "POST") {
            request.send(this.generateBody());
        } else {
            request.send();
        }
        
    }
}