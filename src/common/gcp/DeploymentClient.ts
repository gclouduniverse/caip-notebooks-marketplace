import { AbstractGcpClient } from "./AbstractGcpClient";

export type DeploymentResponse = {
};

export class DeploymentClient extends AbstractGcpClient<DeploymentResponse> {
  private projectId: string;
  private zone: string;
  private name: string;
  private region: string;
  private projectNumber: string;

  constructor(
    projectId: string,
    zone: string,
    name: string,
    region: string,
    projectNumber: string
  ) {
    super();
    this.projectId = projectId;
    this.zone = zone;
    this.name = name;
    this.region = region;
    this.projectNumber = projectNumber;
    console.log("FastAiDeploymnetClient created with:");
    console.log("project: " + projectId);
    console.log("zone: " + zone);
    console.log("name: " + name);
  }

  public deploy() {
    return super.deploy();
  }

  protected generateBody(): string {
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
        items: [
          {
            key: "proxy-mode",
            value: "service_account"
          },
          {
            key: "jupyter-ui",
            value: "notebook"
          },
          {
            key: "post-startup-script",
            value: "gs://marketplace-public-files/fastai/preconfigure-fastai.sh"
          }
        ]
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
            sourceImage:
              "projects/deeplearning-platform-release/global/images/family/pytorch-latest-cpu",
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
