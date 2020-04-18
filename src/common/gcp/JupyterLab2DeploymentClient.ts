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
      "projects/caip-notebooks-marketplace-dev/global/images/family/dlvm-tf2",
      "",
      "",
        []
    );
  }
}
