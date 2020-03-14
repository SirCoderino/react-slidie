import React, { useMemo, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { _ } from "../../helpers";
import { SliderContext } from "../../context";

const LeftHandle = React.memo(({ children, className, ...props }) => {
  const { width: parentWidth } = props;

  // consuming the SliderContext
  const { dx, setDx, boundry, setDragState } = useContext(SliderContext);

  const clickListener = useCallback(() => {
    let newDx = 0;
    const step = props.fullViewSlides ? parentWidth : 80;
    const sign = props.flow === "rtl" ? 1 : -1;

    if (props.flow === "rtl") {
      // we should go forward
      newDx = dx + sign * step;
    } else if (props.flow === "ltr") {
      // we should go backward
      newDx = dx - sign * step;
    }

    newDx = _.constrain(
      newDx,
      Math.min(boundry.minDx, sign * boundry.maxDx),
      Math.max(boundry.minDx, sign * boundry.maxDx)
    );

    setDragState(s => ({ ...s, currentX: newDx, offsetX: newDx }));
    setDx(newDx);
  }, [
    boundry,
    dx,
    setDx,
    setDragState,
    parentWidth,
    props.flow,
    props.fullViewSlides
  ]);

  // constructing the DOM props
  const domProps = useMemo(() => {
    // memoizing the props
    const _props = {};

    // attaching className
    let cName =
      "slidie-slider__handles__handle slidie-slider__handles__handle--left";
    if (className) cName += className.trim();
    _props.className = cName;

    // attaching eventListener
    _props.onClick = clickListener;

    return _props;
  }, [className, clickListener]);

  return <div {...domProps}>{children}</div>;
});

LeftHandle.displayName = "LeftHandle";

LeftHandle.propTypes = {
  className: PropTypes.string,
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"])
};

export default LeftHandle;
