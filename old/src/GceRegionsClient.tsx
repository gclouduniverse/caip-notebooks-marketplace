import { AbstractGcpClient } from "./AbstractGcpClient";

class RegionsResponse {
    items: Region[];
}

export class Region {
    name: string;
    zones: string[];
}

export class GceRegionsClient extends AbstractGcpClient<RegionsResponse> {
    
    public requestRegions(parseRegions: (regions: Region[]) => void): void {
        super.execute( 
            (response: RegionsResponse) => {
                parseRegions(response.items);
            }
        );
    }

    protected getUrl(): string {
        return "https://compute.googleapis.com/compute/v1/projects/caip-notebooks-marketplace/regions";
    }
}