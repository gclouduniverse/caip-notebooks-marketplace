import { AbstractGcpClient } from "./AbstractGcpClient";


class ProjectsResponse {
    projects: Project[];
}

export class Project {
    projectId: string
    name: string
    projectNumber: string
}


export class ProjectsGcpClient extends AbstractGcpClient<ProjectsResponse> {

    private apiKey: string;

    public constructor(apiKey: string) {
        super();
        this.apiKey = apiKey;
    }

    public requestProjects(parseProjects: (projects: Project[]) => void): void {
        super.execute( 
            (response: ProjectsResponse) => {
                parseProjects(response.projects);
            }
        );
    }

    protected getUrl(): string {
        return "https://cloudresourcemanager.googleapis.com/v1/projects?key=" + this.apiKey;
    }
}