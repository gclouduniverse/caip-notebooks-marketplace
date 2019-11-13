import React from "react";
import { Row, Col } from "antd";
import { notebooks } from "./constants";
import NotebookCard from "./NotebookCard";
import { DeployPopupProps } from "../DeployPopup";

import "./style.css";

type Props = {
  setDeployPopupState: (state: DeployPopupProps) => void;
};

/** Card-like view for notebooks */
const NotebooksDeck = ({ setDeployPopupState }: Props) => {
  return (
    <div className="notebooks">
      <Row>
        {notebooks.map(notebook => (
          <Col
            key={notebook.id}
            xs={2}
            sm={4}
            md={6}
            lg={8}
            xl={10}
            className="notebooks__card"
          >
            <NotebookCard
              {...notebook}
              setDeployPopupState={setDeployPopupState}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NotebooksDeck;
