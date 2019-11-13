import React, { useContext } from "react";
import "./style.css";
import { Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { CoreContext } from "../../app";

const Header = () => {
  const { isUserSignedIn } = useContext(CoreContext);

  return (
    <Row className="header" type="flex" justify="space-between">
      <Col span={8}>
        <Link className="header__title" to="/">
          Unofficial Cloud AI Platform Notebooks Marketplace
        </Link>
      </Col>
      <Col span={1}>
        <Button>{isUserSignedIn ? "Sing Out" : "Sign In"}</Button>
      </Col>
    </Row>
  );
};

export default Header;
