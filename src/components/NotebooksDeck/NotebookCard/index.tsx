import React, { useCallback } from "react";
import { Card, Typography, Button } from "antd";
import { NotebookProps } from "../../../common/types";

type Props = NotebookProps & {
  setDeploySettingsState: (isVisible: boolean, deploymentName: string) => void;
}

/** Card with info about notebook */
const NotebookCard: React.FC<Props> = (props: Props) => {
  const {
    imgSrc,
    title,
    text,
    author,
    lastUpdateDate,
    deploymentCode,
    setDeploySettingsState
  } = props;

  const handleOnDeployClick = useCallback(() => {
    setDeploySettingsState(true, props.deploymentCode);
  }, [setDeploySettingsState]);

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
