import React, { ReactNode } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

interface Props {
  children: ReactNode;
}

const ListTitle: React.FC<Props> = (props) => {
  const { isMobile } = useWindowDimensions();
  return (
    <div style={{ textAlign: "left" }}>
      <h2 style={{ color: "#c8c8c8", fontSize: isMobile ? 14 : 18 }}>{props.children}</h2>
    </div>
  );
};

export default ListTitle;
