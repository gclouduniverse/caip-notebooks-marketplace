import { DeploymentClient } from "./DeploymentClient";

export class JupyterLab2DeploymentClient extends DeploymentClient {
  constructor(
    projectId: string,
    zone: string,
    name: string,
    region: string,
    projectNumber: string
  ) {
    super(
      projectId,
      zone,
      name,
      region,
      projectNumber,
      "jupyterlab2",
      "projects/deeplearning-platform-release/global/images/family/common-container-notebooks",
      "",
      "",
      [
          {
              "key": "container",
              "value": "docker.pkg.github.com/gclouduniverse/caip-notebooks-marketplace/tf2-jupyterlab2"
          },
          {
              "key": "install-nvidia-driver",
              "value": "True"
          }
      ]
    );
  }
}
