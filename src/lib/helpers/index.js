export const _ = {
  isPassiveSupported: () => {
    let passiveSupported = false,
      fn = function() {};

    try {
      const opt = Object.defineProperty({}, "passive", {
        // eslint-disable-next-line getter-return
        get: function() {
          passiveSupported = true;
        }
      });
      window.addEventListener("test", fn, opt);
      window.removeEventListener("test", fn, opt);
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return passiveSupported;
  },
  mapRange: (x, a, b, c, d, withinBounds) => {
    const mappedVal = ((x - a) * (d - c)) / (b - a) + c;
    if (!withinBounds) return mappedVal;
    else if (d > c) return _.constrain(mappedVal, c, d);
    else return _.constrain(mappedVal, d, c);
  },
  constrain: (x, a, b) => Math.max(Math.min(x, b), a),
  addClass: (element, cName) => {
    const splited = cName.split(" ");

    for (let i = 0; i < splited.length; i++) {
      let _className = element.className;
      if (_className.indexOf(splited[i]) > -1) continue;

      _className = _className.trim();
      _className += " " + splited[i];
      element.className = _className;
    }
  },
  removeClass: (element, cName) => {
    const splited = cName.split(" ");

    for (let i = 0; i < splited.length; i++) {
      element.className = element.className.replace(
        new RegExp("(?:^|\\s)" + splited[i] + "(?!\\S)", "g"),
        ""
      );
    }
  },
  attachEvent: (element, event, callback, opt) => {
    if (element.addEventListener)
      element.addEventListener(event, callback, opt);
    else if (element.attachEvent) element.attachEvent("on" + event, callback);
    else element["on" + event] = callback;
  },
  detachEvent: (element, event, callback, opt) => {
    if (element.removeEventListener)
      element.removeEventListener(event, callback, opt);
    else if (element.detachEvent) element.detachEvent("on" + event, callback);
    else delete element["on" + event];
  }
};
export const isSSR = () => typeof window === "undefined";
