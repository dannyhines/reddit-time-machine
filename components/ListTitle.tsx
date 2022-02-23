import React from "react";

const ListTitle: React.FC<{}> = (props) => {
  return (
    <div style={{ textAlign: "left" }}>
      <h2 style={{ color: "#8c8c8c" }}>{props.children}</h2>
    </div>
  );
};

export default ListTitle;
