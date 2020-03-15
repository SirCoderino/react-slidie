import React from "react";
import PropTypes from "prop-types";
import { SliderContext } from "../../context";
import componentName from "../../components.names.json";

const SliderProvider = React.memo(({ children, value }) => {
  return (
    <SliderContext.Provider value={value}>{children}</SliderContext.Provider>
  );
});

SliderProvider.displayName = componentName["SliderProvider"];

SliderProvider.propTypes = {
  value: PropTypes.object.isRequired
};

export default SliderProvider;
