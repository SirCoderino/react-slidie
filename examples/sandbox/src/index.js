import Slider, { Slides, Slide, Indicators, Handle } from "lib";
import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const slides = (() => {
  const arr = [];

  for (let i = 0; i < 10; i++)
    arr.push(
      <Slide key={i}>
        {i % 2 === 0 ? (
          <div className="my-dev-item">
            <h6>Item {i}</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
              obcaecati nostrum optio consequatur sunt voluptates ut,
              praesentium laborum, minus cumque animi eaque molestias nihil quod
              libero accusantium quasi maiores labore!
            </p>
          </div>
        ) : (
          <div className="my-dev-item center">
            <h6>Item {i}</h6>
          </div>
        )}
      </Slide>
    );

  return arr;
})();

const App = () => {
  return (
    <div style={{ maxWidth: "700px", margin: "50px auto" }}>
      <Slider
        onChange={useCallback(index => {
          console.log("in onChange callback", index);
        }, [])}
      >
        <Handle role="forward">Go Forward</Handle>
        <Handle role="backward">Go Backward</Handle>
        <Slides>{slides}</Slides>
        <Indicators />
      </Slider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
