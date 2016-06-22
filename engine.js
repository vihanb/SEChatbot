"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Talk = function Talk(text) {
  document.getElementById("input").value = text;document.getElementById("sayit-button").click();
};
var Data = function Data(text, instance) {
  return text.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g, function (_, v) {
    return instance[v];
  });
};

var Chatbot = function Chatbot() {
  var Name = arguments.length <= 0 || arguments[0] === undefined ? "a Chatbot" : arguments[0];

  var _this = this;

  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$Startup = _ref.Startup;
  var Startup = _ref$Startup === undefined ? "Hi my name is $Name!" : _ref$Startup;
  var onmessage = arguments[2];

  _classCallCheck(this, Chatbot);

  var UID = CHAT.CURRENT_USER_ID;

  this.Name = Name;
  this.Options = { Startup: Data(Startup, this), UID: UID };
  this.onmessage = onmessage || function () {};

  this.Queue = [];
  // Private
  var Called = Symbol("Called");

  this[Called] = new Set();

  // Startup
  Talk(this.Options.Startup);

  // Read
  setInterval(function () {
    Array.from(document.getElementsByClassName("message")).filter(function (message, index, transcript) {
      if (_this[Called].has(message)) return false;else _this[Called].add(message);
      return (message.parentElement.parentElement.className.match(/user-(\d+)/) || [0, UID])[1] != UID && index > transcript.map(function (t) {
        return t.textContent.trim();
      }).lastIndexOf(_this.Options.Startup);
    }).forEach(function (message) {
      return _this.onmessage.call({
        "Text": message.textContent.trim() /*.replace(/\b[a-z\.]+(?:com|org|net|xyz)/g, "http://$&")*/
        , "HTML": message.innerHTML,
        "Raw": message,

        "User": message.parentElement.parentElement.getElementsByClassName("username")[0].textContent.trim(),

        "Mentions": [].concat(_toConsumableArray(message.querySelectorAll(".mention"))).map(function (m) {
          return (m.textContext || "").slice(1);
        }),

        "Speak": function Speak(Text) {
          return _this.Queue.push(Text);
        },
        "Reply": function Reply(Text) {
          return _this.Queue.push(":" + message.id.split("-")[1] + " " + Text);
        },
        "Star": function Star(Text) {
          return message.querySelector(".meta > .stars > .vote").click();
        },

        "super": _this
      });
    });
  }, 2100);

  setInterval(function () {
    if (_this.Queue[0]) Talk(_this.Queue.shift());
  }, 2500);
};

// How to use:
/*
let MyChatbot = new Chatbot("<CHATBOT NAME>", { UID: <CHATBOT ACCOUNT UID, Startup: "<WHAT TO SAY ON STARTUP ($Name) is Chatbot's name>" }, function() {
  // Chatbot Code which runs every message
  // this.Text contains message text
  // use this.Speak() to speak
  // use this.Reply() to reply
  // use this.Star()  to star the message
  // use this.Mentions to see who was mentioned in the message
  // use this.HTML to get raw message HTML
  console.log(this);
});
*/