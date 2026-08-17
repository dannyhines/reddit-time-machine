import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "antd";
import DatePicker from "./DatePicker";
import dayjs, { Dayjs } from "dayjs";
import getRandomDate from "./getRandomDate";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { sendBtnClickToGA } from "../../utils/googleAnalytics";
import styles from "../../styles/Home.module.css";
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from "../../utils/constants";

interface DateSelectionProps {
  showingDate: string;
  handleSubmit: (dateStr: string) => void;
  loading?: boolean;
  onHomePage?: boolean;
}

const DateSelectionView: React.FC<DateSelectionProps> = (props) => {
  const { showingDate, handleSubmit, loading, onHomePage } = props;
  const { isMobile } = useWindowDimensions();
  const [date, setDate] = useState<Dayjs | null>(dayjs(showingDate));
  // this variable makes sure they don't spam the 'Go' or 'Random' btns
  const [justFinished, setJustFinished] = useState(false);

  const submitDate = (date: Dayjs | null) => {
    if (date && !justFinished) {
      // Update the parent date which calls the api
      handleSubmit(date.startOf("day").format("YYYY-MM-DD"));
      setTimeout(() => {
        setJustFinished(false);
      }, 2000);
      setJustFinished(true);
    }
  };

  useEffect(() => {
    if (showingDate) {
      setDate(dayjs(showingDate));
    }
  }, [showingDate]);

  const handleRandom = () => {
    if (!justFinished) {
      const newDate = getRandomDate();
      setDate(newDate);
      submitDate(newDate);
      sendBtnClickToGA("random", newDate.format("YYYY-MM-DD") || "");
    }
  };

  const handleGo = () => {
    sendBtnClickToGA("go", date?.format("YYYY-MM-DD") || "");
    submitDate(date);
  };

  return (
    <Row justify='center'>
      <Col lg={24} md={18}>
        <Card
          bordered={false}
          headStyle={{ borderBottom: 0 }}
          bodyStyle={{ padding: onHomePage ? (isMobile ? "18px 12px" : "20px 24px") : isMobile ? "12px 10px" : 16 }}
          style={{ width: "100%", backgroundColor: "#101214", borderRadius: 18, border: "1px solid #292f33" }}
        >
          {onHomePage ? (
            <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
              <p style={{ marginBottom: 14, color: "rgb(210, 210, 210)", fontSize: 15 }}>
                Choose a date or click <strong>Random</strong> to see the most up-voted news, pictures and memes on a day
                in Reddit history (since 2009)
              </p>
            </div>
          ) : null}
          <Row
            gutter={[8, 8]}
            justify='center'
            align='middle'
          >
            <Col>
              <DatePicker
                value={date}
                format='MM-DD-YYYY'
                onChange={(value) => setDate(value)}
                style={{ width: isMobile ? 130 : "inherit" }}
                aria-label='date selector'
                disabledDate={(date) =>
                  !date || date.isBefore(FIRST_AVAILABLE_DATE) || date.isAfter(LAST_AVAILABLE_DATE)
                }
                disabled={loading}
                className={styles.datepicker_calendar_wrapper}
              />
            </Col>
            <Col>
              <Button
                type='primary'
                htmlType='submit'
                aria-label='Show results for this date'
                title='Show results for this date'
                style={{ paddingLeft: isMobile ? 10 : 16, paddingRight: isMobile ? 10 : 16 }}
                disabled={
                  date === null ||
                  loading ||
                  justFinished ||
                  (date.format("YYYY-MM-DD") === showingDate && !onHomePage) ||
                  date.isBefore(FIRST_AVAILABLE_DATE) ||
                  date.isAfter(LAST_AVAILABLE_DATE)
                }
                onClick={handleGo}
              >
                Go
              </Button>
            </Col>
            <Col>
              <Button
                onClick={handleRandom}
                aria-label='View posts from a random date'
                disabled={justFinished || loading}
                style={{ backgroundColor: "black", padding: "0 12px" }}
              >
                Random
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default DateSelectionView;
