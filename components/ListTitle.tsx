import React, { ReactNode } from "react";
import useWindowDimensions from "../utils/useWindowDimensions";

interface Props {
  children: ReactNode;
}

const ListTitle: React.FC<Props> = (props) => {
  const { isMobile } = useWindowDimensions();
  return (
    <div style={{ textAlign: "left" }}>
      <h2 style={{ color: "#8c8c8c", fontSize: isMobile ? 14 : 18 }}>{props.children}</h2>
    </div>
  );
};

export default ListTitle;
