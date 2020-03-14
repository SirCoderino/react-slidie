import Slider, { Slide } from "lib/index";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const items = (() => {
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
      <Slider>{items}</Slider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
