import React from "react";
import { Row, Col } from "antd";
import NotebookCard from "./NotebookCard";
import "./style.css";
import { NotebookProps } from "../../common/types";

type Props = {
  setDeployPopupState: (isVisible: boolean) => void;
  notebooks: NotebookProps[];
};

/** Card-like view for notebooks */
const NotebooksDeck = React.memo(
  ({ setDeployPopupState, notebooks }: Props) => {
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
  },
  (prevProps, nextProps) =>
    prevProps.notebooks.length === nextProps.notebooks.length
);

export default NotebooksDeck;
