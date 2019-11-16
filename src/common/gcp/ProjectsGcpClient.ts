import { AbstractGcpClient } from "./AbstractGcpClient";
import { GoogleCloudProject } from "../types";

const PROJECT_API_URL =
  "https://cloudresourcemanager.googleapis.com/v1/projects?key=";

export class ProjectsGcpClient extends AbstractGcpClient<GoogleCloudProject[]> {
  public constructor() {
    super();
  }

  public async requestProjects() {
    const projects = await super.execute("projects");
    return projects;
  }

  protected getUrl(): string {
    return PROJECT_API_URL + this.apiKey;
  }
}
