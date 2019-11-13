import React, { useContext, useCallback } from "react";
import "./style.css";
import { Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { CoreContext, CoreContextProps } from "../../app";
import { signIn, getSignBtnText } from "./utils";

const Header = () => {
  const { isUserSignedIn, setIsUserSignedIn, isLoading } = useContext<
    CoreContextProps
  >(CoreContext);

  const handleOnSignIn = useCallback(() => {
    if (isUserSignedIn) {
      return;
    }
    signIn(() => {
      setIsUserSignedIn && setIsUserSignedIn(true);
    });
  }, [isUserSignedIn, setIsUserSignedIn]);

  return (
    <Row className="header" type="flex" justify="space-between">
      <Col span={8}>
        <Link className="header__title" to="/">
          Unofficial Cloud AI Platform Notebooks Marketplace
        </Link>
      </Col>
      <Col span={2}>
        <Button loading={isLoading} onClick={handleOnSignIn}>
          {getSignBtnText(isLoading, isUserSignedIn)}
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
