import React from "react";
import PropTypes from "prop-types";
import { SliderContext } from "../../context";

const SliderProvider = ({ children, value }) => {
  return (
    <SliderContext.Provider value={value}>{children}</SliderContext.Provider>
  );
};

SliderProvider.propTypes = {
  value: PropTypes.object.isRequired
};

export default SliderProvider;
