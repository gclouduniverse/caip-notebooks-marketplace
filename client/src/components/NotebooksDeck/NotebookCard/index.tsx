import React, { useCallback } from "react";
import { DeployPopupProps } from "../../DeployPopup";

type Props = {
  id: string;
  imgSrc: string;
  title: string;
  text: string;
  author: string;
  lastUpdateDate: Date;
  setDeployPopupState: (state: DeployPopupProps) => void;
};

/** Card with info about notebook */
const NotebookCard: React.FC<Props> = (props: Props) => {
  const {
    imgSrc,
    title,
    text,
    author,
    lastUpdateDate,
    setDeployPopupState
  } = props;
  const handleOnDeployClick = useCallback(() => {
    setDeployPopupState({ visible: true });
  }, [setDeployPopupState]);
  return (
    <div className="card">
      <img className="card-img-top" src={imgSrc} alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        <p className="card-text">Author: {author}</p>
        <button className="btn btn-primary" onClick={handleOnDeployClick}>
          Deploy
        </button>
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Updated: {lastUpdateDate.toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default NotebookCard;
