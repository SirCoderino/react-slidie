import React, { useMemo } from "react";
import PropTypes from "prop-types";
import componentName from "../../components.names.json";

const Slide = React.memo(
  React.forwardRef(({ children, className }, ref) => {
    // constructing the DOM props
    const domProps = useMemo(() => {
      const _props = { ref };

      // attaching className
      let cName = "slidie-slider__slide";
      if (className) cName += ` ${className.trim()}`;
      _props.className = cName;

      return _props;
    }, [className, ref]);

    return <div {...domProps}>{children}</div>;
  })
);

Slide.displayName = componentName["Slide"];

Slide.propTypes = {
  className: PropTypes.string
};

export default Slide;
