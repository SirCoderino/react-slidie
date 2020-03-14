import React, { useMemo } from "react";
import PropTypes from "prop-types";

const Slide = React.memo(
  React.forwardRef(({ children, className }, ref) => {
    // constructing the DOM props
    const domProps = useMemo(() => {
      const _props = { ref };

      // attaching className
      let cName = "slidie-slider__slides__slide";
      if (className) cName += className.trim();
      _props.className = cName;

      return _props;
    }, [className, ref]);

    return <div {...domProps}>{children}</div>;
  })
);

Slide.displayName = "Slide";

Slide.propTypes = {
  className: PropTypes.string
};

export default Slide;
