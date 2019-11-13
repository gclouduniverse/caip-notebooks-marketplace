import React from "react";
import "./style.css";
import { Select, Typography } from "antd";
const { Option } = Select;
const { Paragraph } = Typography;

export type DeployPopupProps = {
  visible: boolean;
};

const DeployPopup = () => {
  return (
    <div className="deploy-popup">
      <Paragraph strong>Pick GCP prject to deploy the solution</Paragraph>
      <Select className="deploy-popup__select">
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <Paragraph strong>Pick GCE regions</Paragraph>
      <Select className="deploy-popup__select"></Select>
      <Paragraph strong>Pick GCE zone</Paragraph>
      <Select className="deploy-popup__select"></Select>
    </div>
  );
};

export default DeployPopup;
