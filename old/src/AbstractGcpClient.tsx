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
        this.gcpAuthHelper.getAuthToken().then(token => {
            const request = new XMLHttpRequest();
            request.open(this.requestType, this.getUrl());
            request.setRequestHeader("Authorization", "Bearer " + token);
            request.setRequestHeader("Accept", "application/json");
            request.onreadystatechange = (e) => {
                if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    // console.log(request.responseText);
                    var response: T = JSON.parse(request.responseText);
                    callback(response);
                }
            }
            if (this.requestType == "POST") {
                request.setRequestHeader("Content-Type", "application/json");
                request.send(this.generateBody());
            } else {
                request.send();
            }
        }).catch(e => {
            alert("Token problem: " + e);
        });

        
    }
}