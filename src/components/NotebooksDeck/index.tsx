import React from "react";
import { Row, Col } from "antd";
import NotebookCard from "./NotebookCard";
import "./style.css";
import { NotebookProps } from "../../common/types";

type Props = {
  setDeploySettingsState: (isVisible: boolean) => void;
  notebooks: NotebookProps[];
};

/** Card-like view for notebooks */
const NotebooksDeck = React.memo(
  ({ setDeploySettingsState, notebooks }: Props) => {
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
                setDeploySettingsState={setDeploySettingsState}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.notebooks.length === nextProps.notebooks.length
);

export default NotebooksDeck;
