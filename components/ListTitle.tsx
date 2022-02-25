import React from "react";
import useWindowDimensions from "../utils/useWindowDimensions";

const ListTitle: React.FC<{}> = (props) => {
  const { isMobile } = useWindowDimensions();
  return (
    <div style={{ textAlign: "left" }}>
      <h2 style={{ color: "#8c8c8c", fontSize: isMobile ? 18 : 20 }}>{props.children}</h2>
    </div>
  );
};

export default ListTitle;
