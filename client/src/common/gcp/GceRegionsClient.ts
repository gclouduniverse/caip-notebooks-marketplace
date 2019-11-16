import { AbstractGcpClient } from "./AbstractGcpClient";
import { GoogleProjectRegion } from "../types";
import { GAPI_PROJECT_NAME } from "../constants";

const API_URL =`https://compute.googleapis.com/compute/v1/projects/${GAPI_PROJECT_NAME}/regions`;

export class GceRegionsClient extends AbstractGcpClient<GoogleProjectRegion[]> {
  public constructor() {
    super();
  }

  public async requestRegions() {
    const regions = await super.execute("regions");
    return regions;
  }

  protected getUrl(): string {
    return API_URL;
  }
}
