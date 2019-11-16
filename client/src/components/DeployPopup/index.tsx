import React, { useEffect, useState } from "react";
import "./style.css";
import { Select, Typography } from "antd";
import { ProjectsGcpClient, GceRegionsClient } from "../../common/gcp";
import { GoogleCloudProject, GoogleProjectRegion } from "../../common/types";

const { Option } = Select;
const { Paragraph } = Typography;

type DeployPopupState = {
  projects: GoogleCloudProject[] | null;
  regions: GoogleProjectRegion[] | null;
  zones: string[];
  selectedRegion: string | null;
};

const initialState: DeployPopupState = {
  projects: [],
  regions: [],
  zones: [],
  selectedRegion: null
};

const DeployPopup = React.memo(() => {
  const [state, setState] = useState<DeployPopupState>(initialState);

  useEffect(() => {
    Promise.all([
      new ProjectsGcpClient().requestProjects(),
      new GceRegionsClient().requestRegions()
    ]).then(([projects, regions]) => {
      setState({ ...state, projects, regions });
    });
  }, []);

  const { projects, regions } = state;

  return (
    <div className="deploy-popup">
      <Paragraph strong>Pick GCP project to deploy the solution</Paragraph>
      <Select className="deploy-popup__select">
        {projects &&
          projects.map((project: GoogleCloudProject) => (
            <Option key={project.projectId} value={project.projectId}>{project.name}</Option>
          ))}
      </Select>
      <Paragraph strong>Pick GCE regions</Paragraph>
      <Select className="deploy-popup__select">
      {regions &&
          regions.map((region: GoogleProjectRegion) => (
            <Option key={region.name} value={region.name}>{region.name}</Option>
          ))}
      </Select>
      <Paragraph strong>Pick GCE zone</Paragraph>
      <Select className="deploy-popup__select"></Select>
    </div>
  );
});

export default DeployPopup;
