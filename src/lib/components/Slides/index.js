import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  useContext
} from "react";
import PropTypes from "prop-types";
import { isSSR, _ } from "../../helpers";
import useEventListener from "../../hooks/useEventListener";
import { SliderContext } from "../../context";
import componentName from "../../components.names.json";

const Slides = React.memo(({ children, className, threshold, ...props }) => {
  const slidesRef = useRef([]),
    frameRef = useRef(null);

  const { width: parentWidth, flow } = props;

  // consuming the SliderContext
  const {
    parentRef,
    dx,
    boundry,
    dragState,
    transition,
    setDx,
    setBoundry,
    setDragState,
    setSlidesCount,
    toggleTransitionOn,
    toggleTransitionOff,
    slideIndex,
    setSlideIndex,
    slidesCount
  } = useContext(SliderContext);

  const [isMounted, setMounted] = useState(false);
  const [areSlidesRendered, setSlidesRendered] = useState(false);

  // check whether component is mounted or not
  useEffect(() => {
    // component did mount
    setMounted(true);

    // component is about to dismount
    return () => setMounted(false);
  }, []);

  // we only calculate the core logic when this is CSR & the component is mounted
  const isCalcsAllowed = useMemo(() => isMounted && !isSSR(), [isMounted]);

  const frameInlineStyle = useMemo(() => {
    const { duration, timingFunction } = transition;

    return {
      WebkitTransition: `-webkit-transform ${duration}ms ${timingFunction}`,
      OTransition: `transform ${duration}ms ${timingFunction}`,
      transition: `transform ${duration}ms ${timingFunction}, -webkit-transform ${duration}ms ${timingFunction}`,
      WebkitTransform: `translate3d(${dx}px, 0, 0)`,
      transform: `translate3d(${dx}px, 0, 0)`
    };
  }, [dx, transition]);

  // constructing the DOM props
  const domProps = useMemo(() => {
    const _props = {};

    let cName = "slidie-slider__slides";
    if (className) cName += ` ${className.trim()}`;
    _props.className = cName;

    return _props;
  }, [className]);

  const setSlideRef = useCallback((node, index) => {
    slidesRef.current[index] = node;
  }, []);

  const slideCalcs = useCallback(() => {
    if (parentWidth) {
      let maximumWidth = 0;

      slidesRef.current.forEach(slide => {
        maximumWidth += slide.getBoundingClientRect().width;
      });

      setBoundry(b => ({
        ...b,
        maxDx: Math.abs(parentWidth - maximumWidth)
      }));
      setSlidesCount(slidesRef.current.length);
    }
  }, [parentWidth, setBoundry, setSlidesCount]);

  // creates the new slides when children (Slide) changes
  const createSlides = useCallback(() => {
    const createdSlides = React.Children.map(children, (child, index) => {
      if (child.type.displayName === "Slide") {
        const curProps = child.props;
        const newProps = {
          ref: node => setSlideRef(node, index),
          key: `itemKey${index}`
        };

        return React.cloneElement(child, { ...curProps, ...newProps });
      }
    });

    setSlidesRendered(false);
    return createdSlides;
  }, [children, setSlideRef]);

  // memoizes the created slides
  const slides = useMemo(() => createSlides(), [createSlides]);

  // renders the memoized slides
  // this function will be called on each render
  const renderSlides = useCallback(() => {
    if (!areSlidesRendered) setSlidesRendered(true);
    return slides;
  }, [slides, areSlidesRendered]);

  useEffect(() => {
    if (isCalcsAllowed && areSlidesRendered) slideCalcs();
  }, [isCalcsAllowed, areSlidesRendered, slideCalcs]);

  // divides the slide[index] into 4 parts based on the threshold
  const getRelativeDividesOfThreshold = useCallback(
    index => {
      const divides = {
        head: parentWidth * index,
        tail: parentWidth * (index + 1)
      };

      if (index >= 0) {
        divides["d0"] = parentWidth * (index + threshold);
        divides["d1"] = parentWidth * (index + (1 - threshold));
      } else return null;

      return divides;
    },
    [threshold, parentWidth]
  );

  // returns the index of the correct slide based on the x value
  const getSlideIndexOfDx = useCallback(
    (x, currentIndex) => {
      const absX = Math.abs(x);
      let index = currentIndex;

      const curSlideDivides = getRelativeDividesOfThreshold(currentIndex);
      const prevSlideDivides = getRelativeDividesOfThreshold(currentIndex - 1);

      if (
        curSlideDivides.head > absX &&
        prevSlideDivides &&
        prevSlideDivides.d1 >= absX
      )
        index = _.constrain(index - 1, 0, slidesCount);
      else if (curSlideDivides.d0 < absX)
        index = _.constrain(index + 1, 0, slidesCount);

      return index;
    },
    [getRelativeDividesOfThreshold, slidesCount]
  );

  const goToSlide = useCallback(
    nextIndex => {
      const currentIndex = slideIndex;
      const deltaIndexes = Math.abs(nextIndex - currentIndex);
      var isAdjacent = deltaIndexes === 1;

      if (!isAdjacent) {
        if (deltaIndexes !== 0) {
          toggleTransitionOff();
          setTimeout(toggleTransitionOn, transition.duration);
        } else toggleTransitionOn();
      } else toggleTransitionOn();

      const sign = flow === "rtl" ? 1 : -1;
      const tVal = nextIndex * parentWidth;
      let newDx = _.constrain(tVal, boundry.minDx, boundry.maxDx);

      newDx = sign * newDx;

      setDx(newDx);
      setDragState(s => ({ ...s, currentX: newDx, offsetX: newDx }));
      setSlideIndex(nextIndex);
    },
    [
      setDx,
      setDragState,
      toggleTransitionOff,
      toggleTransitionOn,
      slideIndex,
      setSlideIndex,
      parentWidth,
      transition,
      flow,
      boundry
    ]
  );

  const dragStarts = useCallback(
    e => {
      let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const parentRect = parentRef.current.getBoundingClientRect();

      clientX = clientX - parentRect.left;

      setDragState(s => ({
        ...s,
        active: true,
        initialX: clientX - s.offsetX
      }));
    },
    [setDragState, parentRef]
  );

  const dragEnds = useCallback(() => {
    if (dragState.active) {
      const currentIndex = slideIndex;
      const newSlideIndex = getSlideIndexOfDx(dragState.currentX, currentIndex);

      setDragState(s => ({ ...s, active: false, initialX: s.currentX }));
      goToSlide(newSlideIndex);
    }
  }, [dragState, setDragState, getSlideIndexOfDx, goToSlide, slideIndex]);

  const dragging = useCallback(
    e => {
      let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      var parentRect = parentRef.current.getBoundingClientRect();
      const sign = flow === "rtl" ? 1 : -1;

      if (dragState.active) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        clientX = clientX - parentRect.left;
        clientX = _.constrain(clientX, 0, parentRect.left + parentRect.width);

        let currentX = clientX - dragState.initialX;

        currentX = _.constrain(
          currentX,
          Math.min(boundry.minDx, sign * boundry.maxDx),
          Math.max(boundry.minDx, sign * boundry.maxDx)
        );

        toggleTransitionOff();
        setDx(currentX);
        setDragState(s => ({ ...s, currentX, offsetX: currentX }));
      }
    },
    [
      boundry,
      dragState,
      setDragState,
      parentRef,
      setDx,
      flow,
      toggleTransitionOff
    ]
  );

  // attaching events using custom hook (useEventListener)
  // when the EventCurrentTarget or the EventListener changes this hook will
  // unbind the previous one and bind the new one.
  // basically on each render this will do the unbind-bind thing.
  useEventListener(
    frameRef.current,
    "touchstart",
    dragStarts,
    _.isPassiveSupported() ? { passive: false } : false
  );
  useEventListener(
    frameRef.current,
    "mousedown",
    dragStarts,
    _.isPassiveSupported() ? { passive: false } : false
  );
  useEventListener(
    document,
    "touchend",
    dragEnds,
    _.isPassiveSupported() ? { passive: false } : false
  );
  useEventListener(
    document,
    "mouseup",
    dragEnds,
    _.isPassiveSupported() ? { passive: false } : false
  );
  useEventListener(
    document,
    "touchmove",
    dragging,
    _.isPassiveSupported() ? { passive: false } : false
  );
  useEventListener(
    document,
    "mousemove",
    dragging,
    _.isPassiveSupported() ? { passive: false } : false
  );

  return (
    <div {...domProps}>
      <div className="slidie-slider__slides-wrapper">
        <div className="slidie-slider__slides-container">
          <div
            className="slidie-slider__slides-frame"
            ref={frameRef}
            style={frameInlineStyle}
          >
            {renderSlides()}
          </div>
        </div>
      </div>
    </div>
  );
});

Slides.displayName = componentName["Slides"];

Slides.propTypes = {
  threshold: PropTypes.number,
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"]),
  className: PropTypes.string
};

export default Slides;
