import { Col, Row } from "antd";
import React from "react";
import styles from "../styles/Home.module.css";

interface HeaderProps {}

const Footer: React.FC<HeaderProps> = (props) => {
  return (
    <footer className={styles.footer_container}>
      <Row justify="center" align="middle" style={{ padding: "1rem 0" }}>
        <Col span={24}>
          <p className={styles.footer_text}>
            Reddit Time Machine © 2022 · Created by Danny Hines
          </p>
        </Col>
        <Col span={24}>
          <p className={styles.footer_subtitle}>
            Data comes from{" "}
            <a
              href="https://pushshift.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              pushshift.io
            </a>
          </p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
