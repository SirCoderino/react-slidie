import React from "react";

const Item = React.memo(children => {
  return children;
});

Item.displayName = "CarouselItem";

export default Item;
