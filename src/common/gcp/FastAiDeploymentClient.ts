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
      "projects/deeplearning-platform-release/global/images/family/pytorch-latest-cpu",
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
