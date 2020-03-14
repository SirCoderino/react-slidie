/* eslint-disable no-unused-vars */
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo
} from "react";
import { withResizeDetector } from "react-resize-detector";
import PropTypes from "prop-types";
import { isSSR, _ } from "../../helpers";
import useEventListener from "../../hooks/useEventListener";
import "../../static/scss/index.scss";

const Slider = ({ children, flow, fullViewItems, ...props }) => {
  const { width: parentWidth } = props;

  const parentRef = useRef(null),
    frameRef = useRef(null),
    itemsRef = useRef([]);

  // the transition value
  const [dx, setDx] = useState(0);

  const [isMounted, setMounted] = useState(false);
  const [areItemsRendered, setItemsRendered] = useState(false);
  const [boundry, setBoundry] = useState({ minDx: 0, maxDx: 0 });
  const [arrowVisibility, setArrowVisibility] = useState({
    left: true,
    right: true
  });

  // the states of the dragging
  const [dragState, setDragState] = useState({
    active: false, // is dragging active or not
    currentX: 0, // the current position
    initialX: 0, // the initial position when the dragging starts
    offsetX: 0 // works as currentX but we use this to calculate the initialX
  });

  // check whether component is mounted or not
  useEffect(() => {
    // component did mount
    setMounted(true);

    // component is about to dismount
    return () => setMounted(false);
  }, []);

  // we only calculate the core logic when this is CSR & the component is mounted
  const isCalcsAllowed = useMemo(() => isMounted && !isSSR(), [isMounted]);

  const setItemRef = useCallback((node, index) => {
    itemsRef.current[index] = node;
  }, []);

  const itemCalcs = useCallback(() => {
    let maximumWidth = 0;

    itemsRef.current.forEach(item => {
      maximumWidth += item.getBoundingClientRect().width;
    });

    setBoundry(b => ({
      ...b,
      maxDx: Math.abs(
        parentRef.current.getBoundingClientRect().width - maximumWidth
      )
    }));
  }, []);

  const dragStarts = useCallback(e => {}, []);
  const dragEnds = useCallback(() => {}, []);
  const dragging = useCallback(e => {}, []);

  const goForward = useCallback(() => {
    let newDx = 0;
    const step = fullViewItems ? parentWidth : 80;
    const sign = flow === "rtl" ? 1 : -1;

    newDx = _.constrain(
      dx + sign * step,
      Math.min(boundry.minDx, sign * boundry.maxDx),
      Math.max(boundry.minDx, sign * boundry.maxDx)
    );

    _.setCssValue(
      frameRef.current,
      "transform",
      `translate3d(${newDx}px, 0, 0)`
    );

    setDragState(s => ({ ...s, currentX: newDx, offsetX: newDx }));
    setDx(newDx);
  }, [dx, boundry, flow, fullViewItems, parentWidth]);

  const goBackward = useCallback(() => {
    let newDx = 0;
    const step = fullViewItems ? parentWidth : 80;
    const sign = flow === "rtl" ? 1 : -1;

    newDx = _.constrain(
      dx - sign * step,
      Math.min(boundry.minDx, sign * boundry.maxDx),
      Math.max(boundry.minDx, sign * boundry.maxDx)
    );

    _.setCssValue(
      frameRef.current,
      "transform",
      `translate3d(${newDx}px, 0, 0)`
    );

    setDragState(s => ({ ...s, currentX: newDx, offsetX: newDx }));
    setDx(newDx);
  }, [dx, boundry, flow, fullViewItems, parentWidth]);

  const goTo = useCallback(index => {}, []);

  // creates the new items when children (SliderItem) changes
  const createItems = useCallback(() => {
    const createdItems = React.Children.map(children, (child, index) => {
      if (child.type.displayName === "Slide") {
        const curProps = child.props;
        const newProps = {
          ref: node => setItemRef(node, index),
          key: `itemKey${index}`
        };

        return React.cloneElement(child, { ...curProps, ...newProps });
      }
    });

    setItemsRendered(false);
    return createdItems;
  }, [children, setItemRef]);

  // memoizes the created items
  const items = useMemo(() => createItems(), [createItems]);

  // renders the memoized items
  // this function will be called on each render
  const renderItems = useCallback(() => {
    if (!areItemsRendered) setItemsRendered(true);
    return items;
  }, [items, areItemsRendered]);

  useEffect(() => {
    if (isCalcsAllowed && areItemsRendered) itemCalcs();
  }, [isCalcsAllowed, areItemsRendered, itemCalcs]);

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
    <div
      ref={parentRef}
      className={`slidie-slider${flow ? ` slidie-slider--${flow}` : ""}`}
    >
      <div className="slidie-slider__wrapper">
        <div
          className={`slidie-slider__arrow-container slidie-slider__arrow-container--right${
            !arrowVisibility.right ? " hide" : ""
          }`}
          onClick={flow === "ltr" ? goForward : goBackward}
        >
          <span className="slidie-slider__right-arrow sonnat-icon sonnat-icon-arrow-right-o"></span>
        </div>
        <div className="slidie-slider__container">
          <div className="slidie-slider__frame" ref={frameRef}>
            {renderItems()}
          </div>
        </div>
        <div
          className={`slidie-slider__arrow-container slidie-slider__arrow-container--left${
            !arrowVisibility.left ? " hide" : ""
          }`}
          onClick={flow === "ltr" ? goBackward : goForward}
        >
          <span className="slidie-slider__left-arrow sonnat-icon sonnat-icon-arrow-left-o"></span>
        </div>
      </div>
    </div>
  );
};

Slider.defaultProps = {
  flow: "ltr",
  fullViewItems: true
};

Slider.propTypes = {
  fullViewItems: PropTypes.bool,
  width: PropTypes.number,
  flow: PropTypes.oneOf(["ltr", "rtl"])
};

export default React.memo(
  withResizeDetector(Slider, {
    handleWidth: true,
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 250
  })
);
