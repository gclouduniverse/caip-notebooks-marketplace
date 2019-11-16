import React, { useState, useCallback, useContext } from "react";
import { Modal, Button } from "antd";
import NotebooksDeck from "../NotebooksDeck";
import DeployPopup from "../DeployPopup";
import { CoreContext, CoreContextProps } from "../../app";
import { notebooks } from "./constants";
import SignIn from "../SignIn";

const WarningSignIn = () => (
  <div>You need to sign in before to be able to deploy</div>
);
const DeployButton = () => <Button type="primary">Deploy</Button>;

/** Main page of marketplace */
const Main = () => {
  const [isDeployPopupVisibile, setIsDeployPopupVisibile] = useState<boolean>(
    false
  );

  const { isUserSignedIn } = useContext<CoreContextProps>(CoreContext);

  const handleCloseModal = useCallback(() => {
    setIsDeployPopupVisibile(false);
  }, []);

  const modalTitle = isUserSignedIn ? "Deploy Settings" : "You need to sign in";
  const modalContent = isUserSignedIn ? <DeployPopup /> : <WarningSignIn />;
  const modalFooter = isUserSignedIn ? <DeployButton /> : <SignIn />;

  return (
    <>
      <NotebooksDeck
        setDeployPopupState={setIsDeployPopupVisibile}
        notebooks={notebooks}
      />
      <Modal
        title={modalTitle}
        visible={isDeployPopupVisibile}
        onCancel={handleCloseModal}
        footer={[modalFooter]}
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default Main;
