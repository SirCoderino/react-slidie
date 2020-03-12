import { useRef, useEffect } from "react";
import { _ } from "../helpers";

const useEventListener = (element, eventName, handler, opts) => {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = evt => savedHandler.current(evt);
    if (element)
      _.attachEvent(element, eventName, eventListener, opts ? opts : null);

    return () => {
      if (element)
        _.detachEvent(element, eventName, eventListener, opts ? opts : null);
    };
  }, [element, eventName, opts]);
};

export default useEventListener;
