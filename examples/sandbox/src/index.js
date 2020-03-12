import Carousel, { Item } from "lib/index";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

const App = () => {
  return (
    <Carousel>
      <Item>
        <div>
          <h6>Item 1</h6>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            obcaecati nostrum optio consequatur sunt voluptates ut, praesentium
            laborum, minus cumque animi eaque molestias nihil quod libero
            accusantium quasi maiores labore!
          </p>
        </div>
      </Item>
    </Carousel>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
