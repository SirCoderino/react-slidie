import React, { useMemo } from "react";
import PropTypes from "prop-types";

const Handles = React.memo(({ children, className, ...props }) => {
  // constructing the DOM props
  const domProps = useMemo(() => {
    const _props = {};

    // attaching className
    let cName = "slidie-slider__handles";
    if (className) cName += className.trim();
    _props.className = cName;

    return _props;
  }, [className]);

  const handles = useMemo(() => {
    let right = null,
      left = null;

    React.Children.forEach(children, child => {
      if (child.type.displayName === "RightHandle")
        right = React.cloneElement(child, { ...props });
      else if (child.type.displayName === "LeftHandle")
        left = React.cloneElement(child, { ...props });
    });

    return { right, left };
  }, [children, props]);

  return (
    <div {...domProps}>
      {handles.right}
      {handles.left}
    </div>
  );
});

Handles.displayName = "Handles";

Handles.propTypes = {
  className: PropTypes.string,
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"])
};

export default Handles;
