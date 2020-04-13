import { DeploymentClient } from "./DeploymentClient";

export class FastAiDeploymentClient extends DeploymentClient {
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
      "fastai",
      "",
      "gs://marketplace-public-files/fastai/preconfigure-fastai.sh",
      [
        {
          key: "jupyter-ui",
          value: "notebook"
        }
      ]
    );
  }
}
