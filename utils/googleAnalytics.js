// log the pageview with their URL
export const pageview = (url) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag("event", action, params);
};

export const sendBtnClickToGA = (btnName, dateStr) => {
  event({
    action: "btn_click",
    params: {
      event_label: btnName,
      value: dateStr, // 2022-01-01
    },
  });
};

export const sendLinkClickToGA = (type, url) => {
  event({
    action: "link_click",
    params: {
      event_label: type, // reddit,external
      value: url,
    },
  });
};
