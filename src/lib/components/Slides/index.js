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

const Slides = React.memo(({ children, className, ...props }) => {
  const slidesRef = useRef([]),
    frameRef = useRef(null);

  const { width: parentWidth } = props;

  // consuming the SliderContext
  const {
    dx,
    setDx,
    boundry,
    setBoundry,
    dragState,
    setDragState,
    setSlidesCount
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
    const translate = `translate3d(${dx}px, 0, 0)`;

    return {
      WebkitTransform: translate,
      MozTransform: translate,
      transform: translate
    };
  }, [dx]);

  // constructing the DOM props
  const domProps = useMemo(() => {
    const _props = {};

    let cName = "slidie-slider__slides";
    if (className) cName += className.trim();
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

  const dragStarts = useCallback(e => {}, []);
  const dragEnds = useCallback(() => {}, []);
  const dragging = useCallback(e => {}, []);

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
  fullViewSlides: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"]),
  className: PropTypes.string
};

export default Slides;
