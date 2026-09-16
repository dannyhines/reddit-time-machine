import { ImageResponse } from "next/og";
import { getReadableDate, SITE_NAME, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from "../../utils/seo";

export const config = { runtime: "edge" };

type CardKind = "home" | "archive" | "month" | "date";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isDate = (value: string | null): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
const isYear = (value: string | null): value is string => Boolean(value && /^20\d{2}$/.test(value));
const isMonth = (value: string | null): value is string => Boolean(value && /^(0[1-9]|1[0-2])$/.test(value));

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
};

const getCardContent = (searchParams: URLSearchParams) => {
  const requestedKind = searchParams.get("kind");
  const kind: CardKind = requestedKind === "date" || requestedKind === "month" || requestedKind === "archive" ? requestedKind : "home";
  const date = searchParams.get("date");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (kind === "date" && isDate(date)) {
    return {
      eyebrow: "Reddit archive",
      title: `Reddit on ${getReadableDate(date)}`,
      description: "Top posts and discussions from this day in internet history.",
      cta: "Explore this date",
    };
  }

  if (kind === "month" && isYear(year) && isMonth(month)) {
    return {
      eyebrow: "Monthly archive",
      title: `Reddit in ${MONTH_NAMES[Number(month) - 1]} ${year}`,
      description: "Browse the front page from every day in this month.",
      cta: "Browse the month",
    };
  }

  if (kind === "archive") {
    return {
      eyebrow: "Reddit archive",
      title: "Browse Reddit history by date",
      description: "Explore every available day from 2009 through 2022.",
      cta: "Browse the archive",
    };
  }

  return {
    eyebrow: SITE_NAME,
    title: "Explore Reddit history by date",
    description: "See the most up-voted news, pictures, and memes from any day in the archive.",
    cta: "Start exploring",
  };
};

export default async function handler(request: Request) {
  const content = getCardContent(new URL(request.url).searchParams);
  const screenshotUrl = new URL("/og.jpg", request.url).toString();
  const screenshotResponse = await fetch(screenshotUrl);
  const screenshot = `data:image/jpeg;base64,${toBase64(await screenshotResponse.arrayBuffer())}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          background: "#f9fafb",
          color: "#111827",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: -105,
            top: -78,
            width: 640,
            height: 780,
            borderRadius: 48,
            background: "#dbeafe",
            opacity: 0.68,
            transform: "rotate(12deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 50,
            top: 64,
            width: 410,
            height: 506,
            overflow: "hidden",
            border: "7px solid #ffffff",
            borderRadius: 26,
            boxShadow: "0 28px 55px rgba(15, 23, 42, 0.28)",
            transform: "rotate(-7deg)",
            background: "#080a0b",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires a normal image element. */}
          <img alt="" src={screenshot} width={410} height={506} style={{ objectFit: "cover", objectPosition: "top" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 555,
            width: 550,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
              padding: "10px 16px",
              border: "1px solid #d1d5db",
              borderRadius: 999,
              color: "#475569",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {content.eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: 56, lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.04em" }}>
            {content.title}
          </div>
          <div style={{ display: "flex", marginTop: 22, color: "#475569", fontSize: 25, lineHeight: 1.35 }}>
            {content.description}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              padding: "15px 21px",
              borderRadius: 14,
              background: "#0f172a",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {content.cta} →
          </div>
        </div>
      </div>
    ),
    { width: SOCIAL_IMAGE_WIDTH, height: SOCIAL_IMAGE_HEIGHT }
  );
}
