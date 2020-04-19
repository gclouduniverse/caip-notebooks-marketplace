import { AbstractGcpClient } from "./AbstractGcpClient";
import "firebase/analytics";
import firebase from "firebase";

export type DeploymentResponse = {};

export class DeploymentClient extends AbstractGcpClient<DeploymentResponse> {
  private projectId: string;
  private zone: string;
  private name: string;
  private region: string;
  private projectNumber: string;
  private deploymentNameForAnalytics: string;
  private sourceImage: string;
  private gceStartupScripts?: string;
  private dlvmStartupScripts?: string;
  private additionalMetadata?: Array<{ key: string; value: string }>;

  constructor(
    projectId: string,
    zone: string,
    name: string,
    region: string,
    projectNumber: string,
    deploymentNameForAnalytics: string,
    sourceImage: string,
    gceStartupScripts?: string,
    dlvmStartupScripts?: string,
    additionalMetadata?: Array<{ key: string; value: string }>
  ) {
    super();
    this.projectId = projectId;
    this.zone = zone;
    this.name = name;
    this.region = region;
    this.projectNumber = projectNumber;
    this.deploymentNameForAnalytics = deploymentNameForAnalytics;
    this.sourceImage = sourceImage;
    this.gceStartupScripts = gceStartupScripts;
    this.dlvmStartupScripts = dlvmStartupScripts;
    this.additionalMetadata = additionalMetadata;
    console.log("New DeploymnetClient created with:");
    console.log("project: " + projectId);
    console.log("zone: " + zone);
    console.log("name: " + name);
  }

  public deploy() {
    firebase
      .analytics()
      .logEvent(`deploy_${this.deploymentNameForAnalytics}_clicked`);
    return super.deploy();
  }

  protected generateBody(): string {
    const metadata_items_start = [
      {
        key: "proxy-mode",
        value: "service_account"
      }
    ];
    const metadata_items = this.additionalMetadata
      ? metadata_items_start.concat(this.additionalMetadata)
      : metadata_items_start;
    if (!!this.dlvmStartupScripts) {
      metadata_items.push({
        key: "post-startup-script",
        value: this.dlvmStartupScripts
      });
    }
    if (!!this.gceStartupScripts) {
      metadata_items.push({
        key: "startup-script-url",
        value: this.gceStartupScripts
      });
    }

    const body = {
      machineType:
        "projects/" +
        this.projectId +
        "/zones/" +
        this.zone +
        "/machineTypes/n1-standard-1",
      name: this.name,
      zone: "projects/" + this.projectId + "/zones/" + this.zone,
      metadata: {
        kind: "compute#metadata",
        items: metadata_items
      },
      serviceAccounts: [
        {
          email: this.projectNumber + "-compute@developer.gserviceaccount.com",
          scopes: [
            "https://www.googleapis.com/auth/cloud-platform",
            "https://www.googleapis.com/auth/userinfo.email"
          ]
        }
      ],
      networkInterfaces: [
        {
          kind: "compute#networkInterface",
          subnetwork:
            "projects/" +
            this.projectId +
            "/regions/" +
            this.region +
            "/subnetworks/default",
          accessConfigs: [
            {
              kind: "compute#accessConfig",
              name: "External NAT",
              type: "ONE_TO_ONE_NAT",
              networkTier: "PREMIUM"
            }
          ]
        }
      ],
      tags: {
        items: ["deeplearning-vm"]
      },
      disks: [
        {
          kind: "compute#attachedDisk",
          type: "PERSISTENT",
          boot: true,
          mode: "READ_WRITE",
          autoDelete: true,
          deviceName: this.name,
          initializeParams: {
            sourceImage: this.sourceImage,
            diskType:
              "projects/" +
              this.projectId +
              "/zones/" +
              this.zone +
              "/diskTypes/pd-standard",
            diskSizeGb: "50"
          },
          diskEncryptionKey: {}
        }
      ]
    };
    return JSON.stringify(body);
  }

  protected getUrl(): string {
    return `https://compute.googleapis.com/compute/v1/projects/${this.projectId}/zones/${this.zone}/instances`;
  }
}
