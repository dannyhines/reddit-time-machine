declare global {
  interface Window {
    gtag: any;
  }
}

// log the pageview with their URL
export const pageview = (url: string) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

// log specific events happening.
export const event = ({ action, params }: { action: string; params: any }) => {
  window.gtag("event", action, params);
};

export const sendBtnClickToGA = (btnName: string, dateStr: string) => {
  event({
    action: "btn_click",
    params: {
      event_label: btnName,
      value: dateStr, // 2022-01-01
    },
  });
};

export const sendLinkClickToGA = (type: "reddit" | "external", url: string) => {
  event({
    action: "link_click",
    params: {
      event_label: type, // reddit,external
      value: url,
    },
  });
};
