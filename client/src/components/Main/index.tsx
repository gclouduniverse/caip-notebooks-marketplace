import React, { useState, useCallback, useContext } from "react";
import { Modal, Button } from "antd";
import NotebooksDeck from "../NotebooksDeck";
import DeployPopup, { DeployPopupProps } from "../DeployPopup";
import { CoreContext, CoreContextProps } from "../../app";
import { notebooks } from "./constants";
import SignIn from "../SignIn";

const initialDeployPopupState: DeployPopupProps = {
  visible: false
};

const WarningSignIn = () => (
  <div>You need to sign in before to be able to deploy</div>
);
const DeployButton = () => <Button type="primary">Deploy</Button>;

/** Main page of marketplace */
const Main = () => {
  const [deployPopupState, setDeployPopupState] = useState<DeployPopupProps>(
    initialDeployPopupState
  );

  const { isUserSignedIn } = useContext<CoreContextProps>(CoreContext);

  const handleCloseModal = useCallback(() => {
    setDeployPopupState(initialDeployPopupState);
  }, []);

  const modalTitle = isUserSignedIn ? "Deploy Settings" : "You need to sign in";
  const modalContent = isUserSignedIn ? <DeployPopup /> : <WarningSignIn />;
  const modalFooter = isUserSignedIn ? <DeployButton /> : <SignIn />;

  return (
    <>
      <NotebooksDeck
        setDeployPopupState={setDeployPopupState}
        notebooks={notebooks}
      />
      <Modal
        title={modalTitle}
        visible={deployPopupState.visible}
        onCancel={handleCloseModal}
        footer={[modalFooter]}
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default Main;
