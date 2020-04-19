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
          key: "container",
          value: "b0noi/tf2-jupyterlab2-gpu"
        },
        {
          key: "install-nvidia-driver",
          value: "True"
        }
      ]
    );
  }
}
