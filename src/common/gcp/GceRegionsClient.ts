import { AbstractGcpClient } from "./AbstractGcpClient";
import { GoogleProjectRegion, GoogleCloudProject } from "../types";


export class GceRegionsClient extends AbstractGcpClient<GoogleProjectRegion[]> {
  private project: GoogleCloudProject;

  public constructor(project: GoogleCloudProject) {
    super();
    this.project = project;
  }

  public async requestRegions(): Promise<GoogleProjectRegion[] | null> {
    const regions: GoogleProjectRegion[] | null  = await super.execute("items");
    if (regions == null) {
      return null;
    }
    return regions.map((region: GoogleProjectRegion) => {
      region.zones = region.zones.map((zone: string) => {
        const zoneComponents: string[] = zone.split("/");
        return zoneComponents[zoneComponents.length - 1];
      });
      return region;
    });
  }

  protected getUrl(): string {
    return `https://compute.googleapis.com/compute/v1/projects/${this.project.name}/regions`;
  }
}
