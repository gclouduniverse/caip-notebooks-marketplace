import { AbstractGcpClient } from "./AbstractGcpClient";

class Response {}

export class FastAiDeploymnetClient extends AbstractGcpClient<Response> {
    private project: string;
    private zone: string;
    private name: string;

    constructor(project: string, zone: string, name: string) {
        super("POST");
        this.project = project;
        this.zone = zone;
        this.name = name;
        console.log("FastAiDeploymnetClient created with:");
        console.log("project: " + project);
        console.log("zone: " + zone);
        console.log("name: " + name);
    }

    public deploy() {
        super.execute((response: Response) => {
            console.log("YaY!");
        })
    }

    protected generateBody(): string {
        return JSON.stringify({
            "machineType": "n1-standard-1",
            "name": this.name,
            // "metadata": {
            //     "items": {
            //         "proxy-mode": "service_account"
            //     }
            // },
            // "scopes": [
            //     "https://www.googleapis.com/auth/cloud-platform",
            //     "https://www.googleapis.com/auth/userinfo.email"
            // ],
            "image-family": "pytorch-latest-cpu",
            "image-project": "deeplearning-platform-release"
        });
    }

    protected getUrl(): string {
        return "https://compute.googleapis.com/compute/v1/projects/" + this.project + "/zones/" + this.zone + "/instances";
    }
}
