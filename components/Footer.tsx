import { Col, Row } from "antd";
import React from "react";
import styles from "../styles/Home.module.css";
import { LinkWithAnalytics } from "./LinkWithAnalytics";

interface HeaderProps {}

const Footer: React.FC<HeaderProps> = (props) => {
  return (
    <footer className={styles.footer_container}>
      <Row justify='center' align='middle' style={{ padding: "1rem 0" }}>
        <Col span={24}>
          <p className={styles.footer_text}>Reddit Time Machine © 2023</p>
        </Col>
        <Col span={24}>
          <p className={styles.footer_subtitle}>
            Created by{" "}
            <LinkWithAnalytics url='https://www.dannyhines.io' text='Danny Hines' type='external' color='#61dafb' />
          </p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
