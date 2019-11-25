import React, { useState, useCallback, useContext } from "react";
import { Modal, Button } from "antd";
import NotebooksDeck from "../NotebooksDeck";
import DeploySettings from "../DeploySettings";
import { CoreContext, CoreContextProps } from "../../app";
import { notebooks } from "./constants";
import SignIn from "../SignIn";
import "./style.css"

const WarningSignIn = () => (
  <div>You need to sign in before to be able to deploy</div>
);
const DeployButton = () => <Button type="primary">Deploy</Button>;

/** Main page of marketplace */
const Main = () => {
  const [isDeploySettingsVisibile, setIsDeploySettingsVisibile] = useState<
    boolean
  >(false);

  const { isUserSignedIn } = useContext<CoreContextProps>(CoreContext);

  const handleCloseModal = useCallback(() => {
    setIsDeploySettingsVisibile(false);
  }, []);

  const modalTitle = isUserSignedIn ? "Deploy Settings" : "You need to sign in";
  const modalContent = isUserSignedIn ? <DeploySettings /> : <WarningSignIn />;

  return (
    <>
      <NotebooksDeck
        setDeploySettingsState={setIsDeploySettingsVisibile}
        notebooks={notebooks}
      />
      <Modal
        title={modalTitle}
        visible={isDeploySettingsVisibile}
        onCancel={handleCloseModal}
        footer={!isUserSignedIn ? [<SignIn />] : []}
        className="main-deploy-modal"
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default Main;
