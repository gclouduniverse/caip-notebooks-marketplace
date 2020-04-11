import React, {ReactElement} from "react";
import DeploySettings from "../DeploySettings"
import { DeploySettingsState } from "../DeploySettings"
import { DeploymentClient } from "../../common/gcp/DeploymentClient";

const FastAiDeploySettings = React.memo(() => {

    function deploy(state: DeploySettingsState, cb: (isSuccess: boolean) => void) {
        const { selectedProject, selectedZone, selectedRegion, deploymentName } = state;
        if (!selectedProject || !selectedZone || !selectedRegion || !deploymentName) {
            cb(false);
            return;
        }
        const client = new DeploymentClient(
            selectedProject.projectId,
            selectedZone,
            deploymentName,
            selectedRegion.name,
            selectedProject.projectNumber
        );
        client.deploy().then(isSuccess => {
            cb(isSuccess);
        });
    }

    function generateElement(): ReactElement {
        return (
            <div></div>
        )
    }

    return (
        <DeploySettings deploy={deploy} generateElement={generateElement}></DeploySettings>
    )
});

export default FastAiDeploySettings;