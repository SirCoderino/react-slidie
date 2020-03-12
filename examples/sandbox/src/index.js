import Carousel, { Item } from "lib/index";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const items = (() => {
  const arr = [];

  for (let i = 0; i < 10; i++)
    arr.push(
      <Item key={i}>
        <div>
          <h6>Item {i}</h6>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            obcaecati nostrum optio consequatur sunt voluptates ut, praesentium
            laborum, minus cumque animi eaque molestias nihil quod libero
            accusantium quasi maiores labore!
          </p>
        </div>
      </Item>
    );

  return arr;
})();

const App = () => {
  return <Carousel>{items}</Carousel>;
};

ReactDOM.render(<App />, document.getElementById("root"));
