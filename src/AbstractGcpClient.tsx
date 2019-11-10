import * as Cookies from 'es-cookie';


export abstract class AbstractGcpClient<T> {

    protected getUrl(): string {
        throw new Error("getUrl of AbstractGcpClient need to be overriden"); 
    }

    public execute(callback: (jsonResponse: T) => any): void {
        const cookie: string = Cookies.get('token');
        if (!cookie) {
            throw new Error("Client is not signed in."); 
        }
        var request: gapi.client.HttpRequest<any> = gapi.client.request(
            {
                "path": this.getUrl(),
                "method": "GET",
                "headers": {
                  "Authorization": "Bearer " + cookie,
                  "Accept": "application/json"
                }
            }
        );
        request.execute(callback);
    }
}