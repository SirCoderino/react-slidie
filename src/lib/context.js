import { createContext } from "react";

export const SliderContext = createContext({
  dx: 0,
  boundry: {},
  slideIndex: 0,
  dragState: {},
  slidesCount: 0,
  setDx: () => {},
  setBoundry: () => {},
  setSlideIndex: () => {},
  setDragState: () => {},
  setSlidesCount: () => {}
});
