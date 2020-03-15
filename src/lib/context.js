import { createContext } from "react";

export const SliderContext = createContext({
  dx: 0,
  boundry: {},
  slideIndex: 0,
  dragState: {},
  slidesCount: 0,
  transition: {},
  setDx: () => {},
  setBoundry: () => {},
  setSlideIndex: () => {},
  setDragState: () => {},
  setSlidesCount: () => {},
  toggleTransitionOff: () => {},
  toggleTransitionOn: () => {},
  parentRef: { current: undefined }
});
