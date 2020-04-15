import { DeploymentClient } from "./DeploymentClient";

export class TheiaDeploymentClient extends DeploymentClient {
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
      "theia",
      "projects/deeplearning-platform-release/global/images/family/common-container-notebooks",
      "gs://marketplace-public-files/theia/startup-script.sh",
      "",
        [
            {
                key: "container",
                value: "theiaide/theia:next"
            },
            {
                key: "agent-health-check-path",
                value: "/"
            }
        ]
    );
  }
}
