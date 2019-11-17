import { AbstractGcpClient } from "./AbstractGcpClient";
import { GoogleProjectRegion, GoogleCloudProject } from "../types";


export class GceRegionsClient extends AbstractGcpClient<GoogleProjectRegion[]> {
  private project: GoogleCloudProject;

  public constructor(project: GoogleCloudProject) {
    super();
    this.project = project;
  }

  public async requestRegions() {
    const regions = await super.execute("items");
    return regions;
  }

  protected getUrl(): string {
    return `https://compute.googleapis.com/compute/v1/projects/${this.project.name}/regions`;
  }
}
