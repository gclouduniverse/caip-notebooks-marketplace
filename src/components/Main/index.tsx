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
const [deploySettingDeploymentName, setDeploySettingDeploymentName] = useState<
    string
    >("");

  function setDeploymentState(visible: boolean, deploymentName: string) {
      setIsDeploySettingsVisibile(visible);
      setDeploySettingDeploymentName(deploymentName);
  }

  function getDeploySettingDeploymentName() {
        return deploySettingDeploymentName;
  }

  const { isUserSignedIn } = useContext<CoreContextProps>(CoreContext);

  const handleCloseModal = useCallback(() => {
    setIsDeploySettingsVisibile(false);
  }, []);

  const modalTitle = isUserSignedIn ? "Deploy Settings" : "You need to sign in";
  const modalContent = isUserSignedIn ? <DeploySettings getDeploymentName={getDeploySettingDeploymentName}/> :
      <WarningSignIn />;

  return (
    <>
      <NotebooksDeck
        setDeploySettingsState={setDeploymentState}
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
