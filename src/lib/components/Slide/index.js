import React from "react";

const Slide = React.memo(
  React.forwardRef(({ children }, ref) => (
    <div className="slidie-slider__slide" ref={ref}>
      {children}
    </div>
  ))
);

Slide.displayName = "Slide";

export default Slide;
