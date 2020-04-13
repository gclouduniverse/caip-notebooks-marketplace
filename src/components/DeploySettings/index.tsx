import React, { useEffect, useState, useCallback } from "react";
import "./style.css";
import { Select, Typography, Button, Spin, Icon, Input } from "antd";
import { ProjectsGcpClient, GceRegionsClient } from "../../common/gcp";
import { GoogleCloudProject, GoogleProjectRegion } from "../../common/types";
import { DeploymentClient } from "../../common/gcp/DeploymentClient";
import { FastAiDeploymentClient } from "../../common/gcp/FastAiDeploymentClient";

const { Option } = Select;
const { Paragraph } = Typography;

type Props = {
  getDeploymentName: () => string;
};

enum DeployProgessState {
  NotStarted,
  InProcess,
  Error,
  Success
}

type DeploySettingsState = {
  projects: GoogleCloudProject[] | null;
  regions: GoogleProjectRegion[] | null;
  zones: string[];
  selectedProject: GoogleCloudProject | null;
  selectedRegion: GoogleProjectRegion | null;
  selectedZone: string | null;
  deploymentName: string | null;
  deployProgressState: DeployProgessState;
};

const initialState: DeploySettingsState = {
  projects: [],
  regions: [],
  zones: [],
  selectedProject: null,
  selectedRegion: null,
  selectedZone: null,
  deploymentName: null,
  deployProgressState: DeployProgessState.NotStarted
};

/**
 * Component for notebook deploy settings
 * @todo Break into subcomponents to reduce size
 * @todo Display deployment error message
 */
const DeploySettings = React.memo(({ getDeploymentName }: Props) => {
  const [state, setState] = useState<DeploySettingsState>(initialState);

  useEffect(() => {
    new ProjectsGcpClient()
      .requestProjects()
      .then(projects => setState({ ...state, projects }));
  }, []);

  useEffect(() => {
    if (!state.selectedProject) {
      return;
    }
    new GceRegionsClient(state.selectedProject)
      .requestRegions()
      .then(regions => setState({ ...state, regions }));
  }, [state.selectedProject]);

  useEffect(() => {
    if (!state.selectedRegion) {
      return;
    }
    setState({ ...state, zones: state.selectedRegion.zones });
  }, [state.selectedRegion]);

  const handleOnSelectProject = useCallback(
    projectId => {
      if (!state.projects) {
        return;
      }
      const selectedProject = state.projects.find(
        project => project.projectId === projectId
      );
      if (!selectedProject) {
        return;
      }
      setState({ ...state, selectedProject, regions: [], zones: [] });
    },
    [state]
  );

  const handleOnSelectRegion = useCallback(
    regionId => {
      if (!state.regions) {
        return;
      }
      const selectedRegion = state.regions.find(
        region => region.id === regionId
      );
      if (!selectedRegion) {
        return;
      }
      setState({ ...state, selectedRegion, zones: [] });
    },
    [state]
  );

  const handleOnSelectZone = useCallback(
    zoneName => {
      if (!state.zones) {
        return;
      }
      const selectedZone = state.zones.find(zone => zone === zoneName);
      if (!selectedZone) {
        return;
      }
      setState({ ...state, selectedZone });
    },
    [state]
  );

  const handleOnDeploymentName = useCallback(
    (deploymentNameInput: React.FormEvent<HTMLInputElement>) => {
      const deploymentName: string = deploymentNameInput.currentTarget.value;
      setState({ ...state, deploymentName });
    },
    [state]
  );

  const handleOnDeployClick = useCallback(() => {
    if (
      state.deployProgressState ||
      !state.selectedProject ||
      !state.selectedRegion ||
      !state.selectedZone ||
      !state.deploymentName
    ) {
      return;
    }
    const {
      selectedProject,
      selectedZone,
      selectedRegion,
      deploymentName
    } = state;
    setState({ ...state, deployProgressState: DeployProgessState.InProcess });
    var client: DeploymentClient;
    if (getDeploymentName() == "fastai") {
      client = new FastAiDeploymentClient(
        selectedProject.projectId,
        selectedZone,
        deploymentName,
        selectedRegion.name,
        selectedProject.projectNumber
      );
    } else {
      throw new Error(`deployment name is unknown: ${getDeploymentName()}`);
    }
    client.deploy().then(isSuccess => {
      setState({
        ...state,
        deployProgressState: isSuccess
          ? DeployProgessState.Success
          : DeployProgessState.Error
      });
    });
  }, [state]);

  const { projects, regions, zones } = state;
  const isDeployButtonDisabled =
    !state.selectedProject || !state.selectedRegion || !state.selectedZone;

  return (
    <>
      <div className="deploy-popup">
        <Paragraph strong>Specify deployment name</Paragraph>
        <Input onChange={handleOnDeploymentName}></Input>
        <Paragraph strong>Pick GCP project to deploy the solution</Paragraph>
        <Select
          disabled={state.deployProgressState === DeployProgessState.InProcess}
          className="deploy-popup__select"
          onSelect={handleOnSelectProject}
        >
          {projects &&
            projects.map((project: GoogleCloudProject) => (
              <Option key={project.projectId} value={project.projectId}>
                {project.name}
              </Option>
            ))}
        </Select>
        <Paragraph strong>Pick GCE regions</Paragraph>
        <Select
          disabled={
            !state.selectedProject ||
            state.deployProgressState === DeployProgessState.InProcess
          }
          className="deploy-popup__select"
          onSelect={handleOnSelectRegion}
        >
          {regions &&
            regions.map((region: GoogleProjectRegion) => (
              <Option key={region.id} value={region.id}>
                {region.name}
              </Option>
            ))}
        </Select>
        <Paragraph strong>Pick GCE zone</Paragraph>
        <Select
          disabled={
            !state.selectedRegion ||
            state.deployProgressState === DeployProgessState.InProcess
          }
          className="deploy-popup__select"
          onSelect={handleOnSelectZone}
        >
          {zones &&
            zones.map((zone: string) => (
              <Option key={zone} value={zone}>
                {zone}
              </Option>
            ))}
        </Select>
        {state.deployProgressState === DeployProgessState.Success && (
          <div className="deploy-progress" style={{ background: "#B7EB8F" }}>
            <Icon
              type="check-circle"
              theme="filled"
              style={{ color: "#52C41A" }}
            />
            <div className="deploy-progress__text">Success</div>
          </div>
        )}
        {state.deployProgressState === DeployProgessState.InProcess && (
          <div className="deploy-progress" style={{ background: "#E6F7FF" }}>
            <Spin />
            <div className="deploy-progress__text">Deploy in progress</div>
          </div>
        )}
        {state.deployProgressState === DeployProgessState.Error && (
          <div className="deploy-progress" style={{ background: "#FFF1F0" }}>
            <div>
              <Icon
                type="warning"
                theme="filled"
                style={{ color: "#FAAD14" }}
              />
            </div>
            <div className="deploy-progress__text">Deployment error</div>
          </div>
        )}
      </div>
      <div className="deploy-popup__deploy-btn-container">
        <Button
          type="primary"
          disabled={
            isDeployButtonDisabled ||
            state.deployProgressState === DeployProgessState.InProcess
          }
          onClick={handleOnDeployClick}
        >
          Deploy
        </Button>
      </div>
    </>
  );
});

export default DeploySettings;
