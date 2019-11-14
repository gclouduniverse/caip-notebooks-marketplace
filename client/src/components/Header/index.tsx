import React from "react";
import "./style.css";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import SignIn from "../SignIn";

const Header = () => {
  return (
    <Row className="header" type="flex" justify="space-between">
      <Col span={8}>
        <Link className="header__title" to="/">
          Unofficial Cloud AI Platform Notebooks Marketplace
        </Link>
      </Col>
      <Col span={2}>
        <SignIn />
      </Col>
    </Row>
  );
};

export default Header;
