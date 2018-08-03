(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global['@mqschwanda/firebase-container'] = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
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

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var inherits = function (subClass, superClass) {
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
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var mapDoc = function mapDoc(querySnapshot) {
    return { querySnapshot: querySnapshot, data: querySnapshot.data() };
  };

  var mapDocs = function mapDocs(querySnapshot) {
    var data = [];

    querySnapshot.forEach(function (doc) {
      return data.push(mapDoc(doc));
    });

    return { querySnapshot: querySnapshot, data: data };
  };

  var mapData = function mapData(querySnapshot) {
    return querySnapshot.docs && querySnapshot.docs.length ? mapDocs(querySnapshot) : mapDoc(querySnapshot);
  };

  var assignQuerySnapshot = function assignQuerySnapshot(handleQuerySnapshot) {
    return function (querySnapshot) {
      return _extends({ querySnapshot: querySnapshot }, handleQuerySnapshot(querySnapshot));
    };
  };

  var defaultMapQuerySnapshot = assignQuerySnapshot(mapData);

  var firestoreContainer = function firestoreContainer(doc) {
    var mapQuerySnapshot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMapQuerySnapshot;
    return function (Component) {
      var _class, _temp, _initialiseProps;

      var LoadingComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return null;
      };
      return _temp = _class = function (_PureComponent) {
        inherits(FirestoreContainer, _PureComponent);

        function FirestoreContainer(props) {
          classCallCheck(this, FirestoreContainer);

          var _this = possibleConstructorReturn(this, (FirestoreContainer.__proto__ || Object.getPrototypeOf(FirestoreContainer)).call(this, props));

          _initialiseProps.call(_this);

          _this.state = {};
          _this.unsubscribe = _this.getSnapshot(props);
          return _this;
        }

        createClass(FirestoreContainer, [{
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.unsubscribe();
          }
        }, {
          key: 'render',
          value: function render() {
            return this.state !== {} ? React__default.createElement(Component, _extends({ firestore: this.state }, this.props)) : React__default.createElement(LoadingComponent, null);
          }
        }]);
        return FirestoreContainer;
      }(React.PureComponent), _initialiseProps = function _initialiseProps() {
        var _this2 = this;

        this.getDoc = function () {
          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.props;
          return typeof doc === 'function' ? doc(props) : doc;
        };

        this.getSnapshot = function () {
          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.props;
          return _this2.getDoc(props).onSnapshot(_this2.onSnapshot);
        };

        this.onSnapshot = function (querySnapshot) {
          return _this2.setState(mapQuerySnapshot(querySnapshot));
        };
      }, _temp;
    };
  };

  exports.firestoreContainer = firestoreContainer;
  exports.default = firestoreContainer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
