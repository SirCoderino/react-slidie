/* eslint-disable no-unused-vars */
import React, { useMemo, useContext } from "react";
import PropTypes from "prop-types";
import { SliderContext } from "../../context";
import componentName from "../../components.names.json";

const Indicators = React.memo(({ className }) => {
  // consuming the SliderContext
  const { slideIndex, slidesCount } = useContext(SliderContext);

  // constructing the DOM props
  const domProps = useMemo(() => {
    const _props = {};

    let cName = "slidie-slider__indicators";
    if (className) cName += ` ${className.trim()}`;
    _props.className = cName;

    return _props;
  }, [className]);

  return <div {...domProps}>indicators</div>;
});

Indicators.displayName = componentName["Indicators"];

Indicators.propTypes = {
  className: PropTypes.string,
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"])
};

export default Indicators;
