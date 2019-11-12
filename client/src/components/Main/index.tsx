import React, { useState } from "react";
import Header from "../Header";
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
  return (
    <>
      <Header />
      <NotebooksDeck setDeployPopupState={setDeployPopupState} />
      {deployPopupState.visible && <DeployPopup />}
    </>
  );
};

export default Main;
