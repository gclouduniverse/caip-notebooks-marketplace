import React from "react";
import { notebooks } from "./constants";
import NotebookCard from "./NotebookCard";
import { DeployPopupProps } from "../DeployPopup";

type Props = {
  setDeployPopupState: (state: DeployPopupProps) => void;
};

/** Card-like view for notebooks */
const NotebooksDeck = ({ setDeployPopupState }: Props) => {
  return (
    <div className="card-deck">
      {notebooks.map(notebook => (
        <NotebookCard key={notebook.id} {...notebook} setDeployPopupState={setDeployPopupState} />
      ))}
    </div>
  );
};

export default NotebooksDeck;
