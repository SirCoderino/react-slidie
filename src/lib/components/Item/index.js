import React from "react";

const Item = React.memo(
  React.forwardRef((children, ref) => (
    <div className="snt-carousel__item" ref={ref}>
      {children}
    </div>
  ))
);

Item.displayName = "CarouselItem";

export default Item;
