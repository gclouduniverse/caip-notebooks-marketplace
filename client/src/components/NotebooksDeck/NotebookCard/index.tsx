import React, { useCallback } from "react";
import { DeployPopupProps } from "../../DeployPopup";
import { Card, Typography, Button } from "antd";

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
    <Card cover={<img alt={title} src={imgSrc} />}>
      <Typography.Title level={3}>{title}</Typography.Title>
      <Typography.Paragraph>{text}</Typography.Paragraph>
      <Typography.Paragraph>
        <Typography.Text strong>Author:</Typography.Text> {author}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Typography.Text strong>Updated:</Typography.Text>{" "}
        {lastUpdateDate.toLocaleDateString()}
      </Typography.Paragraph>
      <Button onClick={handleOnDeployClick} type="primary">Deploy</Button>
    </Card>
  );
};

export default NotebookCard;
