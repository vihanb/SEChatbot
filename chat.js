/* Generated by Babel */
//// chat.js is the transpiled (ES5) version

// Helper Functions
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Talk = function Talk(text) {
  document.getElementById("input").value = text;document.getElementById("sayit-button").click();
};
var Data = function Data(text, instance) {
  return text.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g, function (_, v) {
    return instance[v];
  });
};

var Chatbot = (function () {
  function Chatbot(Name, _x, onmessage) {
    if (Name === undefined) Name = "a Chatbot";

    var _this = this;

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$Startup = _ref.Startup;
    var Startup = _ref$Startup === undefined ? "Hi my name is $Name!" : _ref$Startup;
    var _ref$UID = _ref.UID;
    var UID = _ref$UID === undefined ? 0 : _ref$UID;

    _classCallCheck(this, Chatbot);

    this.Name = Name;
    this.Options = { Startup: Data(Startup, this), UID: UID };
    this.onmessage = onmessage || function () {
      return void 0;
    };

    // Private
    var Called = Symbol("Called");

    this[Called] = new Set();

    // Startup
    Talk(this.Options.Startup);

    // Read
    setInterval(function () {
      [].concat(_toConsumableArray(document.getElementsByClassName("message"))).filter(function (message, index, transcript) {
        if (_this[Called].has(message)) return false;else _this[Called].add(message);
        return (message.parentElement.parentElement.className.match(/user-(\d+)/) || [0, UID])[1] != UID;
      }).forEach(function (message) {
        return _this.onmessage.call({
          "Text": message.textContent.trim().replace(/([a-z]\.)+(?:com|org|net|xyz)/g, "http://$&"),
          "HTML": message.innerHTML,
          "Raw": message,

          "User": message.parentElement.parentElement.getElementsByClassName("username")[0].textContent.trim(),

          "Speak": _this.Speak,
          "Reply": _this.Reply(message)
        }, _this);
      });
    }, 2100);
  }

  /*
   * CHATGOAT v2.0
  **/

  _createClass(Chatbot, [{
    key: "Speak",
    value: function Speak(text) {
      Talk(text);
    }
  }, {
    key: "Reply",
    value: function Reply(message) {
      return function (Text) {
        return Talk(":" + message.id.split("-")[1] + " " + Text);
      };
    }
  }]);

  return Chatbot;
})();

var Admins = new Set(["Doᴡɴɢᴏᴀᴛ", "Chatgoat"]);

var Commands = {
  "help": function help(args) {
    return Object.keys(Commands).join(", ");
  },
  "learn": function learn(args, c) {
    return (Commands[args[0]] = function () {
      return Data(args.slice(1).join(" "), c);
    }, "Learned how to " + args[0] + "!");
  },

  // Random functions
  "golf": function golf(args) {
    var len = Math.floor(Math.random() * args.join(" ").length * .5) + 1;
    return Array(len).fill().map(function () {
      return String.fromCharCode(Math.floor(Math.random() * 1200 + 255));
    }).join("") + " is only " + (Math.floor(Math.random() * (len - 1)) + 1) + " bytes in the " + Array(Math.floor(Math.random() * 2) + 2).fill().map(function () {
      return String.fromCharCode(Math.floor(Math.random() * 25) + 65);
    }).join("") + "-" + Math.floor(Math.random() * Math.pow(10, Math.floor(Math.random() * 4) + 2)) + " encoding";
  }
};

var Chatgoat = new Chatbot("Chatgoat", { UID: 180858, Startup: "Hello! My name is $Name!" }, function (self) {
  if (this.Text[0] === "/") {
    // Command
    var Command = this.Text.split(" ")[0].slice(1); // Command
    this.Speak((this.Text.split(" ").reverse()[1] === "to" ? "@" + this.Text.split(" ").reverse()[0] + " " : "") + Commands[Command](this.Text.split(" ").slice(1), this));
  } else {
    if (/(Hello|Hi|Hey)(?=[^A-Za-z])/i.test(this.Text)) {
      this.Reply("Hello " + this.User + "!");
    }
  }
});