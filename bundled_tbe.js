(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

module.exports = function factory() {
  return {
    version: "1.1.4",
    buildNumber: "2",
    buildDate: ""
  };
}();

},{}],2:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'select'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});
},{"select":10}],3:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});
},{"./clipboard-action":2,"good-listener":7,"tiny-emitter":12}],4:[function(require,module,exports){
var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;

},{}],5:[function(require,module,exports){
var closest = require('./closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"./closest":4}],6:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],7:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":6,"delegate":5}],8:[function(require,module,exports){
/**
 * interact.js v1.2.8
 *
 * Copyright (c) 2012-2015 Taye Adeyemi <dev@taye.me>
 * Open source under the MIT License.
 * https://raw.github.com/taye/interact.js/master/LICENSE
 */
(function (realWindow) {
    'use strict';

    // return early if there's no window to work with (eg. Node.js)
    if (!realWindow) { return; }

    var // get wrapped window if using Shadow DOM polyfill
        window = (function () {
            // create a TextNode
            var el = realWindow.document.createTextNode('');

            // check if it's wrapped by a polyfill
            if (el.ownerDocument !== realWindow.document
                && typeof realWindow.wrap === 'function'
                && realWindow.wrap(el) === el) {
                // return wrapped window
                return realWindow.wrap(realWindow);
            }

            // no Shadow DOM polyfil or native implementation
            return realWindow;
        }()),

        document           = window.document,
        DocumentFragment   = window.DocumentFragment   || blank,
        SVGElement         = window.SVGElement         || blank,
        SVGSVGElement      = window.SVGSVGElement      || blank,
        SVGElementInstance = window.SVGElementInstance || blank,
        HTMLElement        = window.HTMLElement        || window.Element,

        PointerEvent = (window.PointerEvent || window.MSPointerEvent),
        pEventTypes,

        hypot = Math.hypot || function (x, y) { return Math.sqrt(x * x + y * y); },

        tmpXY = {},     // reduce object creation in getXY()

        documents       = [],   // all documents being listened to

        interactables   = [],   // all set interactables
        interactions    = [],   // all interactions

        dynamicDrop     = false,

        // {
        //      type: {
        //          selectors: ['selector', ...],
        //          contexts : [document, ...],
        //          listeners: [[listener, useCapture], ...]
        //      }
        //  }
        delegatedEvents = {},

        defaultOptions = {
            base: {
                accept        : null,
                actionChecker : null,
                styleCursor   : true,
                preventDefault: 'auto',
                origin        : { x: 0, y: 0 },
                deltaSource   : 'page',
                allowFrom     : null,
                ignoreFrom    : null,
                _context      : document,
                dropChecker   : null
            },

            drag: {
                enabled: false,
                manualStart: true,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                axis: 'xy'
            },

            drop: {
                enabled: false,
                accept: null,
                overlap: 'pointer'
            },

            resize: {
                enabled: false,
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: null,
                restrict: null,
                inertia: null,
                autoScroll: null,

                square: false,
                preserveAspectRatio: false,
                axis: 'xy',

                // use default margin
                margin: NaN,

                // object with props left, right, top, bottom which are
                // true/false values to resize when the pointer is over that edge,
                // CSS selectors to match the handles for each direction
                // or the Elements for each handle
                edges: null,

                // a value of 'none' will limit the resize rect to a minimum of 0x0
                // 'negate' will alow the rect to have negative width/height
                // 'reposition' will keep the width/height positive by swapping
                // the top and bottom edges and/or swapping the left and right edges
                invert: 'none'
            },

            gesture: {
                manualStart: false,
                enabled: false,
                max: Infinity,
                maxPerElement: 1,

                restrict: null
            },

            perAction: {
                manualStart: false,
                max: Infinity,
                maxPerElement: 1,

                snap: {
                    enabled     : false,
                    endOnly     : false,
                    range       : Infinity,
                    targets     : null,
                    offsets     : null,

                    relativePoints: null
                },

                restrict: {
                    enabled: false,
                    endOnly: false
                },

                autoScroll: {
                    enabled     : false,
                    container   : null,     // the item that is scrolled (Window or HTMLElement)
                    margin      : 60,
                    speed       : 300       // the scroll speed in pixels per second
                },

                inertia: {
                    enabled          : false,
                    resistance       : 10,    // the lambda in exponential decay
                    minSpeed         : 100,   // target speed must be above this for inertia to start
                    endSpeed         : 10,    // the speed at which inertia is slow enough to stop
                    allowResume      : true,  // allow resuming an action in inertia phase
                    zeroResumeDelta  : true,  // if an action is resumed after launch, set dx/dy to 0
                    smoothEndDuration: 300    // animate to snap/restrict endOnly if there's no inertia
                }
            },

            _holdDuration: 600
        },

        // Things related to autoScroll
        autoScroll = {
            interaction: null,
            i: null,    // the handle returned by window.setInterval
            x: 0, y: 0, // Direction each pulse is to scroll in

            // scroll the window by the values in scroll.x/y
            scroll: function () {
                var options = autoScroll.interaction.target.options[autoScroll.interaction.prepared.name].autoScroll,
                    container = options.container || getWindow(autoScroll.interaction.element),
                    now = new Date().getTime(),
                    // change in time in seconds
                    dtx = (now - autoScroll.prevTimeX) / 1000,
                    dty = (now - autoScroll.prevTimeY) / 1000,
                    vx, vy, sx, sy;

                // displacement
                if (options.velocity) {
                  vx = options.velocity.x;
                  vy = options.velocity.y;
                }
                else {
                  vx = vy = options.speed
                }
 
                sx = vx * dtx;
                sy = vy * dty;

                if (sx >= 1 || sy >= 1) {
                    if (isWindow(container)) {
                        container.scrollBy(autoScroll.x * sx, autoScroll.y * sy);
                    }
                    else if (container) {
                        container.scrollLeft += autoScroll.x * sx;
                        container.scrollTop  += autoScroll.y * sy;
                    }

                    if (sx >=1) autoScroll.prevTimeX = now;
                    if (sy >= 1) autoScroll.prevTimeY = now;
                }

                if (autoScroll.isScrolling) {
                    cancelFrame(autoScroll.i);
                    autoScroll.i = reqFrame(autoScroll.scroll);
                }
            },

            isScrolling: false,
            prevTimeX: 0,
            prevTimeY: 0,

            start: function (interaction) {
                autoScroll.isScrolling = true;
                cancelFrame(autoScroll.i);

                autoScroll.interaction = interaction;
                autoScroll.prevTimeX = new Date().getTime();
                autoScroll.prevTimeY = new Date().getTime();
                autoScroll.i = reqFrame(autoScroll.scroll);
            },

            stop: function () {
                autoScroll.isScrolling = false;
                cancelFrame(autoScroll.i);
            }
        },

        // Does the browser support touch input?
        supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),

        // Does the browser support PointerEvents
        // Avoid PointerEvent bugs introduced in Chrome 55
        supportsPointerEvent = PointerEvent && !/Chrome/.test(navigator.userAgent),

        // Less Precision with touch input
        margin = supportsTouch || supportsPointerEvent? 20: 10,

        pointerMoveTolerance = 1,

        // for ignoring browser's simulated mouse events
        prevTouchTime = 0,

        // Allow this many interactions to happen simultaneously
        maxInteractions = Infinity,

        // Check if is IE9 or older
        actionCursors = (document.all && !window.atob) ? {
            drag    : 'move',
            resizex : 'e-resize',
            resizey : 's-resize',
            resizexy: 'se-resize',

            resizetop        : 'n-resize',
            resizeleft       : 'w-resize',
            resizebottom     : 's-resize',
            resizeright      : 'e-resize',
            resizetopleft    : 'se-resize',
            resizebottomright: 'se-resize',
            resizetopright   : 'ne-resize',
            resizebottomleft : 'ne-resize',

            gesture : ''
        } : {
            drag    : 'move',
            resizex : 'ew-resize',
            resizey : 'ns-resize',
            resizexy: 'nwse-resize',

            resizetop        : 'ns-resize',
            resizeleft       : 'ew-resize',
            resizebottom     : 'ns-resize',
            resizeright      : 'ew-resize',
            resizetopleft    : 'nwse-resize',
            resizebottomright: 'nwse-resize',
            resizetopright   : 'nesw-resize',
            resizebottomleft : 'nesw-resize',

            gesture : ''
        },

        actionIsEnabled = {
            drag   : true,
            resize : true,
            gesture: true
        },

        // because Webkit and Opera still use 'mousewheel' event type
        wheelEvent = 'onmousewheel' in document? 'mousewheel': 'wheel',

        eventTypes = [
            'dragstart',
            'dragmove',
            'draginertiastart',
            'dragend',
            'dragenter',
            'dragleave',
            'dropactivate',
            'dropdeactivate',
            'dropmove',
            'drop',
            'resizestart',
            'resizemove',
            'resizeinertiastart',
            'resizeend',
            'gesturestart',
            'gesturemove',
            'gestureinertiastart',
            'gestureend',

            'down',
            'move',
            'up',
            'cancel',
            'tap',
            'doubletap',
            'hold'
        ],

        globalEvents = {},

        // Opera Mobile must be handled differently
        isOperaMobile = navigator.appName == 'Opera' &&
            supportsTouch &&
            navigator.userAgent.match('Presto'),

        // scrolling doesn't change the result of getClientRects on iOS 7
        isIOS7 = (/iP(hone|od|ad)/.test(navigator.platform)
                         && /OS 7[^\d]/.test(navigator.appVersion)),

        // prefix matchesSelector
        prefixedMatchesSelector = 'matches' in Element.prototype?
                'matches': 'webkitMatchesSelector' in Element.prototype?
                    'webkitMatchesSelector': 'mozMatchesSelector' in Element.prototype?
                        'mozMatchesSelector': 'oMatchesSelector' in Element.prototype?
                            'oMatchesSelector': 'msMatchesSelector',

        // will be polyfill function if browser is IE8
        ie8MatchesSelector,

        // native requestAnimationFrame or polyfill
        reqFrame = realWindow.requestAnimationFrame,
        cancelFrame = realWindow.cancelAnimationFrame,

        // Events wrapper
        events = (function () {
            var useAttachEvent = ('attachEvent' in window) && !('addEventListener' in window),
                addEvent       = useAttachEvent?  'attachEvent': 'addEventListener',
                removeEvent    = useAttachEvent?  'detachEvent': 'removeEventListener',
                on             = useAttachEvent? 'on': '',

                elements          = [],
                targets           = [],
                attachedListeners = [];

            function add (element, type, listener, useCapture) {
                var elementIndex = indexOf(elements, element),
                    target = targets[elementIndex];

                if (!target) {
                    target = {
                        events: {},
                        typeCount: 0
                    };

                    elementIndex = elements.push(element) - 1;
                    targets.push(target);

                    attachedListeners.push((useAttachEvent ? {
                            supplied: [],
                            wrapped : [],
                            useCount: []
                        } : null));
                }

                if (!target.events[type]) {
                    target.events[type] = [];
                    target.typeCount++;
                }

                if (!contains(target.events[type], listener)) {
                    var ret;

                    if (useAttachEvent) {
                        var listeners = attachedListeners[elementIndex],
                            listenerIndex = indexOf(listeners.supplied, listener);

                        var wrapped = listeners.wrapped[listenerIndex] || function (event) {
                            if (!event.immediatePropagationStopped) {
                                event.target = event.srcElement;
                                event.currentTarget = element;

                                event.preventDefault = event.preventDefault || preventDef;
                                event.stopPropagation = event.stopPropagation || stopProp;
                                event.stopImmediatePropagation = event.stopImmediatePropagation || stopImmProp;

                                if (/mouse|click/.test(event.type)) {
                                    event.pageX = event.clientX + getWindow(element).document.documentElement.scrollLeft;
                                    event.pageY = event.clientY + getWindow(element).document.documentElement.scrollTop;
                                }

                                listener(event);
                            }
                        };

                        ret = element[addEvent](on + type, wrapped, Boolean(useCapture));

                        if (listenerIndex === -1) {
                            listeners.supplied.push(listener);
                            listeners.wrapped.push(wrapped);
                            listeners.useCount.push(1);
                        }
                        else {
                            listeners.useCount[listenerIndex]++;
                        }
                    }
                    else {
                        ret = element[addEvent](type, listener, useCapture || false);
                    }
                    target.events[type].push(listener);

                    return ret;
                }
            }

            function remove (element, type, listener, useCapture) {
                var i,
                    elementIndex = indexOf(elements, element),
                    target = targets[elementIndex],
                    listeners,
                    listenerIndex,
                    wrapped = listener;

                if (!target || !target.events) {
                    return;
                }

                if (useAttachEvent) {
                    listeners = attachedListeners[elementIndex];
                    listenerIndex = indexOf(listeners.supplied, listener);
                    wrapped = listeners.wrapped[listenerIndex];
                }

                if (type === 'all') {
                    for (type in target.events) {
                        if (target.events.hasOwnProperty(type)) {
                            remove(element, type, 'all');
                        }
                    }
                    return;
                }

                if (target.events[type]) {
                    var len = target.events[type].length;

                    if (listener === 'all') {
                        for (i = 0; i < len; i++) {
                            remove(element, type, target.events[type][i], Boolean(useCapture));
                        }
                        return;
                    } else {
                        for (i = 0; i < len; i++) {
                            if (target.events[type][i] === listener) {
                                element[removeEvent](on + type, wrapped, useCapture || false);
                                target.events[type].splice(i, 1);

                                if (useAttachEvent && listeners) {
                                    listeners.useCount[listenerIndex]--;
                                    if (listeners.useCount[listenerIndex] === 0) {
                                        listeners.supplied.splice(listenerIndex, 1);
                                        listeners.wrapped.splice(listenerIndex, 1);
                                        listeners.useCount.splice(listenerIndex, 1);
                                    }
                                }

                                break;
                            }
                        }
                    }

                    if (target.events[type] && target.events[type].length === 0) {
                        target.events[type] = null;
                        target.typeCount--;
                    }
                }

                if (!target.typeCount) {
                    targets.splice(elementIndex, 1);
                    elements.splice(elementIndex, 1);
                    attachedListeners.splice(elementIndex, 1);
                }
            }

            function preventDef () {
                this.returnValue = false;
            }

            function stopProp () {
                this.cancelBubble = true;
            }

            function stopImmProp () {
                this.cancelBubble = true;
                this.immediatePropagationStopped = true;
            }

            return {
                add: add,
                remove: remove,
                useAttachEvent: useAttachEvent,

                _elements: elements,
                _targets: targets,
                _attachedListeners: attachedListeners
            };
        }());

    function blank () {}

    function isElement (o) {
        if (!o || (typeof o !== 'object')) { return false; }

        var _window = getWindow(o) || window;

        return (/object|function/.test(typeof _window.Element)
            ? o instanceof _window.Element //DOM2
            : o.nodeType === 1 && typeof o.nodeName === "string");
    }
    function isWindow (thing) { return thing === window || !!(thing && thing.Window) && (thing instanceof thing.Window); }
    function isDocFrag (thing) { return !!thing && thing instanceof DocumentFragment; }
    function isArray (thing) {
        return isObject(thing)
                && (typeof thing.length !== undefined)
                && isFunction(thing.splice);
    }
    function isObject   (thing) { return !!thing && (typeof thing === 'object'); }
    function isFunction (thing) { return typeof thing === 'function'; }
    function isNumber   (thing) { return typeof thing === 'number'  ; }
    function isBool     (thing) { return typeof thing === 'boolean' ; }
    function isString   (thing) { return typeof thing === 'string'  ; }

    function trySelector (value) {
        if (!isString(value)) { return false; }

        // an exception will be raised if it is invalid
        document.querySelector(value);
        return true;
    }

    function extend (dest, source) {
        for (var prop in source) {
            dest[prop] = source[prop];
        }
        return dest;
    }

    var prefixedPropREs = {
      webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/
    };

    function pointerExtend (dest, source) {
        for (var prop in source) {
          var deprecated = false;

          // skip deprecated prefixed properties
          for (var vendor in prefixedPropREs) {
            if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
              deprecated = true;
              break;
            }
          }

          if (!deprecated) {
            dest[prop] = source[prop];
          }
        }
        return dest;
    }

    function copyCoords (dest, src) {
        dest.page = dest.page || {};
        dest.page.x = src.page.x;
        dest.page.y = src.page.y;

        dest.client = dest.client || {};
        dest.client.x = src.client.x;
        dest.client.y = src.client.y;

        dest.timeStamp = src.timeStamp;
    }

    function setEventXY (targetObj, pointers, interaction) {
        var pointer = (pointers.length > 1
                       ? pointerAverage(pointers)
                       : pointers[0]);

        getPageXY(pointer, tmpXY, interaction);
        targetObj.page.x = tmpXY.x;
        targetObj.page.y = tmpXY.y;

        getClientXY(pointer, tmpXY, interaction);
        targetObj.client.x = tmpXY.x;
        targetObj.client.y = tmpXY.y;

        targetObj.timeStamp = new Date().getTime();
    }

    function setEventDeltas (targetObj, prev, cur) {
        targetObj.page.x     = cur.page.x      - prev.page.x;
        targetObj.page.y     = cur.page.y      - prev.page.y;
        targetObj.client.x   = cur.client.x    - prev.client.x;
        targetObj.client.y   = cur.client.y    - prev.client.y;
        targetObj.timeStamp = new Date().getTime() - prev.timeStamp;

        // set pointer velocity
        var dt = Math.max(targetObj.timeStamp / 1000, 0.001);
        targetObj.page.speed   = hypot(targetObj.page.x, targetObj.page.y) / dt;
        targetObj.page.vx      = targetObj.page.x / dt;
        targetObj.page.vy      = targetObj.page.y / dt;

        targetObj.client.speed = hypot(targetObj.client.x, targetObj.page.y) / dt;
        targetObj.client.vx    = targetObj.client.x / dt;
        targetObj.client.vy    = targetObj.client.y / dt;
    }

    function isNativePointer (pointer) {
        return (pointer instanceof window.Event
            || (supportsTouch && window.Touch && pointer instanceof window.Touch));
    }

    // Get specified X/Y coords for mouse or event.touches[0]
    function getXY (type, pointer, xy) {
        xy = xy || {};
        type = type || 'page';

        xy.x = pointer[type + 'X'];
        xy.y = pointer[type + 'Y'];

        return xy;
    }

    function getPageXY (pointer, page) {
        page = page || {};

        // Opera Mobile handles the viewport and scrolling oddly
        if (isOperaMobile && isNativePointer(pointer)) {
            getXY('screen', pointer, page);

            page.x += window.scrollX;
            page.y += window.scrollY;
        }
        else {
            getXY('page', pointer, page);
        }

        return page;
    }

    function getClientXY (pointer, client) {
        client = client || {};

        if (isOperaMobile && isNativePointer(pointer)) {
            // Opera Mobile handles the viewport and scrolling oddly
            getXY('screen', pointer, client);
        }
        else {
          getXY('client', pointer, client);
        }

        return client;
    }

    function getScrollXY (win) {
        win = win || window;
        return {
            x: win.scrollX || win.document.documentElement.scrollLeft,
            y: win.scrollY || win.document.documentElement.scrollTop
        };
    }

    function getPointerId (pointer) {
        return isNumber(pointer.pointerId)? pointer.pointerId : pointer.identifier;
    }

    function getActualElement (element) {
        return (element instanceof SVGElementInstance
            ? element.correspondingUseElement
            : element);
    }

    function getWindow (node) {
        if (isWindow(node)) {
            return node;
        }

        var rootNode = (node.ownerDocument || node);

        return rootNode.defaultView || rootNode.parentWindow || window;
    }

    function getElementClientRect (element) {
        var clientRect = (element instanceof SVGElement
                            ? element.getBoundingClientRect()
                            : element.getClientRects()[0]);

        return clientRect && {
            left  : clientRect.left,
            right : clientRect.right,
            top   : clientRect.top,
            bottom: clientRect.bottom,
            width : clientRect.width || clientRect.right - clientRect.left,
            height: clientRect.height || clientRect.bottom - clientRect.top
        };
    }

    function getElementRect (element) {
        var clientRect = getElementClientRect(element);

        if (!isIOS7 && clientRect) {
            var scroll = getScrollXY(getWindow(element));

            clientRect.left   += scroll.x;
            clientRect.right  += scroll.x;
            clientRect.top    += scroll.y;
            clientRect.bottom += scroll.y;
        }

        return clientRect;
    }

    function getTouchPair (event) {
        var touches = [];

        // array of touches is supplied
        if (isArray(event)) {
            touches[0] = event[0];
            touches[1] = event[1];
        }
        // an event
        else {
            if (event.type === 'touchend') {
                if (event.touches.length === 1) {
                    touches[0] = event.touches[0];
                    touches[1] = event.changedTouches[0];
                }
                else if (event.touches.length === 0) {
                    touches[0] = event.changedTouches[0];
                    touches[1] = event.changedTouches[1];
                }
            }
            else {
                touches[0] = event.touches[0];
                touches[1] = event.touches[1];
            }
        }

        return touches;
    }

    function pointerAverage (pointers) {
        var average = {
            pageX  : 0,
            pageY  : 0,
            clientX: 0,
            clientY: 0,
            screenX: 0,
            screenY: 0
        };
        var prop;

        for (var i = 0; i < pointers.length; i++) {
            for (prop in average) {
                average[prop] += pointers[i][prop];
            }
        }
        for (prop in average) {
            average[prop] /= pointers.length;
        }

        return average;
    }

    function touchBBox (event) {
        if (!event.length && !(event.touches && event.touches.length > 1)) {
            return;
        }

        var touches = getTouchPair(event),
            minX = Math.min(touches[0].pageX, touches[1].pageX),
            minY = Math.min(touches[0].pageY, touches[1].pageY),
            maxX = Math.max(touches[0].pageX, touches[1].pageX),
            maxY = Math.max(touches[0].pageY, touches[1].pageY);

        return {
            x: minX,
            y: minY,
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    function touchDistance (event, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event);


        var dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY];

        return hypot(dx, dy);
    }

    function touchAngle (event, prevAngle, deltaSource) {
        deltaSource = deltaSource || defaultOptions.deltaSource;

        var sourceX = deltaSource + 'X',
            sourceY = deltaSource + 'Y',
            touches = getTouchPair(event),
            dx = touches[0][sourceX] - touches[1][sourceX],
            dy = touches[0][sourceY] - touches[1][sourceY],
            angle = 180 * Math.atan(dy / dx) / Math.PI;

        if (isNumber(prevAngle)) {
            var dr = angle - prevAngle,
                drClamped = dr % 360;

            if (drClamped > 315) {
                angle -= 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped > 135) {
                angle -= 180 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -315) {
                angle += 360 + (angle / 360)|0 * 360;
            }
            else if (drClamped < -135) {
                angle += 180 + (angle / 360)|0 * 360;
            }
        }

        return  angle;
    }

    function getOriginXY (interactable, element) {
        var origin = interactable
                ? interactable.options.origin
                : defaultOptions.origin;

        if (origin === 'parent') {
            origin = parentElement(element);
        }
        else if (origin === 'self') {
            origin = interactable.getRect(element);
        }
        else if (trySelector(origin)) {
            origin = closest(element, origin) || { x: 0, y: 0 };
        }

        if (isFunction(origin)) {
            origin = origin(interactable && element);
        }

        if (isElement(origin))  {
            origin = getElementRect(origin);
        }

        origin.x = ('x' in origin)? origin.x : origin.left;
        origin.y = ('y' in origin)? origin.y : origin.top;

        return origin;
    }

    // http://stackoverflow.com/a/5634528/2280888
    function _getQBezierValue(t, p1, p2, p3) {
        var iT = 1 - t;
        return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
    }

    function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
        return {
            x:  _getQBezierValue(position, startX, cpX, endX),
            y:  _getQBezierValue(position, startY, cpY, endY)
        };
    }

    // http://gizma.com/easing/
    function easeOutQuad (t, b, c, d) {
        t /= d;
        return -c * t*(t-2) + b;
    }

    function nodeContains (parent, child) {
        while (child) {
            if (child === parent) {
                return true;
            }

            child = child.parentNode;
        }

        return false;
    }

    function closest (child, selector) {
        var parent = parentElement(child);

        while (isElement(parent)) {
            if (matchesSelector(parent, selector)) { return parent; }

            parent = parentElement(parent);
        }

        return null;
    }

    function parentElement (node) {
        var parent = node.parentNode;

        if (isDocFrag(parent)) {
            // skip past #shado-root fragments
            while ((parent = parent.host) && isDocFrag(parent)) {}

            return parent;
        }

        return parent;
    }

    function inContext (interactable, element) {
        return interactable._context === element.ownerDocument
                || nodeContains(interactable._context, element);
    }

    function testIgnore (interactable, interactableElement, element) {
        var ignoreFrom = interactable.options.ignoreFrom;

        if (!ignoreFrom || !isElement(element)) { return false; }

        if (isString(ignoreFrom)) {
            return matchesUpTo(element, ignoreFrom, interactableElement);
        }
        else if (isElement(ignoreFrom)) {
            return nodeContains(ignoreFrom, element);
        }

        return false;
    }

    function testAllow (interactable, interactableElement, element) {
        var allowFrom = interactable.options.allowFrom;

        if (!allowFrom) { return true; }

        if (!isElement(element)) { return false; }

        if (isString(allowFrom)) {
            return matchesUpTo(element, allowFrom, interactableElement);
        }
        else if (isElement(allowFrom)) {
            return nodeContains(allowFrom, element);
        }

        return false;
    }

    function checkAxis (axis, interactable) {
        if (!interactable) { return false; }

        var thisAxis = interactable.options.drag.axis;

        return (axis === 'xy' || thisAxis === 'xy' || thisAxis === axis);
    }

    function checkSnap (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return options[action].snap && options[action].snap.enabled;
    }

    function checkRestrict (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].restrict && options[action].restrict.enabled;
    }

    function checkAutoScroll (interactable, action) {
        var options = interactable.options;

        if (/^resize/.test(action)) {
            action = 'resize';
        }

        return  options[action].autoScroll && options[action].autoScroll.enabled;
    }

    function withinInteractionLimit (interactable, element, action) {
        var options = interactable.options,
            maxActions = options[action.name].max,
            maxPerElement = options[action.name].maxPerElement,
            activeInteractions = 0,
            targetCount = 0,
            targetElementCount = 0;

        for (var i = 0, len = interactions.length; i < len; i++) {
            var interaction = interactions[i],
                otherAction = interaction.prepared.name,
                active = interaction.interacting();

            if (!active) { continue; }

            activeInteractions++;

            if (activeInteractions >= maxInteractions) {
                return false;
            }

            if (interaction.target !== interactable) { continue; }

            targetCount += (otherAction === action.name)|0;

            if (targetCount >= maxActions) {
                return false;
            }

            if (interaction.element === element) {
                targetElementCount++;

                if (otherAction !== action.name || targetElementCount >= maxPerElement) {
                    return false;
                }
            }
        }

        return maxInteractions > 0;
    }

    // Test for the element that's "above" all other qualifiers
    function indexOfDeepestElement (elements) {
        var dropzone,
            deepestZone = elements[0],
            index = deepestZone? 0: -1,
            parent,
            deepestZoneParents = [],
            dropzoneParents = [],
            child,
            i,
            n;

        for (i = 1; i < elements.length; i++) {
            dropzone = elements[i];

            // an element might belong to multiple selector dropzones
            if (!dropzone || dropzone === deepestZone) {
                continue;
            }

            if (!deepestZone) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            // check if the deepest or current are document.documentElement or document.rootElement
            // - if the current dropzone is, do nothing and continue
            if (dropzone.parentNode === dropzone.ownerDocument) {
                continue;
            }
            // - if deepest is, update with the current dropzone and continue to next
            else if (deepestZone.parentNode === dropzone.ownerDocument) {
                deepestZone = dropzone;
                index = i;
                continue;
            }

            if (!deepestZoneParents.length) {
                parent = deepestZone;
                while (parent.parentNode && parent.parentNode !== parent.ownerDocument) {
                    deepestZoneParents.unshift(parent);
                    parent = parent.parentNode;
                }
            }

            // if this element is an svg element and the current deepest is
            // an HTMLElement
            if (deepestZone instanceof HTMLElement
                && dropzone instanceof SVGElement
                && !(dropzone instanceof SVGSVGElement)) {

                if (dropzone === deepestZone.parentNode) {
                    continue;
                }

                parent = dropzone.ownerSVGElement;
            }
            else {
                parent = dropzone;
            }

            dropzoneParents = [];

            while (parent.parentNode !== parent.ownerDocument) {
                dropzoneParents.unshift(parent);
                parent = parent.parentNode;
            }

            n = 0;

            // get (position of last common ancestor) + 1
            while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
                n++;
            }

            var parents = [
                dropzoneParents[n - 1],
                dropzoneParents[n],
                deepestZoneParents[n]
            ];

            child = parents[0].lastChild;

            while (child) {
                if (child === parents[1]) {
                    deepestZone = dropzone;
                    index = i;
                    deepestZoneParents = [];

                    break;
                }
                else if (child === parents[2]) {
                    break;
                }

                child = child.previousSibling;
            }
        }

        return index;
    }

    function Interaction () {
        this.target          = null; // current interactable being interacted with
        this.element         = null; // the target element of the interactable
        this.dropTarget      = null; // the dropzone a drag target might be dropped into
        this.dropElement     = null; // the element at the time of checking
        this.prevDropTarget  = null; // the dropzone that was recently dragged away from
        this.prevDropElement = null; // the element at the time of checking

        this.prepared        = {     // action that's ready to be fired on next move event
            name : null,
            axis : null,
            edges: null
        };

        this.matches         = [];   // all selectors that are matched by target element
        this.matchElements   = [];   // corresponding elements

        this.inertiaStatus = {
            active       : false,
            smoothEnd    : false,
            ending       : false,

            startEvent: null,
            upCoords: {},

            xe: 0, ye: 0,
            sx: 0, sy: 0,

            t0: 0,
            vx0: 0, vys: 0,
            duration: 0,

            resumeDx: 0,
            resumeDy: 0,

            lambda_v0: 0,
            one_ve_v0: 0,
            i  : null
        };

        if (isFunction(Function.prototype.bind)) {
            this.boundInertiaFrame = this.inertiaFrame.bind(this);
            this.boundSmoothEndFrame = this.smoothEndFrame.bind(this);
        }
        else {
            var that = this;

            this.boundInertiaFrame = function () { return that.inertiaFrame(); };
            this.boundSmoothEndFrame = function () { return that.smoothEndFrame(); };
        }

        this.activeDrops = {
            dropzones: [],      // the dropzones that are mentioned below
            elements : [],      // elements of dropzones that accept the target draggable
            rects    : []       // the rects of the elements mentioned above
        };

        // keep track of added pointers
        this.pointers    = [];
        this.pointerIds  = [];
        this.downTargets = [];
        this.downTimes   = [];
        this.holdTimers  = [];

        // Previous native pointer move event coordinates
        this.prevCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };
        // current native pointer move event coordinates
        this.curCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Starting InteractEvent pointer coordinates
        this.startCoords = {
            page     : { x: 0, y: 0 },
            client   : { x: 0, y: 0 },
            timeStamp: 0
        };

        // Change in coordinates and time of the pointer
        this.pointerDelta = {
            page     : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            client   : { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
            timeStamp: 0
        };

        this.downEvent   = null;    // pointerdown/mousedown/touchstart event
        this.downPointer = {};

        this._eventTarget    = null;
        this._curEventTarget = null;

        this.prevEvent = null;      // previous action event
        this.tapTime   = 0;         // time of the most recent tap event
        this.prevTap   = null;

        this.startOffset    = { left: 0, right: 0, top: 0, bottom: 0 };
        this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 };
        this.snapOffsets    = [];

        this.gesture = {
            start: { x: 0, y: 0 },

            startDistance: 0,   // distance between two touches of touchStart
            prevDistance : 0,
            distance     : 0,

            scale: 1,           // gesture.distance / gesture.startDistance

            startAngle: 0,      // angle of line joining two touches
            prevAngle : 0       // angle of the previous gesture event
        };

        this.snapStatus = {
            x       : 0, y       : 0,
            dx      : 0, dy      : 0,
            realX   : 0, realY   : 0,
            snappedX: 0, snappedY: 0,
            targets : [],
            locked  : false,
            changed : false
        };

        this.restrictStatus = {
            dx         : 0, dy         : 0,
            restrictedX: 0, restrictedY: 0,
            snap       : null,
            restricted : false,
            changed    : false
        };

        this.restrictStatus.snap = this.snapStatus;

        this.pointerIsDown   = false;
        this.pointerWasMoved = false;
        this.gesturing       = false;
        this.dragging        = false;
        this.resizing        = false;
        this.resizeAxes      = 'xy';

        this.mouse = false;

        interactions.push(this);
    }

    Interaction.prototype = {
        getPageXY  : function (pointer, xy) { return   getPageXY(pointer, xy, this); },
        getClientXY: function (pointer, xy) { return getClientXY(pointer, xy, this); },
        setEventXY : function (target, ptr) { return  setEventXY(target, ptr, this); },

        pointerOver: function (pointer, event, eventTarget) {
            if (this.prepared.name || !this.mouse) { return; }

            var curMatches = [],
                curMatchElements = [],
                prevTargetElement = this.element;

            this.addPointer(pointer);

            if (this.target
                && (testIgnore(this.target, this.element, eventTarget)
                    || !testAllow(this.target, this.element, eventTarget))) {
                // if the eventTarget should be ignored or shouldn't be allowed
                // clear the previous target
                this.target = null;
                this.element = null;
                this.matches = [];
                this.matchElements = [];
            }

            var elementInteractable = interactables.get(eventTarget),
                elementAction = (elementInteractable
                                 && !testIgnore(elementInteractable, eventTarget, eventTarget)
                                 && testAllow(elementInteractable, eventTarget, eventTarget)
                                 && validateAction(
                                     elementInteractable.getAction(pointer, event, this, eventTarget),
                                     elementInteractable));

            if (elementAction && !withinInteractionLimit(elementInteractable, eventTarget, elementAction)) {
                 elementAction = null;
            }

            function pushCurMatches (interactable, selector) {
                if (interactable
                    && inContext(interactable, eventTarget)
                    && !testIgnore(interactable, eventTarget, eventTarget)
                    && testAllow(interactable, eventTarget, eventTarget)
                    && matchesSelector(eventTarget, selector)) {

                    curMatches.push(interactable);
                    curMatchElements.push(eventTarget);
                }
            }

            if (elementAction) {
                this.target = elementInteractable;
                this.element = eventTarget;
                this.matches = [];
                this.matchElements = [];
            }
            else {
                interactables.forEachSelector(pushCurMatches);

                if (this.validateSelector(pointer, event, curMatches, curMatchElements)) {
                    this.matches = curMatches;
                    this.matchElements = curMatchElements;

                    this.pointerHover(pointer, event, this.matches, this.matchElements);
                    events.add(eventTarget,
                                        supportsPointerEvent? pEventTypes.move : 'mousemove',
                                        listeners.pointerHover);
                }
                else if (this.target) {
                    if (nodeContains(prevTargetElement, eventTarget)) {
                        this.pointerHover(pointer, event, this.matches, this.matchElements);
                        events.add(this.element,
                                            supportsPointerEvent? pEventTypes.move : 'mousemove',
                                            listeners.pointerHover);
                    }
                    else {
                        this.target = null;
                        this.element = null;
                        this.matches = [];
                        this.matchElements = [];
                    }
                }
            }
        },

        // Check what action would be performed on pointerMove target if a mouse
        // button were pressed and change the cursor accordingly
        pointerHover: function (pointer, event, eventTarget, curEventTarget, matches, matchElements) {
            var target = this.target;

            if (!this.prepared.name && this.mouse) {

                var action;

                // update pointer coords for defaultActionChecker to use
                this.setEventXY(this.curCoords, [pointer]);

                if (matches) {
                    action = this.validateSelector(pointer, event, matches, matchElements);
                }
                else if (target) {
                    action = validateAction(target.getAction(this.pointers[0], event, this, this.element), this.target);
                }

                if (target && target.options.styleCursor) {
                    if (action) {
                        target._doc.documentElement.style.cursor = getActionCursor(action);
                    }
                    else {
                        target._doc.documentElement.style.cursor = '';
                    }
                }
            }
            else if (this.prepared.name) {
                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        pointerOut: function (pointer, event, eventTarget) {
            if (this.prepared.name) { return; }

            // Remove temporary event listeners for selector Interactables
            if (!interactables.get(eventTarget)) {
                events.remove(eventTarget,
                                       supportsPointerEvent? pEventTypes.move : 'mousemove',
                                       listeners.pointerHover);
            }

            if (this.target && this.target.options.styleCursor && !this.interacting()) {
                this.target._doc.documentElement.style.cursor = '';
            }
        },

        selectorDown: function (pointer, event, eventTarget, curEventTarget) {
            var that = this,
                // copy event to be used in timeout for IE8
                eventCopy = events.useAttachEvent? extend({}, event) : event,
                element = eventTarget,
                pointerIndex = this.addPointer(pointer),
                action;

            this.holdTimers[pointerIndex] = setTimeout(function () {
                that.pointerHold(events.useAttachEvent? eventCopy : pointer, eventCopy, eventTarget, curEventTarget);
            }, defaultOptions._holdDuration);

            this.pointerIsDown = true;

            // Check if the down event hits the current inertia target
            if (this.inertiaStatus.active && this.target.selector) {
                // climb up the DOM tree from the event target
                while (isElement(element)) {

                    // if this element is the current inertia target element
                    if (element === this.element
                        // and the prospective action is the same as the ongoing one
                        && validateAction(this.target.getAction(pointer, event, this, this.element), this.target).name === this.prepared.name) {

                        // stop inertia so that the next move will be a normal one
                        cancelFrame(this.inertiaStatus.i);
                        this.inertiaStatus.active = false;

                        this.collectEventTargets(pointer, event, eventTarget, 'down');
                        return;
                    }
                    element = parentElement(element);
                }
            }

            // do nothing if interacting
            if (this.interacting()) {
                this.collectEventTargets(pointer, event, eventTarget, 'down');
                return;
            }

            function pushMatches (interactable, selector, context) {
                var elements = ie8MatchesSelector
                    ? context.querySelectorAll(selector)
                    : undefined;

                if (inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, elements)) {

                    that.matches.push(interactable);
                    that.matchElements.push(element);
                }
            }

            // update pointer coords for defaultActionChecker to use
            this.setEventXY(this.curCoords, [pointer]);
            this.downEvent = event;

            while (isElement(element) && !action) {
                this.matches = [];
                this.matchElements = [];

                interactables.forEachSelector(pushMatches);

                action = this.validateSelector(pointer, event, this.matches, this.matchElements);
                element = parentElement(element);
            }

            if (action) {
                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.collectEventTargets(pointer, event, eventTarget, 'down');

                return this.pointerDown(pointer, event, eventTarget, curEventTarget, action);
            }
            else {
                // do these now since pointerDown isn't being called from here
                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                pointerExtend(this.downPointer, pointer);

                copyCoords(this.prevCoords, this.curCoords);
                this.pointerWasMoved = false;
            }

            this.collectEventTargets(pointer, event, eventTarget, 'down');
        },

        // Determine action to be performed on next pointerMove and add appropriate
        // style and event Listeners
        pointerDown: function (pointer, event, eventTarget, curEventTarget, forceAction) {
            if (!forceAction && !this.inertiaStatus.active && this.pointerWasMoved && this.prepared.name) {
                this.checkAndPreventDefault(event, this.target, this.element);

                return;
            }

            this.pointerIsDown = true;
            this.downEvent = event;

            var pointerIndex = this.addPointer(pointer),
                action;

            // If it is the second touch of a multi-touch gesture, keep the
            // target the same and get a new action if a target was set by the
            // first touch
            if (this.pointerIds.length > 1 && this.target._element === this.element) {
                var newAction = validateAction(forceAction || this.target.getAction(pointer, event, this, this.element), this.target);

                if (withinInteractionLimit(this.target, this.element, newAction)) {
                    action = newAction;
                }

                this.prepared.name = null;
            }
            // Otherwise, set the target if there is no action prepared
            else if (!this.prepared.name) {
                var interactable = interactables.get(curEventTarget);

                if (interactable
                    && !testIgnore(interactable, curEventTarget, eventTarget)
                    && testAllow(interactable, curEventTarget, eventTarget)
                    && (action = validateAction(forceAction || interactable.getAction(pointer, event, this, curEventTarget), interactable, eventTarget))
                    && withinInteractionLimit(interactable, curEventTarget, action)) {
                    this.target = interactable;
                    this.element = curEventTarget;
                }
            }

            var target = this.target,
                options = target && target.options;

            if (target && (forceAction || !this.prepared.name)) {
                action = action || validateAction(forceAction || target.getAction(pointer, event, this, curEventTarget), target, this.element);

                this.setEventXY(this.startCoords, this.pointers);

                if (!action) { return; }

                if (options.styleCursor) {
                    target._doc.documentElement.style.cursor = getActionCursor(action);
                }

                this.resizeAxes = action.name === 'resize'? action.axis : null;

                if (action === 'gesture' && this.pointerIds.length < 2) {
                    action = null;
                }

                this.prepared.name  = action.name;
                this.prepared.axis  = action.axis;
                this.prepared.edges = action.edges;

                this.snapStatus.snappedX = this.snapStatus.snappedY =
                    this.restrictStatus.restrictedX = this.restrictStatus.restrictedY = NaN;

                this.downTimes[pointerIndex] = new Date().getTime();
                this.downTargets[pointerIndex] = eventTarget;
                pointerExtend(this.downPointer, pointer);

                copyCoords(this.prevCoords, this.startCoords);
                this.pointerWasMoved = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
            // if inertia is active try to resume action
            else if (this.inertiaStatus.active
                && curEventTarget === this.element
                && validateAction(target.getAction(pointer, event, this, this.element), target).name === this.prepared.name) {

                cancelFrame(this.inertiaStatus.i);
                this.inertiaStatus.active = false;

                this.checkAndPreventDefault(event, target, this.element);
            }
        },

        setModifications: function (coords, preEnd) {
            var target         = this.target,
                shouldMove     = true,
                shouldSnap     = checkSnap(target, this.prepared.name)     && (!target.options[this.prepared.name].snap.endOnly     || preEnd),
                shouldRestrict = checkRestrict(target, this.prepared.name) && (!target.options[this.prepared.name].restrict.endOnly || preEnd);

            if (shouldSnap    ) { this.setSnapping   (coords); } else { this.snapStatus    .locked     = false; }
            if (shouldRestrict) { this.setRestriction(coords); } else { this.restrictStatus.restricted = false; }

            if (shouldSnap && this.snapStatus.locked && !this.snapStatus.changed) {
                shouldMove = shouldRestrict && this.restrictStatus.restricted && this.restrictStatus.changed;
            }
            else if (shouldRestrict && this.restrictStatus.restricted && !this.restrictStatus.changed) {
                shouldMove = false;
            }

            return shouldMove;
        },

        setStartOffsets: function (action, interactable, element) {
            var rect = interactable.getRect(element),
                origin = getOriginXY(interactable, element),
                snap = interactable.options[this.prepared.name].snap,
                restrict = interactable.options[this.prepared.name].restrict,
                width, height;

            if (rect) {
                this.startOffset.left = this.startCoords.page.x - rect.left;
                this.startOffset.top  = this.startCoords.page.y - rect.top;

                this.startOffset.right  = rect.right  - this.startCoords.page.x;
                this.startOffset.bottom = rect.bottom - this.startCoords.page.y;

                if ('width' in rect) { width = rect.width; }
                else { width = rect.right - rect.left; }
                if ('height' in rect) { height = rect.height; }
                else { height = rect.bottom - rect.top; }
            }
            else {
                this.startOffset.left = this.startOffset.top = this.startOffset.right = this.startOffset.bottom = 0;
            }

            this.snapOffsets.splice(0);

            var snapOffset = snap && snap.offset === 'startCoords'
                                ? {
                                    x: this.startCoords.page.x - origin.x,
                                    y: this.startCoords.page.y - origin.y
                                }
                                : snap && snap.offset || { x: 0, y: 0 };

            if (rect && snap && snap.relativePoints && snap.relativePoints.length) {
                for (var i = 0; i < snap.relativePoints.length; i++) {
                    this.snapOffsets.push({
                        x: this.startOffset.left - (width  * snap.relativePoints[i].x) + snapOffset.x,
                        y: this.startOffset.top  - (height * snap.relativePoints[i].y) + snapOffset.y
                    });
                }
            }
            else {
                this.snapOffsets.push(snapOffset);
            }

            if (rect && restrict.elementRect) {
                this.restrictOffset.left = this.startOffset.left - (width  * restrict.elementRect.left);
                this.restrictOffset.top  = this.startOffset.top  - (height * restrict.elementRect.top);

                this.restrictOffset.right  = this.startOffset.right  - (width  * (1 - restrict.elementRect.right));
                this.restrictOffset.bottom = this.startOffset.bottom - (height * (1 - restrict.elementRect.bottom));
            }
            else {
                this.restrictOffset.left = this.restrictOffset.top = this.restrictOffset.right = this.restrictOffset.bottom = 0;
            }
        },

        /*\
         * Interaction.start
         [ method ]
         *
         * Start an action with the given Interactable and Element as tartgets. The
         * action must be enabled for the target Interactable and an appropriate number
         * of pointers must be held down – 1 for drag/resize, 2 for gesture.
         *
         * Use it with `interactable.<action>able({ manualStart: false })` to always
         * [start actions manually](https://github.com/taye/interact.js/issues/114)
         *
         - action       (object)  The action to be performed - drag, resize, etc.
         - interactable (Interactable) The Interactable to target
         - element      (Element) The DOM Element to target
         = (object) interact
         **
         | interact(target)
         |   .draggable({
         |     // disable the default drag start by down->move
         |     manualStart: true
         |   })
         |   // start dragging after the user holds the pointer down
         |   .on('hold', function (event) {
         |     var interaction = event.interaction;
         |
         |     if (!interaction.interacting()) {
         |       interaction.start({ name: 'drag' },
         |                         event.interactable,
         |                         event.currentTarget);
         |     }
         | });
        \*/
        start: function (action, interactable, element) {
            if (this.interacting()
                || !this.pointerIsDown
                || this.pointerIds.length < (action.name === 'gesture'? 2 : 1)) {
                return;
            }

            // if this interaction had been removed after stopping
            // add it back
            if (indexOf(interactions, this) === -1) {
                interactions.push(this);
            }

            // set the startCoords if there was no prepared action
            if (!this.prepared.name) {
                this.setEventXY(this.startCoords, this.pointers);
            }

            this.prepared.name  = action.name;
            this.prepared.axis  = action.axis;
            this.prepared.edges = action.edges;
            this.target         = interactable;
            this.element        = element;

            this.setStartOffsets(action.name, interactable, element);
            this.setModifications(this.startCoords.page);

            this.prevEvent = this[this.prepared.name + 'Start'](this.downEvent);
        },

        pointerMove: function (pointer, event, eventTarget, curEventTarget, preEnd) {
            if (this.inertiaStatus.active) {
                var pageUp   = this.inertiaStatus.upCoords.page;
                var clientUp = this.inertiaStatus.upCoords.client;

                var inertiaPosition = {
                    pageX  : pageUp.x   + this.inertiaStatus.sx,
                    pageY  : pageUp.y   + this.inertiaStatus.sy,
                    clientX: clientUp.x + this.inertiaStatus.sx,
                    clientY: clientUp.y + this.inertiaStatus.sy
                };

                this.setEventXY(this.curCoords, [inertiaPosition]);
            }
            else {
                this.recordPointer(pointer);
                this.setEventXY(this.curCoords, this.pointers);
            }

            var duplicateMove = (this.curCoords.page.x === this.prevCoords.page.x
                                 && this.curCoords.page.y === this.prevCoords.page.y
                                 && this.curCoords.client.x === this.prevCoords.client.x
                                 && this.curCoords.client.y === this.prevCoords.client.y);

            var dx, dy,
                pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // register movement greater than pointerMoveTolerance
            if (this.pointerIsDown && !this.pointerWasMoved) {
                dx = this.curCoords.client.x - this.startCoords.client.x;
                dy = this.curCoords.client.y - this.startCoords.client.y;

                this.pointerWasMoved = hypot(dx, dy) > pointerMoveTolerance;
            }

            if (!duplicateMove && (!this.pointerIsDown || this.pointerWasMoved)) {
                if (this.pointerIsDown) {
                    clearTimeout(this.holdTimers[pointerIndex]);
                }

                this.collectEventTargets(pointer, event, eventTarget, 'move');
            }

            if (!this.pointerIsDown) { return; }

            if (duplicateMove && this.pointerWasMoved && !preEnd) {
                this.checkAndPreventDefault(event, this.target, this.element);
                return;
            }

            // set pointer coordinate, time changes and speeds
            setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

            if (!this.prepared.name) { return; }

            if (this.pointerWasMoved
                // ignore movement while inertia is active
                && (!this.inertiaStatus.active || (pointer instanceof InteractEvent && /inertiastart/.test(pointer.type)))) {

                // if just starting an action, calculate the pointer speed now
                if (!this.interacting()) {
                    setEventDeltas(this.pointerDelta, this.prevCoords, this.curCoords);

                    // check if a drag is in the correct axis
                    if (this.prepared.name === 'drag') {
                        var absX = Math.abs(dx),
                            absY = Math.abs(dy),
                            targetAxis = this.target.options.drag.axis,
                            axis = (absX > absY ? 'x' : absX < absY ? 'y' : 'xy');

                        // if the movement isn't in the axis of the interactable
                        if (axis !== 'xy' && targetAxis !== 'xy' && targetAxis !== axis) {
                            // cancel the prepared action
                            this.prepared.name = null;

                            // then try to get a drag from another ineractable

                            var element = eventTarget;

                            // check element interactables
                            while (isElement(element)) {
                                var elementInteractable = interactables.get(element);

                                if (elementInteractable
                                    && elementInteractable !== this.target
                                    && !elementInteractable.options.drag.manualStart
                                    && elementInteractable.getAction(this.downPointer, this.downEvent, this, element).name === 'drag'
                                    && checkAxis(axis, elementInteractable)) {

                                    this.prepared.name = 'drag';
                                    this.target = elementInteractable;
                                    this.element = element;
                                    break;
                                }

                                element = parentElement(element);
                            }

                            // if there's no drag from element interactables,
                            // check the selector interactables
                            if (!this.prepared.name) {
                                var thisInteraction = this;

                                var getDraggable = function (interactable, selector, context) {
                                    var elements = ie8MatchesSelector
                                        ? context.querySelectorAll(selector)
                                        : undefined;

                                    if (interactable === thisInteraction.target) { return; }

                                    if (inContext(interactable, eventTarget)
                                        && !interactable.options.drag.manualStart
                                        && !testIgnore(interactable, element, eventTarget)
                                        && testAllow(interactable, element, eventTarget)
                                        && matchesSelector(element, selector, elements)
                                        && interactable.getAction(thisInteraction.downPointer, thisInteraction.downEvent, thisInteraction, element).name === 'drag'
                                        && checkAxis(axis, interactable)
                                        && withinInteractionLimit(interactable, element, 'drag')) {

                                        return interactable;
                                    }
                                };

                                element = eventTarget;

                                while (isElement(element)) {
                                    var selectorInteractable = interactables.forEachSelector(getDraggable);

                                    if (selectorInteractable) {
                                        this.prepared.name = 'drag';
                                        this.target = selectorInteractable;
                                        this.element = element;
                                        break;
                                    }

                                    element = parentElement(element);
                                }
                            }
                        }
                    }
                }

                var starting = !!this.prepared.name && !this.interacting();

                if (starting
                    && (this.target.options[this.prepared.name].manualStart
                        || !withinInteractionLimit(this.target, this.element, this.prepared))) {
                    this.stop(event);
                    return;
                }

                if (this.prepared.name && this.target) {
                    if (starting) {
                        this.start(this.prepared, this.target, this.element);
                    }

                    var shouldMove = this.setModifications(this.curCoords.page, preEnd);

                    // move if snapping or restriction doesn't prevent it
                    if (shouldMove || starting) {
                        this.prevEvent = this[this.prepared.name + 'Move'](event);
                    }

                    this.checkAndPreventDefault(event, this.target, this.element);
                }
            }

            copyCoords(this.prevCoords, this.curCoords);

            if (this.dragging || this.resizing) {
                this.autoScrollMove(pointer);
            }
        },

        dragStart: function (event) {
            var dragEvent = new InteractEvent(this, event, 'drag', 'start', this.element);

            this.dragging = true;
            this.target.fire(dragEvent);

            // reset active dropzones
            this.activeDrops.dropzones = [];
            this.activeDrops.elements  = [];
            this.activeDrops.rects     = [];

            if (!this.dynamicDrop) {
                this.setActiveDrops(this.element);
            }

            var dropEvents = this.getDropEvents(event, dragEvent);

            if (dropEvents.activate) {
                this.fireActiveDrops(dropEvents.activate);
            }

            return dragEvent;
        },

        dragMove: function (event) {
            var target = this.target,
                dragEvent  = new InteractEvent(this, event, 'drag', 'move', this.element),
                draggableElement = this.element,
                drop = this.getDrop(dragEvent, event, draggableElement);

            this.dropTarget = drop.dropzone;
            this.dropElement = drop.element;

            var dropEvents = this.getDropEvents(event, dragEvent);

            target.fire(dragEvent);

            if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
            if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
            if (dropEvents.move ) {     this.dropTarget.fire(dropEvents.move ); }

            this.prevDropTarget  = this.dropTarget;
            this.prevDropElement = this.dropElement;

            return dragEvent;
        },

        resizeStart: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'start', this.element);

            if (this.prepared.edges) {
                var startRect = this.target.getRect(this.element);

                /*
                 * When using the `resizable.square` or `resizable.preserveAspectRatio` options, resizing from one edge
                 * will affect another. E.g. with `resizable.square`, resizing to make the right edge larger will make
                 * the bottom edge larger by the same amount. We call these 'linked' edges. Any linked edges will depend
                 * on the active edges and the edge being interacted with.
                 */
                if (this.target.options.resize.square || this.target.options.resize.preserveAspectRatio) {
                    var linkedEdges = extend({}, this.prepared.edges);

                    linkedEdges.top    = linkedEdges.top    || (linkedEdges.left   && !linkedEdges.bottom);
                    linkedEdges.left   = linkedEdges.left   || (linkedEdges.top    && !linkedEdges.right );
                    linkedEdges.bottom = linkedEdges.bottom || (linkedEdges.right  && !linkedEdges.top   );
                    linkedEdges.right  = linkedEdges.right  || (linkedEdges.bottom && !linkedEdges.left  );

                    this.prepared._linkedEdges = linkedEdges;
                }
                else {
                    this.prepared._linkedEdges = null;
                }

                // if using `resizable.preserveAspectRatio` option, record aspect ratio at the start of the resize
                if (this.target.options.resize.preserveAspectRatio) {
                    this.resizeStartAspectRatio = startRect.width / startRect.height;
                }

                this.resizeRects = {
                    start     : startRect,
                    current   : extend({}, startRect),
                    restricted: extend({}, startRect),
                    previous  : extend({}, startRect),
                    delta     : {
                        left: 0, right : 0, width : 0,
                        top : 0, bottom: 0, height: 0
                    }
                };

                resizeEvent.rect = this.resizeRects.restricted;
                resizeEvent.deltaRect = this.resizeRects.delta;
            }

            this.target.fire(resizeEvent);

            this.resizing = true;

            return resizeEvent;
        },

        resizeMove: function (event) {
            var resizeEvent = new InteractEvent(this, event, 'resize', 'move', this.element);

            var edges = this.prepared.edges,
                invert = this.target.options.resize.invert,
                invertible = invert === 'reposition' || invert === 'negate';

            if (edges) {
                var dx = resizeEvent.dx,
                    dy = resizeEvent.dy,

                    start      = this.resizeRects.start,
                    current    = this.resizeRects.current,
                    restricted = this.resizeRects.restricted,
                    delta      = this.resizeRects.delta,
                    previous   = extend(this.resizeRects.previous, restricted),

                    originalEdges = edges;

                // `resize.preserveAspectRatio` takes precedence over `resize.square`
                if (this.target.options.resize.preserveAspectRatio) {
                    var resizeStartAspectRatio = this.resizeStartAspectRatio;

                    edges = this.prepared._linkedEdges;

                    if ((originalEdges.left && originalEdges.bottom)
                        || (originalEdges.right && originalEdges.top)) {
                        dy = -dx / resizeStartAspectRatio;
                    }
                    else if (originalEdges.left || originalEdges.right) { dy = dx / resizeStartAspectRatio; }
                    else if (originalEdges.top || originalEdges.bottom) { dx = dy * resizeStartAspectRatio; }
                }
                else if (this.target.options.resize.square) {
                    edges = this.prepared._linkedEdges;

                    if ((originalEdges.left && originalEdges.bottom)
                        || (originalEdges.right && originalEdges.top)) {
                        dy = -dx;
                    }
                    else if (originalEdges.left || originalEdges.right) { dy = dx; }
                    else if (originalEdges.top || originalEdges.bottom) { dx = dy; }
                }

                // update the 'current' rect without modifications
                if (edges.top   ) { current.top    += dy; }
                if (edges.bottom) { current.bottom += dy; }
                if (edges.left  ) { current.left   += dx; }
                if (edges.right ) { current.right  += dx; }

                if (invertible) {
                    // if invertible, copy the current rect
                    extend(restricted, current);

                    if (invert === 'reposition') {
                        // swap edge values if necessary to keep width/height positive
                        var swap;

                        if (restricted.top > restricted.bottom) {
                            swap = restricted.top;

                            restricted.top = restricted.bottom;
                            restricted.bottom = swap;
                        }
                        if (restricted.left > restricted.right) {
                            swap = restricted.left;

                            restricted.left = restricted.right;
                            restricted.right = swap;
                        }
                    }
                }
                else {
                    // if not invertible, restrict to minimum of 0x0 rect
                    restricted.top    = Math.min(current.top, start.bottom);
                    restricted.bottom = Math.max(current.bottom, start.top);
                    restricted.left   = Math.min(current.left, start.right);
                    restricted.right  = Math.max(current.right, start.left);
                }

                restricted.width  = restricted.right  - restricted.left;
                restricted.height = restricted.bottom - restricted.top ;

                for (var edge in restricted) {
                    delta[edge] = restricted[edge] - previous[edge];
                }

                resizeEvent.edges = this.prepared.edges;
                resizeEvent.rect = restricted;
                resizeEvent.deltaRect = delta;
            }

            this.target.fire(resizeEvent);

            return resizeEvent;
        },

        gestureStart: function (event) {
            var gestureEvent = new InteractEvent(this, event, 'gesture', 'start', this.element);

            gestureEvent.ds = 0;

            this.gesture.startDistance = this.gesture.prevDistance = gestureEvent.distance;
            this.gesture.startAngle = this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.scale = 1;

            this.gesturing = true;

            this.target.fire(gestureEvent);

            return gestureEvent;
        },

        gestureMove: function (event) {
            if (!this.pointerIds.length) {
                return this.prevEvent;
            }

            var gestureEvent;

            gestureEvent = new InteractEvent(this, event, 'gesture', 'move', this.element);
            gestureEvent.ds = gestureEvent.scale - this.gesture.scale;

            this.target.fire(gestureEvent);

            this.gesture.prevAngle = gestureEvent.angle;
            this.gesture.prevDistance = gestureEvent.distance;

            if (gestureEvent.scale !== Infinity &&
                gestureEvent.scale !== null &&
                gestureEvent.scale !== undefined  &&
                !isNaN(gestureEvent.scale)) {

                this.gesture.scale = gestureEvent.scale;
            }

            return gestureEvent;
        },

        pointerHold: function (pointer, event, eventTarget) {
            this.collectEventTargets(pointer, event, eventTarget, 'hold');
        },

        pointerUp: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'up' );
            this.collectEventTargets(pointer, event, eventTarget, 'tap');

            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        pointerCancel: function (pointer, event, eventTarget, curEventTarget) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            clearTimeout(this.holdTimers[pointerIndex]);

            this.collectEventTargets(pointer, event, eventTarget, 'cancel');
            this.pointerEnd(pointer, event, eventTarget, curEventTarget);

            this.removePointer(pointer);
        },

        // http://www.quirksmode.org/dom/events/click.html
        // >Events leading to dblclick
        //
        // IE8 doesn't fire down event before dblclick.
        // This workaround tries to fire a tap and doubletap after dblclick
        ie8Dblclick: function (pointer, event, eventTarget) {
            if (this.prevTap
                && event.clientX === this.prevTap.clientX
                && event.clientY === this.prevTap.clientY
                && eventTarget   === this.prevTap.target) {

                this.downTargets[0] = eventTarget;
                this.downTimes[0] = new Date().getTime();
                this.collectEventTargets(pointer, event, eventTarget, 'tap');
            }
        },

        // End interact move events and stop auto-scroll unless inertia is enabled
        pointerEnd: function (pointer, event, eventTarget, curEventTarget) {
            var endEvent,
                target = this.target,
                options = target && target.options,
                inertiaOptions = options && this.prepared.name && options[this.prepared.name].inertia,
                inertiaStatus = this.inertiaStatus;

            if (this.interacting()) {

                if (inertiaStatus.active && !inertiaStatus.ending) { return; }

                var pointerSpeed,
                    now = new Date().getTime(),
                    inertiaPossible = false,
                    inertia = false,
                    smoothEnd = false,
                    endSnap = checkSnap(target, this.prepared.name) && options[this.prepared.name].snap.endOnly,
                    endRestrict = checkRestrict(target, this.prepared.name) && options[this.prepared.name].restrict.endOnly,
                    dx = 0,
                    dy = 0,
                    startEvent;

                if (this.dragging) {
                    if      (options.drag.axis === 'x' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vx); }
                    else if (options.drag.axis === 'y' ) { pointerSpeed = Math.abs(this.pointerDelta.client.vy); }
                    else   /*options.drag.axis === 'xy'*/{ pointerSpeed = this.pointerDelta.client.speed; }
                }
                else {
                    pointerSpeed = this.pointerDelta.client.speed;
                }

                // check if inertia should be started
                inertiaPossible = (inertiaOptions && inertiaOptions.enabled
                                   && this.prepared.name !== 'gesture'
                                   && event !== inertiaStatus.startEvent);

                inertia = (inertiaPossible
                           && (now - this.curCoords.timeStamp) < 50
                           && pointerSpeed > inertiaOptions.minSpeed
                           && pointerSpeed > inertiaOptions.endSpeed);

                if (inertiaPossible && !inertia && (endSnap || endRestrict)) {

                    var snapRestrict = {};

                    snapRestrict.snap = snapRestrict.restrict = snapRestrict;

                    if (endSnap) {
                        this.setSnapping(this.curCoords.page, snapRestrict);
                        if (snapRestrict.locked) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (endRestrict) {
                        this.setRestriction(this.curCoords.page, snapRestrict);
                        if (snapRestrict.restricted) {
                            dx += snapRestrict.dx;
                            dy += snapRestrict.dy;
                        }
                    }

                    if (dx || dy) {
                        smoothEnd = true;
                    }
                }

                if (inertia || smoothEnd) {
                    copyCoords(inertiaStatus.upCoords, this.curCoords);

                    this.pointers[0] = inertiaStatus.startEvent = startEvent =
                        new InteractEvent(this, event, this.prepared.name, 'inertiastart', this.element);

                    inertiaStatus.t0 = now;

                    target.fire(inertiaStatus.startEvent);

                    if (inertia) {
                        inertiaStatus.vx0 = this.pointerDelta.client.vx;
                        inertiaStatus.vy0 = this.pointerDelta.client.vy;
                        inertiaStatus.v0 = pointerSpeed;

                        this.calcInertia(inertiaStatus);

                        var page = extend({}, this.curCoords.page),
                            origin = getOriginXY(target, this.element),
                            statusObject;

                        page.x = page.x + inertiaStatus.xe - origin.x;
                        page.y = page.y + inertiaStatus.ye - origin.y;

                        statusObject = {
                            useStatusXY: true,
                            x: page.x,
                            y: page.y,
                            dx: 0,
                            dy: 0,
                            snap: null
                        };

                        statusObject.snap = statusObject;

                        dx = dy = 0;

                        if (endSnap) {
                            var snap = this.setSnapping(this.curCoords.page, statusObject);

                            if (snap.locked) {
                                dx += snap.dx;
                                dy += snap.dy;
                            }
                        }

                        if (endRestrict) {
                            var restrict = this.setRestriction(this.curCoords.page, statusObject);

                            if (restrict.restricted) {
                                dx += restrict.dx;
                                dy += restrict.dy;
                            }
                        }

                        inertiaStatus.modifiedXe += dx;
                        inertiaStatus.modifiedYe += dy;

                        inertiaStatus.i = reqFrame(this.boundInertiaFrame);
                    }
                    else {
                        inertiaStatus.smoothEnd = true;
                        inertiaStatus.xe = dx;
                        inertiaStatus.ye = dy;

                        inertiaStatus.sx = inertiaStatus.sy = 0;

                        inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
                    }

                    inertiaStatus.active = true;
                    return;
                }

                if (endSnap || endRestrict) {
                    // fire a move event at the snapped coordinates
                    this.pointerMove(pointer, event, eventTarget, curEventTarget, true);
                }
            }

            if (this.dragging) {
                endEvent = new InteractEvent(this, event, 'drag', 'end', this.element);

                var draggableElement = this.element,
                    drop = this.getDrop(endEvent, event, draggableElement);

                this.dropTarget = drop.dropzone;
                this.dropElement = drop.element;

                var dropEvents = this.getDropEvents(event, endEvent);

                if (dropEvents.leave) { this.prevDropTarget.fire(dropEvents.leave); }
                if (dropEvents.enter) {     this.dropTarget.fire(dropEvents.enter); }
                if (dropEvents.drop ) {     this.dropTarget.fire(dropEvents.drop ); }
                if (dropEvents.deactivate) {
                    this.fireActiveDrops(dropEvents.deactivate);
                }

                target.fire(endEvent);
            }
            else if (this.resizing) {
                endEvent = new InteractEvent(this, event, 'resize', 'end', this.element);
                target.fire(endEvent);
            }
            else if (this.gesturing) {
                endEvent = new InteractEvent(this, event, 'gesture', 'end', this.element);
                target.fire(endEvent);
            }

            this.stop(event);
        },

        collectDrops: function (element) {
            var drops = [],
                elements = [],
                i;

            element = element || this.element;

            // collect all dropzones and their elements which qualify for a drop
            for (i = 0; i < interactables.length; i++) {
                if (!interactables[i].options.drop.enabled) { continue; }

                var current = interactables[i],
                    accept = current.options.drop.accept;

                // test the draggable element against the dropzone's accept setting
                if ((isElement(accept) && accept !== element)
                    || (isString(accept)
                        && !matchesSelector(element, accept))) {

                    continue;
                }

                // query for new elements if necessary
                var dropElements = current.selector? current._context.querySelectorAll(current.selector) : [current._element];

                for (var j = 0, len = dropElements.length; j < len; j++) {
                    var currentElement = dropElements[j];

                    if (currentElement === element) {
                        continue;
                    }

                    drops.push(current);
                    elements.push(currentElement);
                }
            }

            return {
                dropzones: drops,
                elements: elements
            };
        },

        fireActiveDrops: function (event) {
            var i,
                current,
                currentElement,
                prevElement;

            // loop through all active dropzones and trigger event
            for (i = 0; i < this.activeDrops.dropzones.length; i++) {
                current = this.activeDrops.dropzones[i];
                currentElement = this.activeDrops.elements [i];

                // prevent trigger of duplicate events on same element
                if (currentElement !== prevElement) {
                    // set current element as event target
                    event.target = currentElement;
                    current.fire(event);
                }
                prevElement = currentElement;
            }
        },

        // Collect a new set of possible drops and save them in activeDrops.
        // setActiveDrops should always be called when a drag has just started or a
        // drag event happens while dynamicDrop is true
        setActiveDrops: function (dragElement) {
            // get dropzones and their elements that could receive the draggable
            var possibleDrops = this.collectDrops(dragElement, true);

            this.activeDrops.dropzones = possibleDrops.dropzones;
            this.activeDrops.elements  = possibleDrops.elements;
            this.activeDrops.rects     = [];

            for (var i = 0; i < this.activeDrops.dropzones.length; i++) {
                this.activeDrops.rects[i] = this.activeDrops.dropzones[i].getRect(this.activeDrops.elements[i]);
            }
        },

        getDrop: function (dragEvent, event, dragElement) {
            var validDrops = [];

            if (dynamicDrop) {
                this.setActiveDrops(dragElement);
            }

            // collect all dropzones and their elements which qualify for a drop
            for (var j = 0; j < this.activeDrops.dropzones.length; j++) {
                var current        = this.activeDrops.dropzones[j],
                    currentElement = this.activeDrops.elements [j],
                    rect           = this.activeDrops.rects    [j];

                validDrops.push(current.dropCheck(dragEvent, event, this.target, dragElement, currentElement, rect)
                                ? currentElement
                                : null);
            }

            // get the most appropriate dropzone based on DOM depth and order
            var dropIndex = indexOfDeepestElement(validDrops),
                dropzone  = this.activeDrops.dropzones[dropIndex] || null,
                element   = this.activeDrops.elements [dropIndex] || null;

            return {
                dropzone: dropzone,
                element: element
            };
        },

        getDropEvents: function (pointerEvent, dragEvent) {
            var dropEvents = {
                enter     : null,
                leave     : null,
                activate  : null,
                deactivate: null,
                move      : null,
                drop      : null
            };

            if (this.dropElement !== this.prevDropElement) {
                // if there was a prevDropTarget, create a dragleave event
                if (this.prevDropTarget) {
                    dropEvents.leave = {
                        target       : this.prevDropElement,
                        dropzone     : this.prevDropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragleave'
                    };

                    dragEvent.dragLeave = this.prevDropElement;
                    dragEvent.prevDropzone = this.prevDropTarget;
                }
                // if the dropTarget is not null, create a dragenter event
                if (this.dropTarget) {
                    dropEvents.enter = {
                        target       : this.dropElement,
                        dropzone     : this.dropTarget,
                        relatedTarget: dragEvent.target,
                        draggable    : dragEvent.interactable,
                        dragEvent    : dragEvent,
                        interaction  : this,
                        timeStamp    : dragEvent.timeStamp,
                        type         : 'dragenter'
                    };

                    dragEvent.dragEnter = this.dropElement;
                    dragEvent.dropzone = this.dropTarget;
                }
            }

            if (dragEvent.type === 'dragend' && this.dropTarget) {
                dropEvents.drop = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'drop'
                };

                dragEvent.dropzone = this.dropTarget;
            }
            if (dragEvent.type === 'dragstart') {
                dropEvents.activate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropactivate'
                };
            }
            if (dragEvent.type === 'dragend') {
                dropEvents.deactivate = {
                    target       : null,
                    dropzone     : null,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropdeactivate'
                };
            }
            if (dragEvent.type === 'dragmove' && this.dropTarget) {
                dropEvents.move = {
                    target       : this.dropElement,
                    dropzone     : this.dropTarget,
                    relatedTarget: dragEvent.target,
                    draggable    : dragEvent.interactable,
                    dragEvent    : dragEvent,
                    interaction  : this,
                    dragmove     : dragEvent,
                    timeStamp    : dragEvent.timeStamp,
                    type         : 'dropmove'
                };
                dragEvent.dropzone = this.dropTarget;
            }

            return dropEvents;
        },

        currentAction: function () {
            return (this.dragging && 'drag') || (this.resizing && 'resize') || (this.gesturing && 'gesture') || null;
        },

        interacting: function () {
            return this.dragging || this.resizing || this.gesturing;
        },

        clearTargets: function () {
            this.target = this.element = null;

            this.dropTarget = this.dropElement = this.prevDropTarget = this.prevDropElement = null;
        },

        stop: function (event) {
            if (this.interacting()) {
                autoScroll.stop();
                this.matches = [];
                this.matchElements = [];

                var target = this.target;

                if (target.options.styleCursor) {
                    target._doc.documentElement.style.cursor = '';
                }

                // prevent Default only if were previously interacting
                if (event && isFunction(event.preventDefault)) {
                    this.checkAndPreventDefault(event, target, this.element);
                }

                if (this.dragging) {
                    this.activeDrops.dropzones = this.activeDrops.elements = this.activeDrops.rects = null;
                }
            }

            this.clearTargets();

            this.pointerIsDown = this.snapStatus.locked = this.dragging = this.resizing = this.gesturing = false;
            this.prepared.name = this.prevEvent = null;
            this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy = 0;

            // remove pointers if their ID isn't in this.pointerIds
            for (var i = 0; i < this.pointers.length; i++) {
                if (indexOf(this.pointerIds, getPointerId(this.pointers[i])) === -1) {
                    this.pointers.splice(i, 1);
                }
            }
        },

        inertiaFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                options = this.target.options[this.prepared.name].inertia,
                lambda = options.resistance,
                t = new Date().getTime() / 1000 - inertiaStatus.t0;

            if (t < inertiaStatus.te) {

                var progress =  1 - (Math.exp(-lambda * t) - inertiaStatus.lambda_v0) / inertiaStatus.one_ve_v0;

                if (inertiaStatus.modifiedXe === inertiaStatus.xe && inertiaStatus.modifiedYe === inertiaStatus.ye) {
                    inertiaStatus.sx = inertiaStatus.xe * progress;
                    inertiaStatus.sy = inertiaStatus.ye * progress;
                }
                else {
                    var quadPoint = getQuadraticCurvePoint(
                            0, 0,
                            inertiaStatus.xe, inertiaStatus.ye,
                            inertiaStatus.modifiedXe, inertiaStatus.modifiedYe,
                            progress);

                    inertiaStatus.sx = quadPoint.x;
                    inertiaStatus.sy = quadPoint.y;
                }

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundInertiaFrame);
            }
            else {
                inertiaStatus.ending = true;

                inertiaStatus.sx = inertiaStatus.modifiedXe;
                inertiaStatus.sy = inertiaStatus.modifiedYe;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.active = inertiaStatus.ending = false;
            }
        },

        smoothEndFrame: function () {
            var inertiaStatus = this.inertiaStatus,
                t = new Date().getTime() - inertiaStatus.t0,
                duration = this.target.options[this.prepared.name].inertia.smoothEndDuration;

            if (t < duration) {
                inertiaStatus.sx = easeOutQuad(t, 0, inertiaStatus.xe, duration);
                inertiaStatus.sy = easeOutQuad(t, 0, inertiaStatus.ye, duration);

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.i = reqFrame(this.boundSmoothEndFrame);
            }
            else {
                inertiaStatus.ending = true;

                inertiaStatus.sx = inertiaStatus.xe;
                inertiaStatus.sy = inertiaStatus.ye;

                this.pointerMove(inertiaStatus.startEvent, inertiaStatus.startEvent);
                this.pointerEnd(inertiaStatus.startEvent, inertiaStatus.startEvent);

                inertiaStatus.smoothEnd =
                  inertiaStatus.active = inertiaStatus.ending = false;
            }
        },

        addPointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) {
                index = this.pointerIds.length;
            }

            this.pointerIds[index] = id;
            this.pointers[index] = pointer;

            return index;
        },

        removePointer: function (pointer) {
            var id = getPointerId(pointer),
                index = this.mouse? 0 : indexOf(this.pointerIds, id);

            if (index === -1) { return; }

            this.pointers   .splice(index, 1);
            this.pointerIds .splice(index, 1);
            this.downTargets.splice(index, 1);
            this.downTimes  .splice(index, 1);
            this.holdTimers .splice(index, 1);
        },

        recordPointer: function (pointer) {
            var index = this.mouse? 0: indexOf(this.pointerIds, getPointerId(pointer));

            if (index === -1) { return; }

            this.pointers[index] = pointer;
        },

        collectEventTargets: function (pointer, event, eventTarget, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer));

            // do not fire a tap event if the pointer was moved before being lifted
            if (eventType === 'tap' && (this.pointerWasMoved
                // or if the pointerup target is different to the pointerdown target
                || !(this.downTargets[pointerIndex] && this.downTargets[pointerIndex] === eventTarget))) {
                return;
            }

            var targets = [],
                elements = [],
                element = eventTarget;

            function collectSelectors (interactable, selector, context) {
                var els = ie8MatchesSelector
                        ? context.querySelectorAll(selector)
                        : undefined;

                if (interactable._iEvents[eventType]
                    && isElement(element)
                    && inContext(interactable, element)
                    && !testIgnore(interactable, element, eventTarget)
                    && testAllow(interactable, element, eventTarget)
                    && matchesSelector(element, selector, els)) {

                    targets.push(interactable);
                    elements.push(element);
                }
            }

            while (element) {
                if (interact.isSet(element) && interact(element)._iEvents[eventType]) {
                    targets.push(interact(element));
                    elements.push(element);
                }

                interactables.forEachSelector(collectSelectors);

                element = parentElement(element);
            }

            // create the tap event even if there are no listeners so that
            // doubletap can still be created and fired
            if (targets.length || eventType === 'tap') {
                this.firePointers(pointer, event, eventTarget, targets, elements, eventType);
            }
        },

        firePointers: function (pointer, event, eventTarget, targets, elements, eventType) {
            var pointerIndex = this.mouse? 0 : indexOf(this.pointerIds, getPointerId(pointer)),
                pointerEvent = {},
                i,
                // for tap events
                interval, createNewDoubleTap;

            // if it's a doubletap then the event properties would have been
            // copied from the tap event and provided as the pointer argument
            if (eventType === 'doubletap') {
                pointerEvent = pointer;
            }
            else {
                pointerExtend(pointerEvent, event);
                if (event !== pointer) {
                    pointerExtend(pointerEvent, pointer);
                }

                pointerEvent.preventDefault           = preventOriginalDefault;
                pointerEvent.stopPropagation          = InteractEvent.prototype.stopPropagation;
                pointerEvent.stopImmediatePropagation = InteractEvent.prototype.stopImmediatePropagation;
                pointerEvent.interaction              = this;

                pointerEvent.timeStamp       = new Date().getTime();
                pointerEvent.originalEvent   = event;
                pointerEvent.originalPointer = pointer;
                pointerEvent.type            = eventType;
                pointerEvent.pointerId       = getPointerId(pointer);
                pointerEvent.pointerType     = this.mouse? 'mouse' : !supportsPointerEvent? 'touch'
                                                    : isString(pointer.pointerType)
                                                        ? pointer.pointerType
                                                        : [,,'touch', 'pen', 'mouse'][pointer.pointerType];
            }

            if (eventType === 'tap') {
                pointerEvent.dt = pointerEvent.timeStamp - this.downTimes[pointerIndex];

                interval = pointerEvent.timeStamp - this.tapTime;
                createNewDoubleTap = !!(this.prevTap && this.prevTap.type !== 'doubletap'
                       && this.prevTap.target === pointerEvent.target
                       && interval < 500);

                pointerEvent.double = createNewDoubleTap;

                this.tapTime = pointerEvent.timeStamp;
            }

            for (i = 0; i < targets.length; i++) {
                pointerEvent.currentTarget = elements[i];
                pointerEvent.interactable = targets[i];
                targets[i].fire(pointerEvent);

                if (pointerEvent.immediatePropagationStopped
                    ||(pointerEvent.propagationStopped && elements[i + 1] !== pointerEvent.currentTarget)) {
                    break;
                }
            }

            if (createNewDoubleTap) {
                var doubleTap = {};

                extend(doubleTap, pointerEvent);

                doubleTap.dt   = interval;
                doubleTap.type = 'doubletap';

                this.collectEventTargets(doubleTap, event, eventTarget, 'doubletap');

                this.prevTap = doubleTap;
            }
            else if (eventType === 'tap') {
                this.prevTap = pointerEvent;
            }
        },

        validateSelector: function (pointer, event, matches, matchElements) {
            for (var i = 0, len = matches.length; i < len; i++) {
                var match = matches[i],
                    matchElement = matchElements[i],
                    action = validateAction(match.getAction(pointer, event, this, matchElement), match);

                if (action && withinInteractionLimit(match, matchElement, action)) {
                    this.target = match;
                    this.element = matchElement;

                    return action;
                }
            }
        },

        setSnapping: function (pageCoords, status) {
            var snap = this.target.options[this.prepared.name].snap,
                targets = [],
                target,
                page,
                i;

            status = status || this.snapStatus;

            if (status.useStatusXY) {
                page = { x: status.x, y: status.y };
            }
            else {
                var origin = getOriginXY(this.target, this.element);

                page = extend({}, pageCoords);

                page.x -= origin.x;
                page.y -= origin.y;
            }

            status.realX = page.x;
            status.realY = page.y;

            page.x = page.x - this.inertiaStatus.resumeDx;
            page.y = page.y - this.inertiaStatus.resumeDy;

            var len = snap.targets? snap.targets.length : 0;

            for (var relIndex = 0; relIndex < this.snapOffsets.length; relIndex++) {
                var relative = {
                    x: page.x - this.snapOffsets[relIndex].x,
                    y: page.y - this.snapOffsets[relIndex].y
                };

                for (i = 0; i < len; i++) {
                    if (isFunction(snap.targets[i])) {
                        target = snap.targets[i](relative.x, relative.y, this);
                    }
                    else {
                        target = snap.targets[i];
                    }

                    if (!target) { continue; }

                    targets.push({
                        x: isNumber(target.x) ? (target.x + this.snapOffsets[relIndex].x) : relative.x,
                        y: isNumber(target.y) ? (target.y + this.snapOffsets[relIndex].y) : relative.y,

                        range: isNumber(target.range)? target.range: snap.range
                    });
                }
            }

            var closest = {
                    target: null,
                    inRange: false,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0
                };

            for (i = 0, len = targets.length; i < len; i++) {
                target = targets[i];

                var range = target.range,
                    dx = target.x - page.x,
                    dy = target.y - page.y,
                    distance = hypot(dx, dy),
                    inRange = distance <= range;

                // Infinite targets count as being out of range
                // compared to non infinite ones that are in range
                if (range === Infinity && closest.inRange && closest.range !== Infinity) {
                    inRange = false;
                }

                if (!closest.target || (inRange
                    // is the closest target in range?
                    ? (closest.inRange && range !== Infinity
                        // the pointer is relatively deeper in this target
                        ? distance / range < closest.distance / closest.range
                        // this target has Infinite range and the closest doesn't
                        : (range === Infinity && closest.range !== Infinity)
                            // OR this target is closer that the previous closest
                            || distance < closest.distance)
                    // The other is not in range and the pointer is closer to this target
                    : (!closest.inRange && distance < closest.distance))) {

                    if (range === Infinity) {
                        inRange = true;
                    }

                    closest.target = target;
                    closest.distance = distance;
                    closest.range = range;
                    closest.inRange = inRange;
                    closest.dx = dx;
                    closest.dy = dy;

                    status.range = range;
                }
            }

            var snapChanged;

            if (closest.target) {
                snapChanged = (status.snappedX !== closest.target.x || status.snappedY !== closest.target.y);

                status.snappedX = closest.target.x;
                status.snappedY = closest.target.y;
            }
            else {
                snapChanged = true;

                status.snappedX = NaN;
                status.snappedY = NaN;
            }

            status.dx = closest.dx;
            status.dy = closest.dy;

            status.changed = (snapChanged || (closest.inRange && !status.locked));
            status.locked = closest.inRange;

            return status;
        },

        setRestriction: function (pageCoords, status) {
            var target = this.target,
                restrict = target && target.options[this.prepared.name].restrict,
                restriction = restrict && restrict.restriction,
                page;

            if (!restriction) {
                return status;
            }

            status = status || this.restrictStatus;

            page = status.useStatusXY
                    ? page = { x: status.x, y: status.y }
                    : page = extend({}, pageCoords);

            if (status.snap && status.snap.locked) {
                page.x += status.snap.dx || 0;
                page.y += status.snap.dy || 0;
            }

            page.x -= this.inertiaStatus.resumeDx;
            page.y -= this.inertiaStatus.resumeDy;

            status.dx = 0;
            status.dy = 0;
            status.restricted = false;

            var rect, restrictedX, restrictedY;

            if (isString(restriction)) {
                if (restriction === 'parent') {
                    restriction = parentElement(this.element);
                }
                else if (restriction === 'self') {
                    restriction = target.getRect(this.element);
                }
                else {
                    restriction = closest(this.element, restriction);
                }

                if (!restriction) { return status; }
            }

            if (isFunction(restriction)) {
                restriction = restriction(page.x, page.y, this.element);
            }

            if (isElement(restriction)) {
                restriction = getElementRect(restriction);
            }

            rect = restriction;

            if (!restriction) {
                restrictedX = page.x;
                restrictedY = page.y;
            }
            // object is assumed to have
            // x, y, width, height or
            // left, top, right, bottom
            else if ('x' in restriction && 'y' in restriction) {
                restrictedX = Math.max(Math.min(rect.x + rect.width  - this.restrictOffset.right , page.x), rect.x + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.y + rect.height - this.restrictOffset.bottom, page.y), rect.y + this.restrictOffset.top );
            }
            else {
                restrictedX = Math.max(Math.min(rect.right  - this.restrictOffset.right , page.x), rect.left + this.restrictOffset.left);
                restrictedY = Math.max(Math.min(rect.bottom - this.restrictOffset.bottom, page.y), rect.top  + this.restrictOffset.top );
            }

            status.dx = restrictedX - page.x;
            status.dy = restrictedY - page.y;

            status.changed = status.restrictedX !== restrictedX || status.restrictedY !== restrictedY;
            status.restricted = !!(status.dx || status.dy);

            status.restrictedX = restrictedX;
            status.restrictedY = restrictedY;

            return status;
        },

        checkAndPreventDefault: function (event, interactable, element) {
            if (!(interactable = interactable || this.target)) { return; }

            var options = interactable.options,
                prevent = options.preventDefault;

            if (prevent === 'auto' && element && !/^(input|select|textarea)$/i.test(event.target.nodeName)) {
                // do not preventDefault on pointerdown if the prepared action is a drag
                // and dragging can only start from a certain direction - this allows
                // a touch to pan the viewport if a drag isn't in the right direction
                if (/down|start/i.test(event.type)
                    && this.prepared.name === 'drag' && options.drag.axis !== 'xy') {

                    return;
                }

                // with manualStart, only preventDefault while interacting
                if (options[this.prepared.name] && options[this.prepared.name].manualStart
                    && !this.interacting()) {
                    return;
                }

                event.preventDefault();
                return;
            }

            if (prevent === 'always') {
                event.preventDefault();
                return;
            }
        },

        calcInertia: function (status) {
            var inertiaOptions = this.target.options[this.prepared.name].inertia,
                lambda = inertiaOptions.resistance,
                inertiaDur = -Math.log(inertiaOptions.endSpeed / status.v0) / lambda;

            status.x0 = this.prevEvent.pageX;
            status.y0 = this.prevEvent.pageY;
            status.t0 = status.startEvent.timeStamp / 1000;
            status.sx = status.sy = 0;

            status.modifiedXe = status.xe = (status.vx0 - inertiaDur) / lambda;
            status.modifiedYe = status.ye = (status.vy0 - inertiaDur) / lambda;
            status.te = inertiaDur;

            status.lambda_v0 = lambda / status.v0;
            status.one_ve_v0 = 1 - inertiaOptions.endSpeed / status.v0;
        },

        autoScrollMove: function (pointer) {
            if (!(this.interacting()
                && checkAutoScroll(this.target, this.prepared.name))) {
                return;
            }

            if (this.inertiaStatus.active) {
                autoScroll.x = autoScroll.y = 0;
                return;
            }

            var top,
                right,
                bottom,
                left,
                options = this.target.options[this.prepared.name].autoScroll,
                container = options.container || getWindow(this.element);

            if (isWindow(container)) {
                left   = pointer.clientX < autoScroll.margin;
                top    = pointer.clientY < autoScroll.margin;
                right  = pointer.clientX > container.innerWidth  - autoScroll.margin;
                bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
            }
            else {
                var rect = getElementClientRect(container);

                left   = pointer.clientX < rect.left   + autoScroll.margin;
                top    = pointer.clientY < rect.top    + autoScroll.margin;
                right  = pointer.clientX > rect.right  - autoScroll.margin;
                bottom = pointer.clientY > rect.bottom - autoScroll.margin;
            }

            autoScroll.x = (right ? 1: left? -1: 0);
            autoScroll.y = (bottom? 1:  top? -1: 0);

            if (!autoScroll.isScrolling) {
                // set the autoScroll properties to those of the target
                autoScroll.margin = options.margin;
                autoScroll.speed  = options.speed;

                autoScroll.start(this);
            }
        },

        _updateEventTargets: function (target, currentTarget) {
            this._eventTarget    = target;
            this._curEventTarget = currentTarget;
        }

    };

    function getInteractionFromPointer (pointer, eventType, eventTarget) {
        var i = 0, len = interactions.length,
            mouseEvent = (/mouse/i.test(pointer.pointerType || eventType)
                          // MSPointerEvent.MSPOINTER_TYPE_MOUSE
                          || pointer.pointerType === 4),
            interaction;

        var id = getPointerId(pointer);

        // try to resume inertia with a new pointer
        if (/down|start/i.test(eventType)) {
            for (i = 0; i < len; i++) {
                interaction = interactions[i];

                var element = eventTarget;

                if (interaction.inertiaStatus.active && interaction.target.options[interaction.prepared.name].inertia.allowResume
                    && (interaction.mouse === mouseEvent)) {
                    while (element) {
                        // if the element is the interaction element
                        if (element === interaction.element) {
                            return interaction;
                        }
                        element = parentElement(element);
                    }
                }
            }
        }

        // if it's a mouse interaction
        if (mouseEvent || !(supportsTouch || supportsPointerEvent)) {

            // find a mouse interaction that's not in inertia phase
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !interactions[i].inertiaStatus.active) {
                    return interactions[i];
                }
            }

            // find any interaction specifically for mouse.
            // if the eventType is a mousedown, and inertia is active
            // ignore the interaction
            for (i = 0; i < len; i++) {
                if (interactions[i].mouse && !(/down/.test(eventType) && interactions[i].inertiaStatus.active)) {
                    return interaction;
                }
            }

            // create a new interaction for mouse
            interaction = new Interaction();
            interaction.mouse = true;

            return interaction;
        }

        // get interaction that has this pointer
        for (i = 0; i < len; i++) {
            if (contains(interactions[i].pointerIds, id)) {
                return interactions[i];
            }
        }

        // at this stage, a pointerUp should not return an interaction
        if (/up|end|out/i.test(eventType)) {
            return null;
        }

        // get first idle interaction
        for (i = 0; i < len; i++) {
            interaction = interactions[i];

            if ((!interaction.prepared.name || (interaction.target.options.gesture.enabled))
                && !interaction.interacting()
                && !(!mouseEvent && interaction.mouse)) {

                return interaction;
            }
        }

        return new Interaction();
    }

    function doOnInteractions (method) {
        return (function (event) {
            var interaction,
                eventTarget = getActualElement(event.path
                                               ? event.path[0]
                                               : event.target),
                curEventTarget = getActualElement(event.currentTarget),
                i;

            if (supportsTouch && /touch/.test(event.type)) {
                prevTouchTime = new Date().getTime();

                for (i = 0; i < event.changedTouches.length; i++) {
                    var pointer = event.changedTouches[i];

                    interaction = getInteractionFromPointer(pointer, event.type, eventTarget);

                    if (!interaction) { continue; }

                    interaction._updateEventTargets(eventTarget, curEventTarget);

                    interaction[method](pointer, event, eventTarget, curEventTarget);
                }
            }
            else {
                if (!supportsPointerEvent && /mouse/.test(event.type)) {
                    // ignore mouse events while touch interactions are active
                    for (i = 0; i < interactions.length; i++) {
                        if (!interactions[i].mouse && interactions[i].pointerIsDown) {
                            return;
                        }
                    }

                    // try to ignore mouse events that are simulated by the browser
                    // after a touch event
                    if (new Date().getTime() - prevTouchTime < 500) {
                        return;
                    }
                }

                interaction = getInteractionFromPointer(event, event.type, eventTarget);

                if (!interaction) { return; }

                interaction._updateEventTargets(eventTarget, curEventTarget);

                interaction[method](event, event, eventTarget, curEventTarget);
            }
        });
    }

    function InteractEvent (interaction, event, action, phase, element, related) {
        var client,
            page,
            target      = interaction.target,
            snapStatus  = interaction.snapStatus,
            restrictStatus  = interaction.restrictStatus,
            pointers    = interaction.pointers,
            deltaSource = (target && target.options || defaultOptions).deltaSource,
            sourceX     = deltaSource + 'X',
            sourceY     = deltaSource + 'Y',
            options     = target? target.options: defaultOptions,
            origin      = getOriginXY(target, element),
            starting    = phase === 'start',
            ending      = phase === 'end',
            coords      = starting? interaction.startCoords : interaction.curCoords;

        element = element || interaction.element;

        page   = extend({}, coords.page);
        client = extend({}, coords.client);

        page.x -= origin.x;
        page.y -= origin.y;

        client.x -= origin.x;
        client.y -= origin.y;

        var relativePoints = options[action].snap && options[action].snap.relativePoints ;

        if (checkSnap(target, action) && !(starting && relativePoints && relativePoints.length)) {
            this.snap = {
                range  : snapStatus.range,
                locked : snapStatus.locked,
                x      : snapStatus.snappedX,
                y      : snapStatus.snappedY,
                realX  : snapStatus.realX,
                realY  : snapStatus.realY,
                dx     : snapStatus.dx,
                dy     : snapStatus.dy
            };

            if (snapStatus.locked) {
                page.x += snapStatus.dx;
                page.y += snapStatus.dy;
                client.x += snapStatus.dx;
                client.y += snapStatus.dy;
            }
        }

        if (checkRestrict(target, action) && !(starting && options[action].restrict.elementRect) && restrictStatus.restricted) {
            page.x += restrictStatus.dx;
            page.y += restrictStatus.dy;
            client.x += restrictStatus.dx;
            client.y += restrictStatus.dy;

            this.restrict = {
                dx: restrictStatus.dx,
                dy: restrictStatus.dy
            };
        }

        this.pageX     = page.x;
        this.pageY     = page.y;
        this.clientX   = client.x;
        this.clientY   = client.y;

        this.x0        = interaction.startCoords.page.x - origin.x;
        this.y0        = interaction.startCoords.page.y - origin.y;
        this.clientX0  = interaction.startCoords.client.x - origin.x;
        this.clientY0  = interaction.startCoords.client.y - origin.y;
        this.ctrlKey   = event.ctrlKey;
        this.altKey    = event.altKey;
        this.shiftKey  = event.shiftKey;
        this.metaKey   = event.metaKey;
        this.button    = event.button;
        this.buttons   = event.buttons;
        this.target    = element;
        this.t0        = interaction.downTimes[0];
        this.type      = action + (phase || '');

        this.interaction = interaction;
        this.interactable = target;

        var inertiaStatus = interaction.inertiaStatus;

        if (inertiaStatus.active) {
            this.detail = 'inertia';
        }

        if (related) {
            this.relatedTarget = related;
        }

        // end event dx, dy is difference between start and end points
        if (ending) {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.startCoords.client.x;
                this.dy = client.y - interaction.startCoords.client.y;
            }
            else {
                this.dx = page.x - interaction.startCoords.page.x;
                this.dy = page.y - interaction.startCoords.page.y;
            }
        }
        else if (starting) {
            this.dx = 0;
            this.dy = 0;
        }
        // copy properties from previousmove if starting inertia
        else if (phase === 'inertiastart') {
            this.dx = interaction.prevEvent.dx;
            this.dy = interaction.prevEvent.dy;
        }
        else {
            if (deltaSource === 'client') {
                this.dx = client.x - interaction.prevEvent.clientX;
                this.dy = client.y - interaction.prevEvent.clientY;
            }
            else {
                this.dx = page.x - interaction.prevEvent.pageX;
                this.dy = page.y - interaction.prevEvent.pageY;
            }
        }
        if (interaction.prevEvent && interaction.prevEvent.detail === 'inertia'
            && !inertiaStatus.active
            && options[action].inertia && options[action].inertia.zeroResumeDelta) {

            inertiaStatus.resumeDx += this.dx;
            inertiaStatus.resumeDy += this.dy;

            this.dx = this.dy = 0;
        }

        if (action === 'resize' && interaction.resizeAxes) {
            if (options.resize.square) {
                if (interaction.resizeAxes === 'y') {
                    this.dx = this.dy;
                }
                else {
                    this.dy = this.dx;
                }
                this.axes = 'xy';
            }
            else {
                this.axes = interaction.resizeAxes;

                if (interaction.resizeAxes === 'x') {
                    this.dy = 0;
                }
                else if (interaction.resizeAxes === 'y') {
                    this.dx = 0;
                }
            }
        }
        else if (action === 'gesture') {
            this.touches = [pointers[0], pointers[1]];

            if (starting) {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = 1;
                this.ds       = 0;
                this.angle    = touchAngle(pointers, undefined, deltaSource);
                this.da       = 0;
            }
            else if (ending || event instanceof InteractEvent) {
                this.distance = interaction.prevEvent.distance;
                this.box      = interaction.prevEvent.box;
                this.scale    = interaction.prevEvent.scale;
                this.ds       = this.scale - 1;
                this.angle    = interaction.prevEvent.angle;
                this.da       = this.angle - interaction.gesture.startAngle;
            }
            else {
                this.distance = touchDistance(pointers, deltaSource);
                this.box      = touchBBox(pointers);
                this.scale    = this.distance / interaction.gesture.startDistance;
                this.angle    = touchAngle(pointers, interaction.gesture.prevAngle, deltaSource);

                this.ds = this.scale - interaction.gesture.prevScale;
                this.da = this.angle - interaction.gesture.prevAngle;
            }
        }

        if (starting) {
            this.timeStamp = interaction.downTimes[0];
            this.dt        = 0;
            this.duration  = 0;
            this.speed     = 0;
            this.velocityX = 0;
            this.velocityY = 0;
        }
        else if (phase === 'inertiastart') {
            this.timeStamp = interaction.prevEvent.timeStamp;
            this.dt        = interaction.prevEvent.dt;
            this.duration  = interaction.prevEvent.duration;
            this.speed     = interaction.prevEvent.speed;
            this.velocityX = interaction.prevEvent.velocityX;
            this.velocityY = interaction.prevEvent.velocityY;
        }
        else {
            this.timeStamp = new Date().getTime();
            this.dt        = this.timeStamp - interaction.prevEvent.timeStamp;
            this.duration  = this.timeStamp - interaction.downTimes[0];

            if (event instanceof InteractEvent) {
                var dx = this[sourceX] - interaction.prevEvent[sourceX],
                    dy = this[sourceY] - interaction.prevEvent[sourceY],
                    dt = this.dt / 1000;

                this.speed = hypot(dx, dy) / dt;
                this.velocityX = dx / dt;
                this.velocityY = dy / dt;
            }
            // if normal move or end event, use previous user event coords
            else {
                // speed and velocity in pixels per second
                this.speed = interaction.pointerDelta[deltaSource].speed;
                this.velocityX = interaction.pointerDelta[deltaSource].vx;
                this.velocityY = interaction.pointerDelta[deltaSource].vy;
            }
        }

        if ((ending || phase === 'inertiastart')
            && interaction.prevEvent.speed > 600 && this.timeStamp - interaction.prevEvent.timeStamp < 150) {

            var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI,
                overlap = 22.5;

            if (angle < 0) {
                angle += 360;
            }

            var left = 135 - overlap <= angle && angle < 225 + overlap,
                up   = 225 - overlap <= angle && angle < 315 + overlap,

                right = !left && (315 - overlap <= angle || angle <  45 + overlap),
                down  = !up   &&   45 - overlap <= angle && angle < 135 + overlap;

            this.swipe = {
                up   : up,
                down : down,
                left : left,
                right: right,
                angle: angle,
                speed: interaction.prevEvent.speed,
                velocity: {
                    x: interaction.prevEvent.velocityX,
                    y: interaction.prevEvent.velocityY
                }
            };
        }
    }

    InteractEvent.prototype = {
        preventDefault: blank,
        stopImmediatePropagation: function () {
            this.immediatePropagationStopped = this.propagationStopped = true;
        },
        stopPropagation: function () {
            this.propagationStopped = true;
        }
    };

    function preventOriginalDefault () {
        this.originalEvent.preventDefault();
    }

    function getActionCursor (action) {
        var cursor = '';

        if (action.name === 'drag') {
            cursor =  actionCursors.drag;
        }
        if (action.name === 'resize') {
            if (action.axis) {
                cursor =  actionCursors[action.name + action.axis];
            }
            else if (action.edges) {
                var cursorKey = 'resize',
                    edgeNames = ['top', 'bottom', 'left', 'right'];

                for (var i = 0; i < 4; i++) {
                    if (action.edges[edgeNames[i]]) {
                        cursorKey += edgeNames[i];
                    }
                }

                cursor = actionCursors[cursorKey];
            }
        }

        return cursor;
    }

    function checkResizeEdge (name, value, page, element, interactableElement, rect, margin) {
        // false, '', undefined, null
        if (!value) { return false; }

        // true value, use pointer coords and element rect
        if (value === true) {
            // if dimensions are negative, "switch" edges
            var width = isNumber(rect.width)? rect.width : rect.right - rect.left,
                height = isNumber(rect.height)? rect.height : rect.bottom - rect.top;

            if (width < 0) {
                if      (name === 'left' ) { name = 'right'; }
                else if (name === 'right') { name = 'left' ; }
            }
            if (height < 0) {
                if      (name === 'top'   ) { name = 'bottom'; }
                else if (name === 'bottom') { name = 'top'   ; }
            }

            if (name === 'left'  ) { return page.x < ((width  >= 0? rect.left: rect.right ) + margin); }
            if (name === 'top'   ) { return page.y < ((height >= 0? rect.top : rect.bottom) + margin); }

            if (name === 'right' ) { return page.x > ((width  >= 0? rect.right : rect.left) - margin); }
            if (name === 'bottom') { return page.y > ((height >= 0? rect.bottom: rect.top ) - margin); }
        }

        // the remaining checks require an element
        if (!isElement(element)) { return false; }

        return isElement(value)
                    // the value is an element to use as a resize handle
                    ? value === element
                    // otherwise check if element matches value as selector
                    : matchesUpTo(element, value, interactableElement);
    }

    function defaultActionChecker (pointer, interaction, element) {
        var rect = this.getRect(element),
            shouldResize = false,
            action = null,
            resizeAxes = null,
            resizeEdges,
            page = extend({}, interaction.curCoords.page),
            options = this.options;

        if (!rect) { return null; }

        if (actionIsEnabled.resize && options.resize.enabled) {
            var resizeOptions = options.resize;

            resizeEdges = {
                left: false, right: false, top: false, bottom: false
            };

            // if using resize.edges
            if (isObject(resizeOptions.edges)) {
                for (var edge in resizeEdges) {
                    resizeEdges[edge] = checkResizeEdge(edge,
                                                        resizeOptions.edges[edge],
                                                        page,
                                                        interaction._eventTarget,
                                                        element,
                                                        rect,
                                                        resizeOptions.margin || margin);
                }

                resizeEdges.left = resizeEdges.left && !resizeEdges.right;
                resizeEdges.top  = resizeEdges.top  && !resizeEdges.bottom;

                shouldResize = resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom;
            }
            else {
                var right  = options.resize.axis !== 'y' && page.x > (rect.right  - margin),
                    bottom = options.resize.axis !== 'x' && page.y > (rect.bottom - margin);

                shouldResize = right || bottom;
                resizeAxes = (right? 'x' : '') + (bottom? 'y' : '');
            }
        }

        action = shouldResize
            ? 'resize'
            : actionIsEnabled.drag && options.drag.enabled
                ? 'drag'
                : null;

        if (actionIsEnabled.gesture
            && interaction.pointerIds.length >=2
            && !(interaction.dragging || interaction.resizing)) {
            action = 'gesture';
        }

        if (action) {
            return {
                name: action,
                axis: resizeAxes,
                edges: resizeEdges
            };
        }

        return null;
    }

    // Check if action is enabled globally and the current target supports it
    // If so, return the validated action. Otherwise, return null
    function validateAction (action, interactable) {
        if (!isObject(action)) { return null; }

        var actionName = action.name,
            options = interactable.options;

        if ((  (actionName  === 'resize'   && options.resize.enabled )
            || (actionName      === 'drag'     && options.drag.enabled  )
            || (actionName      === 'gesture'  && options.gesture.enabled))
            && actionIsEnabled[actionName]) {

            if (actionName === 'resize' || actionName === 'resizeyx') {
                actionName = 'resizexy';
            }

            return action;
        }
        return null;
    }

    var listeners = {},
        interactionListeners = [
            'dragStart', 'dragMove', 'resizeStart', 'resizeMove', 'gestureStart', 'gestureMove',
            'pointerOver', 'pointerOut', 'pointerHover', 'selectorDown',
            'pointerDown', 'pointerMove', 'pointerUp', 'pointerCancel', 'pointerEnd',
            'addPointer', 'removePointer', 'recordPointer', 'autoScrollMove'
        ];

    for (var i = 0, len = interactionListeners.length; i < len; i++) {
        var name = interactionListeners[i];

        listeners[name] = doOnInteractions(name);
    }

    // bound to the interactable context when a DOM event
    // listener is added to a selector interactable
    function delegateListener (event, useCapture) {
        var fakeEvent = {},
            delegated = delegatedEvents[event.type],
            eventTarget = getActualElement(event.path
                                           ? event.path[0]
                                           : event.target),
            element = eventTarget;

        useCapture = useCapture? true: false;

        // duplicate the event so that currentTarget can be changed
        for (var prop in event) {
            fakeEvent[prop] = event[prop];
        }

        fakeEvent.originalEvent = event;
        fakeEvent.preventDefault = preventOriginalDefault;

        // climb up document tree looking for selector matches
        while (isElement(element)) {
            for (var i = 0; i < delegated.selectors.length; i++) {
                var selector = delegated.selectors[i],
                    context = delegated.contexts[i];

                if (matchesSelector(element, selector)
                    && nodeContains(context, eventTarget)
                    && nodeContains(context, element)) {

                    var listeners = delegated.listeners[i];

                    fakeEvent.currentTarget = element;

                    for (var j = 0; j < listeners.length; j++) {
                        if (listeners[j][1] === useCapture) {
                            listeners[j][0](fakeEvent);
                        }
                    }
                }
            }

            element = parentElement(element);
        }
    }

    function delegateUseCapture (event) {
        return delegateListener.call(this, event, true);
    }

    interactables.indexOfElement = function indexOfElement (element, context) {
        context = context || document;

        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if ((interactable.selector === element
                && (interactable._context === context))
                || (!interactable.selector && interactable._element === element)) {

                return i;
            }
        }
        return -1;
    };

    interactables.get = function interactableGet (element, options) {
        return this[this.indexOfElement(element, options && options.context)];
    };

    interactables.forEachSelector = function (callback) {
        for (var i = 0; i < this.length; i++) {
            var interactable = this[i];

            if (!interactable.selector) {
                continue;
            }

            var ret = callback(interactable, interactable.selector, interactable._context, i, this);

            if (ret !== undefined) {
                return ret;
            }
        }
    };

    /*\
     * interact
     [ method ]
     *
     * The methods of this variable can be used to set elements as
     * interactables and also to change various default settings.
     *
     * Calling it as a function and passing an element or a valid CSS selector
     * string returns an Interactable object which has various methods to
     * configure it.
     *
     - element (Element | string) The HTML or SVG Element to interact with or CSS selector
     = (object) An @Interactable
     *
     > Usage
     | interact(document.getElementById('draggable')).draggable(true);
     |
     | var rectables = interact('rect');
     | rectables
     |     .gesturable(true)
     |     .on('gesturemove', function (event) {
     |         // something cool...
     |     })
     |     .autoScroll(true);
    \*/
    function interact (element, options) {
        return interactables.get(element, options) || new Interactable(element, options);
    }

    /*\
     * Interactable
     [ property ]
     **
     * Object type returned by @interact
    \*/
    function Interactable (element, options) {
        this._element = element;
        this._iEvents = this._iEvents || {};

        var _window;

        if (trySelector(element)) {
            this.selector = element;

            var context = options && options.context;

            _window = context? getWindow(context) : window;

            if (context && (_window.Node
                    ? context instanceof _window.Node
                    : (isElement(context) || context === _window.document))) {

                this._context = context;
            }
        }
        else {
            _window = getWindow(element);

            if (isElement(element, _window)) {

                if (supportsPointerEvent) {
                    events.add(this._element, pEventTypes.down, listeners.pointerDown );
                    events.add(this._element, pEventTypes.move, listeners.pointerHover);
                }
                else {
                    events.add(this._element, 'mousedown' , listeners.pointerDown );
                    events.add(this._element, 'mousemove' , listeners.pointerHover);
                    events.add(this._element, 'touchstart', listeners.pointerDown );
                    events.add(this._element, 'touchmove' , listeners.pointerHover);
                }
            }
        }

        this._doc = _window.document;

        if (!contains(documents, this._doc)) {
            listenToDocument(this._doc);
        }

        interactables.push(this);

        this.set(options);
    }

    Interactable.prototype = {
        setOnEvents: function (action, phases) {
            if (action === 'drop') {
                if (isFunction(phases.ondrop)          ) { this.ondrop           = phases.ondrop          ; }
                if (isFunction(phases.ondropactivate)  ) { this.ondropactivate   = phases.ondropactivate  ; }
                if (isFunction(phases.ondropdeactivate)) { this.ondropdeactivate = phases.ondropdeactivate; }
                if (isFunction(phases.ondragenter)     ) { this.ondragenter      = phases.ondragenter     ; }
                if (isFunction(phases.ondragleave)     ) { this.ondragleave      = phases.ondragleave     ; }
                if (isFunction(phases.ondropmove)      ) { this.ondropmove       = phases.ondropmove      ; }
            }
            else {
                action = 'on' + action;

                if (isFunction(phases.onstart)       ) { this[action + 'start'         ] = phases.onstart         ; }
                if (isFunction(phases.onmove)        ) { this[action + 'move'          ] = phases.onmove          ; }
                if (isFunction(phases.onend)         ) { this[action + 'end'           ] = phases.onend           ; }
                if (isFunction(phases.oninertiastart)) { this[action + 'inertiastart'  ] = phases.oninertiastart  ; }
            }

            return this;
        },

        /*\
         * Interactable.draggable
         [ method ]
         *
         * Gets or sets whether drag actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of drag events
         | var isDraggable = interact('ul li').draggable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on drag events (object makes the Interactable draggable)
         = (object) This Interactable
         | interact(element).draggable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // the axis in which the first movement must be
         |     // for the drag sequence to start
         |     // 'xy' by default - any direction
         |     axis: 'x' || 'y' || 'xy',
         |
         |     // max number of drags that can happen concurrently
         |     // with elements of this Interactable. Infinity by default
         |     max: Infinity,
         |
         |     // max number of drags that can target the same element+Interactable
         |     // 1 by default
         |     maxPerElement: 2
         | });
        \*/
        draggable: function (options) {
            if (isObject(options)) {
                this.options.drag.enabled = options.enabled === false? false: true;
                this.setPerAction('drag', options);
                this.setOnEvents('drag', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.drag.axis = options.axis;
                }
                else if (options.axis === null) {
                    delete this.options.drag.axis;
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drag.enabled = options;

                return this;
            }

            return this.options.drag;
        },

        setPerAction: function (action, options) {
            // for all the default per-action options
            for (var option in options) {
                // if this option exists for this action
                if (option in defaultOptions[action]) {
                    // if the option in the options arg is an object value
                    if (isObject(options[option])) {
                        // duplicate the object
                        this.options[action][option] = extend(this.options[action][option] || {}, options[option]);

                        if (isObject(defaultOptions.perAction[option]) && 'enabled' in defaultOptions.perAction[option]) {
                            this.options[action][option].enabled = options[option].enabled === false? false : true;
                        }
                    }
                    else if (isBool(options[option]) && isObject(defaultOptions.perAction[option])) {
                        this.options[action][option].enabled = options[option];
                    }
                    else if (options[option] !== undefined) {
                        // or if it's not undefined, do a plain assignment
                        this.options[action][option] = options[option];
                    }
                }
            }
        },

        /*\
         * Interactable.dropzone
         [ method ]
         *
         * Returns or sets whether elements can be dropped onto this
         * Interactable to trigger drop events
         *
         * Dropzones can receive the following events:
         *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
         *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
         *  - `dragmove` when a draggable that has entered the dropzone is moved
         *  - `drop` when a draggable is dropped into this dropzone
         *
         *  Use the `accept` option to allow only elements that match the given CSS selector or element.
         *
         *  Use the `overlap` option to set how drops are checked for. The allowed values are:
         *   - `'pointer'`, the pointer must be over the dropzone (default)
         *   - `'center'`, the draggable element's center must be over the dropzone
         *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
         *       e.g. `0.5` for drop to happen when half of the area of the
         *       draggable is over the dropzone
         *
         - options (boolean | object | null) #optional The new value to be set.
         | interact('.drop').dropzone({
         |   accept: '.can-drop' || document.getElementById('single-drop'),
         |   overlap: 'pointer' || 'center' || zeroToOne
         | }
         = (boolean | object) The current setting or this Interactable
        \*/
        dropzone: function (options) {
            if (isObject(options)) {
                this.options.drop.enabled = options.enabled === false? false: true;
                this.setOnEvents('drop', options);

                if (/^(pointer|center)$/.test(options.overlap)) {
                    this.options.drop.overlap = options.overlap;
                }
                else if (isNumber(options.overlap)) {
                    this.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
                }
                if ('accept' in options) {
                  this.options.drop.accept = options.accept;
                }
                if ('checker' in options) {
                  this.options.drop.checker = options.checker;
                }

                return this;
            }

            if (isBool(options)) {
                this.options.drop.enabled = options;

                return this;
            }

            return this.options.drop;
        },

        dropCheck: function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
            var dropped = false;

            // if the dropzone has no rect (eg. display: none)
            // call the custom dropChecker or just return false
            if (!(rect = rect || this.getRect(dropElement))) {
                return (this.options.drop.checker
                    ? this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement)
                    : false);
            }

            var dropOverlap = this.options.drop.overlap;

            if (dropOverlap === 'pointer') {
                var page = getPageXY(dragEvent),
                    origin = getOriginXY(draggable, draggableElement),
                    horizontal,
                    vertical;

                page.x += origin.x;
                page.y += origin.y;

                horizontal = (page.x > rect.left) && (page.x < rect.right);
                vertical   = (page.y > rect.top ) && (page.y < rect.bottom);

                dropped = horizontal && vertical;
            }

            var dragRect = draggable.getRect(draggableElement);

            if (dropOverlap === 'center') {
                var cx = dragRect.left + dragRect.width  / 2,
                    cy = dragRect.top  + dragRect.height / 2;

                dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
            }

            if (isNumber(dropOverlap)) {
                var overlapArea  = (Math.max(0, Math.min(rect.right , dragRect.right ) - Math.max(rect.left, dragRect.left))
                                  * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top , dragRect.top ))),
                    overlapRatio = overlapArea / (dragRect.width * dragRect.height);

                dropped = overlapRatio >= dropOverlap;
            }

            if (this.options.drop.checker) {
                dropped = this.options.drop.checker(dragEvent, event, dropped, this, dropElement, draggable, draggableElement);
            }

            return dropped;
        },

        /*\
         * Interactable.dropChecker
         [ method ]
         *
         * DEPRECATED. Use interactable.dropzone({ checker: function... }) instead.
         *
         * Gets or sets the function used to check if a dragged element is
         * over this Interactable.
         *
         - checker (function) #optional The function that will be called when checking for a drop
         = (Function | Interactable) The checker function or this Interactable
         *
         * The checker function takes the following arguments:
         *
         - dragEvent (InteractEvent) The related dragmove or dragend event
         - event (TouchEvent | PointerEvent | MouseEvent) The user move/up/end Event related to the dragEvent
         - dropped (boolean) The value from the default drop checker
         - dropzone (Interactable) The dropzone interactable
         - dropElement (Element) The dropzone element
         - draggable (Interactable) The Interactable being dragged
         - draggableElement (Element) The actual element that's being dragged
         *
         > Usage:
         | interact(target)
         | .dropChecker(function(dragEvent,         // related dragmove or dragend event
         |                       event,             // TouchEvent/PointerEvent/MouseEvent
         |                       dropped,           // bool result of the default checker
         |                       dropzone,          // dropzone Interactable
         |                       dropElement,       // dropzone elemnt
         |                       draggable,         // draggable Interactable
         |                       draggableElement) {// draggable element
         |
         |   return dropped && event.target.hasAttribute('allow-drop');
         | }
        \*/
        dropChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.drop.checker = checker;

                return this;
            }
            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.options.drop.checker;
        },

        /*\
         * Interactable.accept
         [ method ]
         *
         * Deprecated. add an `accept` property to the options object passed to
         * @Interactable.dropzone instead.
         *
         * Gets or sets the Element or CSS selector match that this
         * Interactable accepts if it is a dropzone.
         *
         - newValue (Element | string | null) #optional
         * If it is an Element, then only that element can be dropped into this dropzone.
         * If it is a string, the element being dragged must match it as a selector.
         * If it is null, the accept options is cleared - it accepts any element.
         *
         = (string | Element | null | Interactable) The current accept option if given `undefined` or this Interactable
        \*/
        accept: function (newValue) {
            if (isElement(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            // test if it is a valid CSS selector
            if (trySelector(newValue)) {
                this.options.drop.accept = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.drop.accept;

                return this;
            }

            return this.options.drop.accept;
        },

        /*\
         * Interactable.resizable
         [ method ]
         *
         * Gets or sets whether resize actions can be performed on the
         * Interactable
         *
         = (boolean) Indicates if this can be the target of resize elements
         | var isResizeable = interact('input[type=text]').resizable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on resize events (object makes the Interactable resizable)
         = (object) This Interactable
         | interact(element).resizable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     edges: {
         |       top   : true,       // Use pointer coords to check for resize.
         |       left  : false,      // Disable resizing from left edge.
         |       bottom: '.resize-s',// Resize if pointer target matches selector
         |       right : handleEl    // Resize if pointer target is the given Element
         |     },
         |
         |     // Width and height can be adjusted independently. When `true`, width and
         |     // height are adjusted at a 1:1 ratio.
         |     square: false,
         |
         |     // Width and height can be adjusted independently. When `true`, width and
         |     // height maintain the aspect ratio they had when resizing started.
         |     preserveAspectRatio: false,
         |
         |     // a value of 'none' will limit the resize rect to a minimum of 0x0
         |     // 'negate' will allow the rect to have negative width/height
         |     // 'reposition' will keep the width/height positive by swapping
         |     // the top and bottom edges and/or swapping the left and right edges
         |     invert: 'none' || 'negate' || 'reposition'
         |
         |     // limit multiple resizes.
         |     // See the explanation in the @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        resizable: function (options) {
            if (isObject(options)) {
                this.options.resize.enabled = options.enabled === false? false: true;
                this.setPerAction('resize', options);
                this.setOnEvents('resize', options);

                if (/^x$|^y$|^xy$/.test(options.axis)) {
                    this.options.resize.axis = options.axis;
                }
                else if (options.axis === null) {
                    this.options.resize.axis = defaultOptions.resize.axis;
                }

                if (isBool(options.preserveAspectRatio)) {
                    this.options.resize.preserveAspectRatio = options.preserveAspectRatio;
                }
                else if (isBool(options.square)) {
                    this.options.resize.square = options.square;
                }

                return this;
            }
            if (isBool(options)) {
                this.options.resize.enabled = options;

                return this;
            }
            return this.options.resize;
        },

        /*\
         * Interactable.squareResize
         [ method ]
         *
         * Deprecated. Add a `square: true || false` property to @Interactable.resizable instead
         *
         * Gets or sets whether resizing is forced 1:1 aspect
         *
         = (boolean) Current setting
         *
         * or
         *
         - newValue (boolean) #optional
         = (object) this Interactable
        \*/
        squareResize: function (newValue) {
            if (isBool(newValue)) {
                this.options.resize.square = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.resize.square;

                return this;
            }

            return this.options.resize.square;
        },

        /*\
         * Interactable.gesturable
         [ method ]
         *
         * Gets or sets whether multitouch gestures can be performed on the
         * Interactable's element
         *
         = (boolean) Indicates if this can be the target of gesture events
         | var isGestureable = interact(element).gesturable();
         * or
         - options (boolean | object) #optional true/false or An object with event listeners to be fired on gesture events (makes the Interactable gesturable)
         = (object) this Interactable
         | interact(element).gesturable({
         |     onstart: function (event) {},
         |     onmove : function (event) {},
         |     onend  : function (event) {},
         |
         |     // limit multiple gestures.
         |     // See the explanation in @Interactable.draggable example
         |     max: Infinity,
         |     maxPerElement: 1,
         | });
        \*/
        gesturable: function (options) {
            if (isObject(options)) {
                this.options.gesture.enabled = options.enabled === false? false: true;
                this.setPerAction('gesture', options);
                this.setOnEvents('gesture', options);

                return this;
            }

            if (isBool(options)) {
                this.options.gesture.enabled = options;

                return this;
            }

            return this.options.gesture;
        },

        /*\
         * Interactable.autoScroll
         [ method ]
         **
         * Deprecated. Add an `autoscroll` property to the options object
         * passed to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets whether dragging and resizing near the edges of the
         * window/container trigger autoScroll for this Interactable
         *
         = (object) Object with autoScroll properties
         *
         * or
         *
         - options (object | boolean) #optional
         * options can be:
         * - an object with margin, distance and interval properties,
         * - true or false to enable or disable autoScroll or
         = (Interactable) this Interactable
        \*/
        autoScroll: function (options) {
            if (isObject(options)) {
                options = extend({ actions: ['drag', 'resize']}, options);
            }
            else if (isBool(options)) {
                options = { actions: ['drag', 'resize'], enabled: options };
            }

            return this.setOptions('autoScroll', options);
        },

        /*\
         * Interactable.snap
         [ method ]
         **
         * Deprecated. Add a `snap` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how action coordinates are snapped. By
         * default, snapping is relative to the pointer coordinates. You can
         * change this by setting the
         * [`elementOrigin`](https://github.com/taye/interact.js/pull/72).
         **
         = (boolean | object) `false` if snap is disabled; object with snap properties if snap is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | interact(document.querySelector('#thing')).snap({
         |     targets: [
         |         // snap to this specific point
         |         {
         |             x: 100,
         |             y: 100,
         |             range: 25
         |         },
         |         // give this function the x and y page coords and snap to the object returned
         |         function (x, y) {
         |             return {
         |                 x: x,
         |                 y: (75 + 50 * Math.sin(x * 0.04)),
         |                 range: 40
         |             };
         |         },
         |         // create a function that snaps to a grid
         |         interact.createSnapGrid({
         |             x: 50,
         |             y: 50,
         |             range: 10,              // optional
         |             offset: { x: 5, y: 10 } // optional
         |         })
         |     ],
         |     // do not snap during normal movement.
         |     // Instead, trigger only one snapped move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     relativePoints: [
         |         { x: 0, y: 0 },  // snap relative to the top left of the element
         |         { x: 1, y: 1 },  // and also to the bottom right
         |     ],  
         |
         |     // offset the snap target coordinates
         |     // can be an object with x/y or 'startCoords'
         |     offset: { x: 50, y: 50 }
         |   }
         | });
        \*/
        snap: function (options) {
            var ret = this.setOptions('snap', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        setOptions: function (option, options) {
            var actions = options && isArray(options.actions)
                    ? options.actions
                    : ['drag'];

            var i;

            if (isObject(options) || isBool(options)) {
                for (i = 0; i < actions.length; i++) {
                    var action = /resize/.test(actions[i])? 'resize' : actions[i];

                    if (!isObject(this.options[action])) { continue; }

                    var thisOption = this.options[action][option];

                    if (isObject(options)) {
                        extend(thisOption, options);
                        thisOption.enabled = options.enabled === false? false: true;

                        if (option === 'snap') {
                            if (thisOption.mode === 'grid') {
                                thisOption.targets = [
                                    interact.createSnapGrid(extend({
                                        offset: thisOption.gridOffset || { x: 0, y: 0 }
                                    }, thisOption.grid || {}))
                                ];
                            }
                            else if (thisOption.mode === 'anchor') {
                                thisOption.targets = thisOption.anchors;
                            }
                            else if (thisOption.mode === 'path') {
                                thisOption.targets = thisOption.paths;
                            }

                            if ('elementOrigin' in options) {
                                thisOption.relativePoints = [options.elementOrigin];
                            }
                        }
                    }
                    else if (isBool(options)) {
                        thisOption.enabled = options;
                    }
                }

                return this;
            }

            var ret = {},
                allActions = ['drag', 'resize', 'gesture'];

            for (i = 0; i < allActions.length; i++) {
                if (option in defaultOptions[allActions[i]]) {
                    ret[allActions[i]] = this.options[allActions[i]][option];
                }
            }

            return ret;
        },


        /*\
         * Interactable.inertia
         [ method ]
         **
         * Deprecated. Add an `inertia` property to the options object passed
         * to @Interactable.draggable or @Interactable.resizable instead.
         *
         * Returns or sets if and how events continue to run after the pointer is released
         **
         = (boolean | object) `false` if inertia is disabled; `object` with inertia properties if inertia is enabled
         **
         * or
         **
         - options (object | boolean | null) #optional
         = (Interactable) this Interactable
         > Usage
         | // enable and use default settings
         | interact(element).inertia(true);
         |
         | // enable and use custom settings
         | interact(element).inertia({
         |     // value greater than 0
         |     // high values slow the object down more quickly
         |     resistance     : 16,
         |
         |     // the minimum launch speed (pixels per second) that results in inertia start
         |     minSpeed       : 200,
         |
         |     // inertia will stop when the object slows down to this speed
         |     endSpeed       : 20,
         |
         |     // boolean; should actions be resumed when the pointer goes down during inertia
         |     allowResume    : true,
         |
         |     // boolean; should the jump when resuming from inertia be ignored in event.dx/dy
         |     zeroResumeDelta: false,
         |
         |     // if snap/restrict are set to be endOnly and inertia is enabled, releasing
         |     // the pointer without triggering inertia will animate from the release
         |     // point to the snaped/restricted point in the given amount of time (ms)
         |     smoothEndDuration: 300,
         |
         |     // an array of action types that can have inertia (no gesture)
         |     actions        : ['drag', 'resize']
         | });
         |
         | // reset custom settings and use all defaults
         | interact(element).inertia(null);
        \*/
        inertia: function (options) {
            var ret = this.setOptions('inertia', options);

            if (ret === this) { return this; }

            return ret.drag;
        },

        getAction: function (pointer, event, interaction, element) {
            var action = this.defaultActionChecker(pointer, interaction, element);

            if (this.options.actionChecker) {
                return this.options.actionChecker(pointer, event, action, this, element, interaction);
            }

            return action;
        },

        defaultActionChecker: defaultActionChecker,

        /*\
         * Interactable.actionChecker
         [ method ]
         *
         * Gets or sets the function used to check action to be performed on
         * pointerDown
         *
         - checker (function | null) #optional A function which takes a pointer event, defaultAction string, interactable, element and interaction as parameters and returns an object with name property 'drag' 'resize' or 'gesture' and optionally an `edges` object with boolean 'top', 'left', 'bottom' and right props.
         = (Function | Interactable) The checker function or this Interactable
         *
         | interact('.resize-drag')
         |   .resizable(true)
         |   .draggable(true)
         |   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
         |
         |   if (interact.matchesSelector(event.target, '.drag-handle') {
         |     // force drag with handle target
         |     action.name = drag;
         |   }
         |   else {
         |     // resize from the top and right edges
         |     action.name  = 'resize';
         |     action.edges = { top: true, right: true };
         |   }
         |
         |   return action;
         | });
        \*/
        actionChecker: function (checker) {
            if (isFunction(checker)) {
                this.options.actionChecker = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.actionChecker;

                return this;
            }

            return this.options.actionChecker;
        },

        /*\
         * Interactable.getRect
         [ method ]
         *
         * The default function to get an Interactables bounding rect. Can be
         * overridden using @Interactable.rectChecker.
         *
         - element (Element) #optional The element to measure.
         = (object) The object's bounding rectangle.
         o {
         o     top   : 0,
         o     left  : 0,
         o     bottom: 0,
         o     right : 0,
         o     width : 0,
         o     height: 0
         o }
        \*/
        getRect: function rectCheck (element) {
            element = element || this._element;

            if (this.selector && !(isElement(element))) {
                element = this._context.querySelector(this.selector);
            }

            return getElementRect(element);
        },

        /*\
         * Interactable.rectChecker
         [ method ]
         *
         * Returns or sets the function used to calculate the interactable's
         * element's rectangle
         *
         - checker (function) #optional A function which returns this Interactable's bounding rectangle. See @Interactable.getRect
         = (function | object) The checker function or this Interactable
        \*/
        rectChecker: function (checker) {
            if (isFunction(checker)) {
                this.getRect = checker;

                return this;
            }

            if (checker === null) {
                delete this.options.getRect;

                return this;
            }

            return this.getRect;
        },

        /*\
         * Interactable.styleCursor
         [ method ]
         *
         * Returns or sets whether the action that would be performed when the
         * mouse on the element are checked on `mousemove` so that the cursor
         * may be styled appropriately
         *
         - newValue (boolean) #optional
         = (boolean | Interactable) The current setting or this Interactable
        \*/
        styleCursor: function (newValue) {
            if (isBool(newValue)) {
                this.options.styleCursor = newValue;

                return this;
            }

            if (newValue === null) {
                delete this.options.styleCursor;

                return this;
            }

            return this.options.styleCursor;
        },

        /*\
         * Interactable.preventDefault
         [ method ]
         *
         * Returns or sets whether to prevent the browser's default behaviour
         * in response to pointer events. Can be set to:
         *  - `'always'` to always prevent
         *  - `'never'` to never prevent
         *  - `'auto'` to let interact.js try to determine what would be best
         *
         - newValue (string) #optional `true`, `false` or `'auto'`
         = (string | Interactable) The current setting or this Interactable
        \*/
        preventDefault: function (newValue) {
            if (/^(always|never|auto)$/.test(newValue)) {
                this.options.preventDefault = newValue;
                return this;
            }

            if (isBool(newValue)) {
                this.options.preventDefault = newValue? 'always' : 'never';
                return this;
            }

            return this.options.preventDefault;
        },

        /*\
         * Interactable.origin
         [ method ]
         *
         * Gets or sets the origin of the Interactable's element.  The x and y
         * of the origin will be subtracted from action event coordinates.
         *
         - origin (object | string) #optional An object eg. { x: 0, y: 0 } or string 'parent', 'self' or any CSS selector
         * OR
         - origin (Element) #optional An HTML or SVG Element whose rect will be used
         **
         = (object) The current origin or this Interactable
        \*/
        origin: function (newValue) {
            if (trySelector(newValue)) {
                this.options.origin = newValue;
                return this;
            }
            else if (isObject(newValue)) {
                this.options.origin = newValue;
                return this;
            }

            return this.options.origin;
        },

        /*\
         * Interactable.deltaSource
         [ method ]
         *
         * Returns or sets the mouse coordinate types used to calculate the
         * movement of the pointer.
         *
         - newValue (string) #optional Use 'client' if you will be scrolling while interacting; Use 'page' if you want autoScroll to work
         = (string | object) The current deltaSource or this Interactable
        \*/
        deltaSource: function (newValue) {
            if (newValue === 'page' || newValue === 'client') {
                this.options.deltaSource = newValue;

                return this;
            }

            return this.options.deltaSource;
        },

        /*\
         * Interactable.restrict
         [ method ]
         **
         * Deprecated. Add a `restrict` property to the options object passed to
         * @Interactable.draggable, @Interactable.resizable or @Interactable.gesturable instead.
         *
         * Returns or sets the rectangles within which actions on this
         * interactable (after snap calculations) are restricted. By default,
         * restricting is relative to the pointer coordinates. You can change
         * this by setting the
         * [`elementRect`](https://github.com/taye/interact.js/pull/72).
         **
         - options (object) #optional an object with keys drag, resize, and/or gesture whose values are rects, Elements, CSS selectors, or 'parent' or 'self'
         = (object) The current restrictions object or this Interactable
         **
         | interact(element).restrict({
         |     // the rect will be `interact.getElementRect(element.parentNode)`
         |     drag: element.parentNode,
         |
         |     // x and y are relative to the the interactable's origin
         |     resize: { x: 100, y: 100, width: 200, height: 200 }
         | })
         |
         | interact('.draggable').restrict({
         |     // the rect will be the selected element's parent
         |     drag: 'parent',
         |
         |     // do not restrict during normal movement.
         |     // Instead, trigger only one restricted move event
         |     // immediately before the end event.
         |     endOnly: true,
         |
         |     // https://github.com/taye/interact.js/pull/72#issue-41813493
         |     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
         | });
        \*/
        restrict: function (options) {
            if (!isObject(options)) {
                return this.setOptions('restrict', options);
            }

            var actions = ['drag', 'resize', 'gesture'],
                ret;

            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];

                if (action in options) {
                    var perAction = extend({
                            actions: [action],
                            restriction: options[action]
                        }, options);

                    ret = this.setOptions('restrict', perAction);
                }
            }

            return ret;
        },

        /*\
         * Interactable.context
         [ method ]
         *
         * Gets the selector context Node of the Interactable. The default is `window.document`.
         *
         = (Node) The context Node of this Interactable
         **
        \*/
        context: function () {
            return this._context;
        },

        _context: document,

        /*\
         * Interactable.ignoreFrom
         [ method ]
         *
         * If the target of the `mousedown`, `pointerdown` or `touchstart`
         * event or any of it's parents match the given CSS selector or
         * Element, no drag/resize/gesture is started.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to not ignore any elements
         = (string | Element | object) The current ignoreFrom value or this Interactable
         **
         | interact(element, { ignoreFrom: document.getElementById('no-action') });
         | // or
         | interact(element).ignoreFrom('input, textarea, a');
        \*/
        ignoreFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.ignoreFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.ignoreFrom = newValue;
                return this;
            }

            return this.options.ignoreFrom;
        },

        /*\
         * Interactable.allowFrom
         [ method ]
         *
         * A drag/resize/gesture is started only If the target of the
         * `mousedown`, `pointerdown` or `touchstart` event or any of it's
         * parents match the given CSS selector or Element.
         *
         - newValue (string | Element | null) #optional a CSS selector string, an Element or `null` to allow from any element
         = (string | Element | object) The current allowFrom value or this Interactable
         **
         | interact(element, { allowFrom: document.getElementById('drag-handle') });
         | // or
         | interact(element).allowFrom('.handle');
        \*/
        allowFrom: function (newValue) {
            if (trySelector(newValue)) {            // CSS selector to match event.target
                this.options.allowFrom = newValue;
                return this;
            }

            if (isElement(newValue)) {              // specific element
                this.options.allowFrom = newValue;
                return this;
            }

            return this.options.allowFrom;
        },

        /*\
         * Interactable.element
         [ method ]
         *
         * If this is not a selector Interactable, it returns the element this
         * interactable represents
         *
         = (Element) HTML / SVG Element
        \*/
        element: function () {
            return this._element;
        },

        /*\
         * Interactable.fire
         [ method ]
         *
         * Calls listeners for the given InteractEvent type bound globally
         * and directly to this Interactable
         *
         - iEvent (InteractEvent) The InteractEvent object to be fired on this Interactable
         = (Interactable) this Interactable
        \*/
        fire: function (iEvent) {
            if (!(iEvent && iEvent.type) || !contains(eventTypes, iEvent.type)) {
                return this;
            }

            var listeners,
                i,
                len,
                onEvent = 'on' + iEvent.type,
                funcName = '';

            // Interactable#on() listeners
            if (iEvent.type in this._iEvents) {
                listeners = this._iEvents[iEvent.type];

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            // interactable.onevent listener
            if (isFunction(this[onEvent])) {
                funcName = this[onEvent].name;
                this[onEvent](iEvent);
            }

            // interact.on() listeners
            if (iEvent.type in globalEvents && (listeners = globalEvents[iEvent.type]))  {

                for (i = 0, len = listeners.length; i < len && !iEvent.immediatePropagationStopped; i++) {
                    funcName = listeners[i].name;
                    listeners[i](iEvent);
                }
            }

            return this;
        },

        /*\
         * Interactable.on
         [ method ]
         *
         * Binds a listener for an InteractEvent or DOM event.
         *
         - eventType  (string | array | object) The types of events to listen for
         - listener   (function) The function to be called on the given event(s)
         - useCapture (boolean) #optional useCapture flag for addEventListener
         = (object) This Interactable
        \*/
        on: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.on(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.on(prop, eventType[prop], listener);
                }

                return this;
            }

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // convert to boolean
            useCapture = useCapture? true: false;

            if (contains(eventTypes, eventType)) {
                // if this type of event was never bound to this Interactable
                if (!(eventType in this._iEvents)) {
                    this._iEvents[eventType] = [listener];
                }
                else {
                    this._iEvents[eventType].push(listener);
                }
            }
            // delegated event for selector
            else if (this.selector) {
                if (!delegatedEvents[eventType]) {
                    delegatedEvents[eventType] = {
                        selectors: [],
                        contexts : [],
                        listeners: []
                    };

                    // add delegate listener functions
                    for (i = 0; i < documents.length; i++) {
                        events.add(documents[i], eventType, delegateListener);
                        events.add(documents[i], eventType, delegateUseCapture, true);
                    }
                }

                var delegated = delegatedEvents[eventType],
                    index;

                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {
                        break;
                    }
                }

                if (index === -1) {
                    index = delegated.selectors.length;

                    delegated.selectors.push(this.selector);
                    delegated.contexts .push(this._context);
                    delegated.listeners.push([]);
                }

                // keep listener and useCapture flag
                delegated.listeners[index].push([listener, useCapture]);
            }
            else {
                events.add(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.off
         [ method ]
         *
         * Removes an InteractEvent or DOM event listener
         *
         - eventType  (string | array | object) The types of events that were listened for
         - listener   (function) The listener function to be removed
         - useCapture (boolean) #optional useCapture flag for removeEventListener
         = (object) This Interactable
        \*/
        off: function (eventType, listener, useCapture) {
            var i;

            if (isString(eventType) && eventType.search(' ') !== -1) {
                eventType = eventType.trim().split(/ +/);
            }

            if (isArray(eventType)) {
                for (i = 0; i < eventType.length; i++) {
                    this.off(eventType[i], listener, useCapture);
                }

                return this;
            }

            if (isObject(eventType)) {
                for (var prop in eventType) {
                    this.off(prop, eventType[prop], listener);
                }

                return this;
            }

            var eventList,
                index = -1;

            // convert to boolean
            useCapture = useCapture? true: false;

            if (eventType === 'wheel') {
                eventType = wheelEvent;
            }

            // if it is an action event type
            if (contains(eventTypes, eventType)) {
                eventList = this._iEvents[eventType];

                if (eventList && (index = indexOf(eventList, listener)) !== -1) {
                    this._iEvents[eventType].splice(index, 1);
                }
            }
            // delegated event
            else if (this.selector) {
                var delegated = delegatedEvents[eventType],
                    matchFound = false;

                if (!delegated) { return this; }

                // count from last index of delegated to 0
                for (index = delegated.selectors.length - 1; index >= 0; index--) {
                    // look for matching selector and context Node
                    if (delegated.selectors[index] === this.selector
                        && delegated.contexts[index] === this._context) {

                        var listeners = delegated.listeners[index];

                        // each item of the listeners array is an array: [function, useCaptureFlag]
                        for (i = listeners.length - 1; i >= 0; i--) {
                            var fn = listeners[i][0],
                                useCap = listeners[i][1];

                            // check if the listener functions and useCapture flags match
                            if (fn === listener && useCap === useCapture) {
                                // remove the listener from the array of listeners
                                listeners.splice(i, 1);

                                // if all listeners for this interactable have been removed
                                // remove the interactable from the delegated arrays
                                if (!listeners.length) {
                                    delegated.selectors.splice(index, 1);
                                    delegated.contexts .splice(index, 1);
                                    delegated.listeners.splice(index, 1);

                                    // remove delegate function from context
                                    events.remove(this._context, eventType, delegateListener);
                                    events.remove(this._context, eventType, delegateUseCapture, true);

                                    // remove the arrays if they are empty
                                    if (!delegated.selectors.length) {
                                        delegatedEvents[eventType] = null;
                                    }
                                }

                                // only remove one listener
                                matchFound = true;
                                break;
                            }
                        }

                        if (matchFound) { break; }
                    }
                }
            }
            // remove listener from this Interatable's element
            else {
                events.remove(this._element, eventType, listener, useCapture);
            }

            return this;
        },

        /*\
         * Interactable.set
         [ method ]
         *
         * Reset the options of this Interactable
         - options (object) The new settings to apply
         = (object) This Interactable
        \*/
        set: function (options) {
            if (!isObject(options)) {
                options = {};
            }

            this.options = extend({}, defaultOptions.base);

            var i,
                actions = ['drag', 'drop', 'resize', 'gesture'],
                methods = ['draggable', 'dropzone', 'resizable', 'gesturable'],
                perActions = extend(extend({}, defaultOptions.perAction), options[action] || {});

            for (i = 0; i < actions.length; i++) {
                var action = actions[i];

                this.options[action] = extend({}, defaultOptions[action]);

                this.setPerAction(action, perActions);

                this[methods[i]](options[action]);
            }

            var settings = [
                    'accept', 'actionChecker', 'allowFrom', 'deltaSource',
                    'dropChecker', 'ignoreFrom', 'origin', 'preventDefault',
                    'rectChecker', 'styleCursor'
                ];

            for (i = 0, len = settings.length; i < len; i++) {
                var setting = settings[i];

                this.options[setting] = defaultOptions.base[setting];

                if (setting in options) {
                    this[setting](options[setting]);
                }
            }

            return this;
        },

        /*\
         * Interactable.unset
         [ method ]
         *
         * Remove this interactable from the list of interactables and remove
         * it's drag, drop, resize and gesture capabilities
         *
         = (object) @interact
        \*/
        unset: function () {
            events.remove(this._element, 'all');

            if (!isString(this.selector)) {
                events.remove(this, 'all');
                if (this.options.styleCursor) {
                    this._element.style.cursor = '';
                }
            }
            else {
                // remove delegated events
                for (var type in delegatedEvents) {
                    var delegated = delegatedEvents[type];

                    for (var i = 0; i < delegated.selectors.length; i++) {
                        if (delegated.selectors[i] === this.selector
                            && delegated.contexts[i] === this._context) {

                            delegated.selectors.splice(i, 1);
                            delegated.contexts .splice(i, 1);
                            delegated.listeners.splice(i, 1);

                            // remove the arrays if they are empty
                            if (!delegated.selectors.length) {
                                delegatedEvents[type] = null;
                            }
                        }

                        events.remove(this._context, type, delegateListener);
                        events.remove(this._context, type, delegateUseCapture, true);

                        break;
                    }
                }
            }

            this.dropzone(false);

            interactables.splice(indexOf(interactables, this), 1);

            return interact;
        }
    };

    function warnOnce (method, message) {
        var warned = false;

        return function () {
            if (!warned) {
                window.console.warn(message);
                warned = true;
            }

            return method.apply(this, arguments);
        };
    }

    Interactable.prototype.snap = warnOnce(Interactable.prototype.snap,
         'Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping');
    Interactable.prototype.restrict = warnOnce(Interactable.prototype.restrict,
         'Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction');
    Interactable.prototype.inertia = warnOnce(Interactable.prototype.inertia,
         'Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia');
    Interactable.prototype.autoScroll = warnOnce(Interactable.prototype.autoScroll,
         'Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll');
    Interactable.prototype.squareResize = warnOnce(Interactable.prototype.squareResize,
         'Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square');

    Interactable.prototype.accept = warnOnce(Interactable.prototype.accept,
         'Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead');
    Interactable.prototype.dropChecker = warnOnce(Interactable.prototype.dropChecker,
         'Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead');
    Interactable.prototype.context = warnOnce(Interactable.prototype.context,
         'Interactable#context as a method is deprecated. It will soon be a DOM Node instead');

    /*\
     * interact.isSet
     [ method ]
     *
     * Check if an element has been set
     - element (Element) The Element being searched for
     = (boolean) Indicates if the element or CSS selector was previously passed to interact
    \*/
    interact.isSet = function(element, options) {
        return interactables.indexOfElement(element, options && options.context) !== -1;
    };

    /*\
     * interact.on
     [ method ]
     *
     * Adds a global listener for an InteractEvent or adds a DOM event to
     * `document`
     *
     - type       (string | array | object) The types of events to listen for
     - listener   (function) The function to be called on the given event(s)
     - useCapture (boolean) #optional useCapture flag for addEventListener
     = (object) interact
    \*/
    interact.on = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.on(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.on(prop, type[prop], listener);
            }

            return interact;
        }

        // if it is an InteractEvent type, add listener to globalEvents
        if (contains(eventTypes, type)) {
            // if this type of event was never bound
            if (!globalEvents[type]) {
                globalEvents[type] = [listener];
            }
            else {
                globalEvents[type].push(listener);
            }
        }
        // If non InteractEvent type, addEventListener to document
        else {
            events.add(document, type, listener, useCapture);
        }

        return interact;
    };

    /*\
     * interact.off
     [ method ]
     *
     * Removes a global InteractEvent listener or DOM event from `document`
     *
     - type       (string | array | object) The types of events that were listened for
     - listener   (function) The listener function to be removed
     - useCapture (boolean) #optional useCapture flag for removeEventListener
     = (object) interact
     \*/
    interact.off = function (type, listener, useCapture) {
        if (isString(type) && type.search(' ') !== -1) {
            type = type.trim().split(/ +/);
        }

        if (isArray(type)) {
            for (var i = 0; i < type.length; i++) {
                interact.off(type[i], listener, useCapture);
            }

            return interact;
        }

        if (isObject(type)) {
            for (var prop in type) {
                interact.off(prop, type[prop], listener);
            }

            return interact;
        }

        if (!contains(eventTypes, type)) {
            events.remove(document, type, listener, useCapture);
        }
        else {
            var index;

            if (type in globalEvents
                && (index = indexOf(globalEvents[type], listener)) !== -1) {
                globalEvents[type].splice(index, 1);
            }
        }

        return interact;
    };

    /*\
     * interact.enableDragging
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether dragging is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableDragging = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.drag = newValue;

            return interact;
        }
        return actionIsEnabled.drag;
    }, 'interact.enableDragging is deprecated and will soon be removed.');

    /*\
     * interact.enableResizing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether resizing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableResizing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.resize = newValue;

            return interact;
        }
        return actionIsEnabled.resize;
    }, 'interact.enableResizing is deprecated and will soon be removed.');

    /*\
     * interact.enableGesturing
     [ method ]
     *
     * Deprecated.
     *
     * Returns or sets whether gesturing is enabled for any Interactables
     *
     - newValue (boolean) #optional `true` to allow the action; `false` to disable action for all Interactables
     = (boolean | object) The current setting or interact
    \*/
    interact.enableGesturing = warnOnce(function (newValue) {
        if (newValue !== null && newValue !== undefined) {
            actionIsEnabled.gesture = newValue;

            return interact;
        }
        return actionIsEnabled.gesture;
    }, 'interact.enableGesturing is deprecated and will soon be removed.');

    interact.eventTypes = eventTypes;

    /*\
     * interact.debug
     [ method ]
     *
     * Returns debugging data
     = (object) An object with properties that outline the current state and expose internal functions and variables
    \*/
    interact.debug = function () {
        var interaction = interactions[0] || new Interaction();

        return {
            interactions          : interactions,
            target                : interaction.target,
            dragging              : interaction.dragging,
            resizing              : interaction.resizing,
            gesturing             : interaction.gesturing,
            prepared              : interaction.prepared,
            matches               : interaction.matches,
            matchElements         : interaction.matchElements,

            prevCoords            : interaction.prevCoords,
            startCoords           : interaction.startCoords,

            pointerIds            : interaction.pointerIds,
            pointers              : interaction.pointers,
            addPointer            : listeners.addPointer,
            removePointer         : listeners.removePointer,
            recordPointer        : listeners.recordPointer,

            snap                  : interaction.snapStatus,
            restrict              : interaction.restrictStatus,
            inertia               : interaction.inertiaStatus,

            downTime              : interaction.downTimes[0],
            downEvent             : interaction.downEvent,
            downPointer           : interaction.downPointer,
            prevEvent             : interaction.prevEvent,

            Interactable          : Interactable,
            interactables         : interactables,
            pointerIsDown         : interaction.pointerIsDown,
            defaultOptions        : defaultOptions,
            defaultActionChecker  : defaultActionChecker,

            actionCursors         : actionCursors,
            dragMove              : listeners.dragMove,
            resizeMove            : listeners.resizeMove,
            gestureMove           : listeners.gestureMove,
            pointerUp             : listeners.pointerUp,
            pointerDown           : listeners.pointerDown,
            pointerMove           : listeners.pointerMove,
            pointerHover          : listeners.pointerHover,

            eventTypes            : eventTypes,

            events                : events,
            globalEvents          : globalEvents,
            delegatedEvents       : delegatedEvents,

            prefixedPropREs       : prefixedPropREs
        };
    };

    // expose the functions used to calculate multi-touch properties
    interact.getPointerAverage = pointerAverage;
    interact.getTouchBBox     = touchBBox;
    interact.getTouchDistance = touchDistance;
    interact.getTouchAngle    = touchAngle;

    interact.getElementRect         = getElementRect;
    interact.getElementClientRect   = getElementClientRect;
    interact.matchesSelector        = matchesSelector;
    interact.closest                = closest;

    /*\
     * interact.margin
     [ method ]
     *
     * Deprecated. Use `interact(target).resizable({ margin: number });` instead.
     * Returns or sets the margin for autocheck resizing used in
     * @Interactable.getAction. That is the distance from the bottom and right
     * edges of an element clicking in which will start resizing
     *
     - newValue (number) #optional
     = (number | interact) The current margin value or interact
    \*/
    interact.margin = warnOnce(function (newvalue) {
        if (isNumber(newvalue)) {
            margin = newvalue;

            return interact;
        }
        return margin;
    },
    'interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.') ;

    /*\
     * interact.supportsTouch
     [ method ]
     *
     = (boolean) Whether or not the browser supports touch input
    \*/
    interact.supportsTouch = function () {
        return supportsTouch;
    };

    /*\
     * interact.supportsPointerEvent
     [ method ]
     *
     = (boolean) Whether or not the browser supports PointerEvents
    \*/
    interact.supportsPointerEvent = function () {
        return supportsPointerEvent;
    };

    /*\
     * interact.stop
     [ method ]
     *
     * Cancels all interactions (end events are not fired)
     *
     - event (Event) An event on which to call preventDefault()
     = (object) interact
    \*/
    interact.stop = function (event) {
        for (var i = interactions.length - 1; i >= 0; i--) {
            interactions[i].stop(event);
        }

        return interact;
    };

    /*\
     * interact.dynamicDrop
     [ method ]
     *
     * Returns or sets whether the dimensions of dropzone elements are
     * calculated on every dragmove or only on dragstart for the default
     * dropChecker
     *
     - newValue (boolean) #optional True to check on each move. False to check only before start
     = (boolean | interact) The current setting or interact
    \*/
    interact.dynamicDrop = function (newValue) {
        if (isBool(newValue)) {
            //if (dragging && dynamicDrop !== newValue && !newValue) {
                //calcRects(dropzones);
            //}

            dynamicDrop = newValue;

            return interact;
        }
        return dynamicDrop;
    };

    /*\
     * interact.pointerMoveTolerance
     [ method ]
     * Returns or sets the distance the pointer must be moved before an action
     * sequence occurs. This also affects tolerance for tap events.
     *
     - newValue (number) #optional The movement from the start position must be greater than this value
     = (number | Interactable) The current setting or interact
    \*/
    interact.pointerMoveTolerance = function (newValue) {
        if (isNumber(newValue)) {
            pointerMoveTolerance = newValue;

            return this;
        }

        return pointerMoveTolerance;
    };

    /*\
     * interact.maxInteractions
     [ method ]
     **
     * Returns or sets the maximum number of concurrent interactions allowed.
     * By default only 1 interaction is allowed at a time (for backwards
     * compatibility). To allow multiple interactions on the same Interactables
     * and elements, you need to enable it in the draggable, resizable and
     * gesturable `'max'` and `'maxPerElement'` options.
     **
     - newValue (number) #optional Any number. newValue <= 0 means no interactions.
    \*/
    interact.maxInteractions = function (newValue) {
        if (isNumber(newValue)) {
            maxInteractions = newValue;

            return this;
        }

        return maxInteractions;
    };

    interact.createSnapGrid = function (grid) {
        return function (x, y) {
            var offsetX = 0,
                offsetY = 0;

            if (isObject(grid.offset)) {
                offsetX = grid.offset.x;
                offsetY = grid.offset.y;
            }

            var gridx = Math.round((x - offsetX) / grid.x),
                gridy = Math.round((y - offsetY) / grid.y),

                newX = gridx * grid.x + offsetX,
                newY = gridy * grid.y + offsetY;

            return {
                x: newX,
                y: newY,
                range: grid.range
            };
        };
    };

    function endAllInteractions (event) {
        for (var i = 0; i < interactions.length; i++) {
            interactions[i].pointerEnd(event, event);
        }
    }

    function listenToDocument (doc) {
        if (contains(documents, doc)) { return; }

        var win = doc.defaultView || doc.parentWindow;

        // add delegate event listener
        for (var eventType in delegatedEvents) {
            events.add(doc, eventType, delegateListener);
            events.add(doc, eventType, delegateUseCapture, true);
        }

        if (supportsPointerEvent) {
            if (PointerEvent === win.MSPointerEvent) {
                pEventTypes = {
                    up: 'MSPointerUp', down: 'MSPointerDown', over: 'mouseover',
                    out: 'mouseout', move: 'MSPointerMove', cancel: 'MSPointerCancel' };
            }
            else {
                pEventTypes = {
                    up: 'pointerup', down: 'pointerdown', over: 'pointerover',
                    out: 'pointerout', move: 'pointermove', cancel: 'pointercancel' };
            }

            events.add(doc, pEventTypes.down  , listeners.selectorDown );
            events.add(doc, pEventTypes.move  , listeners.pointerMove  );
            events.add(doc, pEventTypes.over  , listeners.pointerOver  );
            events.add(doc, pEventTypes.out   , listeners.pointerOut   );
            events.add(doc, pEventTypes.up    , listeners.pointerUp    );
            events.add(doc, pEventTypes.cancel, listeners.pointerCancel);

            // autoscroll
            events.add(doc, pEventTypes.move, listeners.autoScrollMove);
        }
        else {
            events.add(doc, 'mousedown', listeners.selectorDown);
            events.add(doc, 'mousemove', listeners.pointerMove );
            events.add(doc, 'mouseup'  , listeners.pointerUp   );
            events.add(doc, 'mouseover', listeners.pointerOver );
            events.add(doc, 'mouseout' , listeners.pointerOut  );

            events.add(doc, 'touchstart' , listeners.selectorDown );
            events.add(doc, 'touchmove'  , listeners.pointerMove  );
            events.add(doc, 'touchend'   , listeners.pointerUp    );
            events.add(doc, 'touchcancel', listeners.pointerCancel);

            // autoscroll
            events.add(doc, 'mousemove', listeners.autoScrollMove);
            events.add(doc, 'touchmove', listeners.autoScrollMove);
        }

        events.add(win, 'blur', endAllInteractions);

        try {
            if (win.frameElement) {
                var parentDoc = win.frameElement.ownerDocument,
                    parentWindow = parentDoc.defaultView;

                events.add(parentDoc   , 'mouseup'      , listeners.pointerEnd);
                events.add(parentDoc   , 'touchend'     , listeners.pointerEnd);
                events.add(parentDoc   , 'touchcancel'  , listeners.pointerEnd);
                events.add(parentDoc   , 'pointerup'    , listeners.pointerEnd);
                events.add(parentDoc   , 'MSPointerUp'  , listeners.pointerEnd);
                events.add(parentWindow, 'blur'         , endAllInteractions );
            }
        }
        catch (error) {
            interact.windowParentError = error;
        }

        // prevent native HTML5 drag on interact.js target elements
        events.add(doc, 'dragstart', function (event) {
            for (var i = 0; i < interactions.length; i++) {
                var interaction = interactions[i];

                if (interaction.element
                    && (interaction.element === event.target
                        || nodeContains(interaction.element, event.target))) {

                    interaction.checkAndPreventDefault(event, interaction.target, interaction.element);
                    return;
                }
            }
        });

        if (events.useAttachEvent) {
            // For IE's lack of Event#preventDefault
            events.add(doc, 'selectstart', function (event) {
                var interaction = interactions[0];

                if (interaction.currentAction()) {
                    interaction.checkAndPreventDefault(event);
                }
            });

            // For IE's bad dblclick event sequence
            events.add(doc, 'dblclick', doOnInteractions('ie8Dblclick'));
        }

        documents.push(doc);
    }

    listenToDocument(document);

    function indexOf (array, target) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === target) {
                return i;
            }
        }

        return -1;
    }

    function contains (array, target) {
        return indexOf(array, target) !== -1;
    }

    function matchesSelector (element, selector, nodeList) {
        if (ie8MatchesSelector) {
            return ie8MatchesSelector(element, selector, nodeList);
        }

        // remove /deep/ from selectors if shadowDOM polyfill is used
        if (window !== realWindow) {
            selector = selector.replace(/\/deep\//g, ' ');
        }

        return element[prefixedMatchesSelector](selector);
    }

    function matchesUpTo (element, selector, limit) {
        while (isElement(element)) {
            if (matchesSelector(element, selector)) {
                return true;
            }

            element = parentElement(element);

            if (element === limit) {
                return matchesSelector(element, selector);
            }
        }

        return false;
    }

    // For IE8's lack of an Element#matchesSelector
    // taken from http://tanalin.com/en/blog/2012/12/matches-selector-ie8/ and modified
    if (!(prefixedMatchesSelector in Element.prototype) || !isFunction(Element.prototype[prefixedMatchesSelector])) {
        ie8MatchesSelector = function (element, selector, elems) {
            elems = elems || element.parentNode.querySelectorAll(selector);

            for (var i = 0, len = elems.length; i < len; i++) {
                if (elems[i] === element) {
                    return true;
                }
            }

            return false;
        };
    }

    // requestAnimationFrame polyfill
    (function() {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'];

        for(var x = 0; x < vendors.length && !realWindow.requestAnimationFrame; ++x) {
            reqFrame = realWindow[vendors[x]+'RequestAnimationFrame'];
            cancelFrame = realWindow[vendors[x]+'CancelAnimationFrame'] || realWindow[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!reqFrame) {
            reqFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!cancelFrame) {
            cancelFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    /* global exports: true, module, define */

    // http://documentcloud.github.io/underscore/docs/underscore.html#section-11
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = interact;
        }
        exports.interact = interact;
    }
    // AMD
    else if (typeof define === 'function' && define.amd) {
        define('interact', function() {
            return interact;
        });
    }
    else {
        realWindow.interact = interact;
    }

} (typeof window === 'undefined'? undefined : window));

},{}],9:[function(require,module,exports){
/*!
 * Knockout JavaScript library v3.5.1
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function() {(function(n){var A=this||(0,eval)("this"),w=A.document,R=A.navigator,v=A.jQuery,H=A.JSON;v||"undefined"===typeof jQuery||(v=jQuery);(function(n){"function"===typeof define&&define.amd?define(["exports","require"],n):"object"===typeof exports&&"object"===typeof module?n(module.exports||exports):n(A.ko={})})(function(S,T){function K(a,c){return null===a||typeof a in W?a===c:!1}function X(b,c){var d;return function(){d||(d=a.a.setTimeout(function(){d=n;b()},c))}}function Y(b,c){var d;return function(){clearTimeout(d);
d=a.a.setTimeout(b,c)}}function Z(a,c){c&&"change"!==c?"beforeChange"===c?this.pc(a):this.gb(a,c):this.qc(a)}function aa(a,c){null!==c&&c.s&&c.s()}function ba(a,c){var d=this.qd,e=d[r];e.ra||(this.Qb&&this.mb[c]?(d.uc(c,a,this.mb[c]),this.mb[c]=null,--this.Qb):e.I[c]||d.uc(c,a,e.J?{da:a}:d.$c(a)),a.Ja&&a.gd())}var a="undefined"!==typeof S?S:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.L=function(a,c,d){a[c]=d};a.version="3.5.1";a.b("version",
a.version);a.options={deferUpdates:!1,useOnlyNativeEvents:!1,foreachHidesDestroyed:!1};a.a=function(){function b(a,b){for(var c in a)f.call(a,c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)f.call(b,c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}function e(b,c,d,e){var l=b[c].match(q)||[];a.a.D(d.match(q),function(b){a.a.Na(l,b,e)});b[c]=l.join(" ")}var f=Object.prototype.hasOwnProperty,g={__proto__:[]}instanceof Array,h="function"===typeof Symbol,m={},k={};m[R&&/Firefox\/2/i.test(R.userAgent)?
"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];m.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(m,function(a,b){if(b.length)for(var c=0,d=b.length;c<d;c++)k[b[c]]=a});var l={propertychange:!0},p=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:n}(),q=/\S+/g,t;return{Jc:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],
D:function(a,b,c){for(var d=0,e=a.length;d<e;d++)b.call(c,a[d],d,a)},A:"function"==typeof Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},Lb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d,a))return a[d];return n},Pa:function(b,c){var d=a.a.A(b,c);0<d?b.splice(d,1):0===d&&b.shift()},wc:function(b){var c=[];b&&a.a.D(b,function(b){0>a.a.A(c,b)&&c.push(b)});return c},Mb:function(a,
b,c){var d=[];if(a)for(var e=0,l=a.length;e<l;e++)d.push(b.call(c,a[e],e));return d},jb:function(a,b,c){var d=[];if(a)for(var e=0,l=a.length;e<l;e++)b.call(c,a[e],e)&&d.push(a[e]);return d},Nb:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Na:function(b,c,d){var e=a.a.A(a.a.bc(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},Ba:g,extend:c,setPrototypeOf:d,Ab:g?d:c,P:b,Ga:function(a,b,c){if(!a)return a;var d={},e;for(e in a)f.call(a,e)&&(d[e]=
b.call(c,a[e],e,a));return d},Tb:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},Yb:function(b){b=a.a.la(b);for(var c=(b[0]&&b[0].ownerDocument||w).createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.oa(b[d]));return c},Ca:function(b,c){for(var d=0,e=b.length,l=[];d<e;d++){var k=b[d].cloneNode(!0);l.push(c?a.oa(k):k)}return l},va:function(b,c){a.a.Tb(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},Xc:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],
l=e.parentNode,k=0,f=c.length;k<f;k++)l.insertBefore(c[k],e);k=0;for(f=d.length;k<f;k++)a.removeNode(d[k])}},Ua:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)a.push(c),c=c.nextSibling;a.push(d)}}return a},Zc:function(a,b){7>p?a.setAttribute("selected",b):a.selected=b},Db:function(a){return null===a||a===n?"":a.trim?
a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},Ud:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},vd:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(1!==a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},Sb:function(b){return a.a.vd(b,b.ownerDocument.documentElement)},kd:function(b){return!!a.a.Lb(b,a.a.Sb)},R:function(a){return a&&
a.tagName&&a.tagName.toLowerCase()},Ac:function(b){return a.onError?function(){try{return b.apply(this,arguments)}catch(c){throw a.onError&&a.onError(c),c;}}:b},setTimeout:function(b,c){return setTimeout(a.a.Ac(b),c)},Gc:function(b){setTimeout(function(){a.onError&&a.onError(b);throw b;},0)},B:function(b,c,d){var e=a.a.Ac(d);d=l[c];if(a.options.useOnlyNativeEvents||d||!v)if(d||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var k=function(a){e.call(b,a)},f="on"+c;b.attachEvent(f,
k);a.a.K.za(b,function(){b.detachEvent(f,k)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,e,!1);else t||(t="function"==typeof v(b).on?"on":"bind"),v(b)[t](c,e)},Fb:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.R(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(a.options.useOnlyNativeEvents||!v||d)if("function"==typeof w.createEvent)if("function"==
typeof b.dispatchEvent)d=w.createEvent(k[c]||"HTMLEvents"),d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");else v(b).trigger(c)},f:function(b){return a.O(b)?b():b},bc:function(b){return a.O(b)?b.v():b},Eb:function(b,c,d){var l;c&&("object"===typeof b.classList?
(l=b.classList[d?"add":"remove"],a.a.D(c.match(q),function(a){l.call(b.classList,a)})):"string"===typeof b.className.baseVal?e(b.className,"baseVal",c,d):e(b,"className",c,d))},Bb:function(b,c){var d=a.a.f(c);if(null===d||d===n)d="";var e=a.h.firstChild(b);!e||3!=e.nodeType||a.h.nextSibling(e)?a.h.va(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Ad(b)},Yc:function(a,b){a.name=b;if(7>=p)try{var c=a.name.replace(/[&<>'"]/g,function(a){return"&#"+a.charCodeAt(0)+";"});a.mergeAttributes(w.createElement("<input name='"+
c+"'/>"),!1)}catch(d){}},Ad:function(a){9<=p&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},wd:function(a){if(p){var b=a.style.width;a.style.width=0;a.style.width=b}},Pd:function(b,c){b=a.a.f(b);c=a.a.f(c);for(var d=[],e=b;e<=c;e++)d.push(e);return d},la:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},Da:function(a){return h?Symbol(a):a},Zd:6===p,$d:7===p,W:p,Lc:function(b,c){for(var d=a.a.la(b.getElementsByTagName("input")).concat(a.a.la(b.getElementsByTagName("textarea"))),
e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},l=[],k=d.length-1;0<=k;k--)e(d[k])&&l.push(d[k]);return l},Nd:function(b){return"string"==typeof b&&(b=a.a.Db(b))?H&&H.parse?H.parse(b):(new Function("return "+b))():null},hc:function(b,c,d){if(!H||!H.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return H.stringify(a.a.f(b),c,d)},Od:function(c,d,e){e=e||{};var l=e.params||{},k=e.includeFields||this.Jc,f=c;if("object"==typeof c&&"form"===a.a.R(c))for(var f=c.action,h=k.length-1;0<=h;h--)for(var g=a.a.Lc(c,k[h]),m=g.length-1;0<=m;m--)l[g[m].name]=g[m].value;d=a.a.f(d);var p=w.createElement("form");p.style.display="none";p.action=f;p.method="post";for(var q in d)c=w.createElement("input"),c.type="hidden",c.name=q,c.value=a.a.hc(a.a.f(d[q])),p.appendChild(c);b(l,function(a,b){var c=w.createElement("input");
c.type="hidden";c.name=a;c.value=b;p.appendChild(c)});w.body.appendChild(p);e.submitter?e.submitter(p):p.submit();setTimeout(function(){p.parentNode.removeChild(p)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.D);a.b("utils.arrayFirst",a.a.Lb);a.b("utils.arrayFilter",a.a.jb);a.b("utils.arrayGetDistinctValues",a.a.wc);a.b("utils.arrayIndexOf",a.a.A);a.b("utils.arrayMap",a.a.Mb);a.b("utils.arrayPushAll",a.a.Nb);a.b("utils.arrayRemoveItem",a.a.Pa);a.b("utils.cloneNodes",a.a.Ca);a.b("utils.createSymbolOrString",
a.a.Da);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.Jc);a.b("utils.getFormFields",a.a.Lc);a.b("utils.objectMap",a.a.Ga);a.b("utils.peekObservable",a.a.bc);a.b("utils.postJson",a.a.Od);a.b("utils.parseJson",a.a.Nd);a.b("utils.registerEventHandler",a.a.B);a.b("utils.stringifyJson",a.a.hc);a.b("utils.range",a.a.Pd);a.b("utils.toggleDomNodeCssClass",a.a.Eb);a.b("utils.triggerEvent",a.a.Fb);a.b("utils.unwrapObservable",a.a.f);a.b("utils.objectForEach",a.a.P);a.b("utils.addOrRemoveItem",
a.a.Na);a.b("utils.setTextContent",a.a.Bb);a.b("unwrap",a.a.f);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this;if(1===arguments.length)return function(){return c.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return c.apply(a,e)}});a.a.g=new function(){var b=0,c="__ko__"+(new Date).getTime(),d={},e,f;a.a.W?(e=function(a,e){var f=a[c];if(!f||"null"===f||!d[f]){if(!e)return n;f=a[c]="ko"+b++;d[f]=
{}}return d[f]},f=function(a){var b=a[c];return b?(delete d[b],a[c]=null,!0):!1}):(e=function(a,b){var d=a[c];!d&&b&&(d=a[c]={});return d},f=function(a){return a[c]?(delete a[c],!0):!1});return{get:function(a,b){var c=e(a,!1);return c&&c[b]},set:function(a,b,c){(a=e(a,c!==n))&&(a[b]=c)},Ub:function(a,b,c){a=e(a,!0);return a[b]||(a[b]=c)},clear:f,Z:function(){return b++ +c}}};a.b("utils.domData",a.a.g);a.b("utils.domData.clear",a.a.g.clear);a.a.K=new function(){function b(b,c){var d=a.a.g.get(b,e);
d===n&&c&&(d=[],a.a.g.set(b,e,d));return d}function c(c){var e=b(c,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);a.a.g.clear(c);a.a.K.cleanExternalData(c);g[c.nodeType]&&d(c.childNodes,!0)}function d(b,d){for(var e=[],l,f=0;f<b.length;f++)if(!d||8===b[f].nodeType)if(c(e[e.length]=l=b[f]),b[f]!==l)for(;f--&&-1==a.a.A(e,b[f]););}var e=a.a.g.Z(),f={1:!0,8:!0,9:!0},g={1:!0,9:!0};return{za:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},yb:function(c,
d){var f=b(c,!1);f&&(a.a.Pa(f,d),0==f.length&&a.a.g.set(c,e,n))},oa:function(b){a.u.G(function(){f[b.nodeType]&&(c(b),g[b.nodeType]&&d(b.getElementsByTagName("*")))});return b},removeNode:function(b){a.oa(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){v&&"function"==typeof v.cleanData&&v.cleanData([a])}}};a.oa=a.a.K.oa;a.removeNode=a.a.K.removeNode;a.b("cleanNode",a.oa);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.K);a.b("utils.domNodeDisposal.addDisposeCallback",
a.a.K.za);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.K.yb);(function(){var b=[0,"",""],c=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:c,tbody:c,tfoot:c,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},g=8>=a.a.W;a.a.ua=function(c,d){var e;if(v)if(v.parseHTML)e=v.parseHTML(c,d)||[];else{if((e=v.clean([c],d))&&e[0]){for(var l=e[0];l.parentNode&&11!==l.parentNode.nodeType;)l=l.parentNode;
l.parentNode&&l.parentNode.removeChild(l)}}else{(e=d)||(e=w);var l=e.parentWindow||e.defaultView||A,p=a.a.Db(c).toLowerCase(),q=e.createElement("div"),t;t=(p=p.match(/^(?:\x3c!--.*?--\x3e\s*?)*?<([a-z]+)[\s>]/))&&f[p[1]]||b;p=t[0];t="ignored<div>"+t[1]+c+t[2]+"</div>";"function"==typeof l.innerShiv?q.appendChild(l.innerShiv(t)):(g&&e.body.appendChild(q),q.innerHTML=t,g&&q.parentNode.removeChild(q));for(;p--;)q=q.lastChild;e=a.a.la(q.lastChild.childNodes)}return e};a.a.Md=function(b,c){var d=a.a.ua(b,
c);return d.length&&d[0].parentElement||a.a.Yb(d)};a.a.fc=function(b,c){a.a.Tb(b);c=a.a.f(c);if(null!==c&&c!==n)if("string"!=typeof c&&(c=c.toString()),v)v(b).html(c);else for(var d=a.a.ua(c,b.ownerDocument),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.ua);a.b("utils.setHtml",a.a.fc);a.aa=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.aa.Uc(c.nodeValue);null!=f&&e.push({ud:c,Kd:f})}else if(1==c.nodeType)for(var f=0,g=c.childNodes,h=g.length;f<h;f++)b(g[f],
e)}var c={};return{Xb:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},bd:function(a,b){var f=c[a];if(f===n)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a]}},cd:function(c,e){var f=
[];b(c,f);for(var g=0,h=f.length;g<h;g++){var m=f[g].ud,k=[m];e&&a.a.Nb(k,e);a.aa.bd(f[g].Kd,k);m.nodeValue="";m.parentNode&&m.parentNode.removeChild(m)}},Uc:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.aa);a.b("memoization.memoize",a.aa.Xb);a.b("memoization.unmemoize",a.aa.bd);a.b("memoization.parseMemoText",a.aa.Uc);a.b("memoization.unmemoizeDomNodeAndDescendants",a.aa.cd);a.na=function(){function b(){if(f)for(var b=f,c=0,d;h<f;)if(d=e[h++]){if(h>b){if(5E3<=
++c){h=f;a.a.Gc(Error("'Too much recursion' after processing "+c+" task groups."));break}b=f}try{d()}catch(p){a.a.Gc(p)}}}function c(){b();h=f=e.length=0}var d,e=[],f=0,g=1,h=0;A.MutationObserver?d=function(a){var b=w.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo")}}(c):d=w&&"onreadystatechange"in w.createElement("script")?function(a){var b=w.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;w.documentElement.removeChild(b);
b=null;a()};w.documentElement.appendChild(b)}:function(a){setTimeout(a,0)};return{scheduler:d,zb:function(b){f||a.na.scheduler(c);e[f++]=b;return g++},cancel:function(a){a=a-(g-f);a>=h&&a<f&&(e[a]=null)},resetForTesting:function(){var a=f-h;h=f=e.length=0;return a},Sd:b}}();a.b("tasks",a.na);a.b("tasks.schedule",a.na.zb);a.b("tasks.runEarly",a.na.Sd);a.Ta={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.$({read:b,write:function(e){clearTimeout(d);d=a.a.setTimeout(function(){b(e)},
c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);a.Hb=!1;f="function"==typeof e?e:"notifyWhenChangesStop"==e?Y:X;a.ub(function(a){return f(a,d,c)})},deferred:function(b,c){if(!0!==c)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");b.Hb||(b.Hb=!0,b.ub(function(c){var e,f=!1;return function(){if(!f){a.na.cancel(e);e=a.na.zb(c);try{f=!0,b.notifySubscribers(n,"dirty")}finally{f=
!1}}}}))},notify:function(a,c){a.equalityComparer="always"==c?null:K}};var W={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ta);a.ic=function(b,c,d){this.da=b;this.lc=c;this.mc=d;this.Ib=!1;this.fb=this.Jb=null;a.L(this,"dispose",this.s);a.L(this,"disposeWhenNodeIsRemoved",this.l)};a.ic.prototype.s=function(){this.Ib||(this.fb&&a.a.K.yb(this.Jb,this.fb),this.Ib=!0,this.mc(),this.da=this.lc=this.mc=this.Jb=this.fb=null)};a.ic.prototype.l=function(b){this.Jb=b;a.a.K.za(b,this.fb=this.s.bind(this))};
a.T=function(){a.a.Ab(this,D);D.qb(this)};var D={qb:function(a){a.U={change:[]};a.sc=1},subscribe:function(b,c,d){var e=this;d=d||"change";var f=new a.ic(e,c?b.bind(c):b,function(){a.a.Pa(e.U[d],f);e.hb&&e.hb(d)});e.Qa&&e.Qa(d);e.U[d]||(e.U[d]=[]);e.U[d].push(f);return f},notifySubscribers:function(b,c){c=c||"change";"change"===c&&this.Gb();if(this.Wa(c)){var d="change"===c&&this.ed||this.U[c].slice(0);try{a.u.xc();for(var e=0,f;f=d[e];++e)f.Ib||f.lc(b)}finally{a.u.end()}}},ob:function(){return this.sc},
Dd:function(a){return this.ob()!==a},Gb:function(){++this.sc},ub:function(b){var c=this,d=a.O(c),e,f,g,h,m;c.gb||(c.gb=c.notifySubscribers,c.notifySubscribers=Z);var k=b(function(){c.Ja=!1;d&&h===c&&(h=c.nc?c.nc():c());var a=f||m&&c.sb(g,h);m=f=e=!1;a&&c.gb(g=h)});c.qc=function(a,b){b&&c.Ja||(m=!b);c.ed=c.U.change.slice(0);c.Ja=e=!0;h=a;k()};c.pc=function(a){e||(g=a,c.gb(a,"beforeChange"))};c.rc=function(){m=!0};c.gd=function(){c.sb(g,c.v(!0))&&(f=!0)}},Wa:function(a){return this.U[a]&&this.U[a].length},
Bd:function(b){if(b)return this.U[b]&&this.U[b].length||0;var c=0;a.a.P(this.U,function(a,b){"dirty"!==a&&(c+=b.length)});return c},sb:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},toString:function(){return"[object Object]"},extend:function(b){var c=this;b&&a.a.P(b,function(b,e){var f=a.Ta[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.L(D,"init",D.qb);a.L(D,"subscribe",D.subscribe);a.L(D,"extend",D.extend);a.L(D,"getSubscriptionsCount",D.Bd);a.a.Ba&&a.a.setPrototypeOf(D,
Function.prototype);a.T.fn=D;a.Qc=function(a){return null!=a&&"function"==typeof a.subscribe&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.T);a.b("isSubscribable",a.Qc);a.S=a.u=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{xc:b,end:c,cc:function(b){if(e){if(!a.Qc(b))throw Error("Only subscribable things can act as dependencies");e.od.call(e.pd,b,b.fd||(b.fd=++f))}},G:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},qa:function(){if(e)return e.o.qa()},
Va:function(){if(e)return e.o.Va()},Ya:function(){if(e)return e.Ya},o:function(){if(e)return e.o}}}();a.b("computedContext",a.S);a.b("computedContext.getDependenciesCount",a.S.qa);a.b("computedContext.getDependencies",a.S.Va);a.b("computedContext.isInitial",a.S.Ya);a.b("computedContext.registerDependency",a.S.cc);a.b("ignoreDependencies",a.Yd=a.u.G);var I=a.a.Da("_latestValue");a.ta=function(b){function c(){if(0<arguments.length)return c.sb(c[I],arguments[0])&&(c.ya(),c[I]=arguments[0],c.xa()),this;
a.u.cc(c);return c[I]}c[I]=b;a.a.Ba||a.a.extend(c,a.T.fn);a.T.fn.qb(c);a.a.Ab(c,F);a.options.deferUpdates&&a.Ta.deferred(c,!0);return c};var F={equalityComparer:K,v:function(){return this[I]},xa:function(){this.notifySubscribers(this[I],"spectate");this.notifySubscribers(this[I])},ya:function(){this.notifySubscribers(this[I],"beforeChange")}};a.a.Ba&&a.a.setPrototypeOf(F,a.T.fn);var G=a.ta.Ma="__ko_proto__";F[G]=a.ta;a.O=function(b){if((b="function"==typeof b&&b[G])&&b!==F[G]&&b!==a.o.fn[G])throw Error("Invalid object that looks like an observable; possibly from another Knockout instance");
return!!b};a.Za=function(b){return"function"==typeof b&&(b[G]===F[G]||b[G]===a.o.fn[G]&&b.Nc)};a.b("observable",a.ta);a.b("isObservable",a.O);a.b("isWriteableObservable",a.Za);a.b("isWritableObservable",a.Za);a.b("observable.fn",F);a.L(F,"peek",F.v);a.L(F,"valueHasMutated",F.xa);a.L(F,"valueWillMutate",F.ya);a.Ha=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.ta(b);a.a.Ab(b,
a.Ha.fn);return b.extend({trackArrayChanges:!0})};a.Ha.fn={remove:function(b){for(var c=this.v(),d=[],e="function"!=typeof b||a.O(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var g=c[f];if(e(g)){0===d.length&&this.ya();if(c[f]!==g)throw Error("Array modified during remove; cannot remove item");d.push(g);c.splice(f,1);f--}}d.length&&this.xa();return d},removeAll:function(b){if(b===n){var c=this.v(),d=c.slice(0);this.ya();c.splice(0,c.length);this.xa();return d}return b?this.remove(function(c){return 0<=
a.a.A(b,c)}):[]},destroy:function(b){var c=this.v(),d="function"!=typeof b||a.O(b)?function(a){return a===b}:b;this.ya();for(var e=c.length-1;0<=e;e--){var f=c[e];d(f)&&(f._destroy=!0)}this.xa()},destroyAll:function(b){return b===n?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.A(b,c)}):[]},indexOf:function(b){var c=this();return a.a.A(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.ya(),this.v()[d]=c,this.xa())},sorted:function(a){var c=this().slice(0);
return a?c.sort(a):c.sort()},reversed:function(){return this().slice(0).reverse()}};a.a.Ba&&a.a.setPrototypeOf(a.Ha.fn,a.ta.fn);a.a.D("pop push reverse shift sort splice unshift".split(" "),function(b){a.Ha.fn[b]=function(){var a=this.v();this.ya();this.zc(a,b,arguments);var d=a[b].apply(a,arguments);this.xa();return d===a?this:d}});a.a.D(["slice"],function(b){a.Ha.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.Pc=function(b){return a.O(b)&&"function"==typeof b.remove&&"function"==
typeof b.push};a.b("observableArray",a.Ha);a.b("isObservableArray",a.Pc);a.Ta.trackArrayChanges=function(b,c){function d(){function c(){if(m){var d=[].concat(b.v()||[]),e;if(b.Wa("arrayChange")){if(!f||1<m)f=a.a.Pb(k,d,b.Ob);e=f}k=d;f=null;m=0;e&&e.length&&b.notifySubscribers(e,"arrayChange")}}e?c():(e=!0,h=b.subscribe(function(){++m},null,"spectate"),k=[].concat(b.v()||[]),f=null,g=b.subscribe(c))}b.Ob={};c&&"object"==typeof c&&a.a.extend(b.Ob,c);b.Ob.sparse=!0;if(!b.zc){var e=!1,f=null,g,h,m=0,
k,l=b.Qa,p=b.hb;b.Qa=function(a){l&&l.call(b,a);"arrayChange"===a&&d()};b.hb=function(a){p&&p.call(b,a);"arrayChange"!==a||b.Wa("arrayChange")||(g&&g.s(),h&&h.s(),h=g=null,e=!1,k=n)};b.zc=function(b,c,d){function l(a,b,c){return k[k.length]={status:a,value:b,index:c}}if(e&&!m){var k=[],p=b.length,g=d.length,h=0;switch(c){case "push":h=p;case "unshift":for(c=0;c<g;c++)l("added",d[c],h+c);break;case "pop":h=p-1;case "shift":p&&l("deleted",b[h],h);break;case "splice":c=Math.min(Math.max(0,0>d[0]?p+d[0]:
d[0]),p);for(var p=1===g?p:Math.min(c+(d[1]||0),p),g=c+g-2,h=Math.max(p,g),U=[],L=[],n=2;c<h;++c,++n)c<p&&L.push(l("deleted",b[c],c)),c<g&&U.push(l("added",d[n],c));a.a.Kc(L,U);break;default:return}f=k}}}};var r=a.a.Da("_state");a.o=a.$=function(b,c,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(g.nb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}g.ra||
a.u.cc(e);(g.ka||g.J&&e.Xa())&&e.ha();return g.X}"object"===typeof b?d=b:(d=d||{},b&&(d.read=b));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,g={X:n,sa:!0,ka:!0,rb:!1,jc:!1,ra:!1,wb:!1,J:!1,Wc:d.read,nb:c||d.owner,l:d.disposeWhenNodeIsRemoved||d.l||null,Sa:d.disposeWhen||d.Sa,Rb:null,I:{},V:0,Ic:null};e[r]=g;e.Nc="function"===typeof f;a.a.Ba||a.a.extend(e,a.T.fn);a.T.fn.qb(e);a.a.Ab(e,C);d.pure?(g.wb=!0,g.J=!0,a.a.extend(e,da)):
d.deferEvaluation&&a.a.extend(e,ea);a.options.deferUpdates&&a.Ta.deferred(e,!0);g.l&&(g.jc=!0,g.l.nodeType||(g.l=null));g.J||d.deferEvaluation||e.ha();g.l&&e.ja()&&a.a.K.za(g.l,g.Rb=function(){e.s()});return e};var C={equalityComparer:K,qa:function(){return this[r].V},Va:function(){var b=[];a.a.P(this[r].I,function(a,d){b[d.Ka]=d.da});return b},Vb:function(b){if(!this[r].V)return!1;var c=this.Va();return-1!==a.a.A(c,b)?!0:!!a.a.Lb(c,function(a){return a.Vb&&a.Vb(b)})},uc:function(a,c,d){if(this[r].wb&&
c===this)throw Error("A 'pure' computed must not be called recursively");this[r].I[a]=d;d.Ka=this[r].V++;d.La=c.ob()},Xa:function(){var a,c,d=this[r].I;for(a in d)if(Object.prototype.hasOwnProperty.call(d,a)&&(c=d[a],this.Ia&&c.da.Ja||c.da.Dd(c.La)))return!0},Jd:function(){this.Ia&&!this[r].rb&&this.Ia(!1)},ja:function(){var a=this[r];return a.ka||0<a.V},Rd:function(){this.Ja?this[r].ka&&(this[r].sa=!0):this.Hc()},$c:function(a){if(a.Hb){var c=a.subscribe(this.Jd,this,"dirty"),d=a.subscribe(this.Rd,
this);return{da:a,s:function(){c.s();d.s()}}}return a.subscribe(this.Hc,this)},Hc:function(){var b=this,c=b.throttleEvaluation;c&&0<=c?(clearTimeout(this[r].Ic),this[r].Ic=a.a.setTimeout(function(){b.ha(!0)},c)):b.Ia?b.Ia(!0):b.ha(!0)},ha:function(b){var c=this[r],d=c.Sa,e=!1;if(!c.rb&&!c.ra){if(c.l&&!a.a.Sb(c.l)||d&&d()){if(!c.jc){this.s();return}}else c.jc=!1;c.rb=!0;try{e=this.zd(b)}finally{c.rb=!1}return e}},zd:function(b){var c=this[r],d=!1,e=c.wb?n:!c.V,d={qd:this,mb:c.I,Qb:c.V};a.u.xc({pd:d,
od:ba,o:this,Ya:e});c.I={};c.V=0;var f=this.yd(c,d);c.V?d=this.sb(c.X,f):(this.s(),d=!0);d&&(c.J?this.Gb():this.notifySubscribers(c.X,"beforeChange"),c.X=f,this.notifySubscribers(c.X,"spectate"),!c.J&&b&&this.notifySubscribers(c.X),this.rc&&this.rc());e&&this.notifySubscribers(c.X,"awake");return d},yd:function(b,c){try{var d=b.Wc;return b.nb?d.call(b.nb):d()}finally{a.u.end(),c.Qb&&!b.J&&a.a.P(c.mb,aa),b.sa=b.ka=!1}},v:function(a){var c=this[r];(c.ka&&(a||!c.V)||c.J&&this.Xa())&&this.ha();return c.X},
ub:function(b){a.T.fn.ub.call(this,b);this.nc=function(){this[r].J||(this[r].sa?this.ha():this[r].ka=!1);return this[r].X};this.Ia=function(a){this.pc(this[r].X);this[r].ka=!0;a&&(this[r].sa=!0);this.qc(this,!a)}},s:function(){var b=this[r];!b.J&&b.I&&a.a.P(b.I,function(a,b){b.s&&b.s()});b.l&&b.Rb&&a.a.K.yb(b.l,b.Rb);b.I=n;b.V=0;b.ra=!0;b.sa=!1;b.ka=!1;b.J=!1;b.l=n;b.Sa=n;b.Wc=n;this.Nc||(b.nb=n)}},da={Qa:function(b){var c=this,d=c[r];if(!d.ra&&d.J&&"change"==b){d.J=!1;if(d.sa||c.Xa())d.I=null,d.V=
0,c.ha()&&c.Gb();else{var e=[];a.a.P(d.I,function(a,b){e[b.Ka]=a});a.a.D(e,function(a,b){var e=d.I[a],m=c.$c(e.da);m.Ka=b;m.La=e.La;d.I[a]=m});c.Xa()&&c.ha()&&c.Gb()}d.ra||c.notifySubscribers(d.X,"awake")}},hb:function(b){var c=this[r];c.ra||"change"!=b||this.Wa("change")||(a.a.P(c.I,function(a,b){b.s&&(c.I[a]={da:b.da,Ka:b.Ka,La:b.La},b.s())}),c.J=!0,this.notifySubscribers(n,"asleep"))},ob:function(){var b=this[r];b.J&&(b.sa||this.Xa())&&this.ha();return a.T.fn.ob.call(this)}},ea={Qa:function(a){"change"!=
a&&"beforeChange"!=a||this.v()}};a.a.Ba&&a.a.setPrototypeOf(C,a.T.fn);var N=a.ta.Ma;C[N]=a.o;a.Oc=function(a){return"function"==typeof a&&a[N]===C[N]};a.Fd=function(b){return a.Oc(b)&&b[r]&&b[r].wb};a.b("computed",a.o);a.b("dependentObservable",a.o);a.b("isComputed",a.Oc);a.b("isPureComputed",a.Fd);a.b("computed.fn",C);a.L(C,"peek",C.v);a.L(C,"dispose",C.s);a.L(C,"isActive",C.ja);a.L(C,"getDependenciesCount",C.qa);a.L(C,"getDependencies",C.Va);a.xb=function(b,c){if("function"===typeof b)return a.o(b,
c,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.o(b,c)};a.b("pureComputed",a.xb);(function(){function b(a,f,g){g=g||new d;a=f(a);if("object"!=typeof a||null===a||a===n||a instanceof RegExp||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var h=a instanceof Array?[]:{};g.save(a,h);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":h[c]=d;break;case "object":case "undefined":var l=g.get(d);h[c]=l!==
n?l:b(d,f,g)}});return h}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.values=[]}a.ad=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.O(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.ad(b);return a.a.hc(b,c,d)};d.prototype={constructor:d,save:function(b,c){var d=a.a.A(this.keys,
b);0<=d?this.values[d]=c:(this.keys.push(b),this.values.push(c))},get:function(b){b=a.a.A(this.keys,b);return 0<=b?this.values[b]:n}}})();a.b("toJS",a.ad);a.b("toJSON",a.toJSON);a.Wd=function(b,c,d){function e(c){var e=a.xb(b,d).extend({ma:"always"}),h=e.subscribe(function(a){a&&(h.s(),c(a))});e.notifySubscribers(e.v());return h}return"function"!==typeof Promise||c?e(c.bind(d)):new Promise(e)};a.b("when",a.Wd);(function(){a.w={M:function(b){switch(a.a.R(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?
a.a.g.get(b,a.c.options.$b):7>=a.a.W?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.w.M(b.options[b.selectedIndex]):n;default:return b.value}},cb:function(b,c,d){switch(a.a.R(b)){case "option":"string"===typeof c?(a.a.g.set(b,a.c.options.$b,n),"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__,b.value=c):(a.a.g.set(b,a.c.options.$b,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===
typeof c?c:"");break;case "select":if(""===c||null===c)c=n;for(var e=-1,f=0,g=b.options.length,h;f<g;++f)if(h=a.w.M(b.options[f]),h==c||""===h&&c===n){e=f;break}if(d||0<=e||c===n&&1<b.size)b.selectedIndex=e,6===a.a.W&&a.a.setTimeout(function(){b.selectedIndex=e},0);break;default:if(null===c||c===n)c="";b.value=c}}}})();a.b("selectExtensions",a.w);a.b("selectExtensions.readValue",a.w.M);a.b("selectExtensions.writeValue",a.w.cb);a.m=function(){function b(b){b=a.a.Db(b);123===b.charCodeAt(0)&&(b=b.slice(1,
-1));b+="\n,";var c=[],d=b.match(e),p,q=[],h=0;if(1<d.length){for(var x=0,B;B=d[x];++x){var u=B.charCodeAt(0);if(44===u){if(0>=h){c.push(p&&q.length?{key:p,value:q.join("")}:{unknown:p||q.join("")});p=h=0;q=[];continue}}else if(58===u){if(!h&&!p&&1===q.length){p=q.pop();continue}}else if(47===u&&1<B.length&&(47===B.charCodeAt(1)||42===B.charCodeAt(1)))continue;else 47===u&&x&&1<B.length?(u=d[x-1].match(f))&&!g[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),x=-1,B="/"):40===u||123===u||91===u?++h:
41===u||125===u||93===u?--h:p||q.length||34!==u&&39!==u||(B=B.slice(1,-1));q.push(B)}if(0<h)throw Error("Unbalanced parentheses, braces, or brackets");}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:\\\\.|[^\"])*\"|'(?:\\\\.|[^'])*'|`(?:\\\\.|[^`])*`|/\\*(?:[^*]|\\*+[^*/])*\\*+/|//.*\n|/(?:\\\\.|[^/])+/w*|[^\\s:,/][^,\"'`{}()/:[\\]]*[^\\s,\"'`{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,g={"in":1,"return":1,"typeof":1},
h={};return{Ra:[],wa:h,ac:b,vb:function(e,f){function l(b,e){var f;if(!x){var k=a.getBindingHandler(b);if(k&&k.preprocess&&!(e=k.preprocess(e,b,l)))return;if(k=h[b])f=e,0<=a.a.A(c,f)?f=!1:(k=f.match(d),f=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:f),k=f;k&&q.push("'"+("string"==typeof h[b]?h[b]:b)+"':function(_z){"+f+"=_z}")}g&&(e="function(){return "+e+" }");p.push("'"+b+"':"+e)}f=f||{};var p=[],q=[],g=f.valueAccessors,x=f.bindingParams,B="string"===typeof e?b(e):e;a.a.D(B,function(a){l(a.key||a.unknown,
a.value)});q.length&&l("_ko_property_writers","{"+q.join(",")+" }");return p.join(",")},Id:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;return!1},eb:function(b,c,d,e,f){if(b&&a.O(b))!a.Za(b)||f&&b.v()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.m);a.b("expressionRewriting.bindingRewriteValidators",a.m.Ra);a.b("expressionRewriting.parseObjectLiteral",a.m.ac);a.b("expressionRewriting.preProcessBindings",a.m.vb);a.b("expressionRewriting._twoWayBindings",
a.m.wa);a.b("jsonExpressionRewriting",a.m);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.m.vb);(function(){function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&h.test(f?a.text:a.nodeValue)}function d(d,e){for(var f=d,h=1,g=[];f=f.nextSibling;){if(c(f)&&(a.a.g.set(f,k,!0),h--,0===h))return g;g.push(f);b(f)&&h++}if(!e)throw Error("Cannot find closing comment tag to match: "+d.nodeValue);return null}function e(a,b){var c=d(a,b);return c?
0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,g=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,h=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,m={ul:!0,ol:!0},k="__ko_matchedEndComment__";a.h={ea:{},childNodes:function(a){return b(a)?d(a):a.childNodes},Ea:function(c){if(b(c)){c=a.h.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.Tb(c)},va:function(c,d){if(b(c)){a.h.Ea(c);for(var e=
c.nextSibling,f=0,k=d.length;f<k;f++)e.parentNode.insertBefore(d[f],e)}else a.a.va(c,d)},Vc:function(a,c){var d;b(a)?(d=a.nextSibling,a=a.parentNode):d=a.firstChild;d?c!==d&&a.insertBefore(c,d):a.appendChild(c)},Wb:function(c,d,e){e?(e=e.nextSibling,b(c)&&(c=c.parentNode),e?d!==e&&c.insertBefore(d,e):c.appendChild(d)):a.h.Vc(c,d)},firstChild:function(a){if(b(a))return!a.nextSibling||c(a.nextSibling)?null:a.nextSibling;if(a.firstChild&&c(a.firstChild))throw Error("Found invalid end comment, as the first child of "+
a);return a.firstChild},nextSibling:function(d){b(d)&&(d=e(d));if(d.nextSibling&&c(d.nextSibling)){var f=d.nextSibling;if(c(f)&&!a.a.g.get(f,k))throw Error("Found end comment without a matching opening comment, as child of "+d);return null}return d.nextSibling},Cd:b,Vd:function(a){return(a=(f?a.text:a.nodeValue).match(g))?a[1]:null},Sc:function(d){if(m[a.a.R(d)]){var f=d.firstChild;if(f){do if(1===f.nodeType){var k;k=f.firstChild;var h=null;if(k){do if(h)h.push(k);else if(b(k)){var g=e(k,!0);g?k=
g:h=[k]}else c(k)&&(h=[k]);while(k=k.nextSibling)}if(k=h)for(h=f.nextSibling,g=0;g<k.length;g++)h?d.insertBefore(k[g],h):d.appendChild(k[g])}while(f=f.nextSibling)}}}}})();a.b("virtualElements",a.h);a.b("virtualElements.allowedBindings",a.h.ea);a.b("virtualElements.emptyNode",a.h.Ea);a.b("virtualElements.insertAfter",a.h.Wb);a.b("virtualElements.prepend",a.h.Vc);a.b("virtualElements.setDomNodeChildren",a.h.va);(function(){a.ga=function(){this.nd={}};a.a.extend(a.ga.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=
b.getAttribute("data-bind")||a.j.getComponentNameForNode(b);case 8:return a.h.Cd(b);default:return!1}},getBindings:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b):null;return a.j.tc(d,b,c,!1)},getBindingAccessors:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b,{valueAccessors:!0}):null;return a.j.tc(d,b,c,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.h.Vd(b);default:return null}},
parseBindingsString:function(b,c,d,e){try{var f=this.nd,g=b+(e&&e.valueAccessors||""),h;if(!(h=f[g])){var m,k="with($context){with($data||{}){return{"+a.m.vb(b,e)+"}}}";m=new Function("$context","$element",k);h=f[g]=m}return h(c,d)}catch(l){throw l.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+l.message,l;}}});a.ga.instance=new a.ga})();a.b("bindingProvider",a.ga);(function(){function b(b){var c=(b=a.a.g.get(b,z))&&b.N;c&&(b.N=null,c.Tc())}function c(c,d,e){this.node=c;this.yc=
d;this.kb=[];this.H=!1;d.N||a.a.K.za(c,b);e&&e.N&&(e.N.kb.push(c),this.Kb=e)}function d(a){return function(){return a}}function e(a){return a()}function f(b){return a.a.Ga(a.u.G(b),function(a,c){return function(){return b()[c]}})}function g(b,c,e){return"function"===typeof b?f(b.bind(null,c,e)):a.a.Ga(b,d)}function h(a,b){return f(this.getBindings.bind(this,a,b))}function m(b,c){var d=a.h.firstChild(c);if(d){var e,f=a.ga.instance,l=f.preprocessNode;if(l){for(;e=d;)d=a.h.nextSibling(e),l.call(f,e);
d=a.h.firstChild(c)}for(;e=d;)d=a.h.nextSibling(e),k(b,e)}a.i.ma(c,a.i.H)}function k(b,c){var d=b,e=1===c.nodeType;e&&a.h.Sc(c);if(e||a.ga.instance.nodeHasBindings(c))d=p(c,null,b).bindingContextForDescendants;d&&!u[a.a.R(c)]&&m(d,c)}function l(b){var c=[],d={},e=[];a.a.P(b,function ca(f){if(!d[f]){var k=a.getBindingHandler(f);k&&(k.after&&(e.push(f),a.a.D(k.after,function(c){if(b[c]){if(-1!==a.a.A(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));
ca(c)}}),e.length--),c.push({key:f,Mc:k}));d[f]=!0}});return c}function p(b,c,d){var f=a.a.g.Ub(b,z,{}),k=f.hd;if(!c){if(k)throw Error("You cannot apply bindings multiple times to the same element.");f.hd=!0}k||(f.context=d);f.Zb||(f.Zb={});var g;if(c&&"function"!==typeof c)g=c;else{var p=a.ga.instance,q=p.getBindingAccessors||h,m=a.$(function(){if(g=c?c(d,b):q.call(p,b,d)){if(d[t])d[t]();if(d[B])d[B]()}return g},null,{l:b});g&&m.ja()||(m=null)}var x=d,u;if(g){var J=function(){return a.a.Ga(m?m():
g,e)},r=m?function(a){return function(){return e(m()[a])}}:function(a){return g[a]};J.get=function(a){return g[a]&&e(r(a))};J.has=function(a){return a in g};a.i.H in g&&a.i.subscribe(b,a.i.H,function(){var c=(0,g[a.i.H])();if(c){var d=a.h.childNodes(b);d.length&&c(d,a.Ec(d[0]))}});a.i.pa in g&&(x=a.i.Cb(b,d),a.i.subscribe(b,a.i.pa,function(){var c=(0,g[a.i.pa])();c&&a.h.firstChild(b)&&c(b)}));f=l(g);a.a.D(f,function(c){var d=c.Mc.init,e=c.Mc.update,f=c.key;if(8===b.nodeType&&!a.h.ea[f])throw Error("The binding '"+
f+"' cannot be used with virtual elements");try{"function"==typeof d&&a.u.G(function(){var a=d(b,r(f),J,x.$data,x);if(a&&a.controlsDescendantBindings){if(u!==n)throw Error("Multiple bindings ("+u+" and "+f+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");u=f}}),"function"==typeof e&&a.$(function(){e(b,r(f),J,x.$data,x)},null,{l:b})}catch(k){throw k.message='Unable to process binding "'+f+": "+g[f]+'"\nMessage: '+k.message,
k;}})}f=u===n;return{shouldBindDescendants:f,bindingContextForDescendants:f&&x}}function q(b,c){return b&&b instanceof a.fa?b:new a.fa(b,n,n,c)}var t=a.a.Da("_subscribable"),x=a.a.Da("_ancestorBindingInfo"),B=a.a.Da("_dataDependency");a.c={};var u={script:!0,textarea:!0,template:!0};a.getBindingHandler=function(b){return a.c[b]};var J={};a.fa=function(b,c,d,e,f){function k(){var b=p?h():h,f=a.a.f(b);c?(a.a.extend(l,c),x in c&&(l[x]=c[x])):(l.$parents=[],l.$root=f,l.ko=a);l[t]=q;g?f=l.$data:(l.$rawData=
b,l.$data=f);d&&(l[d]=f);e&&e(l,c,f);if(c&&c[t]&&!a.S.o().Vb(c[t]))c[t]();m&&(l[B]=m);return l.$data}var l=this,g=b===J,h=g?n:b,p="function"==typeof h&&!a.O(h),q,m=f&&f.dataDependency;f&&f.exportDependencies?k():(q=a.xb(k),q.v(),q.ja()?q.equalityComparer=null:l[t]=n)};a.fa.prototype.createChildContext=function(b,c,d,e){!e&&c&&"object"==typeof c&&(e=c,c=e.as,d=e.extend);if(c&&e&&e.noChildContext){var f="function"==typeof b&&!a.O(b);return new a.fa(J,this,null,function(a){d&&d(a);a[c]=f?b():b},e)}return new a.fa(b,
this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)},e)};a.fa.prototype.extend=function(b,c){return new a.fa(J,this,null,function(c){a.a.extend(c,"function"==typeof b?b(c):b)},c)};var z=a.a.g.Z();c.prototype.Tc=function(){this.Kb&&this.Kb.N&&this.Kb.N.sd(this.node)};c.prototype.sd=function(b){a.a.Pa(this.kb,b);!this.kb.length&&this.H&&this.Cc()};c.prototype.Cc=function(){this.H=!0;this.yc.N&&!this.kb.length&&(this.yc.N=
null,a.a.K.yb(this.node,b),a.i.ma(this.node,a.i.pa),this.Tc())};a.i={H:"childrenComplete",pa:"descendantsComplete",subscribe:function(b,c,d,e,f){var k=a.a.g.Ub(b,z,{});k.Fa||(k.Fa=new a.T);f&&f.notifyImmediately&&k.Zb[c]&&a.u.G(d,e,[b]);return k.Fa.subscribe(d,e,c)},ma:function(b,c){var d=a.a.g.get(b,z);if(d&&(d.Zb[c]=!0,d.Fa&&d.Fa.notifySubscribers(b,c),c==a.i.H))if(d.N)d.N.Cc();else if(d.N===n&&d.Fa&&d.Fa.Wa(a.i.pa))throw Error("descendantsComplete event not supported for bindings on this node");
},Cb:function(b,d){var e=a.a.g.Ub(b,z,{});e.N||(e.N=new c(b,e,d[x]));return d[x]==e?d:d.extend(function(a){a[x]=e})}};a.Td=function(b){return(b=a.a.g.get(b,z))&&b.context};a.ib=function(b,c,d){1===b.nodeType&&a.h.Sc(b);return p(b,c,q(d))};a.ld=function(b,c,d){d=q(d);return a.ib(b,g(c,d,b),d)};a.Oa=function(a,b){1!==b.nodeType&&8!==b.nodeType||m(q(a),b)};a.vc=function(a,b,c){!v&&A.jQuery&&(v=A.jQuery);if(2>arguments.length){if(b=w.body,!b)throw Error("ko.applyBindings: could not find document.body; has the document been loaded?");
}else if(!b||1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");k(q(a,c),b)};a.Dc=function(b){return!b||1!==b.nodeType&&8!==b.nodeType?n:a.Td(b)};a.Ec=function(b){return(b=a.Dc(b))?b.$data:n};a.b("bindingHandlers",a.c);a.b("bindingEvent",a.i);a.b("bindingEvent.subscribe",a.i.subscribe);a.b("bindingEvent.startPossiblyAsyncContentBinding",a.i.Cb);a.b("applyBindings",a.vc);a.b("applyBindingsToDescendants",a.Oa);
a.b("applyBindingAccessorsToNode",a.ib);a.b("applyBindingsToNode",a.ld);a.b("contextFor",a.Dc);a.b("dataFor",a.Ec)})();(function(b){function c(c,e){var k=Object.prototype.hasOwnProperty.call(f,c)?f[c]:b,l;k?k.subscribe(e):(k=f[c]=new a.T,k.subscribe(e),d(c,function(b,d){var e=!(!d||!d.synchronous);g[c]={definition:b,Gd:e};delete f[c];l||e?k.notifySubscribers(b):a.na.zb(function(){k.notifySubscribers(b)})}),l=!0)}function d(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a,
c)}):b(null,null)})}function e(c,d,f,l){l||(l=a.j.loaders.slice(0));var g=l.shift();if(g){var q=g[c];if(q){var t=!1;if(q.apply(g,d.concat(function(a){t?f(null):null!==a?f(a):e(c,d,f,l)}))!==b&&(t=!0,!g.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");}else e(c,d,f,l)}else f(null)}var f={},g={};a.j={get:function(d,e){var f=Object.prototype.hasOwnProperty.call(g,d)?g[d]:b;f?f.Gd?a.u.G(function(){e(f.definition)}):
a.na.zb(function(){e(f.definition)}):c(d,e)},Bc:function(a){delete g[a]},oc:e};a.j.loaders=[];a.b("components",a.j);a.b("components.get",a.j.get);a.b("components.clearCachedDefinition",a.j.Bc)})();(function(){function b(b,c,d,e){function g(){0===--B&&e(h)}var h={},B=2,u=d.template;d=d.viewModel;u?f(c,u,function(c){a.j.oc("loadTemplate",[b,c],function(a){h.template=a;g()})}):g();d?f(c,d,function(c){a.j.oc("loadViewModel",[b,c],function(a){h[m]=a;g()})}):g()}function c(a,b,d){if("function"===typeof b)d(function(a){return new b(a)});
else if("function"===typeof b[m])d(b[m]);else if("instance"in b){var e=b.instance;d(function(){return e})}else"viewModel"in b?c(a,b.viewModel,d):a("Unknown viewModel value: "+b)}function d(b){switch(a.a.R(b)){case "script":return a.a.ua(b.text);case "textarea":return a.a.ua(b.value);case "template":if(e(b.content))return a.a.Ca(b.content.childNodes)}return a.a.Ca(b.childNodes)}function e(a){return A.DocumentFragment?a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,c){"string"===typeof b.require?
T||A.require?(T||A.require)([b.require],function(a){a&&"object"===typeof a&&a.Xd&&a["default"]&&(a=a["default"]);c(a)}):a("Uses require, but no AMD loader is present"):c(b)}function g(a){return function(b){throw Error("Component '"+a+"': "+b);}}var h={};a.j.register=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.j.tb(b))throw Error("Component "+b+" is already registered");h[b]=c};a.j.tb=function(a){return Object.prototype.hasOwnProperty.call(h,a)};a.j.unregister=function(b){delete h[b];
a.j.Bc(b)};a.j.Fc={getConfig:function(b,c){c(a.j.tb(b)?h[b]:null)},loadComponent:function(a,c,d){var e=g(a);f(e,c,function(c){b(a,e,c,d)})},loadTemplate:function(b,c,f){b=g(b);if("string"===typeof c)f(a.a.ua(c));else if(c instanceof Array)f(c);else if(e(c))f(a.a.la(c.childNodes));else if(c.element)if(c=c.element,A.HTMLElement?c instanceof HTMLElement:c&&c.tagName&&1===c.nodeType)f(d(c));else if("string"===typeof c){var h=w.getElementById(c);h?f(d(h)):b("Cannot find element with ID "+c)}else b("Unknown element type: "+
c);else b("Unknown template value: "+c)},loadViewModel:function(a,b,d){c(g(a),b,d)}};var m="createViewModel";a.b("components.register",a.j.register);a.b("components.isRegistered",a.j.tb);a.b("components.unregister",a.j.unregister);a.b("components.defaultLoader",a.j.Fc);a.j.loaders.push(a.j.Fc);a.j.dd=h})();(function(){function b(b,e){var f=b.getAttribute("params");if(f){var f=c.parseBindingsString(f,e,b,{valueAccessors:!0,bindingParams:!0}),f=a.a.Ga(f,function(c){return a.o(c,null,{l:b})}),g=a.a.Ga(f,
function(c){var e=c.v();return c.ja()?a.o({read:function(){return a.a.f(c())},write:a.Za(e)&&function(a){c()(a)},l:b}):e});Object.prototype.hasOwnProperty.call(g,"$raw")||(g.$raw=f);return g}return{$raw:{}}}a.j.getComponentNameForNode=function(b){var c=a.a.R(b);if(a.j.tb(c)&&(-1!=c.indexOf("-")||"[object HTMLUnknownElement]"==""+b||8>=a.a.W&&b.tagName===c))return c};a.j.tc=function(c,e,f,g){if(1===e.nodeType){var h=a.j.getComponentNameForNode(e);if(h){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');
var m={name:h,params:b(e,f)};c.component=g?function(){return m}:m}}return c};var c=new a.ga;9>a.a.W&&(a.j.register=function(a){return function(b){return a.apply(this,arguments)}}(a.j.register),w.createDocumentFragment=function(b){return function(){var c=b(),f=a.j.dd,g;for(g in f);return c}}(w.createDocumentFragment))})();(function(){function b(b,c,d){c=c.template;if(!c)throw Error("Component '"+b+"' has no template");b=a.a.Ca(c);a.h.va(d,b)}function c(a,b,c){var d=a.createViewModel;return d?d.call(a,
b,c):b}var d=0;a.c.component={init:function(e,f,g,h,m){function k(){var a=l&&l.dispose;"function"===typeof a&&a.call(l);q&&q.s();p=l=q=null}var l,p,q,t=a.a.la(a.h.childNodes(e));a.h.Ea(e);a.a.K.za(e,k);a.o(function(){var g=a.a.f(f()),h,u;"string"===typeof g?h=g:(h=a.a.f(g.name),u=a.a.f(g.params));if(!h)throw Error("No component name specified");var n=a.i.Cb(e,m),z=p=++d;a.j.get(h,function(d){if(p===z){k();if(!d)throw Error("Unknown component '"+h+"'");b(h,d,e);var f=c(d,u,{element:e,templateNodes:t});
d=n.createChildContext(f,{extend:function(a){a.$component=f;a.$componentTemplateNodes=t}});f&&f.koDescendantsComplete&&(q=a.i.subscribe(e,a.i.pa,f.koDescendantsComplete,f));l=f;a.Oa(d,e)}})},null,{l:e});return{controlsDescendantBindings:!0}}};a.h.ea.component=!0})();var V={"class":"className","for":"htmlFor"};a.c.attr={update:function(b,c){var d=a.a.f(c())||{};a.a.P(d,function(c,d){d=a.a.f(d);var g=c.indexOf(":"),g="lookupNamespaceURI"in b&&0<g&&b.lookupNamespaceURI(c.substr(0,g)),h=!1===d||null===
d||d===n;h?g?b.removeAttributeNS(g,c):b.removeAttribute(c):d=d.toString();8>=a.a.W&&c in V?(c=V[c],h?b.removeAttribute(c):b[c]=d):h||(g?b.setAttributeNS(g,c,d):b.setAttribute(c,d));"name"===c&&a.a.Yc(b,h?"":d)})}};(function(){a.c.checked={after:["value","attr"],init:function(b,c,d){function e(){var e=b.checked,f=g();if(!a.S.Ya()&&(e||!m&&!a.S.qa())){var k=a.u.G(c);if(l){var q=p?k.v():k,z=t;t=f;z!==f?e&&(a.a.Na(q,f,!0),a.a.Na(q,z,!1)):a.a.Na(q,f,e);p&&a.Za(k)&&k(q)}else h&&(f===n?f=e:e||(f=n)),a.m.eb(k,
d,"checked",f,!0)}}function f(){var d=a.a.f(c()),e=g();l?(b.checked=0<=a.a.A(d,e),t=e):b.checked=h&&e===n?!!d:g()===d}var g=a.xb(function(){if(d.has("checkedValue"))return a.a.f(d.get("checkedValue"));if(q)return d.has("value")?a.a.f(d.get("value")):b.value}),h="checkbox"==b.type,m="radio"==b.type;if(h||m){var k=c(),l=h&&a.a.f(k)instanceof Array,p=!(l&&k.push&&k.splice),q=m||l,t=l?g():n;m&&!b.name&&a.c.uniqueName.init(b,function(){return!0});a.o(e,null,{l:b});a.a.B(b,"click",e);a.o(f,null,{l:b});
k=n}}};a.m.wa.checked=!0;a.c.checkedValue={update:function(b,c){b.value=a.a.f(c())}}})();a.c["class"]={update:function(b,c){var d=a.a.Db(a.a.f(c()));a.a.Eb(b,b.__ko__cssValue,!1);b.__ko__cssValue=d;a.a.Eb(b,d,!0)}};a.c.css={update:function(b,c){var d=a.a.f(c());null!==d&&"object"==typeof d?a.a.P(d,function(c,d){d=a.a.f(d);a.a.Eb(b,c,d)}):a.c["class"].update(b,c)}};a.c.enable={update:function(b,c){var d=a.a.f(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.c.disable=
{update:function(b,c){a.c.enable.update(b,function(){return!a.a.f(c())})}};a.c.event={init:function(b,c,d,e,f){var g=c()||{};a.a.P(g,function(g){"string"==typeof g&&a.a.B(b,g,function(b){var k,l=c()[g];if(l){try{var p=a.a.la(arguments);e=f.$data;p.unshift(e);k=l.apply(e,p)}finally{!0!==k&&(b.preventDefault?b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.c.foreach={Rc:function(b){return function(){var c=b(),d=a.a.bc(c);
if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.ba.Ma};a.a.f(c);return{foreach:d.data,as:d.as,noChildContext:d.noChildContext,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.ba.Ma}}},init:function(b,c){return a.c.template.init(b,a.c.foreach.Rc(c))},update:function(b,c,d,e,f){return a.c.template.update(b,a.c.foreach.Rc(c),d,e,f)}};a.m.Ra.foreach=!1;a.h.ea.foreach=
!0;a.c.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement}catch(l){g=f.body}e=g===b}f=c();a.m.eb(f,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),g=e.bind(null,!1);a.a.B(b,"focus",f);a.a.B(b,"focusin",f);a.a.B(b,"blur",g);a.a.B(b,"focusout",g);b.__ko_hasfocusLastValue=!1},update:function(b,c){var d=!!a.a.f(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===
d||(d?b.focus():b.blur(),!d&&b.__ko_hasfocusLastValue&&b.ownerDocument.body.focus(),a.u.G(a.a.Fb,null,[b,d?"focusin":"focusout"]))}};a.m.wa.hasfocus=!0;a.c.hasFocus=a.c.hasfocus;a.m.wa.hasFocus="hasfocus";a.c.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.fc(b,c())}};(function(){function b(b,d,e){a.c[b]={init:function(b,c,h,m,k){var l,p,q={},t,x,n;if(d){m=h.get("as");var u=h.get("noChildContext");n=!(m&&u);q={as:m,noChildContext:u,exportDependencies:n}}x=(t=
"render"==h.get("completeOn"))||h.has(a.i.pa);a.o(function(){var h=a.a.f(c()),m=!e!==!h,u=!p,r;if(n||m!==l){x&&(k=a.i.Cb(b,k));if(m){if(!d||n)q.dataDependency=a.S.o();r=d?k.createChildContext("function"==typeof h?h:c,q):a.S.qa()?k.extend(null,q):k}u&&a.S.qa()&&(p=a.a.Ca(a.h.childNodes(b),!0));m?(u||a.h.va(b,a.a.Ca(p)),a.Oa(r,b)):(a.h.Ea(b),t||a.i.ma(b,a.i.H));l=m}},null,{l:b});return{controlsDescendantBindings:!0}}};a.m.Ra[b]=!1;a.h.ea[b]=!0}b("if");b("ifnot",!1,!0);b("with",!0)})();a.c.let={init:function(b,
c,d,e,f){c=f.extend(c);a.Oa(c,b);return{controlsDescendantBindings:!0}}};a.h.ea.let=!0;var Q={};a.c.options={init:function(b){if("select"!==a.a.R(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.jb(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function g(c,d){if(x&&l)a.i.ma(b,a.i.H);else if(t.length){var e=
0<=a.a.A(t,a.w.M(d[0]));a.a.Zc(d[0],e);x&&!e&&a.u.G(a.a.Fb,null,[b,"change"])}}var h=b.multiple,m=0!=b.length&&h?b.scrollTop:null,k=a.a.f(c()),l=d.get("valueAllowUnset")&&d.has("value"),p=d.get("optionsIncludeDestroyed");c={};var q,t=[];l||(h?t=a.a.Mb(e(),a.w.M):0<=b.selectedIndex&&t.push(a.w.M(b.options[b.selectedIndex])));k&&("undefined"==typeof k.length&&(k=[k]),q=a.a.jb(k,function(b){return p||b===n||null===b||!a.a.f(b._destroy)}),d.has("optionsCaption")&&(k=a.a.f(d.get("optionsCaption")),null!==
k&&k!==n&&q.unshift(Q)));var x=!1;c.beforeRemove=function(a){b.removeChild(a)};k=g;d.has("optionsAfterRender")&&"function"==typeof d.get("optionsAfterRender")&&(k=function(b,c){g(0,c);a.u.G(d.get("optionsAfterRender"),null,[c[0],b!==Q?b:n])});a.a.ec(b,q,function(c,e,g){g.length&&(t=!l&&g[0].selected?[a.w.M(g[0])]:[],x=!0);e=b.ownerDocument.createElement("option");c===Q?(a.a.Bb(e,d.get("optionsCaption")),a.w.cb(e,n)):(g=f(c,d.get("optionsValue"),c),a.w.cb(e,a.a.f(g)),c=f(c,d.get("optionsText"),g),
a.a.Bb(e,c));return[e]},c,k);if(!l){var B;h?B=t.length&&e().length<t.length:B=t.length&&0<=b.selectedIndex?a.w.M(b.options[b.selectedIndex])!==t[0]:t.length||0<=b.selectedIndex;B&&a.u.G(a.a.Fb,null,[b,"change"])}(l||a.S.Ya())&&a.i.ma(b,a.i.H);a.a.wd(b);m&&20<Math.abs(m-b.scrollTop)&&(b.scrollTop=m)}};a.c.options.$b=a.a.g.Z();a.c.selectedOptions={init:function(b,c,d){function e(){var e=c(),f=[];a.a.D(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.w.M(b))});a.m.eb(e,d,"selectedOptions",
f)}function f(){var d=a.a.f(c()),e=b.scrollTop;d&&"number"==typeof d.length&&a.a.D(b.getElementsByTagName("option"),function(b){var c=0<=a.a.A(d,a.w.M(b));b.selected!=c&&a.a.Zc(b,c)});b.scrollTop=e}if("select"!=a.a.R(b))throw Error("selectedOptions binding applies only to SELECT elements");var g;a.i.subscribe(b,a.i.H,function(){g?e():(a.a.B(b,"change",e),g=a.o(f,null,{l:b}))},null,{notifyImmediately:!0})},update:function(){}};a.m.wa.selectedOptions=!0;a.c.style={update:function(b,c){var d=a.a.f(c()||
{});a.a.P(d,function(c,d){d=a.a.f(d);if(null===d||d===n||!1===d)d="";if(v)v(b).css(c,d);else if(/^--/.test(c))b.style.setProperty(c,d);else{c=c.replace(/-(\w)/g,function(a,b){return b.toUpperCase()});var g=b.style[c];b.style[c]=d;d===g||b.style[c]!=g||isNaN(d)||(b.style[c]=d+"px")}})}};a.c.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.B(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?
a.preventDefault():a.returnValue=!1)}})}};a.c.text={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Bb(b,c())}};a.h.ea.text=!0;(function(){if(A&&A.navigator){var b=function(a){if(a)return parseFloat(a[1])},c=A.navigator.userAgent,d,e,f,g,h;(d=A.opera&&A.opera.version&&parseInt(A.opera.version()))||(h=b(c.match(/Edge\/([^ ]+)$/)))||b(c.match(/Chrome\/([^ ]+)/))||(e=b(c.match(/Version\/([^ ]+) Safari/)))||(f=b(c.match(/Firefox\/([^ ]+)/)))||(g=a.a.W||b(c.match(/MSIE ([^ ]+)/)))||
(g=b(c.match(/rv:([^ )]+)/)))}if(8<=g&&10>g)var m=a.a.g.Z(),k=a.a.g.Z(),l=function(b){var c=this.activeElement;(c=c&&a.a.g.get(c,k))&&c(b)},p=function(b,c){var d=b.ownerDocument;a.a.g.get(d,m)||(a.a.g.set(d,m,!0),a.a.B(d,"selectionchange",l));a.a.g.set(b,k,c)};a.c.textInput={init:function(b,c,k){function l(c,d){a.a.B(b,c,d)}function m(){var d=a.a.f(c());if(null===d||d===n)d="";L!==n&&d===L?a.a.setTimeout(m,4):b.value!==d&&(y=!0,b.value=d,y=!1,v=b.value)}function r(){w||(L=b.value,w=a.a.setTimeout(z,
4))}function z(){clearTimeout(w);L=w=n;var d=b.value;v!==d&&(v=d,a.m.eb(c(),k,"textInput",d))}var v=b.value,w,L,A=9==a.a.W?r:z,y=!1;g&&l("keypress",z);11>g&&l("propertychange",function(a){y||"value"!==a.propertyName||A(a)});8==g&&(l("keyup",z),l("keydown",z));p&&(p(b,A),l("dragend",r));(!g||9<=g)&&l("input",A);5>e&&"textarea"===a.a.R(b)?(l("keydown",r),l("paste",r),l("cut",r)):11>d?l("keydown",r):4>f?(l("DOMAutoComplete",z),l("dragdrop",z),l("drop",z)):h&&"number"===b.type&&l("keydown",r);l("change",
z);l("blur",z);a.o(m,null,{l:b})}};a.m.wa.textInput=!0;a.c.textinput={preprocess:function(a,b,c){c("textInput",a)}}})();a.c.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.c.uniqueName.rd;a.a.Yc(b,d)}}};a.c.uniqueName.rd=0;a.c.using={init:function(b,c,d,e,f){var g;d.has("as")&&(g={as:d.get("as"),noChildContext:d.get("noChildContext")});c=f.createChildContext(c,g);a.Oa(c,b);return{controlsDescendantBindings:!0}}};a.h.ea.using=!0;a.c.value={init:function(b,c,d){var e=a.a.R(b),f="input"==
e;if(!f||"checkbox"!=b.type&&"radio"!=b.type){var g=[],h=d.get("valueUpdate"),m=!1,k=null;h&&("string"==typeof h?g=[h]:g=a.a.wc(h),a.a.Pa(g,"change"));var l=function(){k=null;m=!1;var e=c(),f=a.w.M(b);a.m.eb(e,d,"value",f)};!a.a.W||!f||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.A(g,"propertychange")||(a.a.B(b,"propertychange",function(){m=!0}),a.a.B(b,"focus",function(){m=!1}),a.a.B(b,"blur",function(){m&&l()}));a.a.D(g,function(c){var d=l;a.a.Ud(c,"after")&&
(d=function(){k=a.w.M(b);a.a.setTimeout(l,0)},c=c.substring(5));a.a.B(b,c,d)});var p;p=f&&"file"==b.type?function(){var d=a.a.f(c());null===d||d===n||""===d?b.value="":a.u.G(l)}:function(){var f=a.a.f(c()),g=a.w.M(b);if(null!==k&&f===k)a.a.setTimeout(p,0);else if(f!==g||g===n)"select"===e?(g=d.get("valueAllowUnset"),a.w.cb(b,f,g),g||f===a.w.M(b)||a.u.G(l)):a.w.cb(b,f)};if("select"===e){var q;a.i.subscribe(b,a.i.H,function(){q?d.get("valueAllowUnset")?p():l():(a.a.B(b,"change",l),q=a.o(p,null,{l:b}))},
null,{notifyImmediately:!0})}else a.a.B(b,"change",l),a.o(p,null,{l:b})}else a.ib(b,{checkedValue:c})},update:function(){}};a.m.wa.value=!0;a.c.visible={update:function(b,c){var d=a.a.f(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};a.c.hidden={update:function(b,c){a.c.visible.update(b,function(){return!a.a.f(c())})}};(function(b){a.c[b]={init:function(c,d,e,f,g){return a.c.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,g)}}})("click");
a.ca=function(){};a.ca.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.ca.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.ca.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.C.F(d)}if(1==b.nodeType||8==b.nodeType)return new a.C.ia(b);throw Error("Unknown template type: "+b);};a.ca.prototype.renderTemplate=
function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d,e)};a.ca.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.ca.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.ca);a.kc=function(){function b(b,c,d,h){b=a.m.ac(b);for(var m=a.m.Ra,k=0;k<b.length;k++){var l=b[k].key;if(Object.prototype.hasOwnProperty.call(m,
l)){var p=m[l];if("function"===typeof p){if(l=p(b[k].value))throw Error(l);}else if(!p)throw Error("This template engine does not support the '"+l+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.m.vb(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return h.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{xd:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.kc.Ld(b,c)},d)},Ld:function(a,f){return a.replace(c,function(a,c,d,e,l){return b(l,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",f)})},md:function(b,c){return a.aa.Xb(function(d,h){var m=d.nextSibling;m&&m.nodeName.toLowerCase()===c&&a.ib(m,b,h)})}}}();a.b("__tr_ambtns",a.kc.md);(function(){a.C={};a.C.F=function(b){if(this.F=b){var c=
a.a.R(b);this.ab="script"===c?1:"textarea"===c?2:"template"==c&&b.content&&11===b.content.nodeType?3:4}};a.C.F.prototype.text=function(){var b=1===this.ab?"text":2===this.ab?"value":"innerHTML";if(0==arguments.length)return this.F[b];var c=arguments[0];"innerHTML"===b?a.a.fc(this.F,c):this.F[b]=c};var b=a.a.g.Z()+"_";a.C.F.prototype.data=function(c){if(1===arguments.length)return a.a.g.get(this.F,b+c);a.a.g.set(this.F,b+c,arguments[1])};var c=a.a.g.Z();a.C.F.prototype.nodes=function(){var b=this.F;
if(0==arguments.length){var e=a.a.g.get(b,c)||{},f=e.lb||(3===this.ab?b.content:4===this.ab?b:n);if(!f||e.jd){var g=this.text();g&&g!==e.bb&&(f=a.a.Md(g,b.ownerDocument),a.a.g.set(b,c,{lb:f,bb:g,jd:!0}))}return f}e=arguments[0];this.ab!==n&&this.text("");a.a.g.set(b,c,{lb:e})};a.C.ia=function(a){this.F=a};a.C.ia.prototype=new a.C.F;a.C.ia.prototype.constructor=a.C.ia;a.C.ia.prototype.text=function(){if(0==arguments.length){var b=a.a.g.get(this.F,c)||{};b.bb===n&&b.lb&&(b.bb=b.lb.innerHTML);return b.bb}a.a.g.set(this.F,
c,{bb:arguments[0]})};a.b("templateSources",a.C);a.b("templateSources.domElement",a.C.F);a.b("templateSources.anonymousTemplate",a.C.ia)})();(function(){function b(b,c,d){var e;for(c=a.h.nextSibling(c);b&&(e=b)!==c;)b=a.h.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],g=e.parentNode,h=a.ga.instance,m=h.preprocessNode;if(m){b(e,f,function(a,b){var c=a.previousSibling,d=m.call(h,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):
(c.push(e,f),a.a.Ua(c,g))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.vc(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.aa.cd(b,[d])});a.a.Ua(c,g)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,f,h,m){m=m||{};var n=(b&&d(b)||f||{}).ownerDocument,B=m.templateEngine||g;a.kc.xd(f,B,n);f=B.renderTemplate(f,h,m,n);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");n=!1;switch(e){case "replaceChildren":a.h.va(b,
f);n=!0;break;case "replaceNode":a.a.Xc(b,f);n=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}n&&(c(f,h),m.afterRender&&a.u.G(m.afterRender,null,[f,h[m.as||"$data"]]),"replaceChildren"==e&&a.i.ma(b,a.i.H));return f}function f(b,c,d){return a.O(b)?b():"function"===typeof b?b(c,d):b}var g;a.gc=function(b){if(b!=n&&!(b instanceof a.ca))throw Error("templateEngine must inherit from ko.templateEngine");g=b};a.dc=function(b,c,h,m,t){h=h||{};if((h.templateEngine||g)==
n)throw Error("Set a template engine before calling renderTemplate");t=t||"replaceChildren";if(m){var x=d(m);return a.$(function(){var g=c&&c instanceof a.fa?c:new a.fa(c,null,null,null,{exportDependencies:!0}),n=f(b,g.$data,g),g=e(m,t,n,g,h);"replaceNode"==t&&(m=g,x=d(m))},null,{Sa:function(){return!x||!a.a.Sb(x)},l:x&&"replaceNode"==t?x.parentNode:x})}return a.aa.Xb(function(d){a.dc(b,c,h,d,"replaceNode")})};a.Qd=function(b,d,g,h,m){function x(b,c){a.u.G(a.a.ec,null,[h,b,u,g,r,c]);a.i.ma(h,a.i.H)}
function r(a,b){c(b,v);g.afterRender&&g.afterRender(b,a);v=null}function u(a,c){v=m.createChildContext(a,{as:z,noChildContext:g.noChildContext,extend:function(a){a.$index=c;z&&(a[z+"Index"]=c)}});var d=f(b,a,v);return e(h,"ignoreTargetNode",d,v,g)}var v,z=g.as,w=!1===g.includeDestroyed||a.options.foreachHidesDestroyed&&!g.includeDestroyed;if(w||g.beforeRemove||!a.Pc(d))return a.$(function(){var b=a.a.f(d)||[];"undefined"==typeof b.length&&(b=[b]);w&&(b=a.a.jb(b,function(b){return b===n||null===b||
!a.a.f(b._destroy)}));x(b)},null,{l:h});x(d.v());var A=d.subscribe(function(a){x(d(),a)},null,"arrayChange");A.l(h);return A};var h=a.a.g.Z(),m=a.a.g.Z();a.c.template={init:function(b,c){var d=a.a.f(c());if("string"==typeof d||"name"in d)a.h.Ea(b);else if("nodes"in d){d=d.nodes||[];if(a.O(d))throw Error('The "nodes" option must be a plain, non-observable array.');var e=d[0]&&d[0].parentNode;e&&a.a.g.get(e,m)||(e=a.a.Yb(d),a.a.g.set(e,m,!0));(new a.C.ia(b)).nodes(e)}else if(d=a.h.childNodes(b),0<d.length)e=
a.a.Yb(d),(new a.C.ia(b)).nodes(e);else throw Error("Anonymous template defined, but no template content was provided");return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var g=c();c=a.a.f(g);d=!0;e=null;"string"==typeof c?c={}:(g="name"in c?c.name:b,"if"in c&&(d=a.a.f(c["if"])),d&&"ifnot"in c&&(d=!a.a.f(c.ifnot)),d&&!g&&(d=!1));"foreach"in c?e=a.Qd(g,d&&c.foreach||[],c,b,f):d?(d=f,"data"in c&&(d=f.createChildContext(c.data,{as:c.as,noChildContext:c.noChildContext,exportDependencies:!0})),
e=a.dc(g,d,c,b)):a.h.Ea(b);f=e;(c=a.a.g.get(b,h))&&"function"==typeof c.s&&c.s();a.a.g.set(b,h,!f||f.ja&&!f.ja()?n:f)}};a.m.Ra.template=function(b){b=a.m.ac(b);return 1==b.length&&b[0].unknown||a.m.Id(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.h.ea.template=!0})();a.b("setTemplateEngine",a.gc);a.b("renderTemplate",a.dc);a.a.Kc=function(a,c,d){if(a.length&&c.length){var e,f,g,h,m;for(e=f=0;(!d||e<d)&&(h=a[f]);++f){for(g=0;m=c[g];++g)if(h.value===
m.value){h.moved=m.index;m.moved=h.index;c.splice(g,1);e=g=0;break}e+=g}}};a.a.Pb=function(){function b(b,d,e,f,g){var h=Math.min,m=Math.max,k=[],l,p=b.length,q,n=d.length,r=n-p||1,v=p+n+1,u,w,z;for(l=0;l<=p;l++)for(w=u,k.push(u=[]),z=h(n,l+r),q=m(0,l-1);q<=z;q++)u[q]=q?l?b[l-1]===d[q-1]?w[q-1]:h(w[q]||v,u[q-1]||v)+1:q+1:l+1;h=[];m=[];r=[];l=p;for(q=n;l||q;)n=k[l][q]-1,q&&n===k[l][q-1]?m.push(h[h.length]={status:e,value:d[--q],index:q}):l&&n===k[l-1][q]?r.push(h[h.length]={status:f,value:b[--l],index:l}):
(--q,--l,g.sparse||h.push({status:"retained",value:d[q]}));a.a.Kc(r,m,!g.dontLimitMoves&&10*p);return h.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Pb);(function(){function b(b,c,d,h,m){var k=[],l=a.$(function(){var l=c(d,m,a.a.Ua(k,b))||[];0<k.length&&(a.a.Xc(k,l),h&&a.u.G(h,null,[d,l,m]));k.length=0;a.a.Nb(k,l)},null,{l:b,Sa:function(){return!a.a.kd(k)}});
return{Y:k,$:l.ja()?l:n}}var c=a.a.g.Z(),d=a.a.g.Z();a.a.ec=function(e,f,g,h,m,k){function l(b){y={Aa:b,pb:a.ta(w++)};v.push(y);r||F.push(y)}function p(b){y=t[b];w!==y.pb.v()&&D.push(y);y.pb(w++);a.a.Ua(y.Y,e);v.push(y)}function q(b,c){if(b)for(var d=0,e=c.length;d<e;d++)a.a.D(c[d].Y,function(a){b(a,d,c[d].Aa)})}f=f||[];"undefined"==typeof f.length&&(f=[f]);h=h||{};var t=a.a.g.get(e,c),r=!t,v=[],u=0,w=0,z=[],A=[],C=[],D=[],F=[],y,I=0;if(r)a.a.D(f,l);else{if(!k||t&&t._countWaitingForRemove){var E=
a.a.Mb(t,function(a){return a.Aa});k=a.a.Pb(E,f,{dontLimitMoves:h.dontLimitMoves,sparse:!0})}for(var E=0,G,H,K;G=k[E];E++)switch(H=G.moved,K=G.index,G.status){case "deleted":for(;u<K;)p(u++);H===n&&(y=t[u],y.$&&(y.$.s(),y.$=n),a.a.Ua(y.Y,e).length&&(h.beforeRemove&&(v.push(y),I++,y.Aa===d?y=null:C.push(y)),y&&z.push.apply(z,y.Y)));u++;break;case "added":for(;w<K;)p(u++);H!==n?(A.push(v.length),p(H)):l(G.value)}for(;w<f.length;)p(u++);v._countWaitingForRemove=I}a.a.g.set(e,c,v);q(h.beforeMove,D);a.a.D(z,
h.beforeRemove?a.oa:a.removeNode);var M,O,P;try{P=e.ownerDocument.activeElement}catch(N){}if(A.length)for(;(E=A.shift())!=n;){y=v[E];for(M=n;E;)if((O=v[--E].Y)&&O.length){M=O[O.length-1];break}for(f=0;u=y.Y[f];M=u,f++)a.h.Wb(e,u,M)}for(E=0;y=v[E];E++){y.Y||a.a.extend(y,b(e,g,y.Aa,m,y.pb));for(f=0;u=y.Y[f];M=u,f++)a.h.Wb(e,u,M);!y.Ed&&m&&(m(y.Aa,y.Y,y.pb),y.Ed=!0,M=y.Y[y.Y.length-1])}P&&e.ownerDocument.activeElement!=P&&P.focus();q(h.beforeRemove,C);for(E=0;E<C.length;++E)C[E].Aa=d;q(h.afterMove,D);
q(h.afterAdd,F)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.ec);a.ba=function(){this.allowTemplateRewriting=!1};a.ba.prototype=new a.ca;a.ba.prototype.constructor=a.ba;a.ba.prototype.renderTemplateSource=function(b,c,d,e){if(c=(9>a.a.W?0:b.nodes)?b.nodes():null)return a.a.la(c.cloneNode(!0).childNodes);b=b.text();return a.a.ua(b,e)};a.ba.Ma=new a.ba;a.gc(a.ba.Ma);a.b("nativeTemplateEngine",a.ba);(function(){a.$a=function(){var a=this.Hd=function(){if(!v||!v.tmpl)return 0;try{if(0<=v.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();
this.renderTemplateSource=function(b,e,f,g){g=g||w;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=v.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=v.extend({koBindingContext:e},f.templateOptions);e=v.tmpl(h,b,e);e.appendTo(g.createElement("div"));v.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+
a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(v.tmpl.tag.ko_code={open:"__.push($1 || '');"},v.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.$a.prototype=new a.ca;a.$a.prototype.constructor=a.$a;var b=new a.$a;0<b.Hd&&a.gc(b);a.b("jqueryTmplTemplateEngine",a.$a)})()})})();})();

},{}],10:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],11:[function(require,module,exports){
/*
Copyright (c) 2016 Paul Austin - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = (function () {
  'use strict';

  //----------------------------------------------------------------------------
  var teak = {};

  // Token categories
  var tkNone = 0;         // No valid token
  var tkOpenParen = 1;    // (
  var tkCloseParen = 2;   // )
  var tkString = 3;       // 'abc'
  var tkNumber = 4;       // 123 456.289
  var tkSymbol = 5;       // add
  var tkName = 6;         // name:

  function isNumberChar (c) {
    return (c >= '0' && c <= '9');
  }

  function isAlphaChar (c) {
    return (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z');
  }

  teak.invalidToken = {string:'', cat: tkNone};

  //----------------------------------------------------------------------------
  teak.Parser = function Parser (buffer, begin, state, symbolTable) {
    // Buffer is an array of single unicode grapheme
    this.buffer = buffer;
    // Begin is the index to the next character
    this.begin = begin;
    // Parser state
    this.state = state;
    state.error = '';
    state.position = 0;

    // SymbolTable for mapping symbols (not strings) found in the expression
    this.symbolTable = symbolTable;
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.markError = function (message, position) {
    this.state.error = message;
    this.state.position = position;
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.empty = function () {
    return (this.begin >= this.buffer.length);
  };

  //----------------------------------------------------------------------------
  // Skip spaces and any comments found along the way.
  teak.Parser.prototype.skipSpace = function Parser () {
    var i = this.begin;
    var length = this.buffer.length;
    while (i < length) {
      var c = this.peekChar();
      if (c === ' ' || c === '\n' || c === '\r' || c === '\t') {
        this.readChar();
        continue;
      } else if (c === '/' && ((i + 1) < length) && this.buffer[i+1] === '/') {
        // Comment to end-of-line, or end-of-file
        this.readChar();
        this.readChar();
        do {
          c = this.readChar();
        } while (c !== '\n' && !this.empty());
      } else {
        // Found something that does not count was space, break.
        break;
      }
    }
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.peekChar = function () {
    return this.buffer[this.begin];
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.readChar = function () {
    var c = '';
    if (this.begin < this.buffer.length) {
      c = this.buffer[this.begin];
      this.begin += 1;
    }
    return c;
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.scanNumberToken = function (isNeg) {
    var str = isNeg ? '-' : '';
    var c = '';
    do {
      str += this.readChar();
      c = this.peekChar();
      // TODO this is not as strict as it oughto be..
      // tighten up here or in tokenToObject().
    } while (isNumberChar(c) || c === '.');
    return { string:str, category:tkNumber };
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.scanSymbolToken = function (isNeg) {
    var str = isNeg ? '-' : '';
    var cat = tkSymbol;
    do {
      str += this.readChar();
      var c = this.peekChar();
    } while (isNumberChar(c) || isAlphaChar(c));

    // There are a few special cases
    if (c === ':') {
      if (isNeg) {
        this.markError('Invalid negated name', this.begin);
        return teak.invalidToken;
      }
      // symbol followed by a colon is really anchor/field name
      // this takes precedence over reserved words.
      cat = tkName;
      this.readChar();
    }
    return { string:str, category:cat };
  };

  //----------------------------------------------------------------------------
  // Reads characters from the buffer assuming it is a string
  teak.Parser.prototype.scanStringToken = function () {
    this.readChar();
    var str = '';
    var position = this.begin;
    var c = this.readChar();
    while (c !== '\'' && !this.empty()) {
      if (c !== '\\') {
        str += c;
        c = this.readChar();
      } else {
        // Read escape sequence and translate.
        c = this.readChar();
        if (c === 'n') {
          str += '\n';
        } else if (c === '\'') {
          str += '\'';
        } else if (c === '\"') {
          str += '\"';
        } else if (c === '\\') {
          str += '\\';
        } else if (c === 'u') {
          // TODO unicode characters
        } else {
          this.markError('Invalid string escape', this.begin);
        }
        c = this.readChar();
      }
    };

    if (c !== '\'') {
      this.markError('Invalid string', position);
    }
    return {
      string:str,
      category:tkString,
    };
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.readToken = function () {
    this.skipSpace();
    var c = this.peekChar();
    var isNeg = false;

    if (c === '(') {
      return { string: this.readChar(), category: tkOpenParen };
    } else if (c === ')') {
      return { string: this.readChar(), category: tkCloseParen };
    } else if (c === '\'') {
      return this.scanStringToken();
    } else if (c === '-') {
      // negative sign can prefix numbers and some symbols
      isNeg = true;
      this.readChar();
      c = this.peekChar();
    }

    if (isNumberChar(c)) {
      return this.scanNumberToken(isNeg);
    } else if (isAlphaChar(c)) {
      return this.scanSymbolToken(isNeg);
    }  else {
      return teak.invalidToken;
    }
  };

//------------------------------------------------------------------------------
teak.Parser.prototype.tokenToObject = function (token) {
    var str = token.string;
    if (token.category === tkNumber) {
      if (str.includes('.')) {
        return parseFloat(str, 10);
      } else {
        return parseInt(str, 10);
      }
    } else if (token.category === tkString) {
      // Its a string use the data as is.
      return str;
    } else if (token.category === tkSymbol) {
      // Check for reserved words first
      if (str === 'true') {
        return true;
      } else if (str === 'false') {
        return false;
      } else if (str === 'null') {
        return null;
      } else if (str === 'nan') {
        return Number.NaN;
      } else if (str === 'inf') {
        return Number.POSITIVE_INFINITY;
      } else if (str === '-inf') {
        return Number.NEGATIVE_INFINITY;
      } else {
        return this.lookupSymbol(str);
        // TODO unresolved symbols just pass through as undefined.
      }
    } else if (token.category === tkNone) {
      // Unrecognized characters or end of string
      this.markError('Invalid token', this.begin);
      return null;
    } else {
      // Token type not yet supported.
      this.markError('Invalid token category :' + token.category, this.begin);
    }
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.lookupSymbol = function (name) {
    var value = undefined;
    if (Array.isArray(this.symbolTable)) {
      for (var i = 0; i < this.symbolTable.length; i++) {
        value = this.symbolTable[i][name];
        if (value !== undefined) {
          break;
        }
      }
    } else if (typeof this.symbolTable === "function") {
      return this.symbolTable(name);
    } else {
      value = this.symbolTable[name];
    }
    return value;
  };

  //----------------------------------------------------------------------------
  teak.Parser.prototype.parseObject = function (token) {
      var obj = null;
      var names = [];
      var index = 0;

      if (token.category === tkOpenParen) {
        // Beginning of a list
        var array = [];
        token = this.readToken();
        while (token.category !== tkCloseParen && !this.empty()) {

          // See if item has a name
          if (token.category === tkName) {
            names[index] = token.string;
            token = this.readToken();
          }
          if (token.category === tkName) {
            this.markError('Invalid token', this.begin);
            return null;
          }

          array.push(this.parseObject(token));
          token = this.readToken();
          index += 1;
        }
        if (names.length > 0) {
          var objWithFields = {};
          var length = array.length;
          for (var i = 0; i < length; i++) {
            var name = names[i];
            if (name === undefined) {
              name = "_" + i;
            }
            objWithFields[name] = array[i];
          }
          obj = objWithFields;
        } else {
          obj = array;
        }
        if (token.category !== tkCloseParen) {
          this.markError('Invalid expression', this.begin);
          return null;
        }
      } else {
        // Not a list, is a single item
        obj = this.tokenToObject(token);
      }
      return obj;
  };

  //----------------------------------------------------------------------------
  teak.parse = function (string, state, symbolTable) {
    if (state === undefined || state === null) {
      state = {};
    }
    if (symbolTable === undefined || state === null) {
      symbolTable = {};
    }

    var st = '';
    if (!Array.from) {
      // For pre ES2015 runtimes use split, does not support surogate pairs.
      st = new teak.Parser(string.split(''), 0, state, symbolTable);
    } else {
      st = new teak.Parser(Array.from(string), 0, state, symbolTable);
    }

    var token = st.readToken();
    return st.parseObject(token);
  };

  return teak;
}());

},{}],12:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;

},{}],13:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

	//const oldAlert = window.alert
	/*
 window.alert = function () {}
 window.onload = function() {
 	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
 	if (isMobile)
 	{
 		window.location.href = "tblocks://"
 		setTimeout(() => {window.location.href = "http://tblocks.app.link"}, 1000)		
 	}
 	else
 	{
 		window.location.href = "https://trashbots.github.io/tblocks"
 	}
 }
 */
	//window.alert = oldAlert


	var log = require('log.js');
	var fastr = require('fastr.js');

	// Starts as an object and will be mosty empty until start()
	// is called.
	var app = {};
	app.buildFlags = require('../buildFlags.js');

	var timeFormat = {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	};

	log.trace('TBlocks starting -', new Date().toLocaleDateString("en-US", timeFormat));

	app.hideCookieSheet = function () {
		var cookieSheet = document.getElementById('cookieSheet');
		cookieSheet.innerHTML = '';
		app.storage.setItem('cookiesAccepted', true);
	};

	app.pause = function () {
		log.trace('TBlocks pause.', new Date().toLocaleDateString("en-US", timeFormat));
		app.overlays.pauseResume(true);
	};

	app.resume = function () {
		log.trace('TBlocks resuming.', new Date().toLocaleDateString("en-US", timeFormat));
		app.overlays.pauseResume(false);
	};

	// Application main, called once shell is fully up.
	app.start = function () {
		if (window.cordova !== undefined) {
			app.platformId = window.cordova.platformId;
		} else {
			app.platformId = "broswer";
		}

		var isApp = app.isCordovaApp;
		var w = window.innerWidth;
		var h = window.innerHeight;
		var luanchMessage = 'verson:' + app.buildFlags.version + ', isApp:' + app.isCordovaApp + ', platform:' + app.platformId + ', screen:(' + w + ', ' + h + ')';
		log.trace(luanchMessage);

		// Once app has started these can be added.
		document.addEventListener("pause", app.pause, false);
		document.addEventListener("resume", app.resume, false);

		var ko = require('knockout');
		var Clipboard = require('clipboard');
		app.tbe = require('./teakblocks.js');
		app.conductor = require('./conductor.js');
		app.dots = require('./overlays/actionDots.js');
		app.defaultFiles = require('./defaultFiles.js');
		app.teaktext = require('./teaktext.js');

		// Add major modules to the application object.
		var tbe = app.tbe;

		app.overlays = require('./overlays/overlays.js').init();
		// a bit of a hack???
		app.fileManager = app.overlays.screens.fileOverlay;
		app.storage = app.fileManager.localStorage();

		if (window.MobileAccessibility) {
			window.MobileAccessibility.usePreferredTextZoom(false);
		}

		/*
  else
  {
  	window.location.href = "http://tblocks.app.link"; //Testing purposes (redirects to trashbots.github.io)
  }*/

		// Configuration components for the app and blocks
		// Initialize knockout databinding for documents DOM
		tbe.components = {};
		tbe.components.blockSettings = require('./block-settings.js');
		ko.applyBindings(tbe.components);

		var formsDiv = document.getElementById('tbe-forms');
		tbe.components.blockSettings.insert(formsDiv);

		var cookieSheet = document.getElementById('cookieSheet');
		var cookiesAccepted = app.storage.getItem('cookiesAccepted');
		if (!isApp && (cookiesAccepted === null || cookiesAccepted === false)) {
			cookieSheet.innerHTML = '\n        <div id=\'cookiesGlass\'></dev>\n        <div id=\'cookiesForm\'>\n            <div id=\'cookiesNote\'>\n\t\t\t  <input id=\'cookiesButton\' type="button" value="  Accept Cookies  " style="float:right">\n              <p>\n                  We use cookies and similar technologies for document\n                  stroage functionality and to measure performance of application features.\n                  You consent to our cookies if you continue to use our website.\n              </p>\n            </div>\n        </div>\n        ';
			var cookiesButton = document.getElementById('cookiesButton');
			cookiesButton.onclick = app.hideCookieSheet;
		}

		// Some early experiments. seems to work well for desktop Chrome
		// Safari has noticeable lag, with volume fluctuations.
		tbe.audio = {
			shortClick: document.getElementById('short-click'),
			poof: document.getElementById('poof'),
			playSound: function playSound(element) {
				// TODO need means to turn off sounds
				if (!gIOS /* tbe.components.appSettings.editorSounds() */) {
						element.play();
					}
			}
		};
		tbe.audio.shortClick.preload = 'true';
		tbe.audio.poof.preload = 'true';

		var buttonsPages = [{ 'label': 'A', 'command': 'loadDocA' }, { 'label': 'B', 'command': 'loadDocB' }, { 'label': 'C', 'command': 'loadDocC' }, { 'label': 'D', 'command': 'loadDocD' }, { 'label': 'E', 'command': 'loadDocE' }];
		var buttonsEdit = [{ 'label': fastr.copy, 'command': 'copy' }, { 'label': fastr.paste, 'command': 'paste' }, { 'label': fastr.trash, 'command': 'trash' }, { 'label': fastr.settings, 'command': 'splashOverlay' }];

		tbe.deleteRay = null;
		tbe.commands = {
			'play': function play() {
				app.conductor.playAll();
			},
			'stop': function stop() {
				app.conductor.stopAll();
			},
			'trash': function trash() {
				tbe.clearAllBlocks();
			},
			'pages': function pages() {
				tbe.clearStates();tbe.dropdownButtons = app.dots.showDropdown(buttonsPages, tbe, fastr.folder, 'pages');
			},
			'edit': function edit() {
				tbe.clearStates();tbe.dropdownButtons = app.dots.showDropdown(buttonsEdit, tbe, fastr.edit, 'edit');
			},
			'loadDocA': function loadDocA() {
				tbe.loadDoc('docA');
			},
			'loadDocB': function loadDocB() {
				tbe.loadDoc('docB');
			},
			'loadDocC': function loadDocC() {
				tbe.loadDoc('docC');
			},
			'loadDocD': function loadDocD() {
				tbe.loadDoc('docD');
			},
			'loadDocE': function loadDocE() {
				tbe.loadDoc('docE');
			},

			'docSnapShot': function docSnapShot() {
				app.overlays.fileOverlay.cameraFlash();
			},
			'driveOverlay': 'driveOverlay',
			'debugOverlay': 'debugOverlay',
			'splashOverlay': 'splashOverlay',
			'deviceScanOverlay': 'deviceScanOverlay',

			'settings': function settings() {
				tbe.loadSettings();
			},
			'copy': function copy() {
				tbe.copyText = app.teaktext.blocksToText(tbe.forEachDiagramChain);
			},
			'paste': function paste() {
				if (tbe.copyTest !== null) {
					app.teaktext.textToBlocks(tbe, tbe.copyText);
				}
			},
			'save': function save() {
				var currentDocText = app.teaktext.blocksToText(tbe.forEachDiagramChain);
				app.storage.setItem(tbe.currentDoc, currentDocText);
			},
			'calibrate': 'calibrationOverlay'
		};

		// Construct the clipboard
		var clipboard = new Clipboard('.copy-button', {
			text: function text() {
				return app.teaktext.blocksToText(tbe.forEachDiagramChain);
			}
		});
		clipboard.on('success', function (e) {
			log.trace('clipboard success', e);
		});
		clipboard.on('error', function (e) {
			log.trace('clipboard error', e);
		});

		// these could be loaded from JSON files/strings
		var package1 = {
			blocks: [
			// Start Blocks
			{ name: 'identity', group: 'start' }, { name: 'identityAccelerometer', group: 'start' }, { name: 'identityButton', group: 'start' }, { name: 'identityTemperature', group: 'start' },
			// Function Blocks
			{ name: 'picture', group: 'fx' }, { name: 'sound', group: 'fx' }, { name: 'motor', group: 'fx' }, { name: 'twoMotor', group: 'fx' }, { name: 'variableSet', group: 'fx' }, { name: 'variableAdd', group: 'fx' }, { name: 'print', group: 'fx' },
			// Control Blocks
			{ name: 'wait', group: 'control' }, { name: 'loop', group: 'control' }]
		};

		var actionButtonDefs = [{ 'alignment': 'L', 'label': fastr.play, 'command': 'play', 'tweakx': 4 }, { 'alignment': 'L', 'label': fastr.stop, 'command': 'stop' }, { 'alignment': 'L', 'label': fastr.gamepad, 'command': 'driveOverlay' }, { 'alignment': 'M', 'label': fastr.debug, 'command': 'debugOverlay' }, { 'alignment': 'M', 'label': fastr.file, 'command': 'pages', 'sub': buttonsPages }, { 'alignment': 'M', 'label': fastr.edit, 'command': 'edit', 'sub': buttonsEdit }, { 'alignment': 'M', 'label': fastr.calibrate, 'command': 'calibrate' }, { 'alignment': 'R', 'label': '', 'command': 'deviceScanOverlay' }];

		var base = app.dots.defineButtons(actionButtonDefs, document.getElementById('editorSvgCanvas'));
		// It seesm SVG eat all the events, even ones that don't hit any objects :(
		//actionDots.defineButtons(actionButtonDefs, document.getElementById('actionDotSvgCanvas'));

		// This is pretty Wonky
		app.defaultFiles.setupDefaultPages(false);

		tbe.init(document.getElementById('editorSvgCanvas'), base);

		var loadedDocText = app.storage.getItem('docA');
		if (loadedDocText !== null) {
			app.teaktext.textToBlocks(tbe, loadedDocText);
		}

		// Add the main command buttons, to left, middle and right locations.
		tbe.addPalette(package1);

		// Connect to resize event for refresh. Make initial call
		document.body.onresize = tbe.resize;
		tbe.resize();

		app.conductor.attachToScoreEditor(tbe);

		var showSplashAtAlunch = app.isRegularBrowser;
		showSplashAtAlunch = false; // For quick codova style test in browsers.
		if (showSplashAtAlunch && app.splashOverlay.showLaunchAboutBox()) {
			app.doCommand('splashOverlay');
		}
	};

	app.doCommand = function (commandName) {
		// Write the current doc state to storage insert
		// before any command
		app.tbe.saveCurrentDoc();

		var cmd = app.tbe.commands[commandName];
		if (app.overlays.isAnimating) {
			return;
		}

		if (app.overlays.currentShowing !== null) {
			// First hide the current one, then
			// invoke the command once hiding animation is done.
			if (app.overlays.currentShowing === cmd) {
				// Simply hide if its the same overlay.
				app.dots.activate(commandName, 0);
				app.overlays.hideOverlay(null);
			} else {
				if (typeof cmd === 'string') {
					app.dots.activate(commandName, 3);
				}
				app.overlays.hideOverlay(function () {
					app.doCommand(commandName);
				});
			}
		} else if (typeof cmd === 'function') {
			cmd();
		} else if (typeof cmd === 'string') {
			app.dots.activate(cmd, 3);
			app.overlays.showOverlay(cmd);
		}
	};

	return app;
}();

},{"../buildFlags.js":1,"./block-settings.js":14,"./conductor.js":33,"./defaultFiles.js":35,"./overlays/actionDots.js":38,"./overlays/overlays.js":44,"./teakblocks.js":46,"./teaktext.js":48,"clipboard":3,"fastr.js":51,"knockout":9,"log.js":53}],14:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var tbe = require('./teakblocks.js');
  var conductor = require('./conductor.js');

  var moveUp = 0;

  // Bindable properties
  var blockSettings = {
    visible: ko.observable(true),
    activeBlock: null
  };

  blockSettings.insert = function (domRoot) {
    // Create a div shell that will be positioned and scaled as needed.
    blockSettings.commonDiv = document.createElement("div");
    blockSettings.commonDiv.innerHTML = '<div id="block-settings" class="block-config-form">\n      <div class="group-div">\n        <button class="block-run width-third">\n          <i class="fa fa-step-forward" aria-hidden="true"></i>\n        </button>\n        <button class="block-clone width-third">\n          <i class="fa fa-clone" aria-hidden="true"></i>\n        </button>\n        <button class="block-clear width-third">\n          <i class="fa fa-trash-o" aria-hidden="true"></i>\n        </button>\n      </div>\n      <div id="block-settings-custom"></div>\n      <div id="block-controller-tabs"></div>\n    </div>';
    blockSettings.commonDiv.style.width = '240px';
    //    blockSettings.commonDiv.style.pointerEvents = 'all';
    domRoot.appendChild(blockSettings.commonDiv);

    blockSettings.groupDiv = document.createElement("div");
    blockSettings.groupDiv.innerHTML = '<div id="block-settings" class="block-config-form">\n      <div class="group-div">\n        <button class="block-run width-third">\n          <i class="fa fa-step-forward" aria-hidden="true"></i>\n        </button>\n        <button class="block-clone width-third">\n          <i class="fa fa-clone" aria-hidden="true"></i>\n        </button>\n        <button class="block-clear width-third">\n          <i class="fa fa-trash-o" aria-hidden="true"></i>\n        </button>\n      </div>\n    </div>';
    blockSettings.groupDiv.style.width = '240px';
    //    blockSettings.groupDiv.style.pointerEvents = 'all';
    domRoot.appendChild(blockSettings.groupDiv);

    for (var i = 0; i < 2; i++) {
      // To process through commonDiv and groupDiv
      document.getElementsByClassName('block-run')[i].onclick = function () {
        conductor.playOne(blockSettings.activeBlock);
      };
      document.getElementsByClassName('block-clone')[i].onclick = blockSettings.cloneGroup;
      document.getElementsByClassName('block-clear')[i].onclick = blockSettings.deleteGroup;
    }

    // Get a reference to the div that is customized for each block.
    blockSettings.customDiv = document.getElementById('block-settings-custom');

    // Get a reference to the div that lists controllers.
    blockSettings.controllersDiv = document.getElementById('block-controller-tabs'); //TABS - uncomment
  };

  blockSettings.cloneGroup = function () {
    // TODO grab whole loop if necessary
    if (blockSettings.activeBlock !== null) {
      // Back up start if necessary for clone to be logical.
      var startBlock = tbe.findChunkStart(blockSettings.activeBlock);
      if (startBlock.isLoopTail()) {
        // Redirect logive to look a loop beginning
        startBlock = startBlock.flowHead;
      }
      // Extend end if necessary for clone to be logical.
      var endBlock = startBlock;
      if (endBlock.isLoopHead()) {
        endBlock = endBlock.flowTail;
      }
      if (startBlock.isGroupSelected()) {
        endBlock = startBlock.selectionEnd();
      }
      var clone = tbe.replicateChunk(startBlock, endBlock, 0, 0);
      // move it to some open space
      // TODO use more logic to find a good place to put the block.
      var dy = 0;
      if (moveUp === 0) {
        dy = -120;
        moveUp = dy;
      } else if (moveUp < 0) {
        dy = -40 + moveUp;
        moveUp = dy;
      } else if (moveUp > 0) {
        dy = 40 + moveUp;
        moveUp = dy;
      }
      if (clone.top < -dy) {
        dy = 120;
        moveUp = dy;
      } else if (clone.bottom > tbe.height - moveUp - 80) {
        dy = 120;
        moveUp = dy;
      }
      tbe.animateMove(clone, clone.last, 0, dy, 20);
    }
  };

  blockSettings.deleteGroup = function () {
    if (blockSettings.activeBlock === null) return;

    // TODO grab whole loop if necessary
    // Delete the block.
    var block1 = tbe.findChunkStart(blockSettings.activeBlock);
    if (block1.isLoopTail()) {
      // Redirect logive to look a loop beginning
      block1 = block1.flowHead;
    }
    if (block1.isLoopHead() && block1.next === block1.flowTail) {
      // Delete an empty loop.
      tbe.deleteChunk(block1, block1.next);
    } else if (block1.isLoopHead() && !block1.next.isSelected()) {
      // Delete a loop, but leave the interior intact
      tbe.deleteChunk(block1.flowTail, block1.flowTail);
      tbe.deleteChunk(block1, block1);
    } else if (block1.isLoopHead() && block1.next.isSelected()) {
      // Delete a loop including the interior blocks
      tbe.deleteChunk(block1, block1.flowTail);
    } else {
      // If the block is part of a selected chain, find the last block in the chain
      tbe.deleteChunk(block1, block1.selectionEnd());
    }
  };

  blockSettings.isOpen = function () {
    return this.activeBlock !== null;
  };

  blockSettings.hide = function (exceptBlock) {

    var isSelectedGroup = false;
    var block = this.activeBlock;

    if (block !== null && block.isGroupSelected()) {
      if (!block.isIsolatedLoop()) {
        isSelectedGroup = true;
      }
    }

    // If the form is actually associated with a block, hide it.
    if (block !== null && block !== exceptBlock) {
      if (block.funcs.configuratorClose !== undefined) {
        block.funcs.configuratorClose(this.customDiv, block);
        // TODO too aggresive, but works
      }
      this.activeBlock = null;

      var div = null;

      // Start animation to hide the form.
      if (isSelectedGroup) {
        div = this.groupDiv;
      } else {
        div = this.commonDiv;
      }
      div.style.transition = 'all 0.2s ease';
      div.style.position = 'absolute';
      div.style.transform = 'scale(0.33, 0.0)';

      // Clear out the custom part of the form.
      this.customDiv.innerHTML = '';

      this.tabNames = [];
      this.tabButtons = [];
    }
  };

  // A block has been tapped on, the gesture for the config page.
  // Bring it up, toggle it, or move it as apppropriate.
  blockSettings.tap = function (block) {
    if (this.activeBlock === block) {
      // Clicked on the same block so make it go away.
      tbe.clearStates();
    } else if (this.activeBlock !== null) {
      // Clicked on a block other than the one that is showing.
      // Make the block that is showing go away,
      // then show the new one once the hide transition is done.
      tbe.clearStates();
      this.activeBlock = block;
      if (block.name === 'tail') {
        block.markSelected(true);
        block.flowHead.markSelected(true);
      } else if (block.name === 'loop') {
        block.markSelected(true);
        block.flowTail.markSelected(true);
      } else {
        block.markSelected(true);
      }
      setTimeout(function () {
        blockSettings.showActive();
      }, 400);
      //      this.addEventListener(this.showActive, 500);
    } else {
      // Nothing is showing, so make it pop-up.
      //block.markSelected(true);
      if (block.name === 'tail') {
        block.markSelected(true);
        block.flowHead.markSelected(true);
      } else if (block.name === 'loop') {
        block.markSelected(true);
        block.flowTail.markSelected(true);
      } else {
        block.markSelected(true);
      }
      this.activeBlock = block;
      this.showActive(null);
    }
  };

  // Build the row of tabs one for each controller editor that can be used
  // by the actor.
  blockSettings.buildControllerTabs = function () {
    // Clear out old tabs.
    blockSettings.controllersDiv.innerHTML = ''; //TABS - uncomment

    // Get the list of tabs with HTML snippets.
    var tabs = this.activeBlock.funcs.tabs;
    this.tabButtons = [];
    if (tabs !== undefined) {
      this.tabNames = Object.keys(tabs);

      // Build some SOM for the buttons.
      var tabCount = this.tabNames.length;
      var tabsDiv = document.createElement('div');
      var width = 100 / tabCount + '%';

      for (var i = 0; i < tabCount; i++) {
        // Create the button.
        var button = document.createElement('button');
        var name = this.tabNames[i];
        blockSettings.tabButtons.push(button);
        tabsDiv.appendChild(button); //TABS - uncomment

        // Configure all its settings.
        button.id = name;
        button.className = 'block-settings-tab';
        button.style.width = width;
        // Tweak the curved edges based on position.
        if (i === 0) {
          button.style.borderRadius = '0px 0px 0px 10px';
        } else if (i === tabCount - 1) {
          button.style.borderRadius = '0px 0px 10px 0px';
        } else {
          button.style.borderRadius = '0px';
        }

        // Inject the HTML snippet.
        button.innerHTML = tabs[name];
        button.onclick = blockSettings.onClickTab;
      }
      // Add the row of tabs to the view.
      this.controllersDiv.appendChild(tabsDiv); //TABS - uncomment

      // Select the initial tab.
      this.selectActiveTab(this.activeBlock.controllerSettings.controller);
    } else {
      // Add controller tabs at the bottom.
      var controllers = this.activeBlock.funcs.controllers;
      if (typeof controllers === "function") {
        // OLD way, delete once other code is merged.
        controllers(blockSettings.controllersDiv); //TABS - uncomment
      } else {
        blockSettings.controllersDiv.innerHTML = ''; //TABS - uncomment
      }
    }
  };

  blockSettings.onClickTab = function () {
    // Since its DOM event, 'this' will be the button.
    blockSettings.selectActiveTab(this.id);
  };

  blockSettings.selectActiveTab = function (name) {
    var count = this.tabNames.length;
    for (var i = 0; i < count; i++) {
      if (this.tabNames[i] === name) {
        this.tabButtons[i].classList.add('tab-selected');
      } else {
        this.tabButtons[i].classList.remove('tab-selected');
      }
    }
  };

  // Build the middle from part, the controllers editor.
  blockSettings.buildController = function () {
    // Allow block to customize bottom part of form.
    var configuratorOpen = this.activeBlock.funcs.configuratorOpen;
    if (typeof configuratorOpen === "function") {
      configuratorOpen(blockSettings.customDiv, this.activeBlock);
    } else {
      blockSettings.customDiv.innerHTML = '<div>\n          <label><input type="checkbox">\n            <span class="label-text">Power</span>\n          </label>\n      </div>';
    }
  };

  // Internal method to show the form.
  blockSettings.showActive = function (event) {
    var isSelectedGroup = false;
    var tweakx = 0;
    var tweaky = 0;
    var block = this.activeBlock;

    if (block === null) {
      return; // Nothing to show.
    }

    if (block !== null && block.isGroupSelected()) {
      if (!block.isIsolatedLoop()) {
        isSelectedGroup = true;
      }
    }
    this.buildControllerTabs();
    this.buildController();

    // Start animation to show settings form.
    var x = block.left;
    var y = block.bottom;
    var div = null;
    if (isSelectedGroup) {
      div = blockSettings.groupDiv;
    } else {
      div = blockSettings.commonDiv;
    }

    // Note after animation sizes are not so obvious. clientHeight
    // is unchanged, use it.
    var settingsHeight = div.clientHeight;

    if (tbe.height > 450) {
      // For screens large enough center the form above or beneath the selected group
      if (x - 80 < 0) {
        tweakx = 85 - x;
      } else if (x + 160 > tbe.width) {
        tweakx = tbe.width - (x + 165);
      }

      if (y + settingsHeight > tbe.height) {
        // Move the from above the selection.
        // If it is agroup selection then much less room is needed.
        tweaky = -settingsHeight - 10 - block.height;
      }
    } else {
      // For smaller screens move it to left or right
      // TODO manage long short window, like those on broswers
      if (x + 60 < tbe.width / 2) {
        x = tbe.width - 175;
      } else {
        x = 100;
      }
      y = 65;
    }

    div.style.transition = 'all 0.0s ease';
    div.style.left = x - 80 + tweakx + 'px';
    div.style.right = x + 80 + tweakx + 'px';
    div.style.top = y + 5 + tweaky + 'px';
    // Second step has to be done in callback in order to allow
    // animation to work.
    setTimeout(function () {
      div.style.transition = 'all 0.2s ease';
      div.style.position = 'absolute';
      div.style.transform = 'scale(1.0, 1.0)';
    }, 10);
  };

  return blockSettings;
}();

},{"./conductor.js":33,"./teakblocks.js":46,"knockout":9}],15:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var svgb = require('svgbuilder.js');
  var interact = require('interact.js');
  var ko = require('knockout');
  var icons = require('icons.js');
  var calcpad = {};
  var expr = {};

  // An expression capture the operator/operand tree
  //  fix:  infix | prefix | postfix
  //  fxn:  function name. Variable and literals evalueate to simple functions
  //  flex: legal set of options allowed by the editor
  //        integer, real, boolean, variable, io variable, string?

  // In this case the data is kept simple and the algorithms are visitors.
  var infixOpMap = {
    'assign': ':=',
    'increment': '+=',
    'decrement': '-=',
    'scale': '*=',
    'divscale': '/=',
    'add': '+',
    'subtract': '-',
    'divide': '/',
    'multiply': '*',
    'rshift': '>>',
    'lshift': '<<',
    'mod': '%',
    'greater': '>',
    'greater-equal': '≥',
    'equal': '=',
    'not-equal': '≠',
    'less-equal': '≤',
    'less': '<',
    //      'and' : '∧',
    //      'or' : '∨',
    'and': '&',
    'or': '|',
    'xor': '⊕'
  };

  var sampleExpr = {
    cat: 'infixop',
    name: 'decrement',
    flex: 'assign|increment|decrement',
    args: [{
      cat: 'variable',
      name: 'A',
      flex: 'variable'
    }, {
      cat: 'integer',
      name: '0',
      flex: 'integer|variable'
    }]
  };

  calcpad.argExists = function (e, i) {
    return e.args !== undefined && e.args[i] !== undefined;
  };

  // Caculate bounding boxes for elements of the epxression
  calcpad.calcExprPlacements = function (e, left) {

    // Start out with all infix notation
    if (calcpad.argExists(e, 0)) left = calcpad.calcExprPlacements(e.args[0], left);

    e.boxLeft = left;
    if (e.cat === 'variable') {
      // Might allow for longer names
      left += 70;
    } else if (e.cat === 'integer') {
      // Might allow for longer numbers and negatives
      left += 50;
    } else if (e.cat === 'boolean') {
      // Might allow for longer numbers and negatives
      left += 40;
    } else if (e.cat === 'infixop') {
      // Migth be one or two characters
      left += 50;
    }

    // This nodes left is for the fxn, not the whole expression.
    e.boxRight = left;

    if (calcpad.argExists(e, 1)) left = calcpad.calcExprPlacements(e.args[1], left);

    return left;
  };

  calcpad.buildExprSvg = function (e, svg, top, height) {
    var obj = null;

    if (calcpad.argExists(e, 0)) calcpad.buildExprSvg(e.args[0], svg, top, height);

    // In the back is th object that actually get the click events.
    // class will be added/removed to highlight the expression.
    var left = e.boxLeft;
    var right = e.boxRight;
    console.log('rect bounds', e, left, top + 6, right - left, height);
    e.boxObj = svgb.createRect('expr-region', left, top, right - left, height);
    e.boxObj.setAttribute('name', e.name); //Just for now.
    svg.appendChild(e.boxObj);

    if (e.cat === 'variable') {
      obj = icons.variable(0.7, left + 15, top + 1, e.name);
      svg.appendChild(obj);
    } else if (e.cat === 'integer') {
      obj = svgb.createText('svg-clear vars-bottom-txt', left + 20, top + 22, e.name);
      obj.setAttribute('text-anchor', 'middle');
      svg.appendChild(obj);
    } else if (e.cat === 'boolean') {
      obj = svgb.createText('svg-clear vars-bottom-txt', left + 20, top + 22, e.name);
      obj.setAttribute('text-anchor', 'middle');
      svg.appendChild(obj);
    } else if (e.cat === 'infixop') {
      var opString = infixOpMap[e.name];
      obj = svgb.createText('svg-clear vars-bottom-txt', left + 20, top + 22, opString);
      obj.setAttribute('text-anchor', 'middle');
      svg.appendChild(obj);
    }

    if (calcpad.argExists(e, 0)) calcpad.buildExprSvg(e.args[1], svg, top, height);
  };

  calcpad.clearSvg = function (e, svg) {};

  calcpad.highlightExprSvg = function (e) {};

  calcpad.configKeyBoard = function (e, svg) {
    if (e.cat === 'variable') {
      calcpad.addVarKeypad(svg);
    } else if (e.cat === 'integer') {
      // can also allow for ooching.
      calcpad.addNumberKeypad(svg);
    } else if (e.cat === 'boolean') {
      // true false
      calcpad.addVarKeypad(svg);
    } else if (e.cat === 'infixop') {
      // logic , equality., etc
      calcpad.addVarKeypad(svg);
      //        calcpad.addOpKeypad(svg);
    }
  };

  calcpad.open = function (div, block) {
    calcpad.activeBlock = block; // Is this even needed ???
    div.innerHTML = '<div id=\'pictureEditorDiv\' class=\'editorDiv\'>\n        <svg id=\'calcpadSvg\' width=231px height=190px xmlns=\'http://www.w3.org/2000/svg\'>\n        </svg>\n      </div>';

    var svg = document.getElementById('calcpadSvg');

    // Expression layout - at the top level there are three Items
    // (1) the left target operand.
    // (2) the operan. method on left of AudioContext
    // (3) the paremete. For now thre is just one operand
    // based on what field is pressed. The key pad let it be filled in
    // layout.

    var xw = 226;
    var yh = 190;
    var displayh = 38;

    var group = svgb.createGroup('', 0, 0);
    var shell = svgb.createRect('calc-shell', 2, 2, xw, displayh, 4);
    var keybase = svgb.createRect('calc-keybase', 2, displayh + 3, xw, 145, 4);
    group.appendChild(shell);
    group.appendChild(keybase);
    svg.appendChild(group);

    calcpad.calcExprPlacements(sampleExpr, 30);
    calcpad.exprGroup = svgb.createGroup('', 0, 0);
    calcpad.buildExprSvg(sampleExpr, calcpad.exprGroup, 4, displayh - 4);
    svg.appendChild(calcpad.exprGroup);

    calcpad.configKeyBoard(sampleExpr, svg);
    calcpad.connectEvents(svg);
  };

  calcpad.connectEvents = function (svg) {
    interact('.calc-button', { context: svg }).on('tap', function (event) {
      var strNum = event.target.getAttribute('name');
      console.log('calc-button ->', strNum);
    });

    interact('.expr-region', { context: svg }).on('tap', function (event) {
      var strNum = event.target.getAttribute('name');
      console.log('expr-region ->', strNum);
    });

    /*
          interact('.calcButtons', {context:svg})
            .on('tap', function (event) {
                // Get the clicked on button name
                var strNum = event.target.getAttribute('name');
            });
            */
  };

  calcpad.addVarKeypad = function (svg) {
    var baseX = 6;
    var dX = 56;
    var baseY = 42;
    var dY = 36;

    var labels = ['7', '8', '9', '+1', '4', '5', '6', '-1', '1', '2', '3', '+/-', '0', '0', '.', 'C'];

    var i = 0;
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        var obj = icons.calcbutton(0.8, baseX + x * dX, baseY + y * dY, 53, 34, labels[i], 'calc-numbers');
        svg.appendChild(obj);
        i += 1;
      }
    }
  };
  /*
       keypad.openTabs(div, object); //dataButton
        var beatsDisplay = document.getElementById('beats-display');
        var numericDisplay = document.getElementById('numeric-display');
        beatsDisplay.onclick = function(){
          var buttons = document.getElementsByClassName('dataButton');
          beatsDisplay.className += " selectedDisplay";
          numericDisplay.className = "numeric-display-half svg-clear";
          var buttonsLen = buttons.length;
          for(var i = 0; i < buttonsLen; i++){
            buttons[0].parentNode.removeChild(buttons[0]);
          }
          var svg = document.getElementById('keypadSvg');
          svg.parentNode.removeChild(svg);
          keypad.openBeats(object);
        };
  
        numericDisplay.onclick = function(){
          var buttons = document.getElementsByClassName('beatsButton');
          numericDisplay.className += " selectedDisplay";
          beatsDisplay.className = "beats-display svg-clear";
          var buttonsLen = buttons.length;
          for(var i = 0; i < buttonsLen; i++){
            buttons[0].parentNode.removeChild(buttons[0]);
          }
          ko.cleanNode(div);
          keypad.tabbedButtons(object);
        };
        */

  calcpad.openTabs = function (div, object) {
    // Get all the data from the parameter
    var block = object.block;
    var min = object.min;
    var max = object.max;
    var suffix = object.suffix;
    var blockType = object.type;
    var setValue = object.setValue;
    var getValue = object.getValue;
    var numArray = object.numArray;
    var calcLayout = object.calcLayout;
    if (object.inner === undefined) {
      div.innerHTML = '<div id=\'keypadDiv\' class=\'editorDiv\'>\n                <div id="numeric-display" class = "numeric-display svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n                </div>\n                <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n            </div>';
    } else {
      div.innerHTML = object.inner;
    }

    ko.applyBindings(blockType, div);
    var display = document.getElementById("numeric-display");
    var keypadSvg = document.getElementById('keypadSvg');

    // Show the current data on the configuration panel
    var num = getValue().toString();
    blockType.keyPadValue(num.toString() + suffix);
    var strNum = "";

    // Create an editor state object for the interactions to work with.

    for (var iy = 0; iy < 4; iy++) {
      for (var ix = 0; ix < 3; ix++) {
        // Create each button
        if (numArray[iy * 3 + ix] !== undefined) {
          var button = svgb.createGroup('dataButton', 0, 0);
          var box = svgb.createRect('calcButtons', 2.5 + ix * 75, 5 + iy * 35, 70, 30, 6);
          var text = svgb.createText('svg-clear', 37.5 + ix * 75, 27.5 + iy * 35, numArray[iy * 3 + ix]);
          text.setAttribute('text-anchor', 'middle');

          button.appendChild(box);
          button.appendChild(text);

          box.setAttribute('name', numArray[iy * 3 + ix]);

          keypadSvg.appendChild(button);
        }
      }
    }

    // Interact on calcButtons
    // do on tap
    // Take event, make event.target
    // get characteristic of dom element

    interact('.calcButtons', { context: keypadSvg }).on('tap', function (event) {
      // Get the clicked on button name
      strNum = event.target.getAttribute('name');

      if (calcLayout === "simple") {
        // If the layout is a simple layout
        var increment = "";
        display.classList.remove("error");

        // Check if you want to change the value
        // Store if we are going up or down and the number that follows
        if (strNum.substring(0, 1) === "+" || strNum.substring(0, 1) === "-") {
          increment = strNum.substring(0, 1);
          strNum = strNum.substring(1);
        }

        // If it is "<-" or "C", then delete current number
        if (strNum === "<-" || strNum === "C") {
          num = "0";
        }

        // If we are subtracting, subtract the number from variable num
        if (increment === "-") {
          if (parseInt(num, 10) - parseInt(strNum, 10) >= min) {
            num = (parseInt(num, 10) - parseInt(strNum, 10)).toString();
          } else {
            num = min;
            display.classList.add("error");
          }
        } else if (increment === "+") {
          //Otherwise, add
          if (parseInt(num, 10) + parseInt(strNum, 10) <= max) {
            num = (parseInt(num, 10) + parseInt(strNum, 10)).toString();
          } else {
            num = max;
            display.classList.add("error");
          }
        }
      } else if (calcLayout === "complex") {
        // If the layout is a complex layout
        var isNegate = strNum === "+/-";
        // If it is "<-" or "C", then delete current number
        if (strNum === "<-" || strNum === "C") {
          num = "0";
          display.classList.remove("error");
        } else if (isNegate && num !== "0") {
          // Negate the number
          display.classList.remove("error");
          if (num.substring(0, 1) === "-") {
            num = num.substring(1);
          } else {
            num = "-" + num;
          }
        } else if (num === "0" && !isNegate) {
          // If the number is 0, replace it
          display.classList.remove("error");
          num = strNum;
          // If the number is going to be within the max and min, then add the new number on.
        } else if (parseInt(num + strNum, 10) <= max && parseInt(num + strNum, 10) >= min && !isNegate) {
          num += strNum;
        } else if (!isNegate) {
          // If the number doesn't satisfy the conditions above, then it is an error
          display.classList.add("error");
        }
      } else if (calcLayout === "defined") {
        // If the layout is a defined layout
        num = strNum; // Set num to strNum
      }

      // Now show the number on the config panel
      blockType.keyPadValue(num.toString() + suffix);
      // And update the block data
      setValue(num);
      block.updateSvg();
    });

    return;
  };

  calcpad.openBeats = function (object) {
    var getBeats = object.getBeats;
    var setBeats = object.setBeats;
    var blockType = object.type;
    var block = object.block;
    var numArray = object.beatsRay;

    if (numArray === undefined) {
      numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }
    var beatsSvg = document.getElementById('beatsSvg');

    // Show the current data on the config panel
    var num = getBeats().toString();
    if (num === '1') {
      blockType.beatsValue(num.toString() + " beat");
    } else {
      blockType.beatsValue(num.toString() + " beats");
    }

    for (var iy = 0; iy < 4; iy++) {
      for (var ix = 0; ix < 3; ix++) {
        // Create each button
        if (numArray[iy * 3 + ix] !== undefined) {
          var button = svgb.createGroup('', 0, 0);
          var box = svgb.createRect('beatsButtons', 2.5 + ix * 75, 5 + iy * 35, 70, 30, 6);
          var text = svgb.createText('svg-clear', 37.5 + ix * 75, 27.5 + iy * 35, numArray[iy * 3 + ix]);
          text.setAttribute('text-anchor', 'middle');

          button.appendChild(box);
          button.appendChild(text);

          box.setAttribute('name', numArray[iy * 3 + ix]);

          beatsSvg.appendChild(button);
        }
      }
    }

    interact('.beatsButtons', { context: beatsSvg }).on('tap', function (event) {
      var strNum = event.target.getAttribute('name');

      num = strNum; // Set num to strNum

      // Now show the number on the config panel
      if (num === '1') {
        blockType.beatsValue(num.toString() + " beat");
      } else {
        blockType.beatsValue(num.toString() + " beats");
      }
      // And update the block data
      setBeats(num);
      block.updateSvg();
    });
  };

  calcpad.openTabsWithBeats = function (div, object) {
    object.inner = '<div id=\'keypadDiv\' class=\'editorDiv\'>\n              <div id="numeric-display" class = "numeric-display-half svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n\n              </div>\n              <div id="beats-display" class = "beats-display svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: beatsValue\'>\n\n              </div>\n              <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'72px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n              <svg id="beatsSvg" class=\'area\' width=\'225px\' height=\'80px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n          </div>';
    calcpad.openTabs(div, object);
    object.beatsRay = ["1", "2", "3", "4", "5", "6"];
    calcpad.openBeats(object);
  };

  calcpad.close = function createKeyPad(div) {
    ko.cleanNode(div);
  };
  return calcpad;
}();

},{"icons.js":52,"interact.js":8,"knockout":9,"svgbuilder.js":55}],16:[function(require,module,exports){
"use strict";

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var colorStripBlock = {};

  // Block for one or more color LEDs in a strip, typically implemented with
  // ws2811, ws2812 LED, AKA neopixels. The block is not coupled to how the
  // colors are produced.
  colorStripBlock.svg = function (root) {
    // TODO
    return root;
  };

  return colorStripBlock;
}();

},{}],17:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var fastr = require('fastr.js');
  var keypad = require('./keypadTab.js');
  var flowBlockHead = {};
  var flowBlockTail = {};
  var flowBlockWidth = 50;

  // List of HTML snippets used for controller tabs.
  // Flow block uses text labels for now.
  flowBlockHead.tabs = {
    // Simple iteration count based for loop
    //'forLoop' : 'for',
    // Loop while something is true
    //'whileLoop'  : 'while',
    // Skip body if condition not true
    //'ifThen'   : 'if'
  };

  flowBlockHead.keyPadValue = ko.observable(0 + " times");

  flowBlockHead.svg = function (root, block) {
    var loop = svgb.createText('fa fas svg-clear block-flowhead-loop', 20, 40, fastr.loop);
    root.appendChild(loop);
    var data = block.controllerSettings.data.duration;
    var duration = svgb.createText('svg-clear block-flowhead-count block-stencil-fill', 35, 70, data); //
    duration.setAttribute('text-anchor', 'middle');
    root.appendChild(duration);
    return root;
  };

  // Initial settings for blocks of this type.
  flowBlockHead.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      // And the data that goes with that editor.
      data: { duration: 5 },
      // Indicate what controller is active. This may affect the data format.
      controller: 'forLoop',
      // Width of the block
      width: flowBlockWidth
    };
  };
  flowBlockTail.defaultSettings = flowBlockHead.defaultSettings;

  flowBlockTail.calculateEnclosedScopeDepth = function (blockTail) {
    // Walk back from end of a loop to its front and determine the deepest
    // number of scopes it contains. That depth determines how far out
    // the flowBar needs to be.
    var nesting = 0;
    var maxDepth = 0;
    var b = blockTail.prev;
    // Null should not be hit.
    while (b !== null && b !== blockTail.flowHead) {
      if (b.flowHead !== null) {
        nesting += 1;
        if (nesting > maxDepth) {
          maxDepth = nesting;
        }
      } else if (b.flowTail !== null) {
        nesting -= 1;
      }
      // Walk back looking for head.
      b = b.prev;
    }
    return maxDepth;
  };

  flowBlockTail.svg = function () {};

  flowBlockTail.crossBlockSvg = function (block) {
    // Remove old cross block graphic.
    var scb = block.svgCrossBlock;
    if (scb !== undefined) {
      block.svgGroup.removeChild(scb);
    }

    // Make a new one.
    var depth = this.calculateEnclosedScopeDepth(block) + 1;
    // The tail of the flow block does the flow-bar rendering.
    var left = flowBlockWidth / 2 - (block.left - block.flowHead.left);
    var width = block.right - block.flowHead.left - flowBlockWidth;
    var hieght = 8 * depth;
    var dxBar = 4 * depth;
    var radius = 8;

    var pb = svgb.pathBuilder;
    var pathd = '';
    pathd = pb.move(left, 0);
    pathd += pb.line(dxBar, -hieght);
    pathd += pb.arc(radius, 60, 0, 1, radius * 0.9, -(radius * 0.7));
    pathd += pb.hline(width - 2 * radius - 2 * dxBar);
    pathd += pb.arc(radius, 60, 0, 1, radius * 0.9, radius * 0.7);
    pathd += pb.line(dxBar, hieght);
    scb = svgb.createPath('flow-path svg-clear', pathd);
    block.svgGroup.insertBefore(scb, block.svgRect);
    block.svgCrossBlock = scb;
  };
  flowBlockHead.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.duration;
      },
      'setValue': function setValue(duration) {
        block.controllerSettings.data.duration = duration;
      },
      'type': flowBlockHead,
      'block': block,
      'min': 1,
      'max': 100,
      'suffix': " times",
      'numArray': ["+1", "C", "+10", "-1", undefined, "-10"], //["1", "2", "3", "4", "5","6", "7", "8", "9", "0", "<-"],
      'calcLayout': 'simple' //'complex'
    });
  };
  flowBlockHead.configuratorClose = function (div) {
    keypad.closeTabs(div);
  };
  flowBlockTail.configuratorOpen = function (div, block) {
    flowBlockHead.configuratorOpen(div, block.flowHead);
  };
  flowBlockTail.configuratorClose = function (div) {
    flowBlockHead.configuratorClose(div);
  };

  return { flowBlockHead: flowBlockHead, flowBlockTail: flowBlockTail };
}();

},{"./keypadTab.js":23,"fastr.js":51,"knockout":9,"svgbuilder.js":55}],18:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var keypad = require('./../keypadTab.js');
  var icons = require('icons.js');
  var identityAccelerometerBlock = {};

  // Items for selecting a device from a list.
  //identityAccelerometer.devices = ko.observableArray([]);
  identityAccelerometerBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  identityAccelerometerBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What comparison: =, <, >
        comparison: '>',
        // Value
        value: 0
      }
    };
  };

  identityAccelerometerBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.value;
      },
      'setValue': function setValue(value) {
        block.controllerSettings.data.value = value;
      },
      'type': identityAccelerometerBlock,
      'block': block,
      'min': -100,
      'max': 100,
      'suffix': "",
      'numArray': ["-10", "C", "+10", "-50", undefined, "+50"],
      'calcLayout': 'simple',
      'inner': '<div id=\'keypadDiv\' class=\'editorDiv\'>\n          <div class="dropdown-label-txt svg-clear">accel\n          </div>\n          <select class="dropdown-comparison" id="comparison-list">\n            <option value=">" id="idAccel-greater">></option>\n            <option value="<" id="idAccel-less"><</option>\n            <option value="=" id="idAccel-equals">=</option>\n          </select>\n          <div id="numeric-display" class = "numeric-display-third svg-clear" width=\'30px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n          </div>\n          <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n      </div>'
    });

    var drop = document.getElementById("comparison-list");
    var opts = drop.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === block.controllerSettings.data.comparison) {
        drop.selectedIndex = i;
        break;
      }
    }
  };

  // Close the identity blocks and clean up hooks related to it.
  identityAccelerometerBlock.configuratorClose = function (div, block) {
    var comparison = document.getElementById('comparison-list');
    var index = comparison.selectedIndex;
    block.controllerSettings.data.comparison = comparison.options[index].value;
    keypad.closeTabs(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  identityAccelerometerBlock.svg = function (root) {
    var path = icons.accelerometer(1, 'svg-clear block-stencil-fill', 38, 40);
    root.appendChild(path);
  };

  return identityAccelerometerBlock;
}();

},{"./../keypadTab.js":23,"icons.js":52,"knockout":9}],19:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var fastr = require('fastr.js');
  // TODO the link type could show up on the icon
  // to indicate how it is connected
  // var pb = svgb.pathBuilder;
  var identityBlock = {};

  // Initial settings for blocks of this type.
  identityBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What triggers this chain, mouse click, button, message,...
        start: true
      }
    };
  };

  identityBlock.configuratorOpen = function (div, block) {
    identityBlock.activeBlock = block;
    div.innerHTML = '<div class=\'group-div\'>\n        <div class=\'svg-clear\'>Play upon program run<div/>\n      </div>';

    // Connect the dataBinding.
    ko.applyBindings(identityBlock, div);
  };

  // Close the identity blocks and clean up hooks related to it.
  identityBlock.configuratorClose = function (div) {
    identityBlock.activeBlock = null;
    ko.cleanNode(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  identityBlock.svg = function (root, block) {
    var arrowHead = svgb.createText('fa fas svg-clear block-identity-text', 40, 55, fastr.play);
    var arrowBody = svgb.createRect('svg-clear block-identity-text', 10, 35, 40, 10, 5);
    root.appendChild(arrowHead);
    root.appendChild(arrowBody);
  };

  return identityBlock;
}();

},{"fastr.js":51,"knockout":9,"svgbuilder.js":55}],20:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var svgb = require('svgbuilder.js');
  var identityButtonBlock = {};
  var icons = require('icons.js');

  // Initial settings for blocks of this type.
  identityButtonBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What comparison: A, B, A+B
        button: 'A'
        // Value
        //value:0,
      }
    };
  };

  identityButtonBlock.configuratorOpen = function (div, block) {
    identityButtonBlock.activeBlock = block;
    div.innerHTML = '<div class=\'editorDiv\'>\n          <div class="dropdown-label-txt svg-clear idButton-comparison-label">button:\n          </div>\n          <select class="dropdown-comparison idButton-comparison" id="dropdown-comparison">\n            <option value="A" id="idButton-A">A</option>\n            <option value="B" id="idButton-B">B</option>\n            <option value="A+B" id="idButton-AB">A+B</option>\n          </select>\n      </div>';

    // Connect the dataBinding.
    var drop = document.getElementById("dropdown-comparison");
    var opts = drop.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === block.controllerSettings.data.button) {
        drop.selectedIndex = i;
        break;
      }
    }
  };

  // Close the identity blocks and clean up hooks related to it.
  identityButtonBlock.configuratorClose = function (div, block) {
    var comparison = document.getElementById('dropdown-comparison');
    var index = comparison.selectedIndex;
    block.controllerSettings.data.button = comparison.options[index].value;
    identityButtonBlock.activeBlock = null;
    block.updateSvg();
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  identityButtonBlock.svg = function (root, block) {
    var button = icons.button(1, '', 15, 10);
    root.appendChild(button);

    var data = block.controllerSettings.data.button;
    var txt = svgb.createText('svg-clear block-idButton-label', 40, 40, data);
    txt.setAttribute('text-anchor', 'middle');
    root.appendChild(txt);
  };

  return identityButtonBlock;
}();

},{"icons.js":52,"svgbuilder.js":55}],21:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  //var log = require('log.js');
  var svgb = require('svgbuilder.js');
  var ko = require('knockout');
  var keypad = require('./../keypadTab.js');

  var pb = svgb.pathBuilder;
  var identityGyroBlock = {};

  // Items for selecting a device from a list.
  identityGyroBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  identityGyroBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What comparison: =, <, >
        comparison: '=',
        // Value
        value: 0
        //run: "yes"
      }
    };
  };

  identityGyroBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.value;
      },
      'setValue': function setValue(value) {
        block.controllerSettings.data.value = value;
      },
      'type': identityGyroBlock,
      'block': block,
      'min': -2048,
      'max': 2048,
      'suffix': "",
      'numArray': ["-10", "C", "+10", "-100", undefined, "+100"],
      'calcLayout': 'simple',
      'inner': '<div id=\'keypadDiv\' class=\'editorDiv\'>\n          <div class="dropdown-label-txt svg-clear">gyro\n          </div>\n          <select class="dropdown-comparison" id="dropdown-comparison">\n            <option value="=" id="idGyro-equals">=</option>\n            <option value=">" id="idGyro-greater">></option>\n            <option value="<" id="idGyro-less"><</option>\n          </select>\n          <div id="numeric-display" class = "numeric-display-third svg-clear" width=\'30px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n          </div>\n          <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n      </div>'
    });

    var drop = document.getElementById("dropdown-comparison");
    var opts = drop.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === block.controllerSettings.data.comparison) {
        drop.selectedIndex = i;
        break;
      }
    }
  };

  // Close the identity blocks and clean up hooks related to it.
  identityGyroBlock.configuratorClose = function (div, block) {
    var comparison = document.getElementById('dropdown-comparison');
    var index = comparison.selectedIndex;
    block.controllerSettings.data.comparison = comparison.options[index].value;
    keypad.closeTabs(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  identityGyroBlock.svg = function (root, block) {
    var pathd = '';
    pathd += pb.move(38, 40);
    pathd += pb.vline(-30);
    pathd += pb.hline(2);
    pathd += pb.vline(30);

    pathd += pb.line(25, 20);
    pathd += pb.line(-1, 1.5);
    pathd += pb.line(-25, -20);

    pathd += pb.line(-25, 20);
    pathd += pb.line(-1, -1.5);
    pathd += pb.line(25, -20);

    var path = svgb.createPath('svg-clear block-stencil-fill', pathd);
    root.appendChild(path);

    var button1 = svgb.createCircle('svg-clear block-stencil-fill', 28, 13, 8);
    button1.setAttribute('style', 'transform: rotate(20deg) scale(1, 1.5);');
    root.appendChild(button1);

    var button2 = svgb.createCircle('svg-clear block-stencil-fill', 46, 30, 8);
    button2.setAttribute('style', 'transform: rotate(-20deg) scale(1, 1.5);');
    root.appendChild(button2);

    var button3 = svgb.createCircle('svg-clear block-stencil-fill', 65, -27, 8);
    button3.setAttribute('style', 'transform: rotate(90deg) scale(1, 1.5);');
    root.appendChild(button3);
  };

  return identityGyroBlock;
}();

},{"./../keypadTab.js":23,"knockout":9,"svgbuilder.js":55}],22:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var fastr = require('fastr.js');
  var keypad = require('./../keypadTab.js');
  var identityTemperatureBlock = {};

  // Items for selecting a device from a list.
  //identityAccelerometer.devices = ko.observableArray([]);
  identityTemperatureBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  identityTemperatureBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What comparison: =, <, >
        comparison: '>',
        // Value
        value: 80
      }
    };
  };

  identityTemperatureBlock.fixLabel = function () {
    var boxContent = document.getElementById('numeric-display').innerHTML;
    console.log(window.origin);
    boxContent = boxContent.slice(0, boxContent.length - 3) + boxContent.slice(boxContent.length - 2, boxContent.length);
    document.getElementById('numeric-display').innerHTML = boxContent;
  };

  identityTemperatureBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.value;
      },
      'setValue': function setValue(value) {
        identityTemperatureBlock.fixLabel();
        block.controllerSettings.data.value = value;
      },
      'type': identityTemperatureBlock,
      'block': block,
      'min': 20,
      'max': 120,
      'suffix': ' °F', //˚F
      'numArray': ["-1", "C", "+1", "-10", undefined, "+10"],
      'calcLayout': 'simple',
      'inner': '<div id=\'keypadDiv\' class=\'editorDiv\'>\n          <div class="dropdown-label-txt svg-clear">temp\n          </div>\n          <select class="dropdown-comparison" id="dropdown-comparison">\n            <option value=">" id="idTemp-greater">></option>\n            <option value="<" id="idTemp-less"><</option>\n            <option value="=" id="idTemp-equals">=</option>\n          </select>\n          <div id="numeric-display" class = "numeric-display-third svg-clear" width=\'30px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n          </div>\n          <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n      </div>'
    });

    var drop = document.getElementById("dropdown-comparison");
    var opts = drop.options;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === block.controllerSettings.data.comparison) {
        drop.selectedIndex = i;
        break;
      }
    }
    identityTemperatureBlock.fixLabel();
  };

  // Close the identity blocks and clean up hooks related to it.
  identityTemperatureBlock.configuratorClose = function (div, block) {
    var comparison = document.getElementById('dropdown-comparison');
    var index = comparison.selectedIndex;
    block.controllerSettings.data.comparison = comparison.options[index].value;
    keypad.closeTabs(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  identityTemperatureBlock.svg = function (root, block) {
    var text = svgb.createText('fa fas svg-clear block-temperature-text block-identity-text', 42, 60, fastr.temp);
    text.setAttribute('text-anchor', 'middle');
    root.appendChild(text);
  };

  return identityTemperatureBlock;
}();

},{"./../keypadTab.js":23,"fastr.js":51,"knockout":9,"svgbuilder.js":55}],23:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var svgb = require('svgbuilder.js');
  var interact = require('interact.js');
  var ko = require('knockout');
  var keypad = {};

  keypad.tabbedButtons = function (div, object) {
    object.inner = '<div id=\'keypadDiv\' class=\'editorDiv\'>\n              <div id="numeric-display" class = "numeric-display-half svg-clear selectedDisplay" width=\'80px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n              </div>\n              <div id="beats-display" class = "beats-display svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: beatsValue\'>\n              </div>\n              <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n              <svg id="beatsSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n          </div>';
    keypad.openTabs(div, object); //dataButton

    var num = object.getBeats().toString();
    if (num === '1') {
      object.type.beatsValue(num.toString() + " beat");
    } else {
      object.type.beatsValue(num.toString() + " beats");
    }
    var beatsDisplay = document.getElementById('beats-display');
    var numericDisplay = document.getElementById('numeric-display');
    beatsDisplay.onclick = function () {
      var buttons = document.getElementsByClassName('dataButton');
      beatsDisplay.className += " selectedDisplay";
      numericDisplay.className = "numeric-display-half svg-clear";
      var buttonsLen = buttons.length;
      for (var i = 0; i < buttonsLen; i++) {
        buttons[0].parentNode.removeChild(buttons[0]);
      }
      var svg = document.getElementById('keypadSvg');
      svg.parentNode.removeChild(svg);
      keypad.openBeats(object);
    };

    numericDisplay.onclick = function () {
      var buttons = document.getElementsByClassName('beatsButton');
      numericDisplay.className += " selectedDisplay";
      beatsDisplay.className = "beats-display svg-clear";
      var buttonsLen = buttons.length;
      for (var i = 0; i < buttonsLen; i++) {
        buttons[0].parentNode.removeChild(buttons[0]);
      }
      ko.cleanNode(div);
      keypad.tabbedButtons(div, object);
    };
  };

  keypad.openTabs = function (div, object) {
    // Get all the data from the parameter
    var block = object.block;
    var min = object.min;
    var max = object.max;
    var suffix = object.suffix;
    var blockType = object.type;
    var setValue = object.setValue;
    var getValue = object.getValue;
    var numArray = object.numArray;
    var calcLayout = object.calcLayout;
    if (object.inner === undefined) {
      div.innerHTML = '<div id=\'keypadDiv\' class=\'editorDiv\'>\n                <div id="numeric-display" class = "numeric-display svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n                </div>\n                <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n            </div>';
    } else {
      div.innerHTML = object.inner;
    }

    ko.applyBindings(blockType, div);
    var display = document.getElementById("numeric-display");
    var keypadSvg = document.getElementById('keypadSvg');

    // Show the current data on the configuration panel
    var num = getValue().toString();
    blockType.keyPadValue(num.toString() + suffix);
    var strNum = "";

    // Create an editor state object for the interactions to work with.

    for (var iy = 0; iy < 4; iy++) {
      for (var ix = 0; ix < 3; ix++) {
        // Create each button
        if (numArray[iy * 3 + ix] !== undefined) {
          var button = svgb.createGroup('dataButton', 0, 0);
          var box = svgb.createRect('calcButtons', 2.5 + ix * 75, 5 + iy * 35, 70, 30, 6);
          var text = svgb.createText('svg-clear', 37.5 + ix * 75, 27.5 + iy * 35, numArray[iy * 3 + ix]);
          text.setAttribute('text-anchor', 'middle');

          button.appendChild(box);
          button.appendChild(text);

          box.setAttribute('name', numArray[iy * 3 + ix]);

          keypadSvg.appendChild(button);
        }
      }
    }

    // Interact on calcButtons
    // do on click
    // Take event, make event.target
    // get characteristic of dom element

    interact('.calcButtons', { context: keypadSvg }).on('click', function (event) {
      // Get the clicked on button name
      strNum = event.target.getAttribute('name');
      console.log('click ->', strNum);
      if (calcLayout === "simple") {
        // If the layout is a simple layout
        var increment = "";
        display.classList.remove("error");

        // Check if you want to change the value
        // Store if we are going up or down and the number that follows
        if (strNum.substring(0, 1) === "+" || strNum.substring(0, 1) === "-") {
          increment = strNum.substring(0, 1);
          strNum = strNum.substring(1);
        }

        // If it is "<-" or "C", then delete current number
        if (strNum === "<-" || strNum === "C") {
          num = "0";
        }

        // If we are subtracting, subtract the number from variable num
        if (increment === "-") {
          if (parseInt(num, 10) - parseInt(strNum, 10) >= min) {
            num = (parseInt(num, 10) - parseInt(strNum, 10)).toString();
          } else {
            num = min;
            display.classList.add("error");
          }
        } else if (increment === "+") {
          //Otherwise, add
          if (parseInt(num, 10) + parseInt(strNum, 10) <= max) {
            num = (parseInt(num, 10) + parseInt(strNum, 10)).toString();
          } else {
            num = max;
            display.classList.add("error");
          }
        }
      } else if (calcLayout === "complex") {
        // If the layout is a complex layout
        var isNegate = strNum === "+/-";
        // If it is "<-" or "C", then delete current number
        if (strNum === "<-" || strNum === "C") {
          num = "0";
          display.classList.remove("error");
        } else if (isNegate && num !== "0") {
          // Negate the number
          display.classList.remove("error");
          if (num.substring(0, 1) === "-") {
            num = num.substring(1);
          } else {
            num = "-" + num;
          }
        } else if (num === "0" && !isNegate) {
          // If the number is 0, replace it
          display.classList.remove("error");
          num = strNum;
          // If the number is going to be within the max and min, then add the new number on.
        } else if (parseInt(num + strNum, 10) <= max && parseInt(num + strNum, 10) >= min && !isNegate) {
          num += strNum;
        } else if (!isNegate) {
          // If the number doesn't satisfy the conditions above, then it is an error
          display.classList.add("error");
        }
      } else if (calcLayout === "defined") {
        // If the layout is a defined layout
        num = strNum; // Set num to strNum
      }

      // Now show the number on the config panel
      blockType.keyPadValue(num.toString() + suffix);
      // And update the block data
      setValue(num);
      block.updateSvg();
    });

    return;
  };
  keypad.openBeats = function (object) {
    var getBeats = object.getBeats;
    var setBeats = object.setBeats;
    var blockType = object.type;
    var block = object.block;
    var numArray = object.beatsRay;

    if (numArray === undefined) {
      numArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }
    var beatsSvg = document.getElementById('beatsSvg');

    // Show the current data on the config panel
    var num = getBeats().toString();
    if (num === '1') {
      blockType.beatsValue(num.toString() + " beat");
    } else {
      blockType.beatsValue(num.toString() + " beats");
    }

    for (var iy = 0; iy < 4; iy++) {
      for (var ix = 0; ix < 3; ix++) {
        // Create each button
        if (numArray[iy * 3 + ix] !== undefined) {
          var button = svgb.createGroup('', 0, 0);
          var box = svgb.createRect('beatsButtons', 2.5 + ix * 75, 5 + iy * 35, 70, 30, 6);
          var text = svgb.createText('svg-clear', 37.5 + ix * 75, 27.5 + iy * 35, numArray[iy * 3 + ix]);
          text.setAttribute('text-anchor', 'middle');

          button.appendChild(box);
          button.appendChild(text);

          box.setAttribute('name', numArray[iy * 3 + ix]);

          beatsSvg.appendChild(button);
        }
      }
    }

    interact('.beatsButtons', { context: beatsSvg }).on('click', function (event) {
      var strNum = event.target.getAttribute('name');

      num = strNum; // Set num to strNum

      // Now show the number on the config panel
      if (num === '1') {
        blockType.beatsValue(num.toString() + " beat");
      } else {
        blockType.beatsValue(num.toString() + " beats");
      }
      // And update the block data
      setBeats(num);
      block.updateSvg();
    });
  };

  keypad.openTabsWithBeats = function (div, object) {
    object.inner = '<div id=\'keypadDiv\' class=\'editorDiv\'>\n              <div id="numeric-display" class = "numeric-display-half svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n\n              </div>\n              <div id="beats-display" class = "beats-display svg-clear" width=\'80px\' height=\'80px\' data-bind=\'text: beatsValue\'>\n\n              </div>\n              <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'72px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n              <svg id="beatsSvg" class=\'area\' width=\'225px\' height=\'80px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n          </div>';
    keypad.openTabs(div, object);
    object.beatsRay = ["1", "2", "3", "4", "5", "6"];
    keypad.openBeats(object);
  };

  keypad.closeTabs = function createKeyPad(div) {
    ko.cleanNode(div);
  };
  return keypad;
}();

},{"interact.js":8,"knockout":9,"svgbuilder.js":55}],24:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var svgb = require('svgbuilder.js');
  var keypad = require('./keypadTab.js');
  var ko = require('knockout');
  var icons = require('icons.js');
  //var formTools = require('./../block-settings.js');
  var pb = svgb.pathBuilder;
  var motorBlock = {};
  motorBlock.tabs = {
    //'speed': '<i class="fa fa-tachometer" aria-hidden="true"></i>',
    //'duration': '<i class="fa fa-clock-o" aria-hidden="true"></i>',
    '1': '1',
    '2': '2'
  };
  motorBlock.keyPadValue = ko.observable(100 + "%");
  motorBlock.beatsValue = ko.observable("1 beat");
  // Initial setting for blocks of this type.
  motorBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        speed: 100,
        duration: 1,
        motor: '1'
      },
      // Indicate what controller is active. This may affect the data format.
      controller: 'speed'
    };
  };
  // Wait block - Wait until something happens, it can wait for things other
  // than time, but it is given that time pasing is part of the function.
  motorBlock.svg = function (root, block) {
    // The graphic is a composite concept of a motor/wheel. In many cases
    // students might only see the wheel.
    var data = block.controllerSettings.data.speed;
    var motor = icons.motorWithDial(1, 5, 0, data);
    root.appendChild(motor);

    var data2 = block.controllerSettings.data.duration;
    var data3 = block.controllerSettings.data.motor;
    var textToDisplay = svgb.createGroup('displayText', 0, 0);
    var duration = svgb.createText('svg-clear block-motor-text-duration block-stencil-fill', 45, 70, data2 + ' \uF192');
    var whichMotor = svgb.createText('svg-clear block-stencil-fill block-motor-text-type', 45, 34, data3);
    textToDisplay.appendChild(duration);
    textToDisplay.appendChild(whichMotor);
    textToDisplay.setAttribute('text-anchor', 'middle');
    root.appendChild(textToDisplay);

    return root;
  };
  motorBlock.configuratorOpen = function (div, block) {
    var tabs = document.getElementsByClassName('block-settings-tab');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].textContent === block.controllerSettings.data.motor) {
        tabs[i].classList.add('tab-selected');
      }
    }
    keypad.tabbedButtons(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.speed;
      },
      'setValue': function setValue(speed) {
        block.controllerSettings.data.speed = speed;
      },
      'type': motorBlock,
      'block': block,
      'min': -100,
      'max': 100,
      'suffix': " %",
      'numArray': ["+1", "+10", "+50", "-1", "-10", "-50", undefined, "C"],
      'calcLayout': 'simple',
      'getBeats': function getBeats() {
        return block.controllerSettings.data.duration;
      },
      'setBeats': function setBeats(duration) {
        block.controllerSettings.data.duration = duration;
      }
    });
  };
  motorBlock.configuratorClose = function (div, block) {
    var tabs = document.getElementsByClassName('block-settings-tab');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].classList.contains('tab-selected')) {
        block.controllerSettings.data.motor = tabs[i].textContent;
      }
    }
    keypad.closeTabs(div);
    block.updateSvg();
  };

  return motorBlock;
}();

},{"./keypadTab.js":23,"icons.js":52,"knockout":9,"svgbuilder.js":55}],25:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var pictureBlock = {};
  var icons = require('icons.js');

  // Use CSS clases for LED lit state.
  function setPicturePixel(svgPixel, state) {
    if (svgPixel === undefined) {
      return;
    }
    if (state === 1) {
      svgPixel.setAttribute('class', 'svg-clear block-picture-led-on');
    } else {
      svgPixel.setAttribute('class', 'svg-clear block-picture-led-off');
    }
  }

  // Map page XY to index in pixel array.
  function pictureEventToIndex(event) {
    // Offset is experimental and not supported on all browsers.
    // var x = Math.floor(event.offsetX / 35);
    // var y = Math.floor(event.offsetY / 35);
    var bb = event.target.parentNode.getBoundingClientRect();
    var x = Math.floor((event.pageX - bb.left) / 35);
    var y = Math.floor((event.pageY - bb.top) / 35);
    if (x > 4 || y > 4) {
      return -1;
    } else {
      return y * 5 + x;
    }
  }

  // List of HTML snippets used for controller tabs.
  pictureBlock.tabs = {
    //'5x5picture' : '<i class="fa fa-smile-o" aria-hidden="true"></i>',
    //'5x5string'  : 'abc',
    //'5x5movie'   : '<i class="fa fa-film" aria-hidden="true"></i>',
    //'5x5sensor'  : '<i class="fa fa-tachometer" aria-hidden="true"></i>'
  };

  // Initial setting for blocks of this type.
  pictureBlock.defaultSettings = function () {
    // Return a new object with settings for the controller
    return {
      // and the data that goes with that editor.
      data: { pix: [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0] },
      // Indicate what controller is active. This may affect the data format.
      controller: '5x5picture'
    };
  };

  // Generate an SVG based image for a specific block.
  pictureBlock.svg = function (svg, block) {
    var pix = block.controllerSettings.data.pix;
    var group = icons.picture(1.15, 25, 18, pix);
    svg.appendChild(group);
  };

  // Inject the HTML for the controller's editor.
  // TODO: pass in the controller. That might all move out of this class.
  pictureBlock.configuratorClose = function () {};

  pictureBlock.configuratorOpen = function (div, block) {
    div.innerHTML = '<div id=\'pictureEditorDiv\' class=\'editorDiv\'>\n          <svg id=\'pictureEditor\' width=175px height=175px xmlns=\'http://www.w3.org/2000/svg\'>\n            <rect id=\'pictureRect\' width=175px height=175px rx=10 ry=10 class=\'pix-editor block-picture-board\'/>\n          </svg>\n        </div>';

    // Create a editor state object for the interactions to work with.
    var svg = document.getElementById('pictureEditor');
    var pix = block.controllerSettings.data.pix;
    var pixOn = 0;
    var dindex = 0;
    for (var iy = 0; iy < 5; iy++) {
      for (var ix = 0; ix < 5; ix++) {
        // Create each LED and initialize its lit state.
        var led = svgb.createCircle('', 17.5 + ix * 35, 17.5 + iy * 35, 13);
        setPicturePixel(led, pix[dindex]);
        svg.appendChild(led);
        dindex += 1;
      }
    }

    interact('.pix-editor', { context: svg }).on('down', function (event) {
      // Flip brush state based on pixel clicked on, then paint.
      var i = pictureEventToIndex(event);
      if (i >= 0) {
        if (pix[i] === 0) {
          pixOn = 1;
        } else {
          pixOn = 0;
        }
      }
      pix[i] = pixOn;
      setPicturePixel(event.target.parentNode.children[i + 1], pix[i]);
      block.updateSvg();
    }).on('move', function (event) {
      // Paint pixel based on brush state.
      if (event.interaction.pointerIsDown) {
        //If it's in range and there was an actualy change then paint.
        var i = pictureEventToIndex(event);
        if (i >= 0 && pix[i] !== pixOn) {
          pix[i] = pixOn;
          setPicturePixel(event.target.parentNode.children[i + 1], pix[i]);
          block.updateSvg();
        }
      }
    });
    return;
  };

  return pictureBlock;
}();

},{"icons.js":52,"interact.js":8,"svgbuilder.js":55}],26:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var interact = require('interact.js');
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  var printBlock = {};
  var vars = require('./../variables.js');
  var fastr = require('fastr.js');

  // Items for selecting a device from a list.
  //identityAccelerometer.devices = ko.observableArray([]);
  printBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  printBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What to print: var, sensor
        print: 'var',
        variable: 'A',
        sensor: 'temperature',
        button: 'A',
        // Value
        value: 0
      }
    };
  };

  printBlock.configuratorOpen = function (div, block) {
    var data = block.controllerSettings.data;
    printBlock.activeBlock = block;
    div.innerHTML = '<div id=\'printEditorDiv\' class=\'editorDiv\'>\n          <div id=\'printBlock-editor\'>\n          </div>\n          <div class=\'printBlock-buttons\' y="100%">\n            <div class=\'printBlock-option\' value=\'A\'>\n              <svg id=\'variable-option\' class="svg-clear" width=\'60px\' height=\'40px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n            </div>\n            <div class=\'printBlock-option\' value=\'B\'>\n              <span class="svg-clear data-option">' + fastr.data + '</span>\n            </div>\n          </div>\n          <div class="vert-line"></div>\n        </div>';
    var variableOption = document.getElementById('variable-option');
    var button = icons.variable(0.9, 4, 1, '');
    variableOption.appendChild(button);

    printBlock.loadSlide(data.button, block);

    var selObj = document.getElementById("var-list");
    var opts = selObj.options;
    for (var i = 0; i < opts.length; i++) {
      if (data.print === 'var' && opts[i].value === data.variable) {
        selObj.selectedIndex = i;
        break;
      } else if (data.print === 'sensor' && opts[i].value === data.sensor) {
        selObj.selectedIndex = i;
        break;
      }
    }

    interact('.printBlock-option').on('down', function (event) {
      var button = event.srcElement;
      var tabs = document.getElementsByClassName('printBlock-option');
      for (var k = 0; k < tabs.length; k++) {
        tabs[k].setAttribute('class', 'printBlock-option');
      }
      button.classList.add('printBlock-selected');
      printBlock.loadSlide(button.getAttribute('value'), block);
    });
  };

  printBlock.loadSlide = function (buttonName, block) {
    var editor = document.getElementById('printBlock-editor');
    var opts = document.getElementsByClassName('printBlock-option');
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].getAttribute('value') === buttonName) {
        opts[i].setAttribute('class', 'printBlock-option printBlock-selected');
      }
    }
    if (buttonName === 'A') {
      // var
      block.controllerSettings.data.print = "var";
      block.controllerSettings.data.button = "A";
      editor.innerHTML = '<select class="dropdown-comparison printBlock-dropdown" id="var-list">\n      </select>';

      // Add variables to the drop down.
      var selObj = document.getElementById("var-list");
      vars.addOptions(selObj, block.controllerSettings.data.variable);
    } else if (buttonName === 'B') {
      //sensor
      block.controllerSettings.data.print = "sensor";
      block.controllerSettings.data.button = "B";
      editor.innerHTML = '<select class="dropdown-comparison printBlock-dropdown" id="var-list">\n        <option value="temperature">temperature</option>\n        <option value="accelerometer">accelerometer</option>\n      </select>';
    }
  };

  // Close the identity blocks and clean up hooks related to it.
  printBlock.configuratorClose = function (div, block) {
    var selObj = document.getElementById('var-list');
    var opt = vars.getSelected(selObj);
    var data = block.controllerSettings.data;
    if (data.print === 'var') {
      data.variable = opt;
    } else if (data.print === 'sensor') {
      data.sensor = opt;
    }
    block.updateSvg();
    printBlock.activeBlock = null;
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  printBlock.svg = function (root, block) {
    var board = icons.pictureNumeric(1, 32, 15);
    board.setAttribute('text-anchor', 'middle');
    root.appendChild(board);

    var print = block.controllerSettings.data.print;
    if (print === 'var') {
      var varData = block.controllerSettings.data.variable;
      var variable = icons.variable(0.5, 32, 52, varData);
      root.appendChild(variable);
    } else if (print === 'sensor') {
      var sensor = block.controllerSettings.data.sensor;
      if (sensor === 'accelerometer') {
        var accel = icons.accelerometer(0.50, 'block-stencil-fill svg-clear', 90, 135);
        root.appendChild(accel);
      } else if (sensor === 'temperature') {
        var temp = svgb.createText('fa block-identity-text svg-clear', 90, 160, '\uF2C9');
        temp.setAttribute('transform', 'scale(0.45)');
        root.appendChild(temp);
      }
    }
  };

  return printBlock;
}();

},{"./../variables.js":57,"fastr.js":51,"icons.js":52,"interact.js":8,"knockout":9,"svgbuilder.js":55}],27:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  //var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var keypad = require('./keypadTab.js');
  var pb = svgb.pathBuilder;
  var servoBlock = {};
  var ko = require('knockout');

  servoBlock.keyPadValue = ko.observable(0 + "%");
  // Initial setting for blocks of this type.
  servoBlock.defaultSettings = function () {
    // Return a new object with settings for the controller
    return {
      // and the data that goes with that editor.
      data: {
        'pos': 0
      }
      // Indicate what controller is active. This may affect the data format.
    };
  };

  servoBlock.svg = function (root, block) {
    // servo body
    var box = svgb.createRect('svg-clear block-micro-servo-body', 18, 20, 44, 24, 2.5);
    root.appendChild(box);

    // simple servo arm
    var pathd = '';
    pathd = pb.move(45, 32);
    pathd += pb.line(2.5, -19);
    pathd += pb.hline(1);
    pathd += pb.line(2.5, 19);
    pathd += pb.arc(3.0, 180, 1, 1, -6, 0);
    pathd += pb.close();
    var path = svgb.createPath('svg-clear block-stencil-fill', pathd);
    // Rotate it according to the block data
    var data = block.controllerSettings.data.pos;
    path.setAttribute('transform', "rotate(" + data + " 48 32)");
    root.appendChild(path);

    var pos = svgb.createText('svg-clear block-servo-text block-stencil-fill', 40, 70, data + "˚");
    pos.setAttribute('text-anchor', 'middle');
    root.appendChild(pos);

    //servoBlock.testExpression(root);
    return root;
  };

  servoBlock.testExpression = function (root) {

    var pathd = '';
    pathd = pb.move(24, 52);
    pathd += pb.line(-9, 0);
    pathd += pb.line(9, 2.5);
    pathd += pb.line(-9, 2.5);
    pathd += pb.line(9, 2.5);
    pathd += pb.line(-9, 2.5);
    pathd += pb.line(9, 2.5);
    pathd += pb.line(-9, 2.5);
    pathd += pb.line(9, 2.5);
    pathd += pb.line(-9, 2.5);
    pathd += pb.line(9, 0);
    var path = svgb.createPath('svg-clear block-sensor-stencil', pathd);
    root.appendChild(path);

    var circle = svgb.createCircle('svg-clear block-sensor-stencil-value', 19.5, 62, 4);
    root.appendChild(circle);

    circle = svgb.createCircle('svg-clear', 19.5, 62, 1);
    root.appendChild(circle);

    return root;
  };

  servoBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.pos;
      },
      'setValue': function setValue(position) {
        block.controllerSettings.data.pos = position;
      },
      'type': servoBlock,
      'block': block,
      'min': 0,
      'max': 180,
      'suffix': "˚",
      'numArray': ["+50", "+10", "+1", "-50", "-10", "-1", undefined, "C"],
      'calcLayout': 'simple'
    });
  };
  servoBlock.configuratorClose = function (div) {
    keypad.closeTabs(div);
  };

  return servoBlock;
}();

},{"./keypadTab.js":23,"knockout":9,"svgbuilder.js":55}],28:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var soundBlock = {};
  var icons = require('icons.js');

  // List of HTML snippets used for controller tabs.
  soundBlock.tabs = {
    //'pianoKeyboard' : '<i class="fa fa-music" aria-hidden="true"></i>'
  };

  // Initial setting for blocks of this type.
  soundBlock.defaultSettings = function () {
    // Return a new object with settings for the controller
    return {
      // and the data that goes with that editor.
      data: { 'description': 'C4 C4 C4 C4', 'period': '1/4', 's': '1 1 1 1', 'duration': 4 },
      // Indicate what controller is active. This may affect the data format.
      controller: 'pianoKeyboard'
    };
  };

  var keyInfo = [
  // Naturals 8
  { name: 'C4', f: 261.6, s: 1 }, //0
  { name: 'D4', f: 293.7, s: 3 }, { name: 'E4', f: 329.6, s: 5 }, { name: 'F4', f: 349.2, s: 6 }, { name: 'G4', f: 392.0, s: 8 }, //4
  { name: 'A4', f: 440.0, s: 10 }, { name: 'B4', f: 493.9, s: 12 }, { name: 'C5', f: 523.2, s: 13 }, //7
  // Accidentals, its easier to not to interleave them.
  { name: 'C#4', f: 277.2, keyShift: -3, s: 2 }, { name: 'D#4', f: 311.1, keyShift: 3, s: 4 }, { name: 'F#4', f: 370.0, keyShift: -4, s: 7 }, { name: 'G#4', f: 415.3, keyShift: 0, s: 9 }, { name: 'A#4', f: 466.1, keyShift: 4, s: 11 }];

  soundBlock.configuratorOpen = function (div, block) {
    soundBlock.activeBlock = block;
    div.innerHTML = '<div id=\'pictureEditorDiv\' class=\'editorDiv\'>\n            <svg id=\'pianoSvg\' width=231px height=190px xmlns=\'http://www.w3.org/2000/svg\'>\n              <rect id=\'pictureRect\' y=2px width=231px height=100px rx=4 ry=4 class=\'block-sound-piano\'/>\n            </svg>\n          </div>';

    // Create an editor state object for the interactions to work with.
    var svg = document.getElementById('pianoSvg');
    var keyIndex = 0;
    for (var iwKey = 0; iwKey < 8; iwKey++) {
      var wkey = svgb.createRect('piano-key block-sound-piano-w', 4 + iwKey * 28, 15, 27, 84, 3);
      wkey.setAttribute('key', keyIndex);
      keyIndex += 1;
      svg.appendChild(wkey);
    }
    for (var ibKey = 0; ibKey < 7; ibKey++) {
      if (ibKey !== 2 && ibKey !== 6) {
        var left = 21 + ibKey * 28 + keyInfo[keyIndex].keyShift;
        var bkey = svgb.createRect('piano-key block-sound-piano-b', left, 15, 22, 45, 3);
        bkey.setAttribute('key', keyIndex);
        keyIndex += 1;
        svg.appendChild(bkey);
      }
    }
    var r = svgb.createRect('svg-clear block-sound-piano', 0, 2, 231, 15, 4);
    svg.appendChild(r);

    var textData = soundBlock.activeBlock.controllerSettings.data.description.split(" ");
    for (var itxtBox = 0; itxtBox < 4; itxtBox++) {
      var txtBox = svgb.createRect('svg-clear block-sound-txtBox block-sound-noteBox', 5 + itxtBox * 60, 108, 40, 30, 3);
      svg.appendChild(txtBox);
      var txt = svgb.createText('svg-clear block-sound-text block-sound-noteTxt', 13 + itxtBox * 60, 130, '__');
      if (textData[itxtBox] !== undefined && textData[itxtBox] !== "") {
        txt.innerHTML = textData[itxtBox];
      }
      txt.setAttribute('box', itxtBox);
      svg.appendChild(txt);
    }

    var clearBox = svgb.createRect('block-sound-txtBox block-sound-clearBox', 75, 145, 80, 25, 3);
    svg.appendChild(clearBox);
    var clearTxt = svgb.createText('svg-clear block-sound-text block-sound-clearTxt', 90, 165, 'Clear');
    svg.appendChild(clearTxt);

    // Create audio context for generating tones.
    soundBlock.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    interact('.piano-key ', { context: svg }).on('down', function (event) {
      soundBlock.lastKey = event.target;
      soundBlock.playKey(event.target);
    }).on('move', function (event) {
      if (event.interaction.pointerIsDown) {
        if (soundBlock.currentKey !== event.target && soundBlock.lastKey !== event.target) {
          soundBlock.lastKey = event.target;
          soundBlock.playKey(event.target);
        }
      }
    }).on('up', function () {
      soundBlock.stopCurrentKey();
    });

    interact('.block-sound-clearBox', { context: svg }).on('down', function () {
      soundBlock.activeBlock.controllerSettings.data.description = "";
      soundBlock.activeBlock.controllerSettings.data.s = "";
      var text = document.getElementsByClassName('block-sound-noteTxt');
      for (var i = 0; i < 4; i++) {
        text[i].innerHTML = '__';
      }
      soundBlock.activeBlock.controllerSettings.data.duration = 0;
      soundBlock.activeBlock.updateSvg();
    });
  };

  // Release the audioContext.
  soundBlock.configuratorClose = function () {
    soundBlock.audioContext.close();
    soundBlock.audioContext = null;
  };

  // State variables for pointer tracking.
  soundBlock.currentKey = null;
  soundBlock.originalClass = null;
  soundBlock.lastKey = null;

  // Play a key, update graphics, etc.
  soundBlock.playKey = function (svgElt) {
    var keyIndex = Number(svgElt.getAttribute('key'));
    svgElt.setAttribute('key', keyIndex);
    soundBlock.stopCurrentKey();
    soundBlock.currentKey = svgElt;
    soundBlock.originalClass = svgElt.getAttribute('class');
    var newClass = soundBlock.originalClass + '-pressed';
    svgElt.setAttribute('class', newClass);

    // Start oscillator
    var ctx = soundBlock.audioContext;
    var oscillator = ctx.createOscillator();
    var gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.3;
    oscillator.type = 'sine';
    oscillator.frequency.value = keyInfo[keyIndex].f;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
    gain.gain.setTargetAtTime(0, ctx.currentTime + 0.3, 0.015);

    // Make sure note ends.
    soundBlock.keyTimer = setTimeout(function () {
      soundBlock.stopCurrentKey();
    }, 400);

    // Update block
    var arr = document.getElementsByClassName('block-sound-text');
    var data1 = soundBlock.activeBlock.controllerSettings.data.description;
    var data2 = soundBlock.activeBlock.controllerSettings.data.s;
    for (var i = 0; i < 4; i++) {
      if (arr[i].innerHTML === '__') {
        arr[i].innerHTML = keyInfo[keyIndex].name;
        if (data1 === '' || data2 === '') {
          data1 = arr[i].innerHTML;
          data2 = String(keyInfo[keyIndex].s);
        } else {
          data1 = data1 + " " + arr[i].innerHTML;
          data2 = data2 + " " + keyInfo[keyIndex].s;
        }
        soundBlock.activeBlock.controllerSettings.data.duration += 1;
        break;
      }
    }

    soundBlock.activeBlock.controllerSettings.data.description = data1;

    soundBlock.activeBlock.controllerSettings.data.s = data2;

    soundBlock.activeBlock.updateSvg();
  };

  soundBlock.stopCurrentKey = function () {
    if (soundBlock.currentKey !== null) {
      clearTimeout(soundBlock.keyTimer);
      soundBlock.keyTimer = undefined;
      soundBlock.currentKey.setAttribute('class', soundBlock.originalClass);
      soundBlock.currentKey = null;
    }
    // Stop oscillator
  };
  // Sound block to make a joyful noise.
  soundBlock.svg = function (root, block) {
    // Speaker
    var soundPath = icons.sound(1.15, 20, 20);
    root.appendChild(soundPath);

    // Description such as note name.
    if (block.controllerSettings.data.s !== '') {
      var name = block.controllerSettings.data.s.split(' ');
      var s = '';
      s += svgb.pathBuilder.move(8, 75);
      for (var i = 0; i < name.length; i++) {
        s += svgb.pathBuilder.move(5, 0 - name[i] * 1.5);
        s += svgb.pathBuilder.line(10, 0);
        s += svgb.pathBuilder.move(0, name[i] * 1.5);
        var line = svgb.createPath('svg-clear block-stencil', s);
        root.appendChild(line);
      }
    }

    return root;
  };

  return soundBlock;
}();

},{"icons.js":52,"interact.js":8,"svgbuilder.js":55}],29:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  //var formTools = require('./../block-settings.js');
  var keypad = require('./keypadTab.js');
  var twoMotorBlock = {};

  twoMotorBlock.keyPadValue = ko.observable(100 + "%");
  twoMotorBlock.beatsValue = ko.observable("1 beat");

  // Initial settings for blocks of this type.
  twoMotorBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        speed: 100,
        duration: 1
      },
      // Indicate what controller is active. This may affect the data format.
      controller: 'speed'
    };
  };
  // Two Motor block
  twoMotorBlock.svg = function (root, block) {
    // Motor 1
    var motor1 = icons.motor(0.85, 3, 3);
    root.appendChild(motor1);

    var data = block.controllerSettings.data.speed;
    var motor2 = icons.motorWithDial(0.85, 23, 3, data);
    root.appendChild(motor2);

    var data2 = block.controllerSettings.data.duration;
    var textToDisplay = svgb.createGroup('displayText', 0, 0);
    var duration = svgb.createText('svg-clear block-motor-text-duration block-stencil-fill', 45, 70, data2 + ' \uF192'); //data2 + " \uf192"
    textToDisplay.appendChild(duration);
    textToDisplay.setAttribute('text-anchor', 'middle');
    root.appendChild(textToDisplay);
    return root;
  };

  twoMotorBlock.configuratorOpen = function (div, block) {
    keypad.tabbedButtons(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.speed;
      },
      'setValue': function setValue(speed) {
        block.controllerSettings.data.speed = speed;
      },
      'type': twoMotorBlock,
      'block': block,
      'min': -100,
      'max': 100,
      'suffix': "%",
      'numArray': ["+1", "+10", "+50", "-1", "-10", "-50", undefined, "C"],
      'calcLayout': 'simple',
      'getBeats': function getBeats() {
        return block.controllerSettings.data.duration;
      },
      'setBeats': function setBeats(duration) {
        block.controllerSettings.data.duration = duration;
      }
    });
  };
  twoMotorBlock.configuratorClose = function (div) {
    keypad.closeTabs(div);
  };

  return twoMotorBlock;
}();

},{"./keypadTab.js":23,"icons.js":52,"knockout":9,"svgbuilder.js":55}],30:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var svgb = require('svgbuilder.js');
  var ko = require('knockout');
  var keypad = require('./../keypadTab.js');
  var icons = require('icons.js');
  var variableAddBlock = {};
  var vars = require('./../../variables.js');

  // Items for selecting a device from a list.
  //identityAccelerometer.devices = ko.observableArray([]);
  variableAddBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  variableAddBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What variable: A, B, C
        variable: 'A',
        incdec: '+',
        // Value
        value: 1
      }
    };
  };

  variableAddBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.value;
      },
      'setValue': function setValue(value) {
        block.controllerSettings.data.value = value;
        if (block.controllerSettings.data.value === '0') {
          block.controllerSettings.data.incdec = '';
        } else if (block.controllerSettings.data.value < 0) {
          block.controllerSettings.data.incdec = '-';
        } else if (block.controllerSettings.data.value > 0) {
          block.controllerSettings.data.incdec = '+';
        }
        //document.getElementById('varAdd-incdec').innerHTML = block.controllerSettings.data.incdec;
      },
      'type': variableAddBlock,
      'block': block,
      'min': -100,
      'max': 100,
      'suffix': "",
      'numArray': ["-1", "C", "+1", "-10", undefined, "+10"],
      'calcLayout': 'simple',
      'inner': '<div id=\'keypadDiv\' class=\'editorDiv\'>\n          <select class="dropdown-comparison vars-dropdown-comparison" id="var-list">\n          </select>\n          <div class="dropdown-label-txt varAdd-label-txt svg-clear" id="varAdd-incdec">\uF061\n          </div>\n          <div id="numeric-display" class = "numeric-display-third svg-clear" width=\'30px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n          </div>\n          <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n      </div>'
    });

    // Add variables to the drop down.
    var selObj = document.getElementById("var-list");
    vars.addOptions(selObj, block.controllerSettings.data.variable);
  };

  // Close the identity blocks and clean up hooks related to it.
  variableAddBlock.configuratorClose = function (div, block) {
    var selObj = document.getElementById('var-list');
    block.controllerSettings.data.variable = vars.getSelected(selObj);
    block.updateSvg();
    keypad.closeTabs(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  variableAddBlock.svg = function (root, block) {
    var varData = block.controllerSettings.data.variable;
    var variable = icons.variable(0.9, 20, 5, varData);
    root.appendChild(variable);

    var val = block.controllerSettings.data.value;
    var incdec = block.controllerSettings.data.incdec;
    // +/- prefix is seperate from the number
    var num = svgb.createText('svg-clear vars-bottom-txt', 45, 71, incdec + ' ' + Math.abs(String(val)));
    num.setAttribute('text-anchor', 'middle');
    root.appendChild(num);
  };

  return variableAddBlock;
}();

},{"./../../variables.js":57,"./../keypadTab.js":23,"icons.js":52,"knockout":9,"svgbuilder.js":55}],31:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  var keypad = require('./../keypadTab.js');
  var calcpad = require('./../calcpad.js');
  var vars = require('./../../variables.js');
  var variableSetBlock = {};

  // Items for selecting a device from a list.
  variableSetBlock.keyPadValue = ko.observable(0);

  // Initial settings for blocks of this type.
  variableSetBlock.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What variable: A, B, C
        variable: 'A',
        // Value
        value: 0
      }
    };
  };

  variableSetBlock.configuratorOpen = function (div, block) {
    // calcpad.open(div, block);

    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.value;
      },
      'setValue': function setValue(value) {
        block.controllerSettings.data.value = value;
      },
      'type': variableSetBlock,
      'block': block,
      'min': -100,
      'max': 100,
      'suffix': "",
      'numArray': ["-1", "C", "+1", "-10", undefined, "+10"],
      'calcLayout': 'simple',
      'inner': '<div id=\'keypadDiv\' class=\'editorDiv\'>\n          <select class="dropdown-comparison vars-dropdown-comparison" id="var-list">\n          </select>\n          <div class="dropdown-label-txt varSet-label-txt svg-clear">=\n          </div>\n          <div id="numeric-display" class = "numeric-display-third svg-clear" width=\'30px\' height=\'80px\' data-bind=\'text: keyPadValue\'>\n          </div>\n          <svg id="keypadSvg" class=\'area\' width=\'225px\' height=\'200px\' xmlns=\'http://www.w3.org/2000/svg\'></svg>\n      </div>'
    });

    var selObj = document.getElementById("var-list");
    vars.addOptions(selObj, block.controllerSettings.data.variable);
  };

  // Close the identity blocks and clean up hooks related to it.
  variableSetBlock.configuratorClose = function (div, block) {
    // Determine what was seleced
    var selObj = document.getElementById('var-list');
    block.controllerSettings.data.variable = vars.getSelected(selObj);
    block.updateSvg();
    //calcpad.close(div);
    keypad.closeTabs(div);
  };

  // Buid an SVG for the block that indicates the device name
  // and connection status
  variableSetBlock.svg = function (root, block) {
    var varData = block.controllerSettings.data.variable;
    var variable = icons.variable(0.9, 20, 5, varData);
    root.appendChild(variable);

    var val = block.controllerSettings.data.value;
    var num = svgb.createText('svg-clear vars-bottom-txt', 45, 71, String(val));
    num.setAttribute('text-anchor', 'middle');
    root.appendChild(num);
  };

  return variableSetBlock;
}();

},{"./../../variables.js":57,"./../calcpad.js":15,"./../keypadTab.js":23,"icons.js":52,"knockout":9,"svgbuilder.js":55}],32:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var ko = require('knockout');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  var keypad = require('./keypadTab.js');

  var waitBlock = {};
  waitBlock.keyPadValue = ko.observable(1);

  // Initial settings for blocks of this type.
  waitBlock.defaultSettings = function () {
    // Return a new object with settings for the controller
    return {
      // and the data that goes with that editor.
      data: { 'duration': 1.0 }
      // Indicate what controller is active. This may affect the data format.
    };
  };
  // Wait block - Wait until something happens. It can wait for things other
  // than time, but it is assumed that time passing is part of the function.
  waitBlock.svg = function (root, block) {
    var waitIcon = icons.wait(0.9, 50, 19);
    root.appendChild(waitIcon);

    var data = block.controllerSettings.data.duration;
    var time = svgb.createText('svg-clear block-wait-text block-stencil-fill', 45, 70, data + ' \uF192');
    time.setAttribute('text-anchor', 'middle');
    root.appendChild(time);

    return root;
  };

  waitBlock.configuratorOpen = function (div, block) {
    keypad.openTabs(div, {
      'getValue': function getValue() {
        return block.controllerSettings.data.duration;
      },
      'setValue': function setValue(duration) {
        block.controllerSettings.data.duration = duration;
      },
      'type': waitBlock,
      'block': block,
      'min': 1,
      'max': 50,
      'suffix': " beats",
      'numArray': ["+1", "C", "-1", "+10", undefined, "-10"],
      'calcLayout': 'simple'
    });
    //  formTools.sliderInteract(div);
  };
  waitBlock.configuratorClose = function (div) {
    keypad.closeTabs(div);
  };

  return waitBlock;
}();

},{"./keypadTab.js":23,"icons.js":52,"knockout":9,"svgbuilder.js":55}],33:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var log = require('log.js');
  var conductor = {};
  var dso = require('./overlays/deviceScanOverlay.js');
  var dots = require('./overlays/actionDots.js');
  var cxn = require('./cxn.js');
  var variables = require('./variables.js');

  conductor.cxn = require('./cxn.js');
  conductor.tbe = null;
  conductor.hbTimer = 0;
  conductor.sensorTimer = 0;
  conductor.runningBlocks = [];
  conductor.count = null;
  conductor.defaultPix = '0000000000';
  conductor.run = false;
  conductor.soundCount = 0;

  // Once the conductor system is connected to the editor,
  // it will ping the target device to determine its current state.
  // Scan the editor looking for identity blocks

  conductor.activeBits = [];

  conductor.attachToScoreEditor = function (tbe) {
    conductor.tbe = tbe;
    conductor.linkHeartBeat();
    conductor.cxn.connectionChanged.subscribe(conductor.updateIndentityBlocks);
  };

  // If there is a change in connections update the indentity blocks
  // TODO this linkage is very much a bit of a hack.
  conductor.updateIndentityBlocks = function () {
    var blockChainIterator = conductor.tbe.forEachDiagramChain;
    blockChainIterator(function (chainStart) {
      if (chainStart.name.startsWith('identity')) {
        var botName = dso.deviceName;
        var status = conductor.cxn.connectionStatus(botName);
        if (status === conductor.cxn.statusEnum.BEACON) {
          // Try to connect ot it.
          conductor.cxn.connect(botName);
        }
        chainStart.updateSvg();
      }
    });
  };

  conductor.linkHeartBeat = function () {
    var botName = dso.deviceName;
    conductor.hbTimer = 0;
    conductor.cxn.write(botName, '(m:(1 2) d:0);');

    // Set all of the blocks to a regular state.
    conductor.tbe.forEachDiagramBlock(function (b) {
      b.svgRect.classList.remove('running-block');
    });

    if (conductor.runningBlocks.length > 0) {
      for (var i = 0; i < conductor.runningBlocks.length; i++) {
        var block = conductor.runningBlocks[i];
        if (block !== null) {
          if (conductor.loopCount === undefined && block.isLoopHead()) {
            conductor.loopCount = block.controllerSettings.data.duration;
          }

          if (block.name === 'tail' && conductor.loopCount > 1) {
            block = block.flowHead;
            conductor.loopCount -= 1;
          } else if (block.name === 'tail' && conductor.loopCount === 1) {
            conductor.loopCount = undefined;
            if (block.next !== null) {
              block = block.next;
            } else {
              conductor.stopAll();
            }
          }

          if (block !== null && block.name === 'loop') {
            block = block.next;
          }
          // If this is a new block, get its duration
          if (block.count === null || block.count === undefined) {
            block.count = block.controllerSettings.data.duration;
          }

          // If it does not have a duration or it has a duration of 0
          // then set its duration to 1
          if (block.count === undefined || block.count === '0') {
            block.count = 1;
          }

          if (block !== null) {
            block.count = parseInt(block.count, 10);

            // Mark the current block as running
            var id = block.first;
            if (id.name.startsWith('identity')) {
              block.moveToFront();
              block.svgRect.classList.add('running-block');
            }

            // If the block has not played for its entire duration,
            // continue playing the block.
            // Otherwise, get the next block ready and set count to null.
            conductor.playOne(block);
            if (block.count > 1) {
              block.count -= 1;
            } else {
              conductor.runningBlocks[i] = block.next;
              block.count = null;
            }
          }
        }
      }
    }
    conductor.hbTimer = setTimeout(function () {
      conductor.linkHeartBeat();
    }, 1000);
  };

  // Find all start all blocks and start them running.
  conductor.playAll = function () {
    dots.activate('play', 5);
    conductor.runningBlocks = [];
    conductor.run = true;
    variables.resetVars();
    var blockChainIterator = conductor.tbe.forEachDiagramChain;
    blockChainIterator(function (chainStart) {
      // Ignore chains that don't start with an identity block.
      if (chainStart.name === 'identity') {
        conductor.runningBlocks.push(chainStart.next);
      } else if (chainStart.name === 'identityAccelerometer' || chainStart.name === 'identityButton' || chainStart.name === 'identityTemperature') {
        //chainStart.controllerSettings.data.run = "yes";
        cxn.buttonA = null;
        cxn.buttonB = null;
        cxn.buttonAB = null;
        conductor.checkSensorIdentity(chainStart);
      }
    });
  };

  conductor.satisfiesStart = function (val, block, error) {
    var blockValue = parseInt(block.controllerSettings.data.value, 10);
    if (block.controllerSettings.data.comparison === '<') {
      return val < blockValue;
    } else if (block.controllerSettings.data.comparison === '>') {
      return val > blockValue;
    } else if (block.controllerSettings.data.comparison === '=') {
      if (val === blockValue) {
        return true;
      } else if (val + error > blockValue && val - error < blockValue) {
        return true;
      }
      return false;
    }
    return null;
  };

  conductor.runningBlockIsNotInChain = function (block) {
    while (block !== null) {
      if (block.svgRect.classList.contains('running-block')) {
        return false;
      }
      block = block.next;
    }
    return true;
  };

  conductor.checkSensorIdentity = function (block) {
    conductor.sensorTimer = 0;
    var data = block.controllerSettings.data;
    //conductor.cxn.write(dso.deviceName, '(sensor);');
    if (conductor.run) {
      if (block.name === 'identityAccelerometer' && cxn.accelerometer !== null) {
        var accel = cxn.accelerometer;
        console.log("Accelerometer", accel);
        if (conductor.satisfiesStart(accel, block, 5) && conductor.runningBlockIsNotInChain(block)) {
          conductor.runningBlocks.push(block.next);
        }
      } else if (block.name === 'identityTemperature' && cxn.temperature !== null) {
        var temp = cxn.temperature;
        console.log("Temperature", temp);
        if (conductor.satisfiesStart(temp, block, 0)) {
          conductor.runningBlocks.push(block.next);
        }
      } else if (block.name === 'identityButton') {
        //console.log(data.button);
        if (data.button === 'A' && cxn.buttonA) {
          conductor.runningBlocks.push(block.next);
          cxn.buttonA = null;
        } else if (data.button === 'B' && cxn.buttonB) {
          conductor.runningBlocks.push(block.next);
          cxn.buttonB = null;
        } else if (data.button === 'A+B' && cxn.buttonAB) {
          conductor.runningBlocks.push(block.next);
          cxn.buttonAB = null;
        }
      }
    }
    conductor.sensorTimer = setTimeout(function () {
      conductor.checkSensorIdentity(block);
    }, 50);
  };

  // Stop all running chains.
  conductor.stopAll = function () {
    dots.activate('play', 0);
    var blockChainIterator = conductor.tbe.forEachDiagramChain;
    var botName = '';
    var message = '(m:(1 2) d:0);';
    var message2 = '(px:' + conductor.defaultPix + ');';
    conductor.run = false;
    blockChainIterator(function (chainStart) {
      chainStart.svgRect.classList.remove('running-block');
      // Ignore chains that don't start with an identity block.
      if (chainStart.name.startsWith('identity')) {
        botName = dso.deviceName;
        conductor.cxn.write(botName, message);
        conductor.cxn.write(botName, message2);
      }
    });
    conductor.count = null;
    conductor.runningBlocks = [];
    conductor.soundCount = 0;
    log.trace('stop all');
    // Single step, find target and head of chain, and run the single block.
  };

  conductor.playOne = function (block) {
    var first = block.first;

    if (first.name.startsWith('identity')) {
      var botName = dso.deviceName;
      var message = '';
      var d = block.controllerSettings.data;
      if (block.name === 'picture') {
        var imageData = d.pix;
        var pixStr = conductor.packPix(imageData);
        message = '(px:' + pixStr + ':' + 1 + ');';
      } else if (block.name === 'servo') {
        message = '(sr:' + 50 + ');';
      } else if (block.name === 'motor') {
        message = '(m:' + d.motor + ' d:' + -d.speed + ' b:' + d.duration + ');';
      } else if (block.name === 'twoMotor') {
        message = '(m:(1 2) d:' + -d.speed + ');'; // +' b:' + d.duration
      } else if (block.name === 'sound') {
        // pass the Solfege index
        message = '(nt:' + d.s.split(" ")[conductor.soundCount] + ');';
        if (conductor.soundCount === d.duration - 1) {
          conductor.soundCount = 0;
        } else {
          conductor.soundCount += 1;
        }
        console.log('message', message);
      } else if (block.name === 'wait') {
        message = '';
      } else if (block.name === 'variableSet') {
        variables.set(d.variable, d.value);
      } else if (block.name === 'variableAdd') {
        // Decrement is done with negative numbers.
        variables.func(d.variable, '+', d.value);
      } else if (block.name === 'print') {
        var val = conductor.getPrintVal(d);
        message = '(pr:' + val + ');';
      }
      conductor.cxn.write(botName, message);
    }
    // variables.printVars();
    // Single step, find target and head of chain and run the single block.
  };

  conductor.getPrintVal = function (d) {
    var val = 0;
    if (d.print === 'var') {
      console.log('var------');
      val = variables.get(d.variable);
    } else if (d.print === 'sensor') {
      console.log('sensor------');
      if (d.sensor === 'accelerometer') {
        val = cxn.accelerometer;
      } else if (d.sensor === 'temperature') {
        val = cxn.temperature;
      }
    }
    console.log('conductor print', d.print, d.variable, d.sensor, val);
    return val;
  };

  conductor.playSingleChain = function () {
    log.trace('play single chain');
    // The conductor starts one chain (part of the score).
  };

  conductor.packPix = function (imageData) {
    var pixStr = '';
    for (var i = 0; i < 5; i++) {
      var value = 0;
      for (var j = 0; j < 5; j++) {
        value *= 2;
        if (imageData[i * 5 + j] !== 0) {
          value += 1;
        }
      }
      var str = value.toString(16);
      if (str.length === 1) {
        str = '0' + str;
      }
      pixStr += str;
    }
    return pixStr;
  };
  return conductor;
}();

},{"./cxn.js":34,"./overlays/actionDots.js":38,"./overlays/deviceScanOverlay.js":41,"./variables.js":57,"log.js":53}],34:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Module for managing BLE connections and lists of devices found.
module.exports = function factory() {
  var log = require('log.js');
  var ko = require('knockout');

  var cxn = {};
  cxn.connectionChanged = ko.observable({});
  cxn.connectionChanged.extend({ notify: 'always' });
  cxn.messages = [];
  cxn.compass = 0;
  cxn.temp = 0;
  cxn.connectingTimeout = 0;
  cxn.hostSelectedName = "";
  cxn.calibrating = false;
  cxn.calibrated = false;

  cxn.accelerometer = null;
  cxn.temperature = null;
  cxn.buttonA = null;
  cxn.buttonB = null;
  cxn.buttonAB = null;
  cxn.batteryPercent = 50;
  // State enumeration for conections.
  cxn.statusEnum = {
    NOT_THERE: 0,
    BEACON: 1,
    CONNECTING: 2,
    CONNECTED: 3,
    CONNECTION_ERROR: 4
  };

  // GUIDs for Nordic BLE UART services.
  var nordicUARTservice = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e' // receive is from the phone's perspective
  };

  cxn.webBLERead = null;
  cxn.webBLEWrite = null;

  // Convert a string to an array of int (int8s).
  function stringToBuffer(str) {
    var array = new Uint8Array(str.length);
    for (var i = 0, l = str.length; i < l; i++) {
      array[i] = str.charCodeAt(i);
    }
    return array.buffer;
  }

  // Convert an array ints to a string.
  function bufferToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  // Sniff out which BLE API to use. The order of testing is important
  if (typeof ble !== 'undefined') {
    // First, look for a cordova based one. Its based on a global
    cxn.appBLE = ble; // eslint-disable-line no-undef
    cxn.webBLE = null;
  } else if (navigator.bluetooth !== null && navigator.bluetooth !== undefined) {
    // Second, see if ther appears to be a web bluetooth implmentation.
    cxn.appBLE = null;
    cxn.webBLE = navigator.bluetooth;
  } else {
    // None found.
    cxn.appBLE = null;
    cxn.webBLE = null;
  }

  // For WebBLE (others??) the UX needs to bring up the host's
  // Scanning dialog.
  cxn.scanUsesHostDialog = function () {
    return cxn.webBLE !== null;
  };

  cxn.devices = {};
  cxn.scanning = false;

  cxn.stopScanning = function () {
    log.trace('cxn.stopScanning');
    cxn.scanning = false;
    if (cxn.appBLE) {
      cxn.appBLE.stopScan();
    }
  };

  cxn.findDeviceByMac = function (mac) {
    for (var deviceName in cxn.devices) {
      var device = cxn.devices[deviceName];
      if (mac === device.mac) {
        return device;
      }
    }
    return null;
  };

  // strip down the name to the core 5 character name
  cxn.bleNameToBotName = function (rawName) {
    if (rawName.startsWith('BBC micro:bit [')) {
      return rawName.split('[', 2)[1].split(']', 1)[0];
    } else {
      return null;
    }
  };

  // A Device has been seen.
  cxn.beaconReceived = function (beaconInfo) {
    if (beaconInfo.name !== undefined) {
      var botName = cxn.bleNameToBotName(beaconInfo.name);
      beaconInfo.botName = botName;

      // If its a legit name make sure it is in the list or devices.
      if (botName !== null) {

        // Merge into list
        if (!this.devices.hasOwnProperty(botName)) {
          this.devices[botName] = {
            name: botName,
            mac: beaconInfo.id
          };
          // Now set the status and trigger observers
          cxn.setConnectionStatus(botName, cxn.statusEnum.BEACON);
        }

        // Update last-seen time stamp, signal strength
        this.devices[botName].ts = Date.now();
        if (Number.isInteger(beaconInfo.rssi)) {
          this.devices[botName].rssi = beaconInfo.rssi;
        }
        this.cullList();
      }
    }
  };

  cxn.cullList = function () {
    var now = Date.now();
    for (var botName in cxn.devices) {
      var botInfo = cxn.devices[botName];

      // Per ECMAScript 5.1 standard section 12.6.4 it is OK to delete while
      // iterating through a an object.
      if (botInfo.status === cxn.statusEnum.BEACON && now - botInfo.ts > 4000) {
        // log.trace('culling beacon thath has not been refreshed for a long while.');
        delete cxn.devices[botName];
      } else if (botInfo.status === cxn.statusEnum.NOT_THERE) {
        // log.trace('culling missing bot');
        delete cxn.devices[botName];
      } else if (botInfo.status === cxn.statusEnum.CONNECTING) {
        // If it is stuck in connecting then drop it.
        // This is probably too quick. should do disconnect as well.
        // log.trace('culling hung connection', cxn.connectingTimeout);
        if (Date.now() - cxn.connectingStart > 10000) {
          delete cxn.devices[botName];
        }
      }
    }

    // Let observers know something about the list of devices has changed.
    cxn.connectionChanged(cxn.devices);
  };

  cxn.isBLESupported = function () {
    if (cxn.webBLE) {
      return true;
    } else if (cxn.appBLE && cxn.appBLE.isEnabled) {
      return true;
    } else {
      return false;
    }
  };

  cxn.startScanning = function () {
    cxn.connectingStart = Date.now(); // a bit of a hack
    cxn.scanning = true;

    if (cxn.webBLE) {
      cxn.webBTConnect();
    } else if (cxn.appBLE) {

      cxn.appBLE.isEnabled(function () {
        console.log("Bluetooth is enabled");
      }, function () {
        console.log("Bluetooth is *not* enabled");
      });

      //cxn.appBLE.enable();
      log.trace('appBLE:' + cxn.scanning);
      cxn.appBLE.startScanWithOptions([], { reportDuplicates: true }, function (beaconInfo) {
        cxn.beaconReceived(beaconInfo);
      }, function (errorCode) {
        log.trace('error1:' + errorCode);
      });
    } else {
      // bleAPI is not null looks like cordova model.
      log.trace('Bluetooth not supported in this context');
    }
  };

  // For Web bluetooth use the promises style of chaining callbacks.
  // It looks a bit like one function, but it is a chain of 'then'
  // call backs
  cxn.webBTConnect = function () {

    var options = {
      filters: [
      // The GATT filter filters out micro:bits on chrome books (6/1/2019) why??
      // {services: ['generic_attribute']},
      { namePrefix: 'BBC micro:bit' }],
      optionalServices: [nordicUARTservice.serviceUUID, 'link_loss']
    };

    // requestDevice will trigger a browse dialog once back to the browser loop.
    // When a user selects one the 'then()' is called. Since the user has already
    // selected on at that point, add it to the list and select.
    navigator.bluetooth.requestDevice(options).then(function (device) {
      // Called once device selected by user - no connection made yet
      log.trace('> device:', device);
      var beaconInfo = {
        name: device.name, // Should be in 'BBC micro:bit [xxxxx]' format
        id: device.id, // looks like a hast of mac id perhaps
        rssi: -1, // signal strength is not shared with JS code
        autoSelect: true // indicate that the app should now connect.
      };
      cxn.beaconReceived(beaconInfo);
      device.addEventListener('gattserverdisconnected', cxn.onDisconnecWebBLE);
      cxn.setConnectionStatus(beaconInfo.botName, cxn.statusEnum.CONNECTING);
      return device.gatt.connect();
    }).then(function (server) {
      // Called once gatt.connect() finishes
      log.trace('> GATT connected:', server);
      return server.getPrimaryService(nordicUARTservice.serviceUUID);
    }).then(function (primaryService) {
      // Called once nordicUARTservice is found.
      log.trace('> Nordic UART service connected:', primaryService);
      // Calling getCharacteristics with no parameters
      // should return the one associated with the primary service
      // ( the tx and rx service)
      return primaryService.getCharacteristics();
    }).then(function (characteristics) {
      var rawName = characteristics[0].service.device.name;
      log.trace('> UART characteristics:', rawName, characteristics);
      var botName = cxn.bleNameToBotName(rawName);
      cxn.scanning = false;
      cxn.setConnectionStatus(botName, cxn.statusEnum.CONNECTED);

      if (characteristics.length >= 2) {
        var c0 = characteristics[0];
        var c1 = characteristics[1];
        if (c0.uuid === nordicUARTservice.txCharacteristic) {
          cxn.webBLEWrite = c0;
        } else if (c1.uuid === nordicUARTservice.txCharacteristic) {
          cxn.webBLEWrite = c1;
        }
        if (c0.uuid === nordicUARTservice.rxCharacteristic) {
          cxn.webBLERead = c0;
        } else if (c1.uuid === nordicUARTservice.rxCharacteristic) {
          cxn.webBLERead = c1;
        }
      }
      cxn.webBLERead.startNotifications().then(function () {
        log.trace('adding event listener');
        cxn.webBLERead.addEventListener('characteristicvaluechanged', cxn.onValChange);
      });
    }).catch(function (error) {
      cxn.scanning = false;
      cxn.connectionChanged(cxn.devices);
      // User canceled the picker.
      //log.trace('cancel or error :' + error);
    });
  };

  cxn.onDisconnectAppBLE = function (info) {
    log.trace('onDisconnectAppBLE:', info);
    var botName = cxn.bleNameToBotName(info.name);
    cxn.setConnectionStatus(botName, cxn.statusEnum.NOT_THERE);
    cxn.cullList();
    cxn.versionNumber = null;
    cxn.calibrated = false;
  };

  cxn.onDisconnecWebBLE = function (event) {
    log.trace('onDisconnecWebBLE:', event.target.name);
    var botName = cxn.bleNameToBotName(event.target.name);
    cxn.setConnectionStatus(botName, cxn.statusEnum.NOT_THERE);
    cxn.cullList();
    cxn.versionNumber = null;
    cxn.calibrated = false;
  };

  // Determine the status of a named connection.
  cxn.connectionStatus = function (name) {
    try {
      if (cxn.devices.hasOwnProperty(name)) {
        return cxn.devices[name].status;
      } else {
        return cxn.statusEnum.NOT_THERE;
      }
    } catch (error) {
      log.trace('execption in BLE onData', error);
      return 0;
    }
  };

  // Change a devices status and trigger observers
  cxn.setConnectionStatus = function (name, status) {
    var dev = cxn.devices[name];
    if (dev !== null) {
      dev.status = status;
    }
    // Trigger notifications.
    cxn.connectionChanged(cxn.devices);
  };

  cxn.disconnectAll = function () {
    if (cxn.appBLE) {
      for (var deviceName in cxn.devices) {
        var mac = cxn.devices[deviceName].mac;
        cxn.appBLE.disconnect(mac);
        cxn.setConnectionStatus(deviceName, cxn.statusEnum.NOT_THERE);
      }
      //    cxn.cullList();
    } else {
      // More to do here once multiple connectios allowed.
      if (cxn.webBLEWrite !== null) {
        var dev = cxn.webBLEWrite.service.device;
        if (dev.gatt.connected) {
          dev.gatt.disconnect();
        }
        cxn.webBLEWrite = null;
        cxn.webBLERead = null;
      }
    }
  };

  cxn.disconnect = function (name) {
    if (cxn.appBLE) {
      var mac = cxn.devices[name].mac;
      console.log('disconnecting appble', mac);
      cxn.appBLE.disconnect(mac);
      cxn.setConnectionStatus(name, cxn.statusEnum.NOT_THERE);
      cxn.cullList();
    } else if (cxn.webBLE) {
      // Not really set up to manage multiple connections.
      // So there is only one, disconect it.
      cxn.disconnectAll();
    }
  };

  cxn.connect = function (name) {
    console.log('cns.connect', name, cxn.devices);
    cxn.connectingStart = Date.now();
    if (cxn.devices.hasOwnProperty(name)) {
      var mac = cxn.devices[name].mac;
      console.log('cns.connect', name, mac);
      if (cxn.appBLE) {
        console.log('cns.connect is app BLE');
        cxn.setConnectionStatus(name, cxn.statusEnum.CONNECTING);
        cxn.appBLE.connect(mac, cxn.onConnectAppBLE, cxn.onDisconnectAppBLE, cxn.onError);
      } else if (cxn.webBLE) {
        // Should already be connected.
        // TODO, no the connection can be postponed until needed (perhaps)
      } else {
        // For no BLE present, pretend the device is connected.
        cxn.setConnectionStatus(name, cxn.statusEnum.CONNECTED);
      }
    }
  };

  cxn.onConnectAppBLE = function (info) {
    log.trace('On Connected:', info.name);
    // If connection works, then start listening for incomming messages.
    cxn.appBLE.startNotification(info.id, nordicUARTservice.serviceUUID, nordicUARTservice.rxCharacteristic, function (data) {
      cxn.onData(info.name, data);
    }, cxn.onError);

    var dev = cxn.findDeviceByMac(info.id);
    if (dev !== null) {
      cxn.setConnectionStatus(dev.name, cxn.statusEnum.CONNECTED);
    }
  };

  cxn.onData = function (name, data) {
    try {
      // (A T B G)
      var str = bufferToString(data);
      //  log.trace('On Data:', name, str);
      cxn.messages.push(name + ':' + str);
      if (str.includes('ac')) {
        var accelData = str.substring(4, str.length - 1);
        cxn.accelerometer = parseInt(accelData, 10) / 20;
      } else if (str.includes('(a)')) {
        cxn.buttonA = true;
      } else if (str.includes('(b)')) {
        cxn.buttonB = true;
      } else if (str.includes('(ab)')) {
        cxn.buttonAB = true;
      } else if (str.includes('compass')) {
        cxn.compass = str.substring(9, str.length - 2);
      } else if (str.includes('tp')) {
        var tempData = str.substring(4, str.length - 1);
        var fData = 1.8 * parseInt(tempData, 10) + 32;
        cxn.temperature = fData;
      } else if (str.includes('vs')) {
        cxn.versionNumber = str.substring(4, str.length - 1);
        console.log('version number:', cxn.versionNumber);
      } else if (str.includes('bt')) {
        cxn.batteryPercent = str.substring(4, str.length - 1);
      } else if (str.includes('cs')) {
        cxn.calibrating = true;
      } else if (str.includes('cf')) {
        cxn.calibrating = false;
        cxn.calibrated = true;
      }
    } catch (error) {
      log.trace('execption in BLE onData', error);
    }
  };

  cxn.onValChange = function (event) {
    var value = event.target.value;
    //log.trace('BLE message recieved', str);
    cxn.onData('Received', value.buffer);
  };

  cxn.onError = function (reason) {
    log.trace('Error2:', reason);
  };

  cxn.write = function (name, message) {
    if (!cxn.calibrating) {
      //console.log(cxn.calibrating);
      try {
        if (cxn.devices.hasOwnProperty(name)) {
          var mac = cxn.devices[name].mac;
          var buffer = stringToBuffer(message);

          if (cxn.appBLE) {
            buffer = stringToBuffer(message);

            // Break the message into smaller sections.
            cxn.appBLE.write(mac, nordicUARTservice.serviceUUID, nordicUARTservice.txCharacteristic, buffer, cxn.onWriteOK, cxn.onWriteFail);
          } else if (cxn.webBLE) {
            if (cxn.webBLEWrite) {
              cxn.webBLEWrite.writeValue(buffer).then(function () {

                //log.trace('write succeded', message);
              }).catch(function () {
                //log.trace('write failed', message, error);
                setTimeout(cxn.write(name, message), 50);
              });
            }
            //var cxn.webBLEWrite = null;
          }
        }
      } catch (error) {
        log.trace('execption in BLE Write', error);
      }
    }
  };

  cxn.onWriteOK = function (data) {
    log.trace('write ok', data);
  };
  cxn.onWriteFail = function (data) {
    log.trace('write fail', data);
  };

  return cxn;
}();

},{"knockout":9,"log.js":53}],35:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var defaultFiles = {};
  var app = require('./appMain.js');
  var defaultPages = [{ title: 'docA', text: '()' }, { title: 'docB', text: '(\n    (chain x:80 y:160 (\n      (identity start:\'click\' deviceName:\'-?-\' bus:\'ble\')\n      (picture pix:(0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 1 0 0 0 1 0 1 1 1 0))\n      (picture pix:(0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 0 1 1 1 0 1 0 0 0 1))\n      (picture pix:(0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0))\n      (picture pix:(0 1 0 1 0 0 0 0 0 0 0 1 1 1 0 1 0 0 0 1 0 1 1 1 0))\n    )))' }, { title: 'docC', text: '(\n      (chain x:80 y:160 (\n        (identity start:\'click\' deviceName:\'-?-\' bus:\'ble\')\n        (loop count:\'25\' (\n          (picture pix:(1 1 1 1 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 1 1 1 1))\n          (picture pix:(0 0 0 0 0 0 1 1 1 0 0 1 0 1 0 0 1 1 1 0 0 0 0 0 0))\n          (picture pix:(0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0))\n        ))\n      )))' }, { title: 'docD', text: '(\n      (chain x:80 y:160 (\n        (identity start:\'click\' deviceName:\'-?-\' bus:\'ble\')\n        (sound description:\'C4\' period:\'1/4\')\n        (sound description:\'E4\' period:\'1/4\')\n        (sound description:\'G4\' period:\'1/4\')\n        (sound description:\'E4\' period:\'1/4\')\n        (sound description:\'C4\' period:\'1/4\')\n      )))' }, { title: 'docE', text: '(\n      (chain x:80 y:160 (\n        (identity start:\'click\' deviceName:\'-?-\' bus:\'ble\')\n        (motor speed:50 duration:0)\n        (motor speed:\'100\' duration:0)\n        (motor speed:50 duration:0)\n        (motor speed:\'0\' duration:0)\n        (motor speed:\'-50\' duration:0)\n        (motor speed:\'-100\' duration:0)\n        (motor speed:\'-50\' duration:0)\n      )))' }];

  defaultFiles.setupDefaultPages = function (force) {
    for (var i = 0; i < defaultPages.length; i++) {
      var page = defaultPages[i];
      if (force || app.storage.getItem(page.title) === null) {
        app.storage.setItem(page.title, page.text);
      }
    }
  };

  return defaultFiles;
}();

},{"./appMain.js":13}],36:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var log = require('log.js');
  var svgb = require('svgbuilder.js');
  var b = {};

  b.bind = function (style) {
    var key = style + 'Block';
    var def = this[key];
    if (def === undefined) {
      def = this.unknownBlock;
      log.trace('cant find style for ', key);
    }
    return def;
  };

  b.unknownBlock = {
    svg: function svg(root, block) {
      //var group = svgb.createGroup('', 10, 10);
      //root.appendChild(group);
      var text = svgb.createText('function-text svg-clear', 10, 40, block.name);
      root.appendChild(text);
      return root;
    }
  };

  b.identityBlock = require('./blocks/identityBlocks/identityBlock.js');
  b.pictureBlock = require('./blocks/pictureBlock.js');
  b.soundBlock = require('./blocks/soundBlock.js');
  b.servoBlock = require('./blocks/servoBlock.js');
  b.waitBlock = require('./blocks/waitBlock.js');
  b.colorStripBlock = require('./blocks/colorStripBlock.js');
  var flowBlocks = require('./blocks/flowBlocks.js');
  b.loopBlock = flowBlocks.flowBlockHead; // TODO name change
  b.tailBlock = flowBlocks.flowBlockTail; // TODO name change
  b.motorBlock = require('./blocks/motorBlock.js');
  b.twoMotorBlock = require('./blocks/twoMotorBlock.js');
  b.identityAccelerometerBlock = require('./blocks/identityBlocks/identityAccelerometerBlock.js');
  b.identityButtonBlock = require('./blocks/identityBlocks/identityButtonBlock.js');
  b.identityGyroBlock = require('./blocks/identityBlocks/identityGyroBlock.js');
  b.identityTemperatureBlock = require('./blocks/identityBlocks/identityTemperatureBlock.js');
  b.variableSetBlock = require('./blocks/variables/variableSetBlock.js');
  b.variableAddBlock = require('./blocks/variables/variableAddBlock.js');
  b.printBlock = require('./blocks/printBlock.js');

  b.digitalWriteBlock = {
    svg: function svg(root) {
      // TODO
      return root;
    }
  };

  b.analogWriteBlock = {
    // TODO
  };

  b.serialWriteBlock = {
    // TODO
  };

  b.I2CWriteBlock = {
    // TODO
  };

  // Calculator
  b.calculatorBlock = {
    svg: function svg(root) {
      return root;
    }
  };
  // Binding sources are things that provide values that can be connected to
  // actors. Much still TODO :)
  b.musicNoteValue = {
    // TODO
  };

  b.constantValue = {
    // TODO
  };

  b.rangeValue = {
    // TODO
  };

  b.acceleromoterValue = {
    // TODO
  };

  b.timeValue = {
    // TODO
  };

  b.compassValue = {
    // TODO
  };

  b.temperatureValue = {
    // TODO
  };

  b.funcionValue = {
    // TODO
  };

  b.messageValue = {
    // TODO
    // May be globals on the device, or across a mesh.
  };

  return b;
}();

},{"./blocks/colorStripBlock.js":16,"./blocks/flowBlocks.js":17,"./blocks/identityBlocks/identityAccelerometerBlock.js":18,"./blocks/identityBlocks/identityBlock.js":19,"./blocks/identityBlocks/identityButtonBlock.js":20,"./blocks/identityBlocks/identityGyroBlock.js":21,"./blocks/identityBlocks/identityTemperatureBlock.js":22,"./blocks/motorBlock.js":24,"./blocks/pictureBlock.js":25,"./blocks/printBlock.js":26,"./blocks/servoBlock.js":27,"./blocks/soundBlock.js":28,"./blocks/twoMotorBlock.js":29,"./blocks/variables/variableAddBlock.js":30,"./blocks/variables/variableSetBlock.js":31,"./blocks/waitBlock.js":32,"log.js":53,"svgbuilder.js":55}],37:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var app = require('./appMain.js');
var overlays = require('./overlays/overlays.js').init();

// Determine if page launched in broswer, or cordova/phone-gap app.
app.isRegularBrowser = document.URL.indexOf('http://') >= 0 || document.URL.indexOf('https://') >= -0;

if (!app.isRegularBrowser) {

	// Add view port info dynamically. might help iOS WKWebview
	var meta = document.createElement('meta');
	meta.name = 'viewport';
	meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
	document.getElementsByTagName('head')[0].appendChild(meta);
	//<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">


	app.isCordovaApp = true;
	// Guess that it is Cordova then. Not intened to run directly from file:
	document.addEventListener('deviceready', app.start, false);
	var script = document.createElement('script');
	// Load cordova.js if not in regular browser, and then set up initialization.
	script.setAttribute('src', './cordova.js');
	document.head.appendChild(script);
} else {
	// If in regular broswer, call start directly.
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	if (isMobile) {
		//window.location.href = 'landingPage.html'
		overlays.insertHTML('\n        <div id=\'mobileOverlay\'>\n            <div id=\'mobileDialog\'>\n\t\t\t  <h1 style = "text-align:center">You are on a mobile Device</h1>\n\t\t\t\t<div style = "text-align:center;">\n\t\t\t\t\tConsider using our mobile app instead: <a href = "https://tblocks.app.link">TBlocks</a>\n\t\t\t\t</div>\n\t\t\t\t<br>\n\t\t\t\t<br>\n\t\t\t\t<div style = "text-align:center;">\n\t\t\t\t\tOr continue with <a id="regularWebsite" href = \'#\'>our website</a>.\n\t\t\t\t</div>\n\t\t\t  </div>\n\t\t</div>');
		var regularWebsite = document.getElementById("regularWebsite");
		regularWebsite.onclick = function () {
			document.getElementById("mobileOverlay").style.display = "none";
			event.preventDefault();
			app.isCordovaApp = false;
			app.start();
		};
	} //			 <a href="https://tblocks.app.link">tblocks</a> 			  <h3 style = "text-align:center;">Considering using our mobile app instead: </h3>


	else {
			app.isCordovaApp = false;
			app.start();
		}
}

},{"./appMain.js":13,"./overlays/overlays.js":44}],38:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var _require = require('../blocks/identityBlocks/identityBlock.js'),
    svg = _require.svg;

module.exports = function () {
  var actionDots = {};
  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var editStyle = require('editStyle.js');
  var app = require('./../appMain.js');
  var fastr = require('fastr.js');
  var dso = require('./deviceScanOverlay.js');

  // Map of all dots to map SVG dotIndex attribure to JS objects
  actionDots.mapIndex = 0;
  actionDots.dotMap = [];

  // Set of top dots after they have been defined.
  actionDots.topDots = [];
  actionDots.commandDots = [];

  // How many dots in each region.
  actionDots.dotsLeft = 0;
  actionDots.dotsMiddle = 0;
  actionDots.dotsRight = 0;

  // Flag to prevent nested animations, seconds hits bounce off.
  actionDots.isAnimating = false;
  actionDots.currentSubShowing = null;
  actionDots.docTitleSVG = null;

  // Construct an action dot object, the object manage the SVGs
  // used by the dot and related dropdown.
  actionDots.ActionDot = function ActionButton(button) {
    // Connect the generic block class to the behavior definition class.
    actionDots.dotMap[actionDots.mapIndex] = this;
    this.dotIndex = actionDots.mapIndex;
    actionDots.mapIndex += 1;

    this.command = button.command;
    this.label = button.label;
    this.alignment = button.alignment;
    if (this.alignment === undefined) {
      this.alignment = 'S';
    }
    this.tweakx = button.tweakx;
    if (this.tweakx === undefined) {
      this.tweakx = 0;
    }

    this.svgDot = null;
    this.svgDotGroup = null;
    this.svgSubGroup = null;
    this.sub = button.sub;
    this.subShowing = false;

    if (button.alignment === 'L') {
      this.position = actionDots.dotsLeft;
      actionDots.dotsLeft += 1;
    } else if (button.alignment === 'M') {
      this.position = actionDots.dotsMiddle;
      actionDots.dotsMiddle += 1;
    } else if (button.alignment === 'R') {
      this.position = actionDots.dotsRight;
      actionDots.dotsRight += 1;
    }

    this.subDots = [];
    if (this.sub !== undefined) {
      for (var i = 0; i < this.sub.length; i++) {
        this.subDots.push(new actionDots.ActionDot(this.sub[i]));
      }
    }
  };

  // resize adjust al SVGs to match the screen sizePaletteToWindow
  actionDots.resize = function (w, h) {

    // System basically makes room for 10 dots.
    // some from right, some from left, some in the center.
    // Still a bit hard coded.
    var slotw = w * 0.1;
    var edgeSpacing = 7;
    var x = 0;
    var dotd = 66; // diameter

    // Shrink if page is too short or too wide.
    // Need to add width check.
    var scale = editStyle.calcSreenScale(w, h);
    var y = edgeSpacing * scale;
    var half = w / 2 - dotd / 2;
    var mid = half - (actionDots.dotsMiddle + 1) * (slotw / 2);

    // The action-dot class is used for event dispatching. The overall
    // group, but not the the interior items should have this class
    for (var i = 0; i < actionDots.topDots.length; i++) {
      var pos = actionDots.topDots[i].position;
      var align = actionDots.topDots[i].alignment;
      // The action-dot class is used for event dispatching. The overall
      // group, but not the the interior items should have this class
      if (align === 'L') {
        x = slotw * pos + edgeSpacing * 2;
      } else if (align === 'M') {
        x = mid + slotw * (pos + 1);
      } else if (align === 'R') {
        x = w - slotw * pos;
      }
      actionDots.topDots[i].updateSvg(x, y, scale);
    }
  };

  actionDots.setDocTitle = function (newName) {
    if (actionDots.docTitleSVG !== null) {
      actionDots.docTitleSVG.textContent = newName;
    }
  };

  // Create an image for the block base on its type.
  actionDots.ActionDot.prototype.updateSvg = function (x, y, scale) {
    // x and y are top left
    // scale allos for small window (or devics)
    var dotd = 66 * scale; // dot diameter
    var fontSize = 34 * scale;

    // Remove exisiting dot group if it exists
    if (this.svgDotGroup !== null) {
      if (this.svgSubGroup !== null && this.subShowing) {
        actionDots.svgDotParent.removeChild(this.svgSubGroup);
        this.subShowing = false;
      }
      actionDots.svgDotParent.removeChild(this.svgDotGroup);
    }
    // Disconnect reference to inner pieces so GC will clean them up.
    this.svgDotGroup = null;
    this.svgDot = null;
    this.svgText = null;
    this.batteryText = null;
    //this.nameText = null;
    this.svgTextOverlay = null;
    this.svgText2 = null;
    this.dotDiameter = dotd;
    this.dopTop = y;

    var svgDG = svgb.createGroup('action-dot', 0, 0);
    var label = this.label;
    var dotHalf = dotd / 2;
    var fontY = y + dotHalf + fontSize / 3;

    //console.log(dso.robotOnlyPos)
    //Check if character strings are more than one character to create a label on top of the usual label
    if (this.command === 'deviceScanOverlay') {

      // For the connect label put the device name
      var buttonWidth = 170 * scale;
      var buttonLeft = x - buttonWidth - 20;
      var buttonCenter = buttonLeft + 80 * scale;
      //console.log(svgb.createRect)
      //console.log(buttonLeft + 35*scale)
      dso.robotOnlyPos = buttonLeft + 35 * scale;
      this.svgDot = svgb.createRect('action-dot-bg', buttonLeft, y, buttonWidth, dotd, dotHalf);
      this.svgText = svgb.createText('fa fas action-dot-fatext', buttonCenter, fontY, fastr.robot + " -?-");
      this.svgText.setAttribute('id', 'device-name-label');

      this.nameText = svgb.createText('fa fas action-dot-fatext', buttonCenter + buttonWidth / 6, y + dotd * 0.25 + fontSize / 3, "");
      this.nameText.setAttribute('id', 'actual-name-label');

      this.batteryText = svgb.createText('fa fas action-dot-fatext', buttonCenter + buttonWidth / 6, y + dotd * 0.75 + fontSize / 3, "");
      this.batteryText.setAttribute('id', 'battery-label');

      editStyle.setFontSize(this.svgText.style, fontSize * 1);
      editStyle.setFontSize(this.batteryText.style, fontSize * 0.95);
      editStyle.setFontSize(this.nameText.style, fontSize * 0.8);
    } else if (this.label === fastr.file) {
      // For files its the doc icon with letter inside.
      this.svgDot = svgb.createCircle('action-dot-bg', x + dotHalf, y + dotHalf, dotHalf);
      this.svgText = svgb.createText('fa fas action-dot-fatext', x + dotHalf, fontY, label.substring(0, 1));
      this.svgTextOverlay = svgb.createText('action-dot-doc-label', x + dotHalf, fontY, 'A');
      actionDots.docTitleSVG = this.svgTextOverlay;
      editStyle.setFontSize(this.svgText.style, fontSize);
    } else {
      // For simple buttons ther is just one font-awesome icon.
      this.svgDot = svgb.createCircle('action-dot-bg', x + dotHalf, y + dotHalf, dotHalf);
      this.svgText = svgb.createText('fa action-dot-fatext fas', x + dotHalf + this.tweakx, fontY, label);
      editStyle.setFontSize(this.svgText.style, fontSize);
    }

    this.svgDot.setAttribute('id', 'action-dot-' + this.command);
    svgDG.appendChild(this.svgDot);
    svgDG.appendChild(this.svgText);
    if (this.nameText != null) {
      svgDG.appendChild(this.nameText);
    }
    if (this.batteryText !== null) {
      svgDG.appendChild(this.batteryText);
    }
    if (this.svgTextOverlay !== null) {
      svgDG.appendChild(this.svgTextOverlay);
    }
    svgDG.setAttribute('dotIndex', this.dotIndex);
    this.svgDotGroup = svgDG;

    if (this.sub !== undefined) {
      this.svgSubGroup = this.updateDropdownSvg(x, y, dotd, fontSize);
    }

    actionDots.svgDotParent.appendChild(this.svgDotGroup);
  };

  // Open up the drop down menu
  // The SVG tree for the drop down is build and saved for use by the event
  // handlers
  actionDots.ActionDot.prototype.updateDropdownSvg = function (x, y, dotd, fontSize) {

    var spacing = y; // Spacing from the top edge
    var svgSubGroup = svgb.createGroup('action-dot-dropdown', 0, 0);

    var ddWidth = dotd + 2 * spacing;
    // The background for the buttons will be a rounded rect a bit larger than
    // the dots, it wil animate to full length when shown.
    this.subBackBottom = (this.subDots.length + 1) * (dotd + spacing) + spacing;
    this.subBackD = ddWidth;
    this.svgSubBack = svgb.createRect('action-dot-dropdown-bg', x - spacing, y - spacing, ddWidth, ddWidth, ddWidth / 2);

    svgSubGroup.appendChild(this.svgSubBack);

    // Insert the buttons that go on the drop-down
    var dotTop = y;
    for (var i = 0; i < this.subDots.length; i++) {
      // Move down from the dot above
      dotTop += dotd + spacing;
      var subDot = this.subDots[i];
      var svg = subDot.buildSubDot(x, dotTop, y, dotd, fontSize);
      svgSubGroup.appendChild(svg);
    }
    return svgSubGroup;
  };

  actionDots.ActionDot.prototype.buildSubDot = function (x, dotTop, dotTopHide, dotd, fontSize) {
    this.x = x;
    this.dotTop = dotTop; // where ethe dot shoudl be once shown.
    this.dotTopHide = dotTopHide; // where the dot hide.

    var dothalf = dotd / 2;
    var svgDG = svgb.createGroup('action-dot', 0, 0);
    var fontTop = dotTop + dothalf + fontSize / 3;
    this.svgDot = svgb.createCircle('action-dot-bg', x + dothalf, dotTop + dothalf, dothalf);
    this.svgText = svgb.createText('fa action-dot-fatext', x + dothalf, fontTop, this.label);
    editStyle.setFontSize(this.svgText.style, fontSize);

    // ??? What is this ????
    if (this.command === 'copy') {
      //  vgDG.classList.add('copyButton');
    }

    this.svgDot.setAttribute('id', 'action-dot-' + this.command);
    svgDG.appendChild(this.svgDot);
    svgDG.appendChild(this.svgText);
    svgDG.setAttribute('dotIndex', this.dotIndex);
    this.svgDotGroup = svgDG;
    return svgDG;
  };

  actionDots.ActionDot.prototype.activate = function (state) {
    // 0 - Back to normal
    // 1 - Highlight mouse-down/finger-press)
    // 2 - Do it, valid release.
    // 3 - Highlight state with overlay showing.
    // This is way to much of a hack. TODO refactor
    if (this.svgDot === null) {
      return; // Button not setup yet.
    } else if (state === 1) {
      this.svgDot.classList.add('action-dot-active');
    } else if (state === 0 || state === 2) {
      this.svgDot.classList.remove('running');
      this.svgDot.classList.remove('overlay-showing');
      this.svgDot.classList.remove('action-dot-active');
      this.svgText.classList.remove('running');
      if (state === 0 && this.subShowing) {
        this.animateDropDown();
      }
    } else if (state === 3) {
      this.svgDot.classList.add('overlay-showing');
    } else if (state === 5) {
      this.svgDot.classList.add('running');
      this.svgText.classList.add('running');
    }
  };

  actionDots.hideOverlay = function () {
    if (app.overlays.currentShowing !== null) {
      actionDots.activate(app.overlays.currentShowing, 0);
      app.overlays.hideOverlay(null);
    }
  };

  actionDots.ActionDot.prototype.doCommand = function () {
    // Highlight the button hit
    this.activate(2);
    if (this.sub === undefined) {
      // No sub menu, just clear state and do the command even if
      // an overlay is up. This allows run and stop to be pressed
      // while an overlay is up.
      var cmd = this.command;
      actionDots.reset();
      app.doCommand(cmd);
    } else {
      // If it's a pull down the hide any showing overlay first.
      actionDots.hideOverlay();
      this.animateDropDown();
    }
  };

  actionDots.ActionDot.prototype.animateDropDown = function () {
    if (actionDots.isAnimating) return;
    actionDots.isAnimating = true;
    if (!this.subShowing) {
      if (this.sub !== undefined) {
        if (actionDots.currentSubShowing !== null) {
          // Hide other menu if one is up. In this case
          // its OK to do both animations at the same time.
          actionDots.currentSubShowing.subShowing = false;
          actionDots.currentSubShowing.slideDots({ frame: 0, frameEnd: 10 }, false);
          actionDots.currentSubShowing = null;
        }
        // Insert the drop down beneath the dot/
        actionDots.svgDotParent.insertBefore(this.svgSubGroup, this.svgDotGroup);
        actionDots.currentSubShowing = this;
        this.slideDots({ frame: 0, frameEnd: 10 }, true);
      }
      this.subShowing = true;
    } else {
      // Start all the animations that hide buttons.
      this.subShowing = false;
      this.slideDots({ frame: 0, frameEnd: 10 }, false);
      actionDots.currentSubShowing = null;
    }
  };

  // A target location is set for the last dot, each dot will move relative
  // to the position it is in, the background will adjust as well.
  actionDots.ActionDot.prototype.slideDots = function (state, down) {
    var thisDot = this;

    // Based on frame calculate a 0.0 to 1.0 fraction
    var f = state.frame / state.frameEnd;
    if (!down) {
      f = 1.0 - f;
    }

    // Animate the drop down back ground.
    var h = (this.subBackBottom - this.subBackD) * f;
    this.svgSubBack.setAttribute('height', String(this.subBackD + h) + 'px');

    // Animate the dots.
    var numDots = this.subDots.length;
    for (var i = 0; i < numDots; i++) {
      var subDot = this.subDots[i];
      var span = subDot.dotTop - subDot.dotTopHide;
      var dy = -((1.0 - f) * span);
      subDot.svgDotGroup.setAttribute('transform', 'translate(0 ' + dy + ')');
    }
    state.frame += 1;
    if (state.frame <= state.frameEnd) {
      requestAnimationFrame(function () {
        thisDot.slideDots(state, down);
      });
    } else {
      actionDots.isAnimating = false;
      if (!down) {
        actionDots.svgDotParent.removeChild(this.svgSubGroup);
      }
    }
  };

  actionDots.reset = function () {
    // Skip the play button since it takes care of its self.
    // TODO refactor, this is over kill, main need is to reset when overlay
    // is hidden.
    for (var i = 1; i < actionDots.topDots.length; i++) {
      actionDots.topDots[i].activate(0);
    }
  };

  actionDots.activate = function (name, state) {
    var dot = actionDots.commandDots[name];
    if (dot !== undefined) {
      dot.activate(state);
    }
  };

  actionDots.doPointerEvent = function (event) {
    var elt = document.elementFromPoint(event.clientX, event.clientY);
    var t = event.type;
    var adi = actionDots.activeIndex;
    if (elt !== null) {
      var par = elt.parentNode;
      var cdi = par.getAttribute('dotIndex');
      if (t === 'dragend' || t === 'tap') {
        if (cdi === actionDots.activeIndex) {
          // If it is a tap the the release right same location as press.
          actionDots.dotMap[adi].doCommand();
        } else {
          actionDots.dotMap[adi].activate(0);
        }
        actionDots.activeIndex = -1;
      } else if (t === 'dragmove') {
        // Deactivate/Activate when leaving/reentering
        actionDots.dotMap[adi].activate(cdi === adi ? 1 : 0);
      }
    }
  };

  actionDots.defineButtons = function (buttons, svg) {
    actionDots.activeIndex = -1;
    actionDots.svgDotParent = svg;
    // Menu elements will be added at the end, that measn they will
    // be visually in the front. All editor elements will be behind this
    // element.
    var base = svgb.createGroup('action-dot', 0, 0);
    svg.appendChild(base);

    var i = 0;
    for (i = 0; i < buttons.length; i++) {
      var dot = new this.ActionDot(buttons[i]);
      actionDots.topDots.push(dot);
      actionDots.commandDots[dot.command] = dot;
    }

    // Pretty sure there may be an easier way to do this. But in may way interact.js
    // If it simple down and up wiht no move then is come through as a tap.
    // If the pointer/finger moves it is a drag. The drag is better than the move
    // events, since it will return events even once the pointer has moved
    // outside the element.
    // SVG items with the 'action-dot' class will process these events.
    interact('.action-dot', { context: svg }).draggable({}).on('down', function (event) {
      var dotIndex = event.currentTarget.getAttribute('dotIndex');
      actionDots.activeIndex = dotIndex;
      actionDots.dotMap[dotIndex].activate(1);
    }).on('dragmove', function (event) {
      actionDots.doPointerEvent(event);
    }).on('dragend', function (event) {
      actionDots.doPointerEvent(event);
    }).on('tap', function (event) {
      actionDots.doPointerEvent(event);
    });
    return base;
  };

  return actionDots;
}();

},{"../blocks/identityBlocks/identityBlock.js":19,"./../appMain.js":13,"./deviceScanOverlay.js":41,"editStyle.js":50,"fastr.js":51,"interact.js":8,"svgbuilder.js":55}],39:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

  var calibrationOverlay = {};
  var editStyle = require('editStyle.js');
  var app = require('./../appMain.js');
  var overlays = require('./overlays.js');
  var cxn = require('./../cxn.js');
  var dso = require('./deviceScanOverlay.js');

  // External function for putting it all together.
  calibrationOverlay.start = function () {

    overlays.insertHTML('\n\t\t<style id=\'calibration-text-id\'>\n\t\t\tcalibration-text { font-size:18px; }\n\t\t</style>\n\t\t<div id=\'calibrationOverlay\'>\n\t\t\t<div id=\'calibrationDialog\'>\n\t\t\t\t<p class=\'calibration-title\'>Smart Steering Calibration</p>\n\t\t\t\t<p class=\'calibration-body calibration-text\'>Click below to activate Smart Steering Calibration, a PID based system for accurate driving</p>\n\t\t\t\t<!--p id = \'calibration-copy\' class=\'calibration-body calibration-text\'>\xA9 2020 Trashbots. All rights reserved.</p-->\n\t\t\t\t<br>\n\t\t\t<div id=\'calibration-button-area\'>\n\t\t\t\t<button id=\'calibration-activate\' class=\'calibration-button calibration-text\'>Begin calibration!</button>\n\t\t\t</div>\n\t\t\t<br><br>\n\t\t\t<button id=\'calibration-done\' class=\'calibration-button calibration-text\'>Close.</button>\n\t\t\t<br>\n\t\t\t</div>\n\t\t</div>');

    var caliArea = document.getElementById('calibration-button-area');

    if (cxn.connectionStatus(dso.deviceName) !== 3) {
      caliArea.innerHTML = "<p style='font-style: italic;' class='calibration-body calibration-text'>Smart Steering Calibration not supported. Please connect a Trashbot.</p>";
    } else if (!(cxn.versionNumber >= 10)) {
      caliArea.innerHTML = "<p style='font-style: italic;' class='calibration-body calibration-text'>Smart Steering Calibration not supported. Please update Trashbot. Refer to trashbots.co/updating-your-bot for instructions.</p>";
    } else {
      var activateButton = document.getElementById('calibration-activate');
      activateButton.onclick = calibrationOverlay.activate;
    }

    // Exit simply go back to editor.
    var exitButton = document.getElementById('calibration-done');
    exitButton.onclick = calibrationOverlay.hideAbout;
  };

  calibrationOverlay.resize = function () {
    var overlay = document.getElementById('calibrationOverlay');
    var w = overlay.clientWidth;
    var h = overlay.clientHeight;
    var scale = editStyle.calcSreenScale(w, h);

    var fs = 20 * scale + 'px';
    var elts = document.getElementsByClassName("calibration-text");
    var i = 0;
    for (i = 0; i < elts.length; i++) {
      elts[i].style.fontSize = fs;
    }

    var bh = 50 * scale + 'px';
    elts = document.getElementsByClassName("calibration-button");
    for (i = 0; i < elts.length; i++) {
      elts[i].style.height = bh;
    }
  };

  calibrationOverlay.hideAbout = function () {
    overlays.hideOverlay(null);
  };

  calibrationOverlay.activate = function () {
    if (!cxn.calibrated) {
      cxn.calibrated = true;
      var botName = dso.deviceName;
      var message = '(cl)';

      cxn.write(botName, message);
    }
  };

  calibrationOverlay.exit = function () {
    cxn.calibrating = false;
    //overlays.hideOverlay(null);
  };

  calibrationOverlay.showLaunchAboutBox = function () {
    var value = app.storage.getItem('teakBlockShowAboutBox');
    return value === null || value === true;
  };

  return calibrationOverlay;
}();

},{"./../appMain.js":13,"./../cxn.js":34,"./deviceScanOverlay.js":41,"./overlays.js":44,"editStyle.js":50}],40:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// An overlay to see log messages and communications
// between the app and the robot.
module.exports = function () {
  var log = require('log.js');
  var overlays = require('./overlays.js');
  var debugMode = {};

  // External function for putting it all together.
  debugMode.start = function () {

    // Construct the DOM for the overlay.
    overlays.insertHTML('\n      <div id=\'debugOverlay\'>\n        <div id=\'debugLogBackground\'>\n          <div id=\'debugLog\'></div>\n        </div>\n      </div>');

    debugMode.logElement = document.getElementById('debugLog');

    // Start update function.
    debugMode.updateDebug();
  };

  // Update the list of messages show in the display.
  debugMode.updateDebug = function () {
    debugMode.logElement.innerHTML = log.buffer;
    // Erase old text.
    // debugMode.logElement.innerHTML = '';
    // Replace contents with existing list of messages.
    // for(var i = 0; i < cxn.messages.length; i++) {
    //    debugMode.log(cxn.messages[i] + '\n');
    // }

    // Prime the timer again.
    debugMode.timer = setTimeout(function () {
      debugMode.updateDebug();
    }, 2000);
  };

  // Close the overlay.
  debugMode.exit = function () {
    clearTimeout(debugMode.timer);
  };

  return debugMode;
}();

},{"./overlays.js":44,"log.js":53}],41:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// An overlay to see log messages and communications
// between the app and the robot.
module.exports = function () {
  var interact = require('interact.js');
  var fastr = require('fastr.js');
  var tbot = require('tbot.js');
  var icons = require('icons.js');
  var svgb = require('svgbuilder.js');
  var cxn = require('./../cxn.js');
  var overlays = require('./overlays.js');
  var deviceScanOverlay = {};
  var dso = deviceScanOverlay;

  var fullThreshold = (75 + 100) / 2;
  var threeQuartersThreshold = (50 + 75) / 2;
  var halfThreshold = (25 + 50) / 2;
  var oneQuarterThreshold = 25 / 2;

  dso.nonName = "-?-";
  dso.tbots = {};
  dso.deviceName = dso.nonName;

  dso.selectDevice = function (newBotName) {
    // Move the selected name into the object.
    if (typeof newBotName === 'string') {
      dso.updateScreenName(newBotName);
    }
  };

  dso.getBattery = function () {
    var percent = cxn.batteryPercent;
    /*if (dso.deviceName === dso.nonName)
    {
      return ""
    }
    else */if (percent > fullThreshold) {
      return fastr.batteryFull;
    } else if (percent > threeQuartersThreshold) {
      return fastr.batteryThreeQuarters;
    } else if (percent > halfThreshold) {
      return fastr.batteryHalf;
    } else if (percent > oneQuarterThreshold) {
      return fastr.batteryOneQuarter;
    } else {
      return fastr.batteryEmpty;
    }
  };

  dso.updateScreenName = function (botName) {
    dso.deviceName = botName;
    dso.disconnectButton.disabled = dso.deviceName === dso.nonName;
    // console.log(dso.decoratedName())
    // console.log(cxn.versionNumber)
    //dso.deviceName = "vegat"
    if (cxn.versionNumber >= 11 && dso.deviceName !== dso.nonName) {
      dso.deviceNameLabel.innerHTML = fastr.robot;
      dso.deviceNameLabel.setAttribute('x', dso.robotOnlyPos);
      dso.batteryLabel.innerHTML = dso.getBattery();
      dso.actualNameLabel.innerHTML = dso.deviceName;
    } else {
      dso.deviceNameLabel.innerHTML = fastr.robot + ' ' + dso.deviceName;
    }
    //console.log(dso.deviceNameLabel.innerHTML)
  };

  dso.updateLabel = function () {
    dso.scanButton.innerHTML = cxn.scanning ? 'Searching for ' + fastr.robot : 'Search for ' + fastr.robot;
  };

  dso.defaultSettings = function () {
    // Return a new object with settings for the controller.
    return {
      data: {
        // What triggers this chain, mouse click, button, message,...
        start: 'click',
        // Device name
        deviceName: dso.nonName,
        // Connection mechanism
        bus: 'ble'
      },
      // Indicate what controller isx active. This may affect the data format.
      controller: 'target-bt',
      status: 0
    };
  };

  dso.testButton = function (e) {
    if (e.pageX < 60 && e.pageY < 200 && !dso.testBotsShowing) {
      dso.testBotsShowing = true;
      dso.addTestBots();
    } else if (e.pageX < 60 && e.pageY > 250) {
      dso.testBotsShowing = false;
      dso.removeAllBots();
    }
  };

  dso.addTestBots = function () {
    var testNames = ['CUPUR', 'CAPAZ', 'FELIX', 'SADOW', 'NATAN', 'GATON', 'FUTOL', 'BATON', 'FILON', 'CAPON'];
    for (var i in testNames) {
      dso.addNewBlock(testNames[i], 0, icons.t55);
    }
  };

  dso.removeAllBots = function () {
    dso.tbots = {};
    dso.svg.removeChild(dso.tbotGroup);
    dso.tbotGroup = dso.svg.appendChild(svgb.createGroup('', 0, 0));
  };

  dso.testKeyTCount = 0;
  dso.testKeyCCount = 0;
  dso.keyEvent = function (e) {
    if (e.key === 'T') {
      dso.testKeyTCount += 1;
    } else if (e.key === 'C') {
      dso.testKeyCCount += 1;
    } else {
      dso.testKeyTCount = dso.testKeyCCount = 0;
    }
    if (dso.testKeyTCount > 3) {
      dso.addTestBots();
      dso.testKeyTCount = dso.testKeyCCount = 0;
    } else if (dso.testKeyCCount > 3) {
      dso.removeAllBots();
      dso.testKeyTCount = dso.testKeyCCount = 0;
    }
  };

  // External function for putting it all together.
  dso.start = function () {
    document.body.addEventListener('keydown', dso.keyEvent, false);

    // Construct the DOM for the overlay.
    overlays.insertHTML('\n        <div id=\'dsoOverlay\'>\n            <div id=\'dsoSvgShell\' class=\'dso-list-box-shell\'>\n              <svg id=\'dsoSVG\' class= \'dso-svg-backgound\' width=\'100%\' height=\'100%\' xmlns="http://www.w3.org/2000/svg"></svg>\n            </div>\n            <div class=\'dso-botton-bar\'>\n                <button id=\'dsoScan\' class=\'fa fas dso-button\'>\n                LABEL SET BASED ON STATE\n                </button>\n                <button id=\'dsoDisconnect\' class=\'fa fas dso-button\' style=\'float:right\'>\n                Disconnect\n                </button>\n            </div>\n        </div>');

    dso.svg = document.getElementById('dsoSVG');
    dso.background = svgb.createRect('dso-svg-backgound', 0, 0, 20, 20, 0);
    var backgroundGroup = dso.svg.appendChild(svgb.createGroup('', 0, 0));
    backgroundGroup.appendChild(dso.background);

    dso.tbotGroup = dso.svg.appendChild(svgb.createGroup('', 0, 0));

    // build the visuals list
    for (var t in dso.tbots) {
      dso.tbots[t].buildSvg(dso.svg);
    }

    dso.scanButton = document.getElementById('dsoScan');
    dso.scanButton.onclick = dso.onScanButton;
    dso.disconnectButton = document.getElementById('dsoDisconnect');
    dso.disconnectButton.onclick = dso.onDisconnectButton;

    // Backdoor way to change hold duration.
    dso.saveHold = interact.debug().defaultOptions._holdDuration;
    interact.debug().defaultOptions._holdDuration = 2000;
    dso.interact = interact('.dso-svg-backgound', { context: dso.svg }).on('hold', function (e) {
      dso.testButton(e);
    });
    dso.deviceNameLabel = document.getElementById('device-name-label');
    dso.batteryLabel = document.getElementById('battery-label');
    dso.actualNameLabel = document.getElementById('actual-name-label');
    if (!cxn.isBLESupported()) {
      dso.sorryCantDoIt();
    }

    if (!cxn.scanUsesHostDialog()) {
      dso.watch = cxn.connectionChanged.subscribe(dso.refreshList);
      cxn.startScanning();
    }

    dso.updateLabel();
    dso.updateScreenName(dso.deviceName);
  };

  dso.sorryCantDoIt = function () {
    var tb = new tbot.Class(dso.tbotGroup, 100, 20, '-----', icons.sad55);
    dso.tbotGroup = dso.svg.appendChild(svgb.createGroup('', 0, 0));
    var message = 'Cannot access Bluetooth (BLE)';
    dso.tbotGroup.appendChild(svgb.createText('svg-clear tbot-device-name', 450, 95, message));
  };

  dso.nextLocation = function (i) {
    var w = dso.columns;
    var row = Math.floor(i / w);
    var col = i % w;
    return { x: 20 + col * 150, y: 20 + row * 150 };
  };

  dso.pauseResume = function (active) {
    //log.trace('pause-resume', active, '************************************');
  };

  dso.resize = function () {
    // Ran in to problems using HTML layout (via flex layout) so
    // just forcing it right now. Many of these numbers could be
    // calculated.
    var overlay = document.getElementById('dsoOverlay');
    dso.w = overlay.clientWidth;
    dso.h = overlay.clientHeight;
    var svgHeight = dso.h - 95 + 'px';
    document.getElementById('dsoSvgShell').style.height = svgHeight;

    svgb.resizeRect(dso.background, dso.w, dso.h);

    dso.columns = Math.floor((dso.w - 40) / 150);
    var i = 0;
    for (var t in dso.tbots) {
      var loc = dso.nextLocation(i);
      i += 1;
      var tb = dso.tbots[t];
      tb.setLocation(loc.x, loc.y);
    }
  };

  // Close the overlay.
  dso.exit = function () {
    document.body.removeEventListener('keydown', dso.keyEvent, false);

    interact.debug().defaultOptions._holdDuration = dso.saveHold;

    for (var t in dso.tbots) {
      dso.tbots[t].releaseSvg();
    }
    dso.testBotsShowing = false;
    dso.svg = null;
    dso.background = null;
    dso.tbotGroup = null;

    if (cxn.scanning) {
      cxn.stopScanning();
      dso.watch.dispose();
      dso.watch = null;
    }

    var botName = dso.deviceName;
    var message = '(vs)';
    cxn.write(botName, message);
  };

  dso.tryConnect = function (tb) {
    if (cxn.scanUsesHostDialog()) {
      // In Host dialog mode (used on browsers) a direct connection
      // can be made, so just bring up the host scan. That will
      // disconnect any current as well.
      dso.onScanButton();
    } else if (!tb.selected) {
      // Right now only one connection is allowed
      //tb.setConnectionStatus(cxn.statusEnum.CONNECTING);
      cxn.disconnectAll();
      cxn.connect(tb.name);
      dso.selectDevice(tb.name);
    } else {
      // Just clear this one
      // Only one is connected so use the main button.
      cxn.disconnectAll();
    }
  };

  dso.onScanButton = function (e) {
    if (cxn.scanUsesHostDialog()) {
      if (cxn.scanning) {
        cxn.stopScanning();
        dso.watch.dispose();
        dso.watch = null;
      } else {
        dso.onDisconnectButton();
        dso.refreshList(cxn.devices);
        dso.watch = cxn.connectionChanged.subscribe(dso.refreshList);
        cxn.startScanning();
      }
    }
  };

  dso.onDisconnectButton = function () {
    cxn.disconnectAll();
  };

  dso.addNewBlock = function (key, status, face) {
    var loc = dso.nextLocation(Object.keys(dso.tbots).length);
    var tb = new tbot.Class(dso.tbotGroup, loc.x, loc.y, key, face);
    tb.onclick = function () {
      dso.tryConnect(tb);
    };
    tb.setConnectionStatus(status);
    dso.tbots[key] = tb;
    return tb;
  };

  // refreshList() -- rebuilds the UI list based on devices the
  // connection manager knows about.
  dso.refreshList = function (bots) {
    var cxnSelectedBot = dso.nonName;
    for (var key in bots) {
      var status = bots[key].status;
      var tb = dso.tbots[key];
      if (tb !== undefined) {
        tb.setConnectionStatus(status);
      } else {
        tb = dso.addNewBlock(key, status, icons.smile55);
      }
      if (status === cxn.statusEnum.CONNECTED) {
        cxnSelectedBot = key;
      }
    }
    dso.updateLabel();
    dso.updateScreenName(cxnSelectedBot);
  };

  return dso;
}();

},{"./../cxn.js":34,"./overlays.js":44,"fastr.js":51,"icons.js":52,"interact.js":8,"svgbuilder.js":55,"tbot.js":56}],42:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Drive mode overlay allows users to diretly control the motors and other IO.
module.exports = function () {
  var conductor = require('./../conductor.js');
  var overlays = require('./overlays.js');
  var dso = require('./deviceScanOverlay.js');
  var slideControl = require('slideControl.js');
  // var chart = require('chart.js');
  var dov = {};

  dov.start = function () {

    overlays.insertHTML("<svg id='driveOverlay' xmlns='http://www.w3.org/2000/svg'></svg>");

    //  This will cause iPhone to drag the screen<div>
    //    <canvas id="myChart" style="position:absolute; top:100px; left:250px;" width="400" height="200"></canvas>
    //  </div>

    dov.svg = document.getElementById('driveOverlay');
    dov.lSlide = new slideControl.Class(dov.svg, 'L');
    dov.rSlide = new slideControl.Class(dov.svg, 'R');

    //dov.chartSetup();
    dov.sendValuesToBot();
  };

  /*
  dov.chartSetup = function() {
     // console.log('hack a chart');
     var ctx = document.getElementById('myChart').getContext('2d');
     ctx.canvas.width = 400;
     ctx.canvas.height = 200;
      // The X axis is catagory based not linear. This allows points to be added
     // without the need to change X
     let bufferWidth = 50;
     var x1Points = [];
     var x2Points = [];
     var xLabels = [];
     for (var x = 0; x <  bufferWidth; x++) {
       x1Points.push((x % 10) * 10);
       x2Points.push((x % 5) * -10);
       xLabels.push('');
     }
      // Add end points, that can be used but the x axis.
     xLabels[2] = 'xMin';
     xLabels[bufferWidth-1] = 'xMax';
      // Notice the scaleLabel at the same level as Ticks
     var options = {
       scales: {
                 xAxes: [{ gridLines: { lineWidth: 3 } }],
                 yAxes: [{
                     gridLines: { lineWidth: 2 },
                     ticks: {
                         beginAtZero:true,
                     },
                     scaleLabel: {
                          display: true,
                          labelString: 'Moola',
                          fontSize: 20
                       }
                 }]
             }
     };
      var data2 = {
           labels: xLabels,
           datasets: [{
               label: "M1",
               fill: false,
               lineTension: 0,
               pointRadius: 0,
               data: x1Points,
             }, {
               label: "M2",
               fill: false,
               lineTension: 0,
               pointRadius: 0,
               data: x2Points,
             }
           ]
         };
      var opt2 = {
         // animation: false,
         animation: { easing:'linear' },
         scales: {
           yAxes: [{
             ticks: {
               min: -100,
               max: 100
             }
           }],
           xAxes: [{
             ticks: {
               display: false,
               min: 'xMin',
               max: 'xMax'
             }
           }]
         }
     };
      dov.chart = new Chart(ctx, {
       type: 'line',
       data: data2,
     options: opt2});
     dov.chart.canvas.style.height = '400px';
     dov.chart.canvas.style.width = '600px';
  };
  */

  dov.resize = function () {
    var t = dov;
    t.w = t.svg.clientWidth;
    t.h = t.svg.clientHeight;

    // Clear out the old.
    while (t.svg.lastChild) {
      t.svg.removeChild(t.svg.lastChild);
    }

    var w = t.w;
    var h = t.h;
    t.scaleH = 1.0;
    t.scaleW = 1.0;
    if (w < 500) {
      if (w < 200) {
        w = 200;
      }
      t.scaleW = w / 500;
    }

    if (h < 500) {
      if (h < 200) {
        h = 200;
      }
      t.scaleH = h / 500;
    }

    var top = 100 * t.scaleH;
    var width = 120 * Math.min(t.scaleH, t.scaleW);
    var gwHalf = width / 2;
    var gInsetW = 80 * t.scaleW;

    t.lSlide.buildSvg(gInsetW + gwHalf, width, top, h, t.scaleH);
    t.rSlide.buildSvg(w - gInsetW - gwHalf, width, top, h, t.scaleH);
  };

  dov.chartUpdate = function () {
    var v1 = dov.lSlide.vvalue.value;
    var v2 = dov.rSlide.vvalue.value;
    console.log('updateChart');
    dov.chart.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
      dataset.data.push(v1);
    });
    dov.chart.update();
  };

  dov.sendValuesToBot = function () {
    var id = dso.deviceName;
    var t = dov;

    if (id !== null && id !== dso.nonName) {
      //console.log(t.lSlide.vvalue.value);
      if (t.lSlide.vvalue.value !== 0) {
        var message2 = '(m:1 d:' + -t.lSlide.vvalue.value + ');';
        conductor.cxn.write(id, message2);
      }
      if (t.rSlide.vvalue.value !== 0) {
        var message1 = '(m:2 d:' + -t.rSlide.vvalue.value + ');';
        conductor.cxn.write(id, message1);
      }
      t.lSlide.vvalue.sync();
      t.rSlide.vvalue.sync();
    }
    /*
        var accel = document.getElementsByClassName("drive-accelerometer")[0];
        accel.innerHTML = "Accelerometer:" + cxn.accelerometer;
    
        var compass = document.getElementsByClassName("drive-compass")[0];
        compass.innerHTML = "Compass:" + cxn.compass;
    
        var temp = document.getElementsByClassName("drive-temperature")[0];
        temp.innerHTML = "Temperature:" + cxn.temp;
    */
    dov.timer = setTimeout(function () {
      // dov.updateChart();
      dov.sendValuesToBot();
    }, 50);
  };

  // Close the dov overlay.
  dov.exit = function () {
    clearTimeout(dov.timer);
  };

  return dov;
}();

},{"./../conductor.js":33,"./deviceScanOverlay.js":41,"./overlays.js":44,"slideControl.js":54}],43:[function(require,module,exports){
'use strict';

/*

Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// An overlay to see access saved and sample programs
/* Theory of operation
  I core challenge is how to come up with simple/meaningful identifers for the
  many programs authored. The programs are pictures so the first approximation
  is to use picture.

  Hypothesis - programs come in two comon forms:
  >  adhoc, simple demos, easy to remake, standalone
  >  more thoght out parts for a bigger plan.

  For the adhoc simple test, the ide is to treat these a bit more like
  photographs. There is no for a name. The program its self is the identifier
  If a user can thumb through recent programs that is simple than having to make
  up a name for each one. Most programs.



  For the work sheet. Two key operation
  <new> save the current one and show a new sheet.
  <clear> wipe the current workspace.
  <snapshot> take a picture of the current work and let me continue woring.
   this fit the photograph model.

  <record> future perhasp alwasy on, let you roll back any time you want.
*/
module.exports = function () {

  var fileOverlay = {};
  var overlays = require('./overlays.js');

  fileOverlay.saveCamera = document.getElementById('saveCamera');

  // External function for putting it all together.
  fileOverlay.start = function () {

    // Construct the DOM for the overlay.
    overlays.overlayShell.innerHTML = '\n      <div id=\'debugLogBackground\'>\n        <div id=\'debugLog\'></div>\n      </div>';
  };

  // Close the overlay.
  fileOverlay.exit = function () {};

  // Get an canvas image of the curret screen.
  // TODO save in medium size perahsp 1/4 scale, for a regualr screen that is
  // 1/16 the storeac, then show smaller thumb nails. on hover the thumb nail
  // can be magnified.

  fileOverlay.mockLocalStorage = {
    getItem: function getItem(key) {
      return null;
    },
    setItem: function setItem(key, value) {},
    key: function key(index) {
      return null;
    }
  };

  fileOverlay.localStorage = function () {
    if (typeof window.localStorage !== 'undefined') {
      // If localStoarge exists then use it directly.
      return window.localStorage;
    } else {
      return fileOverlay.mockLocalStorage;
    }
  };

  fileOverlay.cameraFlash = function () {
    fileOverlay.saveCamera.className = 'cameraFlash';
    setTimeout(function () {
      fileOverlay.saveCamera.className = 'cameraIdle';
    }, 1000);

    // add picture, animate to folder
  };

  fileOverlay.snapShot = function () {
    // Create a SVG string by joining the serialized form with a header.
  };

  return fileOverlay;
}();

},{"./overlays.js":44}],44:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var log = require('log.js');
  var editStyle = require('editStyle.js');
  var overlays = {};

  overlays.currentShowing = null;
  overlays.currentIsClosing = false;
  overlays.isAnimating = false;
  overlays.afterCommand = null;

  // External function for putting it all together.
  overlays.init = function () {

    overlays.overlayLayer = document.getElementById('overlayLayer');
    overlays.overlay = null;

    window.addEventListener("resize", overlays.resize, false);
    overlays.overlayLayer.addEventListener("webkitAnimationEnd", overlays.endAnimation);
    overlays.overlayLayer.addEventListener("animationend", overlays.endAnimation);

    var screens = {};
    screens.driveOverlay = require('./driveOverlay.js');
    screens.debugOverlay = require('./debugOverlay.js');
    screens.deviceScanOverlay = require('./deviceScanOverlay.js');
    screens.fileOverlay = require('./fileOverlay.js');
    screens.splashOverlay = require('./splashOverlay.js');
    screens.calibrationOverlay = require('./calibrationOverlay.js');
    overlays.screens = screens;

    return overlays;
  };

  overlays.insertHTML = function (overlayHTML) {
    var body = '\n    <div id=\'overlayRoot\' style=\'top:80px; height:calc(100% - 80px);\'>\n      <div id=\'overlayShell\' >' + overlayHTML + '\n      </div>\n    </div>';
    overlays.overlayLayer.innerHTML = body;
    overlays.overlayShell = document.getElementById('overlayShell');
  };

  overlays.resize = function () {
    var root = document.getElementById('overlayRoot');
    if (root === null) return;

    var w = window.innerWidth;
    var h = window.innerHeight;
    var scale = editStyle.calcSreenScale(w, h);

    var tstr = (scale * 80).toString() + 'px';
    var hstr = "calc(100% - " + tstr + ")";
    root.style.height = hstr;
    root.style.top = tstr;

    if (overlays.currentShowing !== null) {
      //var message = 'olv:' + overlays.currentShowing + ' size:(' + w + ', ' + h + ') scale:' + scale;
      //log.trace(message);

      var resize = overlays.screens[overlays.currentShowing].resize;
      if (typeof resize === 'function') {
        resize(w, h);
      }
    }
  };

  overlays.showOverlay = function (name) {

    if (overlays.currentShowing !== null) return;
    var o = overlays.screens[name];
    overlays.currentShowing = name;

    // Build the HTML for the overlay and start the animation.
    overlays.overlayLayer.innerHTML = '';
    o.start();
    overlays.resize();
    overlays.overlayShell.classList.add('fullScreenSlideIn');
    overlays.isAnimating = true;
  };

  overlays.hideOverlay = function (afterCommand) {
    if (overlays.currentShowing !== null) {
      overlays.currentIsClosing = true;
      overlays.screens[overlays.currentShowing].exit();
      overlays.currentShowing = null;
      overlays.afterCommand = afterCommand;
      if (overlays.overlayShell !== null) {
        overlays.overlayShell.classList.remove('fullScreenSlideIn');
        overlays.overlayShell.classList.add('fullScreenSlideOut');
        overlays.isAnimating = true;
      }
    }
  };

  overlays.endAnimation = function () {
    var afterCommand = overlays.afterCommand;
    overlays.afterCommand = null;
    overlays.isAnimating = false;

    if (overlays.currentIsClosing === true) {
      // On close, clean up state.
      overlays.currentIsClosing = false;
      overlays.overlayLayer.innerHTML = '';
      overlays.overlayShell = null;
    }
    if (afterCommand !== null) {
      afterCommand();
    }
  };

  overlays.pauseResume = function (active) {
    if (overlays.currentShowing !== null) {
      var pr = overlays.screens[overlays.currentShowing].pauseResume;
      if (typeof pr === 'function') {
        pr(active);
      }
    }
  };

  return overlays;
}();

},{"./calibrationOverlay.js":39,"./debugOverlay.js":40,"./deviceScanOverlay.js":41,"./driveOverlay.js":42,"./fileOverlay.js":43,"./splashOverlay.js":45,"editStyle.js":50,"log.js":53}],45:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Drive mode overlay allows users to diretly control the motors and other IO.
module.exports = function () {

  var splashOverlay = {};
  var editStyle = require('editStyle.js');
  var app = require('./../appMain.js');
  var overlays = require('./overlays.js');

  // External function for putting it all together.
  splashOverlay.start = function () {

    overlays.insertHTML('\n        <style id=\'splash-text-id\'>\n          splash-text { font-size:18px; }\n        </style>\n        <div id=\'splashOverlay\'>\n            <div id=\'splashDialog\'>\n              <p class=\'splash-title\'>TBlocks</p>\n              <p id = \'splash-about\' class=\'splash-body splash-text\'>A block sequencing tool for interactive programming.</p>\n              <p id = \'splash-copy\' class=\'splash-body splash-text\'>\xA9 2020 Trashbots. All rights reserved.</p>\n              <br>\n            <div>\n                <button id=\'splash-done\' class=\'splash-button splash-text\'>OK</button>\n                <br><br>\n                <button id=\'splash-reset\' class=\'splash-button splash-text\'>Clear all.</button>\n            </div>\n            <br>\n            </div>\n        </div>');

    // Append version to description.
    var v = document.getElementById('splash-about');
    v.textContent = v.textContent + ' Version ' + app.buildFlags.version;

    // Exit simply go back to editor.
    var exitButton = document.getElementById('splash-done');
    exitButton.onclick = splashOverlay.hideAbout;

    // Reset - clear all pages so students can go back to the origianl state.
    // often for the next student.
    var resetButton = document.getElementById('splash-reset');
    resetButton.onclick = splashOverlay.resetApp;
  };

  splashOverlay.resize = function () {
    var overlay = document.getElementById('splashOverlay');
    var w = overlay.clientWidth;
    var h = overlay.clientHeight;
    var scale = editStyle.calcSreenScale(w, h);

    var fs = 20 * scale + 'px';
    var elts = document.getElementsByClassName("splash-text");
    var i = 0;
    for (i = 0; i < elts.length; i++) {
      elts[i].style.fontSize = fs;
    }

    var bh = 50 * scale + 'px';
    elts = document.getElementsByClassName("splash-button");
    for (i = 0; i < elts.length; i++) {
      elts[i].style.height = bh;
    }
  };

  splashOverlay.hideAbout = function () {
    overlays.hideOverlay(null);
  };

  splashOverlay.resetApp = function () {
    app.tbe.clearAllBlocks();
    app.defaultFiles.setupDefaultPages(true);
    overlays.hideOverlay(null);
  };

  splashOverlay.exit = function () {};

  splashOverlay.showLaunchAboutBox = function () {
    var value = app.storage.getItem('teakBlockShowAboutBox');
    return value === null || value === true;
  };

  return splashOverlay;
}();

},{"./../appMain.js":13,"./overlays.js":44,"editStyle.js":50}],46:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

  var log = require('log.js');
  var assert = require('assert');
  var interact = require('interact.js');
  var teakText = require('./teaktext.js');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  var trashBlocks = require('./trashBlocks.js');
  var fblocks = require('./fblock-settings.js');
  var teakselection = require('./teakselection');
  var actionDots = require('./overlays/actionDots.js');
  var conductor = require('./conductor.js');
  var app = require('./appMain.js');

  var tbe = {};

  tbe.fblocks = fblocks;
  tbe.diagramBlocks = {};
  tbe.paletteBlocks = {};
  tbe.blockIdSequence = 100;
  tbe.currentDoc = 'docA';
  tbe.currentUndoIndex = 0;
  tbe.stopUndo = false;
  tbe.draggingSelectionArea = null;
  tbe.defaultBlockLoc = [40, 120];
  tbe.identityIndent = 120;

  // Visitor for each block in the diagram
  tbe.forEachDiagramBlock = function (callBack) {
    for (var key in tbe.diagramBlocks) {
      if (tbe.diagramBlocks.hasOwnProperty(key)) {
        var block = tbe.diagramBlocks[key];
        if ((typeof block === 'undefined' ? 'undefined' : _typeof(block)) === 'object') {
          callBack(block);
        }
      }
    }
  };

  // Visitor for each block in the palette
  tbe.forEachPalette = function (callBack) {
    for (var key in tbe.paletteBlocks) {
      if (tbe.paletteBlocks.hasOwnProperty(key)) {
        var block = tbe.paletteBlocks[key];
        if ((typeof block === 'undefined' ? 'undefined' : _typeof(block)) === 'object') {
          callBack(block);
        }
      }
    }
  };

  // Visitor that finds the head of each chain.
  tbe.forEachDiagramChain = function (callBack) {
    tbe.forEachDiagramBlock(function (block) {
      if (block.prev === null) {
        callBack(block);
      }
    });
  };

  // Clear any semi modal state
  tbe.clearStates = function clearStates(block) {
    // Clear any showing forms or multi step state.
    // If the user has interacted with a general part of the editor.
    actionDots.reset();
    app.overlays.hideOverlay(null);
    this.components.blockSettings.hide(block);
    tbe.forEachDiagramBlock(function (b) {
      b.markSelected(false);
    });
  };

  tbe.init = function init(svg, ceiling) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.svg = svg;
    this.svgCeiling = ceiling;
    this.background = svgb.createRect('editor-background', 0, 0, 20, 20, 0);
    this.svg.insertBefore(this.background, this.svgCeiling);
    this.configInteractions();
    interact.maxInteractions(Infinity);

    teakselection.init(tbe);

    return this;
  };

  tbe.elementToBlock = function (el) {
    var text = el.getAttribute('interact-id');
    if (text === null) {
      log.trace('svg elt had no id:', el);
      return null;
    }
    var values = text.split(':');
    var obj = null;
    if (values[0] === 'd') {
      obj = this.diagramBlocks[text];
    } else if (values[0] === 'p') {
      obj = this.paletteBlocks[text];
    }
    if (obj === undefined) {
      obj = null;
    }
    if (obj === null) {
      log.trace('block not found, id was <', text, '>');
    }
    return obj;
  };

  tbe.clearAllBlocks = function () {
    tbe.clearStates();
    trashBlocks(tbe);
  };

  tbe.saveCurrentDoc = function () {
    var currentDocText = teakText.blocksToText(tbe.forEachDiagramChain);
    app.storage.setItem(tbe.currentDoc, currentDocText);
  };

  tbe.loadDoc = function (docName) {
    // If they are actully switching then load the new one.
    if (tbe.currentDoc !== docName) {
      tbe.clearStates();
      tbe.clearDiagramBlocks();
      tbe.currentDoc = docName;
      var loadedDocText = app.storage.getItem(docName);
      if (loadedDocText !== null) {
        teakText.textToBlocks(tbe, loadedDocText);
      }
      actionDots.setDocTitle(docName.substring(3, 4));
    }
  };

  tbe.nextBlockId = function (prefix) {
    var blockId = prefix + String(tbe.blockIdSequence);
    tbe.blockIdSequence += 1;
    return blockId;
  };

  tbe.addBlock = function (x, y, name) {
    var block = new this.FunctionBlock(x, y, name);
    block.isPaletteBlock = false;
    block.interactId = tbe.nextBlockId('d:');
    this.diagramBlocks[block.interactId] = block;
    return block;
  };

  tbe.addPaletteBlock = function (x, y, name, pgroup) {
    var block = new this.FunctionBlock(x, y, name);
    block.pgroup = pgroup;
    block.isPaletteBlock = true;
    block.interactId = tbe.nextBlockId('p:');
    this.paletteBlocks[block.interactId] = block;

    // Looks like blocks are added to main editor, so it is removed
    // then added to the palette. Odd...
    tbe.svg.removeChild(block.svgGroup);
    if (block.rect.right + 30 > tbe.width) {
      block.svgGroup.setAttribute('class', 'drag-group hiddenPaletteBlock');
    }
    tbe.tabGroups[pgroup].appendChild(block.svgGroup);

    return block;
  };

  // Delete a chunk of blocks (typically one).
  tbe.deleteChunk = function (block, endBlock) {

    // Remember any tail so it can be slid over.
    var tail = endBlock.next;
    var head = block.prev;

    // Disconnect the chunk from its surroundings.
    if (head !== null) {
      head.next = tail;
    }
    if (tail !== null) {
      tail.prev = head;
    }
    block.prev = null;
    endBlock.next = null;

    // Now that the chunk has been disconnected, measure it.
    var deleteWidth = block.chainWidth;
    var tempBlock = null;

    if (block.flowTail === endBlock && !block.isGroupSelected()) {
      tbe.clearStates();
      if (block.prev !== null) {
        block.next.prev = block.prev;
      } else {
        block.next.prev = null;
      }
      block.next = null;

      if (endBlock.next !== null) {
        endBlock.prev.next = endBlock.next;
      } else {
        endBlock.prev.next = null;
      }
      endBlock.prev = null;

      delete tbe.diagramBlocks[block.interactId];

      tbe.svg.removeChild(block.svgGroup);
      block.svgGroup = null;
      block.svgRect = null;
      block.next = null;
      block.prev = null;

      delete tbe.diagramBlocks[endBlock.interactId];

      tbe.svg.removeChild(endBlock.svgGroup);
      endBlock.svgGroup = null;
      endBlock.svgRect = null;
      endBlock.next = null;
      endBlock.prev = null;
    } else {
      // Delete the chunk.
      tbe.clearStates();

      while (block !== null) {
        tempBlock = block.next; // Make a copy of block.next before it becomes null
        // Remove map entry for the block.
        delete tbe.diagramBlocks[block.interactId];

        tbe.svg.removeChild(block.svgGroup);
        block.svgGroup = null;
        block.svgRect = null;
        block.next = null;
        block.prev = null;

        block = tempBlock;
      }
    }

    // Slide any remaining blocks over to the left.
    // The links have already been fixed.
    if (tail !== null) {
      tbe.animateMove(tail, tail.last, -deleteWidth, 0, 10);
    }
  };

  tbe.deleteBlock = function () {};

  // Copy a chunk or the rest of the chain, and return the copy.
  // The section specified should not have links to parts outside.
  tbe.replicateChunk = function (chain, endBlock, offsetX, offsetY) {

    this.clearStates(); //???

    var stopPoint = null;
    if (endBlock !== undefined && endBlock !== null) {
      // This might be null as well.
      stopPoint = endBlock.next;
    }

    var newChain = null;
    var newBlock = null;
    var b = null;

    // Copy the chain of blocks and set the newBlock field.
    b = chain;
    while (b !== stopPoint) {
      newBlock = new this.FunctionBlock(b.left + offsetX, b.top + offsetY, b.name);
      b.newBlock = newBlock;
      if (newChain === null) {
        newChain = newBlock;
      }

      // TODO can params and controller settings be combined?
      //newBlock.params = JSON.parse(JSON.stringify(b.params));
      newBlock.controllerSettings = JSON.parse(JSON.stringify(b.controllerSettings));
      newBlock.isPaletteBlock = false;
      newBlock.interactId = tbe.nextBlockId('d:');
      this.diagramBlocks[newBlock.interactId] = newBlock;
      b = b.next;
    }
    // Fix up pointers in the new chain.
    b = chain;
    while (b !== stopPoint) {
      newBlock = b.newBlock;
      newBlock.next = b.mapToNewBlock(b.next);
      newBlock.prev = b.mapToNewBlock(b.prev);
      newBlock.flowHead = b.mapToNewBlock(b.flowHead);
      newBlock.flowTail = b.mapToNewBlock(b.flowTail);
      b = b.next;
    }
    // Clear out the newBlock field, and fix up svg as needed.
    b = chain;
    while (b !== stopPoint) {
      var temp = b.newBlock;
      b.newBlock = null;
      b = b.next;
      temp.fixupChainCrossBlockSvg();
    }

    // Update images in the new chain.
    b = newChain;
    while (b !== null) {
      b.updateSvg();
      b = b.next;
    }

    // Return pointer to head of new chain.
    return newChain;
  };

  //------------------------------------------------------------------------------
  // FunctionBlock -- Constructor for FunctionBlock object.
  //
  //      *-- svgGroup
  //        |
  //        *--- custom graphics for bloc (clear to pointer)
  //        |
  //        *--- svgRect framing rec common to all blocks
  //        |
  //        *--- [svgCrossBlock] option behind block region graphics
  //
  tbe.FunctionBlock = function FunctionBlock(x, y, blockName) {

    // Connect the generic block class to the behavior definition class.
    this.name = blockName;
    this.funcs = fblocks.bind(blockName);
    if (typeof this.funcs.defaultSettings === 'function') {
      this.controllerSettings = this.funcs.defaultSettings();
    } else {
      this.controllerSettings = { controller: 'none', data: 4 };
    }

    // Place holder for sequencing links.
    this.prev = null;
    this.next = null;
    this.flowHead = null;
    this.flowTail = null;

    // Blocks at the top level have a nesting of 0.
    this.nesting = 0;
    this.newBlock = null;

    // Dragging state information.
    this.dragging = false;
    this.snapTarget = null; // Object to append, prepend, replace
    this.snapOpen = { // Object for snapping to the grid
      top: null,
      left: null
    };
    this.snapAction = null; // append, prepend, replace, ...
    this.targetShadow = null; // Svg element to hilite target location

    // Create the actual SVG object.
    // It's a group of two pieces:
    // a rounded rect and a group that holds the custom graphics for the block.
    var width = this.controllerSettings.width;
    if (width === undefined) {
      width = 70;
    }
    this.rect = {
      left: 0,
      top: 0,
      right: width,
      bottom: 80
    };
    this.svgGroup = svgb.createGroup('drag-group', 0, 0);
    if (blockName.startsWith('identity')) {
      this.svgRect = icons.paletteBlockIdentity(1, 'function-block identity-block', 0, 0, width);
    } else {
      this.svgRect = icons.paletteBlock(1, 'function-block', 0, 0, this);
    }
    this.svgGroup.appendChild(this.svgRect);
    this.svgCustomGroup = null; // see updateSvg()
    this.updateSvg();

    // Position block, relative to its initial location at (0, 0).
    this.dmove(x, y, true);

    // Add block to the editor tree. This makes it visible.
    this.moveToFront();
  };

  tbe.FunctionBlock.prototype.isStartBlock = function () {
    // This works for now.
    return this.name.startsWith('identity');
  };

  // Create an image for the block base on its type.
  tbe.FunctionBlock.prototype.updateSvg = function () {

    // Remove the old custom image if they exist.
    if (this.svgCustomGroup !== null) {
      this.svgGroup.removeChild(this.svgCustomGroup);
    }

    // Build custom image for this block.
    this.svgCustomGroup = svgb.createGroup('', 0, 0);
    if (typeof this.funcs.svg === 'function') {
      this.funcs.svg(this.svgCustomGroup, this);
    }

    // Add it to doc's SVG tree.
    this.svgGroup.appendChild(this.svgCustomGroup);
  };

  // Checks if block passed in is in the same chain as this.
  tbe.FunctionBlock.prototype.chainContainsBlock = function (other) {
    // Block is the first block of the chain.
    var block = this.first;
    // Go through the whole chain and look for if any blocks same as other.
    while (block !== null) {
      // If a similarity is found, return true.
      if (block === other) {
        return true;
      }
      block = block.next;
    }
    // If no blocks that were the same were found, return false.
    return false;
  };

  tbe.FunctionBlock.prototype.refreshNesting = function () {
    var nesting = 0;
    var b = this.first;
    while (b !== null) {
      if (b.flowTail !== null) {
        b.nesting = nesting;
        nesting += 1;
      } else if (b.flowHead !== null) {
        nesting -= 1;
        b.nesting = nesting;
      } else {
        b.nesting = nesting;
      }
      b = b.next;
    }
  };

  // Scan down the chain and allow any block that has cross block graphics
  // to update them.
  tbe.FunctionBlock.prototype.fixupChainCrossBlockSvg = function () {
    // TODO, only refresh nesting when the links actually change.
    // no need to do it during each animation step.
    this.refreshNesting();
    var b = this;
    while (b !== null) {
      if (typeof b.funcs.crossBlockSvg === 'function') {
        b.funcs.crossBlockSvg(b);
      }
      b = b.next;
    }
  };

  Object.defineProperty(tbe.FunctionBlock.prototype, 'first', {
    get: function get() {
      var block = this;
      while (block.prev !== null) {
        block = block.prev;
      }
      return block;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'last', {
    get: function get() {
      var block = this;
      while (block.next !== null) {
        block = block.next;
      }
      return block;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'chainWidth', {
    get: function get() {
      var block = this;
      var width = 0;
      while (block !== null) {
        width += block.rect.right - block.rect.left;
        block = block.next;
      }
      return width;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'top', {
    get: function get() {
      return this.rect.top;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'left', {
    get: function get() {
      return this.rect.left;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'bottom', {
    get: function get() {
      return this.rect.bottom;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'right', {
    get: function get() {
      return this.rect.right;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'width', {
    get: function get() {
      return this.rect.right - this.rect.left;
    } });

  Object.defineProperty(tbe.FunctionBlock.prototype, 'height', {
    get: function get() {
      return this.rect.bottom - this.rect.top;
    } });

  // Example of an object property added with defineProperty with an accessor property descriptor
  Object.defineProperty(tbe.FunctionBlock.prototype, 'interactId', {
    get: function get() {
      return this.svgRect.getAttribute('interact-id');
    },
    set: function set(id) {
      this.svgGroup.setAttribute('interact-id', id);
      this.svgRect.setAttribute('interact-id', id);
    }
  });

  // mapToNewBlock -- uUed by replicateChunk to fix up pointers in a
  // copied chain.
  tbe.FunctionBlock.prototype.mapToNewBlock = function (object) {
    if (object === undefined || object === null) {
      return null;
    } else {
      return object.newBlock;
    }
  };

  // Mark all block in the chain starting with 'this' block as being dragged.
  // Disconnect from the previous part of the chain.
  tbe.FunctionBlock.prototype.setDraggingState = function (state) {
    // If this block is in a chain, disconnect it from blocks in front.
    if (state && this.prev !== null) {
      this.prev.next = null;
      this.prev = null;
    }
    // Set the state of all blocks down the chain.
    var block = this;
    while (block !== null) {
      block.dragging = state;
      // block.hilite(state);
      block = block.next;
    }
  };

  tbe.FunctionBlock.prototype.moveToFront = function () {
    // TODO moving to the front interrupts (prevents) the animations.
    //tbe.svg.removeChild(this.svgGroup);
    tbe.svg.insertBefore(this.svgGroup, tbe.svgCeiling);
  };

  tbe.FunctionBlock.prototype.markSelected = function (state) {
    if (state) {
      this.moveToFront();
      this.svgRect.classList.add('selected-block');
      if (this.flowHead !== null) {
        this.flowHead.svgRect.classList.add('selected-block');
      }
      if (this.flowTail !== null) {
        this.flowTail.svgRect.classList.add('selected-block');
      }
    } else {
      this.svgRect.classList.remove('selected-block');
    }
  };

  tbe.FunctionBlock.prototype.isSelected = function () {
    return this.svgRect.classList.contains('selected-block');
  };

  // For a selected block find the last in the selected set.
  tbe.FunctionBlock.prototype.selectionEnd = function () {
    var block = this;
    while (block.next !== null && block.next.isSelected()) {
      block = block.next;
    }
    return block;
  };

  tbe.FunctionBlock.prototype.isLoopHead = function () {
    return this.flowTail !== null;
  };

  tbe.FunctionBlock.prototype.isLoopTail = function () {
    return this.flowHead !== null;
  };

  tbe.FunctionBlock.prototype.isCommented = function () {
    return this.svgRect.classList.contains('commented');
  };

  tbe.FunctionBlock.prototype.isIdentity = function () {
    return this.name.includes('identity');
  };

  // Checks if a selected loop is the only thing selected.
  tbe.FunctionBlock.prototype.isIsolatedLoop = function () {
    if (this.isLoopHead() && this.isSelected()) {
      if (this.prev !== null && this.prev.isSelected()) {
        return false;
      } else if (this.flowTail.next !== null && this.flowTail.next.isSelected()) {
        return false;
      } else if (this.next !== this.flowTail && this.next.isSelected()) {
        return false;
      }
    }
    if (this.isLoopTail() && this.isSelected()) {
      if (this.next !== null && this.next.isSelected()) {
        return false;
      } else if (this.flowHead.prev !== null && this.flowHead.prev.isSelected()) {
        return false;
      } else if (this.prev !== this.flowHead && this.prev.isSelected()) {
        return false;
      }
    }
    if (!this.isLoopHead() && !this.isLoopTail()) {
      return false;
    }
    if (!this.isSelected()) {
      return false;
    }
    return true;
  };

  // Determine if the block is part of selection that is more than one block
  tbe.FunctionBlock.prototype.isGroupSelected = function () {
    var before = false;
    var after = false;
    if (this.next !== null) {
      before = this.next.isSelected();
    }
    if (this.prev !== null) {
      after = this.prev.isSelected();
    }
    return this.isSelected() && (before || after);
  };

  tbe.FunctionBlock.prototype.isOnScreen = function () {
    if (this.rect !== null) {
      if (this.rect.left + this.width >= 0 && this.rect.right - this.width <= tbe.width) {
        if (this.rect.top + this.height >= 0 && this.rect.bottom - this.height <= tbe.height) {
          return true;
        }
      }
    }
    return false;
  };

  // Change the element class to trigger CSS changes.
  tbe.FunctionBlock.prototype.hilite = function (state) {
    // TODO looks like there is more than one bring to front
    // unify the function and give it a better name.
    if (state) {
      // Bring highlighted block to top. Blocks don't normally
      // overlap, so Z plane is not important. But blocks that are
      // being dragged need to float above ones on the diagram.
      this.moveToFront();
    }
  };

  // Move a section of a chain by a delta (x, y) (from this to endBlock)
  tbe.FunctionBlock.prototype.dmove = function (dx, dy, snapToInt, endBlock) {
    var block = this;
    if (endBlock === undefined) {
      endBlock = null;
    }

    while (block !== null) {
      var r = block.rect;
      r.left += dx;
      r.top += dy;
      r.right += dx;
      r.bottom += dy;
      if (snapToInt) {
        // Final locations are forced to integers for clean serialization.
        r.top = Math.round(r.top);
        r.left = Math.round(r.left);
        r.bottom = Math.round(r.bottom);
        r.right = Math.round(r.right);
      }

      if (block.svgGroup) {
        svgb.translateXY(block.svgGroup, r.left, r.top);
      }

      if (block === endBlock) {
        break;
      }
      block = block.next;
    }
  };

  //------------------------------------------------------------------------------
  // Calculate the intersecting area of two rectangles.
  tbe.intersectingArea = function intersectingArea(r1, r2) {
    var x = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left);
    if (x < 0) return 0;
    var y = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
    if (y < 0) {
      return 0;
    }
    return x * y;
  };

  tbe.FunctionBlock.prototype.hilitePossibleTarget = function () {
    var self = this;
    var target = null;
    var overlap = 0;
    var bestOverlap = 0;
    var action = null;
    var rect = null;
    var thisWidth = this.width;

    // Look at every diagram block taking into consideration
    // whether or not it is in the chain.
    tbe.forEachDiagramBlock(function (entry) {
      if (entry !== self && !entry.dragging) {
        rect = {
          top: entry.top,
          bottom: entry.bottom,
          left: entry.left - thisWidth * 0.5,
          right: entry.right - thisWidth * 0.5
        };
        if (entry.prev === null) {
          // For left edge, increase gravity field
          rect.left -= thisWidth * 0.5;
        }
        if (entry.next === null) {
          // For right edge, increase gravity field
          rect.right += thisWidth * 1.5;
        }

        overlap = tbe.intersectingArea(self.rect, rect);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          target = entry;
        }
      }
    });

    // Refine the action based on geometery.
    if (target !== null) {
      if (self.left <= target.left) {
        if (target.prev !== null) {
          if (!self.isStartBlock()) {
            action = 'insert';
          }
        } else {
          if (!target.isStartBlock()) {
            action = 'prepend';
          }
        }
      } else if (!self.name.includes('identity')) {
        action = 'append';
      }
    }

    var shadowX = null;
    var shadowY = null;
    var gridsize = 40;

    if (action === null) {
      action = 'outsnap';
      if (target !== null) {
        var diff = target.rect.bottom - this.rect.top;
        shadowX = Math.round((this.rect.top + diff) / gridsize) * gridsize;
        shadowY = Math.round(this.rect.left / gridsize) * gridsize;
        target = null;
      }
    }

    if (shadowX === null && shadowY === null) {
      shadowX = Math.round(this.rect.top / gridsize) * gridsize;
      shadowY = Math.round(this.rect.left / gridsize) * gridsize;
    }

    // Update shadows as needed.
    if (this.snapTarget !== target || this.snapAction !== action) {
      if (this.snapTarget !== null) {
        this.removeTargetShadows();
      }
      this.snapTarget = target;
      this.snapAction = action;
      if (target !== null) {
        this.insertTargetShadows(target, action);
      }
    } else if (action === 'outsnap' && (this.snapOpen.top !== shadowX || this.snapOpen.left !== shadowY || this.snapAction !== action)) {
      this.removeTargetShadows();
      this.snapAction = action;
      this.snapOpen = {
        top: shadowX,
        left: shadowY
      };

      this.insertTargetShadows(this.snapOpen, action);
    }
    return target;
  };

  // Show the shadow blocks to indicate where the blocks will end up if placed
  // in the current location.
  tbe.FunctionBlock.prototype.insertTargetShadows = function (target, action) {
    var block = this;
    var y = target.top;
    var x = 0;
    if (action === 'prepend') {
      x = target.left - this.chainWidth;
    } else if (action === 'insert') {
      // The shadows will be covered up, and not going to move the
      // down stream blocks until the move is committed.
      // so offset them a bit.
      // TODO show above OR based on where dragging blocks are coming from.
      x = target.left - 20;
      y -= 25;
    } else if (action === 'append') {
      x = target.right;
    } else if (action === 'outsnap') {
      var gridsize = 40;
      x = gridsize * Math.round(this.rect.left / gridsize);
      y = gridsize * Math.round(this.rect.top / gridsize);
    } else {
      return;
    }
    var shadow = null;
    while (block !== null) {
      if (action === 'outsnap') {
        shadow = icons.paletteBlock(1, 'shadow-block shadow-block-outsnap', x, y, block); //svgb.createRect('shadow-block shadow-block-outsnap', x, y, block.width, block.height, 10);
      } else {
        shadow = icons.paletteBlock(1, 'shadow-block', x, y, block); //svgb.createRect('shadow-block', x, y, block.width, block.height, 10);
      }
      tbe.svg.insertBefore(shadow, tbe.background.nextSibling);

      block.targetShadow = shadow;
      x += block.width;
      block = block.next;
    }
  };

  tbe.FunctionBlock.prototype.removeTargetShadows = function () {
    var block = this;
    var shadowsToRemove = [];
    while (block !== null) {
      var shadow = block.targetShadow;
      if (shadow !== null) {
        shadowsToRemove.push(shadow);
        if (block.snapAction === 'outsnap') {
          shadow.setAttribute('class', 'shadow-block-leave shadow-block-leave-outsnap');
        } else {
          shadow.setAttribute('class', 'shadow-block-leave');
        }
        block.targetShadow = null;
      }
      block = block.next;
    }
    // Give some time for the animation to complete, then remove.
    setTimeout(function () {
      shadowsToRemove.forEach(function (elt) {
        if (elt.parentNode !== null) {
          tbe.svg.removeChild(elt);
        }
      });
    }, 1000);
    var shadows = document.getElementsByClassName('shadow-block');
    for (var i = shadows.length - 1; i >= 0; i--) {
      shadows[i].parentNode.removeChild(shadows[i]);
    }
  };

  tbe.FunctionBlock.prototype.moveToPossibleTarget = function () {
    var thisLast = this.last;
    var targx = 0;
    var dx = 0;
    var dy = 0;
    assert(this.prev === null, 'err1');
    assert(thisLast.next === null, 'err2');

    if (this.snapTarget !== null) {
      // TODO:assert that chain we have has clean prev/next links
      // Append/Prepend the block(chain) to the list
      if (this.snapAction === 'prepend') {
        assert(this.snapTarget.prev === null, 'err3');
        targx = this.snapTarget.left - this.chainWidth;
        thisLast.next = this.snapTarget;
        this.snapTarget.prev = thisLast;
      } else if (this.snapAction === 'append') {
        assert(this.snapTarget.next === null, 'err4');
        targx = this.snapTarget.right;
        this.prev = this.snapTarget;
        this.snapTarget.next = this;
        // slide down post blocks if insert
        // logically here, in annimation bellow
      } else if (this.snapAction === 'insert') {
        assert(this.snapTarget.prev !== null, 'err5');
        targx = this.snapTarget.left;
        // Determin space needed for new segment
        // before its spliced in.
        var width = this.chainWidth;

        thisLast.next = this.snapTarget;
        this.prev = this.snapTarget.prev;
        this.snapTarget.prev.next = this;
        this.snapTarget.prev = thisLast;

        // Set up animation to slide down old blocks.
        tbe.animateMove(this.snapTarget, this.snapTarget.last, width, 0, 10);
      }

      // Set up an animation to move the dragging blocks to new location.
      dx = targx - this.left;
      dy = this.snapTarget.top - this.top;
      // The model snaps directly to the target location
      // but the view eases to it.
      tbe.animateMove(this, thisLast, dx, dy, 10);
    } else if (this.snapOpen !== null) {
      dx = Math.round(this.snapOpen.left - this.rect.left);
      dy = Math.round(this.snapOpen.top - this.rect.top);
      tbe.animateMove(this, thisLast, dx, dy, 10);
    } else {
      // Nothing to snap to so leave it where is ended up.
      // still need sound though
      // tbe.audio.drop.play();
    }
    this.hilite(false);
    this.snapTarget = null;
    this.snapAction = null;
    this.snapOpen = {
      top: null,
      left: null
    };
  };

  // animateMove -- move a chunk of block to its new location. The prev and next
  // links should already be set up for the final location.
  tbe.animateMove = function (firstBlock, lastBlock, dx, dy, frames) {
    var state = {
      frame: frames,
      adx: dx / frames,
      ady: dy / frames,
      chunkStart: firstBlock,
      chunkEnd: lastBlock
    };
    tbe.animateMoveCore(state);
  };

  tbe.animateMoveCore = function (state) {
    var frame = state.frame;
    state.chunkStart.dmove(state.adx, state.ady, frame === 1, state.chunkEnd);
    state.chunkStart.fixupChainCrossBlockSvg();
    if (frame > 1) {
      state.frame = frame - 1;
      requestAnimationFrame(function () {
        tbe.animateMoveCore(state);
      });
    } else {
      // Once animation is over shadows are covered, remove them.
      tbe.audio.playSound(tbe.audio.shortClick);
      state.chunkStart.removeTargetShadows();
    }
  };

  tbe.clearDiagramBlocks = function clearDiagramBlocks() {
    tbe.internalClearDiagramBlocks();
  };
  tbe.internalClearDiagramBlocks = function clearDiagramBlocks() {
    tbe.forEachDiagramBlock(function (block) {
      tbe.svg.removeChild(block.svgGroup);
      block.svgGroup = null;
      block.svgCustomGroup = null;
      block.svgRect = null;
      block.next = null;
      block.prev = null;
    });
    tbe.diagramBlocks = {};
  };

  // Find a selected block on the diragram. There should only
  // be one set of blocks selected.
  tbe.findSelectedChunk = function findSelectedChunk() {
    var selected = null;
    tbe.forEachDiagramBlock(function (block) {
      if (selected === null && block.isSelected()) {
        selected = block;
      }
    });
    return selected;
  };

  // Starting at a block that was clicked on find the logical range that
  // should be selected, typically that is the selected block to the end.
  // But for flow blocks it more subtle.
  tbe.findChunkStart = function findChunkStart(clickedBlock) {
    var chunkStart = clickedBlock;
    while (chunkStart.isSelected()) {
      if (chunkStart.prev !== null && chunkStart.prev.isSelected()) {
        chunkStart = chunkStart.prev;
      } else {
        break;
      }
    }
    // Scan to end see if a flow tail is found.
    /*var b = chunkStart;
    while (b !== null) {
      // If tail found inlcude the whole flow block.
      if (b.flowHead !== null) {
        chunkStart = b.flowHead;
      }
      // If at the top its a clean place to break the chain.
      if (b.nesting === 0) {
        break;
      }
      b = b.next;
    }*/
    return chunkStart;
  };
  // Finds the block before where a block can be placed (end of chain)
  // Used when block is dropped by tapping on palette
  tbe.findInsertionPoint = function findInsertionPoint() {
    var foundBlock = null;
    var defaultX = Math.round(tbe.defaultBlockLoc[0]);
    var defaultY = Math.round(tbe.defaultBlockLoc[1]);

    // Find the block at the default location
    tbe.forEachDiagramBlock(function (block) {
      var top = block.top;
      var left = block.left;
      if (top === defaultY && left === defaultX) {
        foundBlock = block;
      }
    });
    // Go find the end of the chain with foundBlock as the start
    while (foundBlock !== null && foundBlock.next !== null) {
      foundBlock = foundBlock.next;
    }
    return foundBlock;
  };
  // Places variable block after the the insertion point
  tbe.autoPlace = function autoPlace(block) {
    var foundBlock = tbe.findInsertionPoint();
    block = tbe.replicateChunk(block, null, 0, 0);
    var x = tbe.defaultBlockLoc[0];
    var y = tbe.defaultBlockLoc[1];
    var dx = Math.round(x - block.left);
    var dy = Math.round(y - block.top);

    if (foundBlock !== null && block.isIdentity()) {
      block.dmove(dx, dy);
      tbe.identityAutoPlace(block);
      return;
    }

    // Check if a chain currently exists
    // If one exists, move the block next to it
    if (foundBlock === null) {
      block.dmove(dx, dy);
    } else {
      block.dmove(dx + foundBlock.right - x, dy);
      foundBlock.next = block;
      block.prev = foundBlock;
    }
  };

  tbe.identityAutoPlace = function identityAutoPlace(block) {
    tbe.forEachDiagramBlock(function (compare) {
      //console.log("compare", tbe.intersectingArea(compare, block));
      if (tbe.intersectingArea(compare, block) > 100 && compare !== block && block.bottom + 120 < tbe.height - 150) {
        block.dmove(0, 120);
        tbe.identityAutoPlace(block);
        return;
      } else if (block.bottom + 120 > tbe.height - 100) {
        tbe.deleteChunk(block, block);
      }
    });
  };

  tbe.keyEvent = function (e) {
    e = e || window.event;

    // Browsers report keys code differently, check both.
    var key = e.which || e.keyCode || 0;

    // Look for control modifier
    var ctrl = e.ctrlKey ? e.ctrlKey : key === 17;

    if (key === 86 && ctrl) {
      log.trace("Ctrl + V Pressed !");
    } else if (key === 67 && ctrl) {
      log.trace("Ctrl + C Pressed !");
      var array = [];
      tbe.forEachDiagramBlock(function (block) {
        if (block.isSelected()) {
          array.push(block);
        }
      });
      var textArea = document.createElement("textarea");

      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = 0;
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      if (array.length >= 0) {
        textArea.value = teakText.chunkToText(tbe.findChunkStart(array[0]), null, '');
        log.trace(textArea);
        document.body.appendChild(textArea);
        textArea.select();

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          log.trace('Copying text command was ' + msg);
        } catch (err) {
          log.trace('Oops, unable to copy');
        }
      }

      document.body.removeChild(textArea);
    } else if (key === 8) {
      if (tbe.components.blockSettings.isOpen()) {
        tbe.components.blockSettings.deleteGroup();
      } else {
        var sBlock = tbe.findSelectedChunk();
        if (sBlock !== null) {
          tbe.deleteChunk(sBlock, sBlock.selectionEnd());
        }
      }
    } else if (key === 49) {
      tbe.loadDoc('docA');
    } else if (key === 50) {
      tbe.loadDoc('docB');
    } else if (key === 51) {
      tbe.loadDoc('docC');
    } else if (key === 52) {
      tbe.loadDoc('docD');
    } else if (key === 53) {
      tbe.loadDoc('docE');
    } else if (key === 80) {
      conductor.playAll();
    } else if (key === 83) {
      conductor.stopAll();
    } else if (key === 88) {
      var cloneBlocks = [];
      tbe.forEachDiagramBlock(function (block) {
        if (block.isSelected()) {
          cloneBlocks.push(block);
        }
      });
      if (cloneBlocks.length !== 0) {
        var clone = tbe.replicateChunk(cloneBlocks[0], cloneBlocks[cloneBlocks.length - 1], 0, 0);

        // TODO put it in a non-hardcoded place
        var dy = -140;
        if (clone.top < 140) {
          dy = 140;
        }
        tbe.animateMove(clone, clone.last, 0, dy, 20);
      }
    } else if (ctrl && key === 65) {
      var selected = null;
      tbe.forEachDiagramBlock(function (block) {
        if (block.isSelected()) {
          selected = block;
        }
      });

      tbe.clearStates();

      while (selected.next !== null) {
        selected.markSelected(true);
        selected = selected.next;
      }
      while (selected !== null) {
        selected.markSelected(true);
        selected = selected.prev;
      }
    }
  };

  document.body.addEventListener("keydown", tbe.keyEvent, false);

  // Attach these interactions properties based on the class property of the DOM elements
  tbe.configInteractions = function configInteractions() {
    var thisTbe = tbe;

    // Most edit transaction start from code dispatched from this code.
    // Know it well and edit with caution. There are subtle interaction states
    // managed in these event handlers.
    interact('.drag-delete').on('down', function () {
      var block = thisTbe.elementToBlock(event.target);
      if (block === null) return;
      thisTbe.clearStates();
      thisTbe.deleteChunk(block, block.last);
    });

    // Pointer events to the background go here. Might make sure the event is not
    // right next to a block, e.g. allow some safe zones.
    interact('.editor-background').on('down', function (event) {
      try {
        thisTbe.clearStates();
        teakselection.startSelectionBoxDrag(event);
      } catch (error) {
        log.trace('exception in drag selection');
      }
    });

    // Event directed to function blocks (SVG objects with class 'drag-group')
    // These come in two main types: pointer events(mouse, track, and touch) and
    // drag events. Drag events start manually, if the semantics of the pointer
    // event indicate that makes sense. Note that the object at the root of the
    // drag event may differ from the object the pointer event came to.
    // For example, dragging may use the head of a flow block, not the tail that was
    // clicked on or that chain dragged might be a copy of the block clicked on.
    //
    // After making change test on FF, Safari, Chrome, desktop and tablet. Most
    // browser breaking behaviour differences have been in this code.

    interact('.drag-group')
    // Pointer events.
    .on('down', function (event) {
      tbe.pointerDownObject = event.target;
    }).on('tap', function (event) {
      var block = thisTbe.elementToBlock(event.target);
      if (block !== null && block.isPaletteBlock) {
        // Tapping on an palette item will place it on the sheet.
        tbe.autoPlace(block);
      } else {
        // Tapping on diagram block brings up a config page.
        actionDots.reset();
        thisTbe.components.blockSettings.tap(block);
      }
    }).on('up', function (event) {
      var block = thisTbe.elementToBlock(event.target);
      if (block.rect.top > tbe.height - 100 && !block.isPaletteBlock) {
        event.interaction.stop();
        block.setDraggingState(false);
        if (block.isLoopHead()) {
          block.next.markSelected(true);
          block.markSelected(true);
          tbe.deleteChunk(block, block.last);
        } else if (block.isLoopTail()) {
          tbe.deleteChunk(block.flowHead, block.last);
        } else {
          tbe.deleteChunk(block, block.last);
        }
      }
    }).on('move', function (event) {
      try {
        var interaction = event.interaction;
        var block = thisTbe.elementToBlock(event.target);
        if (block.name === 'tail') {
          block = block.flowHead;
        }
        // If the pointer was moved while being held down
        // and an interaction hasn't started yet...
        if (interaction.pointerIsDown && !interaction.interacting()) {
          if (tbe.pointerDownObject === event.target) {
            block = tbe.findChunkStart(block);
            var targetToDrag = block.svgGroup;
            var notIsolated = block.next !== null && block.prev !== null;
            var next = block;
            var prev = block;
            if (block.nesting > 0 && notIsolated && !block.isGroupSelected()) {
              next = block.next;
              prev = block.prev;
              block.next.prev = prev;
              block.prev.next = next;
              block.next = null;
              block.prev = null;
              if (next !== null) {
                tbe.animateMove(next, next.last, -block.width, 0, 10);
              }
            } else if (block.nesting > 0 && notIsolated && block.isGroupSelected()) {
              next = block;
              prev = block.prev;
              while (next.next !== null && next.next.isSelected()) {
                next = next.next;
              }
              var nextCopy = next.next;
              next.next.prev = prev;
              prev.next = next.next;
              next.next = null;
              block.prev = null;
              if (next !== null) {
                tbe.animateMove(nextCopy, nextCopy.last, -block.chainWidth, 0, 10);
              }
            }

            // If coming from palette, or if coming from shift drag...
            if (block.isPaletteBlock || event.shiftKey) {
              var offsetX = 0;
              var offsetY = 0;
              if (block.isPaletteBlock) {
                var pageRect = event.target.getBoundingClientRect();
                offsetX = pageRect.x - block.left;
                offsetY = pageRect.y - block.top;
              }
              block = thisTbe.replicateChunk(block, null, offsetX, offsetY);
              targetToDrag = block.svgGroup;
            }

            // Start a drag interaction targeting the clone.
            block.setDraggingState(true);

            tbe.clearStates();
            interaction.start({ name: 'drag' }, event.interactable, targetToDrag);
          }
        } else {
          tbe.pointerDownObject = null;
        }
      } catch (error) {
        log.trace('Exception in move event', error);
      }
    }).draggable({
      manualStart: true, // Drag wont start until initiated by code.
      restrict: {
        restriction: thisTbe.svg,
        endOnly: true,
        // Restrictions, by default, are for the point not the whole object
        // so R and B are 1.x to include the width and height of the object.
        // 'Coordinates' are percent of width and height.
        elementRect: { left: -0.2, top: -0.2, right: 1.2, bottom: 2.4 }
        // TODO bottom needs to exclude the palette.
      },
      inertia: {
        resistance: 20,
        minSpeed: 50,
        endSpeed: 1
      },
      max: Infinity,
      onstart: function onstart() {},
      onend: function onend(event) {
        var block = thisTbe.elementToBlock(event.target);
        if (block === null) return;

        if (block.dragging) {
          // If snap happens in coastin-move
          // the chain will no longer be dragging.
          block.moveToPossibleTarget();
          block.setDraggingState(false);
        }

        tbe.moveToFront(block, tbe.dropAreaGroup);
      },
      onmove: function onmove(event) {
        // Since there is inertia these callbacks continue to
        // happen after the user lets go.

        var block = thisTbe.elementToBlock(event.target);
        if (block === null) return;
        if (!block.dragging) {
          // If snap happens in coasting-move
          // the chain will no longer be dragging.
          return;
        }

        // Puts the blocks being dragged at the top
        tbe.moveToFront(block, tbe.svgCeiling);

        // Move the chain to the new location based on deltas.
        block.dmove(event.dx, event.dy, true);

        // Then see if there is a possible target, a place to snap to.
        var target = block.hilitePossibleTarget();

        // If there is a target and its in the coasting phase then redirect
        // the coasting to the target.
        if (target !== null) {
          var iStatus = event.interaction.inertiaStatus;
          if (iStatus !== undefined && iStatus !== null && iStatus.active) {
            // Its in the coasting state, just move it to the snapping place.
            block.moveToPossibleTarget();
            block.setDraggingState(false);
          }
        }
      }
    });
  };

  tbe.moveToFront = function (blockChain, ceiling) {
    var temp = blockChain;
    while (temp !== null) {
      //  tbe.svg.append(temp.svgGroup);
      tbe.svg.insertBefore(temp.svgGroup, ceiling);
      temp = temp.next;
    }
  };

  tbe.blocksOnScreen = function () {
    var toReturn = false;
    tbe.forEachDiagramBlock(function (block) {
      if (block.isOnScreen()) {
        toReturn = true;
      }
    });
    if (Object.keys(tbe.diagramBlocks).length === 0) {
      return false;
    }
    return toReturn;
  };

  tbe.sizePaletteToWindow = function sizePaletteToWindow() {
    var w = tbe.width;
    var h = tbe.height;

    svgb.resizeRect(tbe.background, w, h);
    tbe.windowRect = { left: 0, top: 0, right: w, bottom: h };

    var scale = 1.0;
    if (h < 250) {
      scale = 250 / 500;
    } else if (h < 500) {
      scale = h / 500;
    }

    //var top = h - 90;
    var paletteHeight = h - 100 * scale;
    svgb.translateXY(tbe.dropAreaGroup, 0, paletteHeight);
    for (var i = 0; i < tbe.dropAreaGroup.childNodes.length; i++) {
      var tab = tbe.dropAreaGroup.childNodes[i];
      var r = tab.childNodes[0];
      svgb.resizeRect(r, w / scale, 100);
      var scalestr = 'scale(' + scale + ')';
      tab.setAttribute('transform', scalestr);
    }
  };

  tbe.createTabSwitcherButton = function () {
    var group = svgb.createGroup('tabSwitcher', 0, 0);
    var circle = svgb.createCircle('tabSwitcherRing', 50, 50, 40, 0);
    group.appendChild(circle);
    return group;
  };

  tbe.buildTabs = function () {
    var dropAreaGroup = svgb.createGroup('dropAreaGroup', 0, 0);
    var names = ['Start', 'Action', 'Control'];
    for (var i = 0; i < 3; i++) {
      var group = svgb.createGroup('', 0, 0);
      var className = 'area' + String(i + 1);
      var rect = svgb.createRect('dropArea ' + className, 0, 0, tbe.width, 100, 0);
      var tab = svgb.createRect('dropArea ' + className, 10 + 160 * i, -30, 150, 40, 5);
      var text = svgb.createText('dropArea svg-clear', 20 + 160 * i, -10, names[i]);
      group.appendChild(rect);
      group.appendChild(tab);
      group.appendChild(text);
      dropAreaGroup.appendChild(group);
    }

    interact('.dropArea').on('down', function (event) {
      var group = event.target.parentNode.getAttribute('group');
      tbe.switchTabs(group);
    });

    this.svg.insertBefore(dropAreaGroup, tbe.svgCeiling);
    this.dropAreaGroup = dropAreaGroup;

    tbe.tabGroups = [];
    tbe.tabGroups['start'] = tbe.dropAreaGroup.childNodes[0];
    tbe.tabGroups['fx'] = tbe.dropAreaGroup.childNodes[1];
    tbe.tabGroups['control'] = tbe.dropAreaGroup.childNodes[2];

    // For event routing.
    tbe.tabGroups['start'].setAttribute('group', 'start');
    tbe.tabGroups['fx'].setAttribute('group', 'fx');
    tbe.tabGroups['control'].setAttribute('group', 'control');
  };

  tbe.switchTabs = function (group) {
    // This moves the tab background to the front.
    this.clearStates();
    var tab = tbe.tabGroups[group];
    this.dropArea = tab;
    tbe.dropAreaGroup.appendChild(tab);
    tbe.showTabGroup(group);
  };

  tbe.showTabGroup = function (group) {
    tbe.forEachPalette(function (block) {
      if (block.pgroup === group) {
        block.svgGroup.setAttribute('class', 'drag-group');
      } else {
        block.svgGroup.setAttribute('class', 'hiddenPaletteBlock');
      }
    });
  };

  tbe.resize = function () {
    // This is the logical size (used by SVG, etc) not retina pixels.
    tbe.width = window.innerWidth;
    tbe.height = window.innerHeight;
    // First resize palette and background then resize the action buttons
    tbe.sizePaletteToWindow();
    actionDots.resize(tbe.width, tbe.height);
  };

  tbe.addPalette = function (palette) {
    var leftIndent = 30;
    var indent = leftIndent;
    var increment = 30;
    var lastGroup = 'start';

    tbe.buildTabs();

    var blocks = palette.blocks;
    var blockTop = 10; //tbe.height - 90;
    for (var index = 0; index < blocks.length; index++) {
      var name = blocks[index].name;
      var pgroup = blocks[index].group;
      if (pgroup !== lastGroup) {
        indent = leftIndent;
        increment = 15;
        lastGroup = pgroup;
      }
      var block = this.addPaletteBlock(indent, blockTop, name, pgroup);

      if (name === 'loop') {
        // The loop is two blocks, needs a little special work here.
        var blockTail = this.addPaletteBlock(block.right, blockTop, 'tail', 'control');
        block.next = blockTail;
        blockTail.prev = block;
        // A flow block set has direct pointers between the two end points.
        block.flowTail = blockTail;
        blockTail.flowHead = block;
        blockTail.fixupChainCrossBlockSvg();
      }
      indent += block.chainWidth + increment;
    }

    tbe.switchTabs('start');
    // dropAreaGroup.appendChild(tbe.createTabSwitcherButton());
  };

  return tbe;
}();

},{"./appMain.js":13,"./conductor.js":33,"./fblock-settings.js":36,"./overlays/actionDots.js":38,"./teakselection":47,"./teaktext.js":48,"./trashBlocks.js":49,"assert":58,"icons.js":52,"interact.js":8,"log.js":53,"svgbuilder.js":55}],47:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var tbSelecton = {};

  // The selection region has a minimum dimension so it can be seen when it is
  // first created, especially on a touch based device.
  var minDim = 20;
  tbSelecton.selectionSvg = null;
  tbSelecton.currentChain = null;

  tbSelecton.init = function (tbe) {
    tbSelecton.tbe = tbe;
    tbSelecton.interactable = interact(".selection-rect").draggable({
      manualStart: true, // Drag won't start until initiated by code.
      max: Infinity,
      onstart: function onstart(event) {
        // Move the selection rectangle to its initial location.
        tbSelecton.x0 = event.clientX;
        tbSelecton.y0 = event.clientY;
        svgb.translateXY(tbSelecton.selectionSvg, event.clientX, event.clientY);
        tbSelecton.currentChain = null;
      },
      onend: function onend() {
        // Remove the selection rectangle
        if (tbSelecton.selectionSvg !== null) {
          tbe.svg.removeChild(tbSelecton.selectionSvg);
          tbSelecton.selectionSvg = null;
          tbSelecton.currentChain = null;
        }
      },
      onmove: function onmove(event) {
        // Determine the top left and the width height based on the pointer
        // location.
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;
        if (event.clientX < tbSelecton.x0) {
          left = event.clientX;
          width = tbSelecton.x0 - event.clientX;
        } else {
          left = tbSelecton.x0;
          width = event.clientX - tbSelecton.x0;
        }
        if (event.clientY < tbSelecton.y0) {
          top = event.clientY;
          height = tbSelecton.y0 - event.clientY;
        } else {
          top = tbSelecton.y0;
          height = event.clientY - tbSelecton.y0;
        }
        width += minDim;
        height += minDim;
        // clientX, clientY reflect the current location.
        // clientX0, clientY0 reflect the initial location at start.
        svgb.translateXY(tbSelecton.selectionSvg, left, top);
        svgb.resizeRect(tbSelecton.selectionSvg, width, height);
        var rect = {
          left: left,
          top: top,
          right: left + width,
          bottom: top + height
        };
        tbSelecton.checkForSelectedBlocks(rect, tbe);
      }
    });
  };

  tbSelecton.startSelectionBoxDrag = function (event) {

    // If a selection is already under way, ignore a second one. This can happen
    // on touch devices.
    if (tbSelecton.selectionSvg !== null) return;

    // Create a selection rectangle and give it a minimum width.
    // place it just above the background so it is behind all blocks.
    var offset = -minDim / 2;
    tbSelecton.selectionSvg = svgb.createRect('selection-rect', offset, offset, minDim, minDim, 5);
    tbSelecton.tbe.svg.insertBefore(tbSelecton.selectionSvg, tbSelecton.tbe.background.nextSibling);

    // Start interacting with the rectangle. This give the rectangle the focus
    // for all events until the pointer is let up.
    event.interaction.start({ name: 'drag' }, tbSelecton.interactable, tbSelecton.selectionSvg);
  };

  // Adds and removes the class for a selected block based on position and order of selection.
  tbSelecton.checkForSelectedBlocks = function (rect, tbe) {
    var intersecting = [];
    // Extend selection to include complete loops where needed.
    tbe.forEachDiagramBlock(function (block) {
      if (tbe.intersectingArea(rect, block.rect) > 0) {
        intersecting.push(block);
        var tempBlock = block;
        if (block.isLoopHead()) {
          while (tempBlock !== null) {
            intersecting.push(tempBlock);
            if (tempBlock === block.flowTail) break;
            tempBlock = tempBlock.next;
          }
        } else if (block.isLoopTail()) {
          while (tempBlock !== null && !tempBlock.isLoopHead()) {
            intersecting.push(tempBlock);
            if (tempBlock === block.flowHead) break;
            tempBlock = tempBlock.prev;
          }
        }
      }
    });

    // If nothing is in the selection area, then clear the intersecting array.
    if (intersecting.length === 0) {
      tbSelecton.currentChain = null;
      intersecting = [];
    } else if (tbSelecton.currentChain === null) {
      // If nothing is in currentChain, then put in the first selected block.
      tbSelecton.currentChain = tbe.findChunkStart(intersecting[0]);
    }
    // If the block is in intersecting array and it is in the currentChain, select it. Otherwise, deselect it.
    tbe.forEachDiagramBlock(function (block) {
      if (intersecting.includes(block) && tbSelecton.currentChain.chainContainsBlock(block)) {
        block.markSelected(true); //tbe.intersectingArea(rect, block.rect) > 0
      } else if (block.flowHead !== null && !intersecting.includes(block.flowHead)) {
        block.markSelected(false);
      } else if (block.flowHead === null) {
        block.markSelected(false);
      }
    });
  };

  return tbSelecton;
}();

},{"interact.js":8,"svgbuilder.js":55}],48:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var log = require('log.js');
  var teak = require('teak');
  var teakText = {};

  //------------------------------------------------------------------------------
  teakText.blocksToText = function (blockChainIterator) {
    var text = '(\n';
    var indentText = '  ';
    blockChainIterator(function (block) {
      text += indentText + '(chain';
      text += ' x:' + block.left + ' y:' + block.top + ' (\n';
      text += teakText.chunkToText(block, null, indentText + '  ');
      text += indentText + '))\n';
    });

    text += ')\n';
    return text;
  };

  teakText.chunkToText = function (chunkStart, chunkEnd, indentText) {
    var block = chunkStart;
    var text = '';
    while (block !== chunkEnd) {
      text += indentText + '(' + block.name;
      if (block.controllerSettings !== null) {
        text += ' ' + teakText.blockParamsToText(block.controllerSettings.data);
      }
      if (block.flowTail !== null) {
        // If it is nesting, then recurse with a bit of indentation.
        text += ' (\n';
        text += teakText.chunkToText(block.next, block.flowTail, indentText + '  ');
        block = block.flowTail;
        text += indentText + ')';
      }
      text += ')\n';
      block = block.next;
    }
    return text;
  };

  teakText.blockParamsToText = function blockParamsToText(params) {
    var text = '';
    var spaceSeparator = '';
    for (var propertyName in params) {
      var value = params[propertyName];
      text += spaceSeparator + propertyName + ':' + this.valueToText(value);
      spaceSeparator = ' ';
    }
    return text;
  };

  teakText.valueToText = function (value) {
    var text = '';
    if (value.constructor === Array) {
      var spaceSeparator = '';
      var index = 0;
      text = '(';
      for (index = 0; index < value.length; index += 1) {
        text += spaceSeparator + this.valueToText(value[index]);
        spaceSeparator = ' ';
      }
      text += ')';
    } else if (typeof value === 'string') {
      text = "'" + String(value) + "'";
    } else {
      text = String(value);
    }
    return text;
  };

  //------------------------------------------------------------------------------
  teakText.textToBlocks = function (tbe, text) {
    var state = {};
    // Visitor pattern may be better, a lot better.
    var teakJSO = teak.parse(text, state, function (name) {
      return name;
    });
    teakText.loadJsoTeak(tbe, teakJSO);
  };

  teakText.loadJsoTeak = function (tbe, jsoTeak) {
    if (Array.isArray(jsoTeak)) {
      var i = 0;
      for (i = 0; i < jsoTeak.length; i++) {
        var jsoChain = jsoTeak[i];
        if (jsoChain._0 !== 'chain') {
          log.trace(' unrecognized chain section');
          return;
        } else {
          var x = jsoChain.x;
          var y = jsoChain.y;
          var jsoChainBlocks = jsoChain._3;
          var chain = teakText.loadJsoTeakBlocks(tbe, jsoChainBlocks, x, y, null);

          // Refresh the graphics in each block in the chain.
          var block = chain;
          while (block !== null) {
            block.updateSvg();
            block = block.next;
          }
          chain.fixupChainCrossBlockSvg();
        }
      }
    } else {
      log.trace(' unrecognized teak file');
      return;
    }
  };

  teakText.loadJsoTeakBlocks = function (tbe, jsoBlocks, x, y, prev) {
    var i = 1;
    var firstBlock = null;
    for (i = 0; i < jsoBlocks.length; i++) {
      var blockName = jsoBlocks[i]._0;
      var block = tbe.addBlock(x, y, blockName);
      if (firstBlock === null) {
        firstBlock = block;
      }
      if (prev !== null) {
        prev.next = block;
        block.prev = prev;
      }
      // Load block specific settings, including sub blocks.
      if (blockName === 'loop') {
        prev = this.loadLoop(tbe, block, jsoBlocks[i]);
      } else {
        this.loadBlockDetails(block, jsoBlocks[i]);
        prev = block;
      }
      x = prev.right;
    }
    return firstBlock;
  };

  // Load a loop, TODO needs to be less hardcoded.
  teakText.loadLoop = function (tbe, block, jsoBlock) {
    // Load the sub chunk of blocks
    var jsoChainBlocks = jsoBlock._2;
    var x = block.right;
    var y = block.top;
    var subChunk = teakText.loadJsoTeakBlocks(tbe, jsoChainBlocks, x, y, block);
    var preTail = null;
    if (subChunk !== null) {
      var subChunkEnd = subChunk.last;
      preTail = subChunkEnd;
    } else {
      preTail = block;
    }
    // The tail is not serialized, so if must be created and stiched into the list.
    x = preTail.right;
    var tail = tbe.addBlock(x, y, 'tail');
    preTail.next = tail;
    tail.prev = preTail;
    block.flowTail = tail;
    tail.flowHead = block;
    return tail;
  };

  teakText.loadBlockDetails = function (block, jsoBlock) {
    for (var key in jsoBlock) {
      if (jsoBlock.hasOwnProperty(key)) {
        if (key !== '_0') {
          block.controllerSettings.data[key] = jsoBlock[key];
        }
      }
    }
  };

  return teakText;
}();

},{"log.js":53,"teak":11}],49:[function(require,module,exports){
"use strict";

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

  // Move block across the screen on frame at a time.
  function trashAnimate(block, tbe) {
    if (block[0] === undefined) {
      var frame = block.animateState.frame;
      block.dmove(block.animateState.adx, block.animateState.ady, frame === 1, block);
      block.animateState.count += 1;

      if (tbe.blocksOnScreen() && frame > 0) {
        // Queue up next animation frame.
        block.animateState.frame = frame - 1;
        requestAnimationFrame(function () {
          trashAnimate(block, tbe);
        });
      } else {
        // Animation is over, now delete the blocks..
        tbe.clearDiagramBlocks();
      }
    }
  }

  // Determine center of block chain, then have all blocks scatter.
  function trashBlocks(tbe) {

    // Calculate initial trajectory for blocks.
    tbe.forEachDiagramBlock(function (block) {
      var frameCount = 100;
      var xPos = block.left - tbe.width / 2;
      var yPos = block.top - tbe.height / 2;
      // Need to find the hypotenuse then divide the xPos and yPos by it.
      var hyp = Math.sqrt(xPos * xPos + yPos * yPos);
      var getX = xPos / hyp * 8;
      var getY = yPos / hyp * 8;
      block.animateState = {
        adx: getX,
        ady: getY,
        frame: frameCount,
        count: 0
      };
    });

    // Play a sound and begin the animation.
    tbe.audio.playSound(tbe.audio.poof);
    tbe.forEachDiagramBlock(function (block) {
      trashAnimate(block, tbe);
    });
  }

  return trashBlocks;
}();

},{}],50:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var log = require('log.js');

  var editStyle = {};

  editStyle.setFontSize = function (style, size) {
    style.fontSize = size.toString() + 'px';
  };

  editStyle.setHeight = function (style, h) {
    style.height = h.toString() + 'px';
  };

  editStyle.calcSreenScale = function (w, h) {
    var scale = 1.0;

    // Scaling is pinned roughly 70% to 100%.
    // If the screen is large enough then is stays at 100%
    // once below 70% that its pins a 70%. No pint in making
    // things too small to read to touch.
    if (h < 500 || w < 700) {
      if (h < 350) {
        h = 350;
      }
      if (w < 500) {
        w = 500;
      }
      scale = Math.min(h / 500, w / 700);
    }
    return scale;
  };

  return editStyle;
}();

},{"log.js":53}],51:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function factory() {

  // Unicode charcodes for FontAwesome symbols.
  var fastr = {
    play: '\uF04B',
    pause: '\uF04C',
    stop: '\uF04D',
    file: '\uF15B',
    trash: '\uF2ED',
    folder: '\uF07B',
    undo: '\uF0E2',
    redo: '\uF01E',
    settings: '\uF013',
    copy: '\uF24D',
    paste: '\uF0EA',
    page: '\uF0F6',
    edit: '\uF044',
    save: '\uF0C7',
    gamepad: '\uF11B',
    debug: '\uF120',
    camera: '\uF030',
    sync: '\uF021',
    spinner: '\uF110',
    bluetooth: '\uF293',
    link: '\uF0C1',
    linking: '\uF0C1',
    cogs: '\uF085',
    connect: '\uF1E6',
    robot: '\uF544',
    temp: '\uF2C9',
    loop: '\uF2EA',
    data: '\uF080',
    calibrate: '\uF24E',
    batteryFull: '\uF240',
    batteryThreeQuarters: '\uF241',
    batteryHalf: '\uF242',
    batteryOneQuarter: '\uF243',
    batteryEmpty: '\uF244'
  };

  return fastr;
}();

},{}],52:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {

  var icons = {};

  var svgb = require('svgbuilder.js');
  var pb = svgb.pathBuilder;

  icons.accelerometer = function (scale, classes, x, y) {
    var pathd = '';
    pathd += pb.move(x, y);
    pathd += pb.vline(-20);
    pathd += pb.hline(-5);
    pathd += pb.line(6, -10);
    pathd += pb.line(6, 10);
    pathd += pb.hline(-5);
    pathd += pb.vline(20);

    pathd += pb.line(15, 10);
    pathd += pb.line(5, -5);
    pathd += pb.line(2, 11);
    pathd += pb.line(-11, -2);
    pathd += pb.line(5, -5);
    pathd += pb.line(-15, -10);

    pathd += pb.move(-3, 0);
    pathd += pb.line(-15, 10);
    pathd += pb.line(5, 5);
    pathd += pb.line(-11, 2);
    pathd += pb.line(2, -11);
    pathd += pb.line(5, 5);
    pathd += pb.line(15, -10);

    var path = svgb.createPath(classes, pathd);
    path.setAttribute('transform', 'scale(' + scale + ')');
    return path;
  };

  icons.sad55 = [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1];
  icons.smile55 = [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0];
  icons.t55 = [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
  icons.numeric55 = [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];

  icons.pictureNumeric = function (scale, x, y) {
    var board = icons.picture(scale, x, y, icons.numeric55);
    return board;
  };

  icons.pictureSmile = function (scale, x, y) {
    var board = icons.picture(scale, x, y, icons.smile55);
    return board;
  };

  // A basic smiling tbot icon about 120x120
  icons.tbot = function (scale, x, y, name, face) {
    var group = svgb.createGroup('tbot', x, y);
    // Item [0] The selection halo
    group.appendChild(svgb.createRect('tbot-select', -8, -7, 135, 135, 3));
    group.appendChild(svgb.createRect('tbot-device', 12, 0, 96, 120, 3));
    group.appendChild(svgb.createRect('svg-clear tbot-device-head', 22, 0, 76, 50, 0));
    group.appendChild(svgb.createRect('tbot-device-side', 0, 0, 10, 120, 3));
    group.appendChild(svgb.createRect('tbot-device-side', 110, 0, 10, 120, 3));
    // Item [5] The device name
    group.appendChild(svgb.createText('svg-clear tbot-device-name', 60, 85, name));
    // Item [6] The connection status
    group.appendChild(svgb.createText('fas svg-clear tbot-device-name', 60, 110, ''));
    group.appendChild(icons.picture(scale, 45, 10, face));
    return group;
  };

  // A basic smiling 5x5 LED matrix
  icons.picture = function (scale, x, y, data) {
    var pix = data;
    var group = svgb.createGroup('svg-clear', 26 + x, 15 + y);
    var box = svgb.createRect('svg-clear block-picture-board', x - 7, y - 7, 42, 42, 4);
    group.appendChild(box);
    for (var iy = 0; iy < 5; iy++) {
      for (var ix = 0; ix < 5; ix++) {
        var style = '';
        if (pix[ix + iy * 5] === 0) {
          style = 'svg-clear block-picture-led-off';
        } else {
          style = 'svg-clear block-picture-led-on';
        }
        var led = svgb.createCircle(style, x + ix * 7, y + iy * 7, 3);
        group.appendChild(led);
      }
    }
    group.setAttribute('transform', 'scale(' + scale + ')');
    return group;
  };

  icons.sound = function (scale, x, y) {
    var group = svgb.createGroup('svg-clear', 0, 0);
    var pathd = '';
    pathd = pb.move(x, y);
    pathd += pb.hline(9);
    pathd += pb.line(10, -10);
    pathd += pb.vline(30);
    pathd += pb.line(-10, -10);
    pathd += pb.hline(-9);
    pathd += pb.vline(-10);
    pathd += pb.close();
    var path = svgb.createPath('svg-clear block-stencil-fill', pathd);
    group.appendChild(path);

    // Sound wave arcs
    pathd = '';
    pathd = pb.move(x + 25, y);
    pathd += pb.arc(12, 90, 0, 1, 0, 10);
    pathd += pb.move(5, -15);
    pathd += pb.arc(20, 90, 0, 1, 0, 20);
    pathd += pb.move(5, -25);
    pathd += pb.arc(28, 90, 0, 1, 0, 30);
    var soundPath = svgb.createPath('svg-clear block-stencil', pathd);
    soundPath.setAttribute('stroke-linecap', 'round');
    group.appendChild(soundPath);
    group.setAttribute('transform', 'scale(' + scale + ')');
    return group;
  };

  icons.wait = function (scale, x, y) {
    var group = svgb.createGroup('svg-group', 0, 0);
    var pathd = '';
    pathd = pb.move(x, y);
    pathd += pb.vline(-7);
    pathd += pb.arc(19, 340, 1, 1, -12, 4);
    pathd += pb.move(10.6, 16.5);
    pathd += pb.arc(1.3, 300, 0, 0, 2.2, -0.8);
    pathd += pb.line(-7.8, -10.5);
    pathd += pb.close();
    var path = svgb.createPath('svg-clear block-stencil', pathd);
    group.appendChild(path);
    group.setAttribute('transform', 'scale(' + scale + ')');
    return group;
  };

  icons.calcbutton = function (scale, x, y, width, hieght, label, style) {
    var group = svgb.createGroup('', 0, 0);
    var button = svgb.createRect('calc-button ' + style, x, y, width, hieght, hieght / 2);
    var text = svgb.createText('svg-clear ' + style + '-text', x + width / 2, y + 28, label);
    text.setAttribute('text-anchor', 'middle');
    group.appendChild(button);
    group.appendChild(text);
    return group;
  };

  icons.variable = function (scale, x, y, label) {
    var group = svgb.createGroup('svg-clear', 0, 0);

    var pathd = '';
    pathd += pb.move(11, 5);
    pathd += pb.hline(36);
    pathd += pb.line(7.5, 18);
    pathd += pb.line(-7.5, 18);
    pathd += pb.hline(-36);
    pathd += pb.line(-7.5, -18);
    pathd += pb.line(7, -18);
    pathd += pb.close();

    var path = svgb.createPath('svg-clear vars-poly', pathd);
    group.appendChild(path);

    var text = svgb.createText('svg-clear vars-poly-text', 29, 34, label);
    text.setAttribute('text-anchor', 'middle');
    group.appendChild(text);
    group.setAttribute('style', 'transform: scale(' + scale + ');');

    var positionGroup = svgb.createGroup('svg-clear', x, y);
    positionGroup.appendChild(group);

    return positionGroup;
  };

  icons.motor = function (scale, x, y) {
    var group = svgb.createGroup('svg-clear', 0, 0);
    var motor = svgb.createCircle('svg-clear block-motor-body', 40, 30, 20);
    group.appendChild(motor);
    var shaft = svgb.createCircle('svg-clear block-motor-shaft', 40, 30, 4);
    group.appendChild(shaft);

    if (scale !== 1.0) {
      group.setAttribute('style', 'transform: translate(' + x + 'px, ' + y + 'px) scale(' + scale + ');');
    }
    return group;
  };

  icons.motorWithDial = function (scale, x, y, data) {
    var group = svgb.createGroup('svg-clear', 0, 0);

    var motorBody = icons.motor(1.0, x, y);
    group.appendChild(motorBody);

    var data1 = data;
    var rotate = data1 / 100 * 180;
    var dx = Math.cos(rotate * (Math.PI / 180));
    var dy = Math.sin(rotate * (Math.PI / 180));
    var spread = 1;
    if (rotate < 0) {
      spread = 0;
    }
    var pathd = '';
    pathd = pb.move(40, 30);
    pathd += pb.line(0, -20);
    pathd += pb.arc(20, rotate, 0, spread, dy * 20, -(dx * 20 - 20));
    pathd += pb.close();
    var path = svgb.createPath('svg-clear block-stencil-fill-back', pathd);
    group.appendChild(path);
    pathd = '';
    pathd = pb.move(35, 30);
    pathd += pb.line(4.5, -19);
    pathd += pb.hline(1);
    pathd += pb.line(4.5, 19);
    pathd += pb.arc(3.0, 180, 1, 1, -10, 0);
    pathd += pb.close();
    path = svgb.createPath('svg-clear block-stencil-fill', pathd);
    path.setAttribute('transform', "rotate(" + rotate + " 40 30)"); //rotate
    group.appendChild(path);

    group.setAttribute('style', 'transform: translate(' + x + 'px, ' + y + 'px) scale(' + scale + ');');
    return group;
  };

  icons.paletteBlock = function (scale, classes, x, y, block) {
    var width = block.width;
    if (block.name.includes('identity')) {
      return icons.paletteBlockIdentity(scale, classes, x, y, width);
    }
    var pathd = '';
    pathd += pb.move(x, y);
    pathd += pb.hline(width);
    pathd += pb.line(15, 40);
    pathd += pb.line(-15, 40);
    pathd += pb.hline(-width);
    pathd += pb.line(15, -40);
    pathd += pb.line(-15, -40);
    pathd += pb.close();

    var path = svgb.createPath(classes, pathd);
    path.setAttribute('transform', 'scale(' + scale + ')');
    return path;
  };

  icons.paletteBlockIdentity = function (scale, classes, x, y, width) {
    var pathd = '';
    pathd += pb.move(x, y);
    pathd += pb.hline(width);
    pathd += pb.line(15, 40);
    pathd += pb.line(-15, 40);
    pathd += pb.hline(-width);
    pathd += pb.vline(-80);
    pathd += pb.close();

    var path = svgb.createPath(classes, pathd);
    path.setAttribute('transform', 'scale(' + scale + ')');
    return path;
  };

  icons.button = function (scale, classes, x, y) {
    var group = svgb.createGroup('svg-clear ' + classes, 0, 0);

    var buttonBack = svgb.createRect('svg-clear block-idButton-back', x, y, 50, 50, 3); // 15, 10
    group.appendChild(buttonBack);

    var screw = svgb.createCircle('svg-clear block-idButton-screw', x + 8, y + 8, 4);
    group.appendChild(screw);
    screw = svgb.createCircle('svg-clear block-idButton-screw', x + 42, y + 8, 4);
    group.appendChild(screw);
    screw = svgb.createCircle('svg-clear block-idButton-screw', x + 42, y + 42, 4);
    group.appendChild(screw);
    screw = svgb.createCircle('svg-clear block-idButton-screw', x + 8, y + 42, 4);
    group.appendChild(screw);

    var button = svgb.createCircle('svg-clear block-idButton-button', x + 25, y + 25, 18);
    group.appendChild(button);

    group.setAttribute('transform', 'scale(' + scale + ')');
    return group;
  };

  return icons;
}();

},{"svgbuilder.js":55}],53:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
    var log = {};

    log.buffer = "";

    log.traceHL = function () {
        var args = Array.prototype.slice.call(arguments);
        // args.unshift('t:');
        log.traceCore(args);
    };

    log.trace = function () {
        var args = Array.prototype.slice.call(arguments);
        // args.unshift('t:');
        log.traceCore(args);
    };

    log.error = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('e:');
        log.traceCore(args);
    };

    log.traceCore = function (args) {

        var message = '';
        var index = 0;
        for (; index < args.length; ++index) {
            if (args[index] === null) {
                message = message + 'null ';
            }if (args[index] === undefined) {
                message = message + 'undefined ';
            } else {
                message = message + args[index].valueOf() + ' ';
            }
        }
        message += '\n';
        log.buffer += message;

        console.log.apply(console, args); // eslint-disable-line no-console
    };

    return log;
}();

},{}],54:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var editStyle = require('editStyle.js');
  var icons = require('icons.js');
  var vars = require('./../variables.js');

  var slideControl = {};

  slideControl.Class = function Slider(svg, name) {
    this.svg = svg;
    this.name = name;
    this.vvalue = vars.v[name];
    this.dragStart = 0;
    this.vDomain = 200;
  };

  slideControl.Class.prototype.buildSvg = function (hCenter, width, top, h, scale) {
    // Since the Thumb is a circle the vRange is reduced by the
    // diameter (.e.g. the width) This still look confusing.
    var tRadius = width / 2;
    var gh = h - tRadius - top;
    this.vRange = gh - tRadius * 2; // range in pixels
    this.hCenter = hCenter;
    this.top = top;
    this.width = width;
    var fontSize = 48 * scale;
    var fontY = fontSize * 0.80;
    var varY = fontSize * 1.40;
    var tw = tRadius - 15;

    // TODO icon and font block could really use a common anchor point - too many tweaks
    var variable = icons.variable(scale, hCenter - 60 * scale, top - varY, this.name);
    this.svg.appendChild(variable);

    this.text = svgb.createText('slider-text', this.hCenter + 45 * scale, top - fontY, "0");
    editStyle.setFontSize(this.text.style, fontSize);
    this.svg.appendChild(this.text);
    var groove = svgb.createRect('slider-groove', hCenter - tRadius, top, width, gh, tRadius);
    this.svg.appendChild(groove);
    this.thumb = svgb.createCircle('slider-thumb', hCenter, top, tw);
    this.thumb.setAttribute('thumb', this.name);
    this.svg.appendChild(this.thumb);

    // Align thumb and text with current value.
    this.updateSvg();
    // ??? Is there any cleanup needed for each time this is called?
    this.interact();
  };

  slideControl.Class.prototype.updateSvg = function () {
    var tPx = this.vRange * ((this.vvalue.value + 100) / 200);
    var bottom = this.top + this.vRange + this.width / 2;
    this.thumb.setAttribute('cy', bottom - tPx);
    this.text.textContent = this.vvalue.value.toString();
  };

  slideControl.Class.prototype.interact = function () {
    var t = this;
    interact('.slider-thumb', { context: t.thumb })
    // target the matches of that selector
    // allow drags on multiple elements
    .draggable({ max: Infinity }).on('dragstart', function (event) {
      t.event(event);
    }).on('dragmove', function (event) {
      t.event(event);
    }).on('dragend', function (event) {
      t.event(event);
    });
  };

  slideControl.Class.prototype.event = function (event) {
    var valPerPy = this.vDomain / this.vRange;
    if (event.type === 'dragstart') {
      this.dragStart = this.vvalue.value;
    } else if (event.type === 'dragmove') {
      this.vvalue.set(this.dragStart + valPerPy * (event.y0 - event.pageY));
    } else if (event.type === 'dragend') {
      this.vvalue.set(0);
    }
    this.updateSvg();
  };

  return slideControl;
}();

},{"./../variables.js":57,"editStyle.js":50,"icons.js":52,"interact.js":8,"svgbuilder.js":55}],55:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/** @module svgBuilder */

module.exports = function () {

  /** @class svgBuilder */
  var svgBuilder = {};
  svgBuilder.ns = 'http://www.w3.org/2000/svg';
  svgBuilder.xlinkns = 'http://www.w3.org/1999/xlink';

  /**
   * A class for building SVG path descriptions
   */
  /** @summary  pathBuilder */
  svgBuilder.pathBuilder = {
    //* relative pen relocation with no drawing
    move: function move(dx, dy) {
      return 'm' + dx + ' ' + dy + ' ';
    },
    //* realtive horizontal line
    hline: function hline(dx) {
      return 'h' + dx + ' ';
    },
    //* relative vertical line
    vline: function vline(dy) {
      return 'v' + dy + ' ';
    },
    //* relative straight line
    line: function line(dx, dy) {
      return 'l' + dx + ' ' + dy + ' ';
    },
    //* arc path element
    arc: function arc(radius, degrees, large, sweep, dx, dy) {
      var text = 'a' + radius + ' ' + radius + ' ' + degrees;
      text += ' ' + large + ' ' + sweep + ' ' + dx + ' ' + dy + ' ';
      return text;
    },
    //* path closing
    close: function close() {
      return 'z ';
    }
  };

  /** @function */
  svgBuilder.createUse = function createSymbolUse(elementClass, symbolName) {
    var elt = document.createElementNS(svgBuilder.ns, 'use');
    elt.setAttribute('class', elementClass);
    elt.setAttributeNS(svgBuilder.xlinkns, 'xlink:href', symbolName);
    return elt;
  };

  svgBuilder.resizeRect = function resizeRect(elt, w, h) {
    elt.setAttribute('width', String(w) + 'px');
    elt.setAttribute('height', String(h) + 'px');
  };

  svgBuilder.translateXY = function translateXY(elt, x, y) {
    elt.setAttribute('transform', 'translate (' + String(x) + ' ' + String(y) + ')');
  };

  svgBuilder.createRect = function createRect(elementClass, x, y, w, h, rxy) {
    var elt = document.createElementNS(svgBuilder.ns, 'rect');
    elt.setAttribute('class', elementClass);
    elt.setAttribute('x', x);
    elt.setAttribute('y', y);
    this.resizeRect(elt, w, h);
    if (rxy !== undefined) {
      elt.setAttribute('rx', rxy);
      elt.setAttribute('ry', rxy);
    }
    return elt;
  };

  svgBuilder.createCircle = function creatCircle(elementClass, cx, cy, r) {
    var elt = document.createElementNS(svgBuilder.ns, 'circle');
    elt.setAttribute('class', elementClass);
    elt.setAttribute('cx', cx);
    elt.setAttribute('cy', cy);
    elt.setAttribute('r', r);
    return elt;
  };

  svgBuilder.createGroup = function createGroup(elementClass, x, y) {
    var elt = document.createElementNS(svgBuilder.ns, 'g');
    elt.setAttribute('class', elementClass);
    elt.setAttribute('transform', 'translate (' + x + ' ' + y + ')');
    return elt;
  };

  svgBuilder.createText = function createText(elementClass, x, y, text) {
    var elt = document.createElementNS(svgBuilder.ns, 'text');
    elt.setAttribute('class', elementClass);
    elt.setAttribute('x', x);
    elt.setAttribute('y', y);
    elt.textContent = text;
    return elt;
  };

  svgBuilder.createPath = function createText(elementClass, pathData) {
    var elt = document.createElementNS(svgBuilder.ns, 'path');
    elt.setAttribute('class', elementClass);
    elt.setAttribute('d', pathData);
    return elt;
  };

  return svgBuilder;
}();

},{}],56:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var interact = require('interact.js');
  var svgb = require('svgbuilder.js');
  var icons = require('icons.js');
  var cxn = require('./../cxn.js');
  var fastr = require('fastr.js');

  var tbot = {};

  tbot.Class = function Tbot(svg, x, y, name, face) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.face = face;
    this.status = cxn.statusEnum.NOT_THERE;
    this.buildSvg(svg);
  };

  tbot.Class.prototype.releaseSvg = function () {
    this.selectionsvg = null;
    this.tbotsvg = null;
    this.cxntext = null;
  };

  tbot.Class.prototype.buildSvg = function (svg) {
    // Since the Thumb is a circle the vRange is reduced by the
    // diameter (.e.g. the width) This still look confusing.

    // TODO icon and font block could really used a common anchor point.
    // too many tweaks
    this.svg = svg;

    // Bot's LEDs uses upper case name, so use that in icon as well.
    var upName = this.name.toUpperCase();
    this.tbotsvg = this.svg.appendChild(icons.tbot(1.0, this.x, this.y, upName, this.face));

    this.selectionsvg = this.tbotsvg.children[0];
    this.cxntext = this.tbotsvg.children[6];

    this.setConnectionStatus(this.status);
    this.interact();
  };

  tbot.Class.prototype.setLocation = function (x, y) {
    this.x = x;
    this.y = y;
    if (this.tbotsvg !== null) {
      svgb.translateXY(this.tbotsvg, x, y);
    }
    return;
  };

  tbot.Class.prototype.setSelected = function (selected) {
    this.selected = selected;
    if (this.selectionsvg === null) return;
    if (selected) {
      this.selectionsvg.style.display = 'block';
    } else {
      this.selectionsvg.style.display = 'none';
    }
  };

  tbot.Class.prototype.setConnectionStatus = function (status) {
    this.status = status;
    var txt = '';
    if (status === cxn.statusEnum.CONNECTED) {
      this.setSelected(true);
      txt = fastr.link;
    } else if (status === cxn.statusEnum.CONNECTING) {
      this.setSelected(true);
      txt = fastr.sync;
    } else if (status === cxn.statusEnum.BEACON) {
      this.setSelected(false);
      txt = '';
    } else if (status === cxn.statusEnum.NOT_THERE) {
      this.setSelected(false);
      txt = '';
    }
    if (this.cxntext !== null) {
      this.cxntext.textContent = txt;
    }
  };

  tbot.Class.prototype.interact = function () {
    var t = this;
    interact('.tbot', { context: this.tbotsvg }).on('down', function (event) {
      t.event(event);
    });
  };

  tbot.Class.prototype.event = function (event) {
    if (event.type === 'down') {
      if (typeof this.onclick === 'function') {
        this.onclick(this);
      }
    }
  };

  return tbot;
}();

},{"./../cxn.js":34,"fastr.js":51,"icons.js":52,"interact.js":8,"svgbuilder.js":55}],57:[function(require,module,exports){
'use strict';

/*
Copyright (c) 2020 Trashbots - SDG

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

module.exports = function () {
  var variables = {};

  variables.vars = {
    'A': { 'rw': true, 'source': 'variable' },
    'B': { 'rw': true, 'source': 'variable' },
    'C': { 'rw': true, 'source': 'variable' }
    /*
    'Accel': {'rw':false, 'source':'sensor'},
    'Gyro': {'rw':false, 'source':'sensor'},
    'M1': {'rw':false, 'source':'actor'},
    'M2': {'rw':false, 'source':'actor'},
    'E1': {'rw':false, 'source':'sensor'},
    'E2': {'rw':false, 'source':'sensor'},
    'F1': {'rw':false, 'source':'function'},
    'F2': {'rw':false, 'source':'function'},
    */
  };

  variables.addOptions = function (selectObj, selectedOption) {

    var index = 0;
    for (var key in variables.vars) {
      var option = document.createElement("option");
      option.text = key;
      option.value = key;
      selectObj.add(option);

      if (key === selectedOption) {
        selectObj.selectedIndex = index;
      }
      index += 1;
    }
  };

  variables.getSelected = function (selectObj) {
    var index = selectObj.selectedIndex;
    var item = selectObj.options[index];
    console.log("selected item", item.value);
    return item.value;
  };

  variables.Var = function Var() {
    this.value = 0;
    this.lastValue = 0;
    this.min = null;
    this.max = null;
  };

  variables.Var.prototype.setMinMax = function (min, max) {
    this.min = min;
    this.max = max;
    this.pin();
  };

  variables.Var.prototype.increment = function (operand) {
    this.value += operand;
    this.pin();
  };

  variables.Var.prototype.decrement = function (operand) {
    this.value -= operand;
    this.pin();
  };

  variables.Var.prototype.set = function (operand) {
    this.value = parseInt(operand, 10);
    this.pin();
  };

  variables.Var.prototype.get = function () {
    return this.value;
  };

  variables.Var.prototype.hasChanged = function () {
    return this.value !== this.lastValue;
  };

  variables.Var.prototype.sync = function () {
    this.lastValue = this.value;
  };

  variables.Var.prototype.pin = function () {
    if (this.min !== null && this.value < this.min) {
      this.value = this.min;
    } else if (this.max !== null && this.value > this.max) {
      this.value = this.max;
    }
  };

  variables.v = {
    'A': new variables.Var(),
    'B': new variables.Var(),
    'C': new variables.Var(),
    'L': new variables.Var(),
    'R': new variables.Var()
  };

  variables.v['L'].setMinMax(-100, 100);
  variables.v['R'].setMinMax(-100, 100);

  variables.func = function (vname, f, val) {
    var v = variables.v[vname];
    if (v === undefined) return;
    var num = parseInt(val, 10);
    if (f === '+') {
      v.increment(num);
    } else if (f === '-') {
      v.decrement(num);
    }
  };

  variables.set = function (vname, val) {
    var v = variables.v[vname];
    if (v === undefined) return;
    v.set(val);
  };

  variables.get = function (vname) {
    return variables.v[vname].get();
  };

  variables.printVars = function () {
    var varDump = '';
    for (var prop in variables.v) {
      if (variables.v.hasOwnProperty(prop)) {
        varDump = varDump + ", [" + prop + "]=" + variables.v[prop].value;
      }
    }
    console.log(varDump);
  };

  variables.resetVars = function () {
    for (var prop in variables.v) {
      if (variables.v.hasOwnProperty(prop)) {
        variables.v[prop].set(0);
      }
    }
  };

  return variables;
}();

},{}],58:[function(require,module,exports){
(function (global){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":62,"util/":61}],59:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],60:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],61:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":60,"_process":63,"inherits":59}],62:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],63:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[37]);
