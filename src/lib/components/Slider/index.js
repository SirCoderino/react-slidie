import React, { useRef, useMemo, useState } from "react";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import SliderProvider from "../SliderProvider";
import componentName from "../../components.names.json";
import "./index.scss";

const Slider = React.memo(({ children, className, ...props }) => {
  const parentRef = useRef(null);

  // the transition value
  const [dx, setDx] = useState(0);
  const [boundry, setBoundry] = useState({ minDx: 0, maxDx: 0 });
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);

  // the states of the dragging
  const [dragState, setDragState] = useState({
    active: false, // is dragging active or not
    currentX: 0, // the current position
    initialX: 0, // the initial position when the dragging starts
    offsetX: 0 // works as currentX but we use this to calculate the initialX
  });

  // constructing the parent DOM props
  const parentProps = useMemo(() => {
    const _props = { ref: node => (parentRef.current = node) };

    let cName = "slidie-slider";
    if (props.flow) cName += ` slidie-slider--${props.flow}`;
    if (className) cName += ` ${className.trim()}`;
    _props.className = cName;

    return _props;
  }, [className, props.flow]);

  // memoizing children components
  const childrens = useMemo(() => {
    const whitelist = [
      componentName["Slides"],
      componentName["Handle"],
      componentName["Indicators"]
    ];

    return React.Children.map(children, child => {
      if (whitelist.includes(child.type.displayName))
        return React.cloneElement(child, { ...props });
    });
  }, [children, props]);

  return (
    <SliderProvider
      value={{
        dx,
        setDx,
        boundry,
        setBoundry,
        slideIndex,
        setSlideIndex,
        dragState,
        setDragState,
        slidesCount,
        setSlidesCount
      }}
    >
      <div {...parentProps}>{childrens}</div>
    </SliderProvider>
  );
});

Slider.displayName = componentName["Slider"];

Slider.defaultProps = {
  flow: "ltr",
  fullViewSlides: true
};

Slider.propTypes = {
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  className: PropTypes.string,
  flow: PropTypes.oneOf(["ltr", "rtl"])
};

export default withResizeDetector(Slider, {
  handleWidth: true,
  handleHeight: false,
  refreshMode: "debounce",
  refreshRate: 250
});
