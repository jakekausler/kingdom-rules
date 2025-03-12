import React from "react";
import { TraitsData } from "../../types";

function Traits({ data }: { data: TraitsData }) {
  return (
    <div className="traits">
      <div className="pf-trait pf-trait-edge">&nbsp;</div>
      {data.content.map((item, index) => (
        <React.Fragment key={index}>
          <div className="pf-trait pf-trait-building">
            {item}
          </div>
        </React.Fragment>
      ))}
      <div className="pf-trait pf-trait-edge">&nbsp;</div>
    </div>
  );
}

export default Traits;
