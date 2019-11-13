import React, { useState, useCallback } from "react";
import { Modal, Button } from "antd";
import NotebooksDeck from "../NotebooksDeck";
import DeployPopup, { DeployPopupProps } from "../DeployPopup";

const initialDeployPopupState: DeployPopupProps = {
  visible: false
};

/** Main page of marketplace */
const Main = () => {
  const [deployPopupState, setDeployPopupState] = useState<DeployPopupProps>(
    initialDeployPopupState
  );

  const handleCloseModal = useCallback(() => {
    setDeployPopupState(initialDeployPopupState);
  }, []);

  return (
    <>
      <NotebooksDeck setDeployPopupState={setDeployPopupState} />
      <Modal
        title="Deploy Settings"
        visible={deployPopupState.visible}
        onCancel={handleCloseModal}
        footer={[<Button type="primary">Deploy</Button>]}
      >
        <DeployPopup />
      </Modal>
    </>
  );
};

export default Main;
