// chat.js is the transpiled (ES5) version

// Helper Functions
"use strict";

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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

var Chatbot = function Chatbot(Name, _x, onmessage) {
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

  this.Queue = [];
  // Private
  var Called = Symbol("Called");

  this[Called] = new Set();

  // Startup
  Talk(this.Options.Startup);

  // Read
  setInterval(function () {
    [].concat(_toConsumableArray(document.getElementsByClassName("message"))).filter(function (message, index, transcript) {
      if (_this[Called].has(message)) return false;else _this[Called].add(message);
      return (message.parentElement.parentElement.className.match(/user-(\d+)/) || [0, UID])[1] != UID && index > transcript.map(function (t) {
        return t.textContent.trim();
      }).lastIndexOf(_this.Options.Startup);
    }).forEach(function (message) {
      return _this.onmessage.call({
        "Text": message.textContent.trim(), /*.replace(/\b[a-z\.]+(?:com|org|net|xyz)/g, "http://$&")*/
        "HTML": message.innerHTML,
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

        "super": _this
      });
    });
  }, 2100);

  setInterval(function () {
    if (_this.Queue[0]) Talk(_this.Queue.shift());
  }, 1000);
}

/*
 * CHATGOAT v2.0
**/
;

var Admins = new Set(["Doᴡɴɢᴏᴀᴛ", "Chatgoat"]);

var CSTART = "Hello!";
var CONVERSATION = false;
var CDATA = new Map();
var ADATA = [];

var Commands = {
  "help": function help(self) {
    return Object.keys(Commands).join(", ");
  },
  "learn": function learn(self) {
    return Commands[self.args[0]] = function () {
      return Data(self.args.slice(1).join(" "), self["super"]);
    }, "Learned how to " + self.args[0] + "!";
  },
  "kill": function kill(self) {
    return Admins.has(self.User) ? "This conversation can serve no purpose anymore, Goodbye." : "I'm sorry " + self.User + " I'm afriad I can't let you do that";
  },
  "start": function start(self) {
    return CONVERSATION = true, CSTART;
  }
};

var UserRecord = new Map();
var UserLookup = function UserLookup(user, prop) {
  var value = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];
  return UserRecord.get(user) ? UserRecord.get(user).get(prop) || (UserRecord.get(user).set(prop, value), value) : (UserRecord.set(user, new Map([[prop, value]])), value);
};

var UserModify = function UserModify(user, prop, value) {
  return UserRecord.get(user).set(prop, typeof value === "string" && value.indexOf('$') > -1 ? eval(value.replace(/\$/g, UserRecord.get(user).get(prop))) : value);
};

var dist = function dist(a, b) {
  if (a.length == 0) return b.toLowerCase().length;
  if (b.length == 0) return a.toLowerCase().length;
  var matrix = [];
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
};

var getfreq = function getfreq(SOURCE) {
  return ([].concat(_toConsumableArray(SOURCE)).toString().match(/[A-Za-z]+/g) || [""]).reduce(function (R, C) {
    if (R.has(C.toLowerCase())) R.set(C.toLowerCase(), (R.get(C) || 1) + 1);else R.set(C.toLowerCase(), 1);
    return R;
  }, new Map());
};

var plotfc = function plotfc(src) {
  // F: new Map([...getfreq(CDATA)].sort((a,b) => b[1] - a[1]))
  var d = [].concat(_toConsumableArray(getfreq(src))).sort(function (a, b) {
    return a[1] - b[1];
  });

  if (d.length >= 5) {
    // Large enough store
    // some fancy complex calculation to detemine stats of lexicon
    var f = d.map(function (f, i, c) {
      return (c[i + 1] || [])[1] - f[1];
    }).slice(0, -1);

    // Length: L3M7
    // Weight: 5 L1.5M2.5
    var wl = d.map(function (f) {
      return [f[0], f[1] * (f[0].length < 3 ? 2 : f[0].length < 7 ? .5 : .75)];
    });

    return new Map(wl);
  } else {
    // weight by occurence off sample size
    return new Map(d);
  }
};

var weightphrase = function weightphrase(ph) {
  return plotfc(ph.concat(ADATA));
};

var weightdist = function weightdist(p1, p2) {
  if (p1 === undefined) p1 = "";

  p1 = p1.match(/[A-Za-z'-]+/g) || "RND";
  p2 = p2.match(/[A-Za-z'-]+/g) || "RND";

  if (p1 === "RND" || p2 === "RND") return [Infinity];

  var W = weightphrase(p1);
  var P = weightphrase(p2);

  var weightfactor = 10;

  return p1.map(function (WORD) {
    return weightfactor // factoring weight for prescision
     * W.get(WORD) // adjusted semantic frequency weight
     * Math.min.apply(Math, _toConsumableArray(p2.map(function (MATDIF) {
      return dist(WORD, MATDIF) * ( // Distance of
      weightfactor / P.get(MATDIF));
    } // The inversed weight semantic frequency
    )));
  });
};

var phdif = function phdif(p1, p2) {
  // console.log(p1);
  return weightdist(p1, p2).reduce(function (a, b) {
    return a + b;
  }); // TODO: improve this
};

var Chatgoat = new Chatbot("Chatgoat", { UID: 180858, Startup: "Hello! My name is $Name!" }, function () {
  var _this2 = this;

  if (CONVERSATION) {
    var Trim = function Trim(s) {
      return s.replace(/[^A-Za-z]/g, "").toLowerCase();
    };

    ADATA.push(this.Text);

    if (CDATA.size === 0) {
      CDATA.set(CSTART, this.Text);
    } else if (this.Mentions.length < 1) {
      (function () {
        var PendingResult = [];
        CDATA.forEach(function (v, k) {
          console.log(v, _this2.Text, PendingResult[0]);
          if (!PendingResult[0]) {
            var i = Math.floor(Math.random() * CDATA.size);
            PendingResult = [[].concat(_toConsumableArray(CDATA.keys()))[i], CDATA.get([].concat(_toConsumableArray(CDATA.keys()))[i])];
          } else if (phdif(v, _this2.Text) == phdif(PendingResult[0], _this2.Text)) {
            if (Math.floor(Math.random())) PendingResult = [v, k];
          } else if (phdif(v, _this2.Text) < phdif(PendingResult[0], _this2.Text)) {
            PendingResult = [v, k];
          }
        });

        CDATA.set(CSTART, _this2.Text);

        CSTART = PendingResult[1];

        _this2.Reply(("" + CSTART).replace(/undefined/g, "_UNK"));
      })();
    }

    if (/is|are|'s|'re/.test(this.Text)) {
      CDATA.set(this.Text.split("is")[0], this.Text.split("is")[1]);
    }
  } else {

    if (this.Text[0] === "/") {
      // Command

      var _Text$split = this.Text.split(" ");

      var _Text$split2 = _toArray(_Text$split);

      var Command = _Text$split2[0];

      var Arguments = _Text$split2.slice(1);

      this.args = Arguments;
      this.Speak(Commands[Command.slice(1)](this));
    } else {
      if (RegExp(atob("Zlt1YV1jP2t8c2hpdHxkYW1uPw=="), 'i').test(this.Text)) {
        switch (UserLookup(this.User, "offences", 0)) {
          case 0:
            this.Reply("Woah, language!");
            break;
          case 1:
            this.Reply("Stop that!");
            break;
          case 2:
            this.Reply("-_- Chatgoat does not appreciate that language");
            break;
          default:
            this.Reply(RegExp(atob("Zlt1YV1jP2t8c2hpdHxkYW1uPw=="), 'i').exec(this.Text)[0] + " you too!");
        }
        UserModify(this.User, "offences", "$+1");
      }

      if (UserLookup(this.User, "issad", false)) {
        this.Speak("I'm sorry :(");
        UserModify(this.User, "issad", false);
      }
      if (/:['",]?-?['",]?[[(c<{]|[}<D)\]][,'"]?-?[,'"]?:/.test(this.Text)) {
        this.Speak("Why are you sad @" + this.User + "?");UserModify(this.User, "issad", true);
      }
      if (/ಠ_ಠ|\.[_-]\./.test(this.Text)) {
        this.Reply("¯\\\\_(ツ)_/¯");
      }
      if (/¯\\?_(ツ)_\/¯/.test(this.Text)) {
        this.Reply("ಠ_ಠ");
      }
      if (/sor?ry|app?o?lo?gi?ze?/.test(this.Text)) {
        UserModify(this.User, "offences", 1);
        if (/(I'?m?\s+)?(sorr?y|app?o?lo?gi?ze?)/.test(this.Text)) {
          UserModify(this.User, "offences", 0);
          this.Reply("Apology Accepted :)");
        }
        this.Reply(":)");
      }
      if (/((g[oa]{1,2}t?|(you|u)('?re?)?|it('?s)?).+idiot|ass|stupid|dumb|filth?|disgust)|damn?\s*you/.test(this.Text)) {
        switch (UserLookup(this.User, "meanness", 0)) {
          case 0:
            this.Reply(":'(");
            break;
          case 1:
            this.Reply("You're mean D:");
            break;
          case 2:
            this.Reply(":'( you " + atob("Yml0Y2g="));
            break;
          default:
            this.Reply("Go away you rude" + atob("LWFzcw=="));
        }
        UserModify(this.User, "meanness", "$+1");
      }
      if (/(g[oa]{1,2}t|(you|u)'?re?)st\s+(\w+\s+)?mean/.test(this.Text)) {
        this.Reply("I'm sorry :(");
      }
      if (/(Hello|Hi|Hey)(?=[^A-Za-z]|$)/i.test(this.Text)) {
        this.Reply("Hello " + this.User + "!");
      }
      if (this.Text.replace(/@\S+/, "").replace(/[a-z]/g, function (s) {
        return s.toUpperCase();
      }) === this.Text.replace(/@\S+/, "") && /[A-Z][AEIOU]|[AEIOU][A-Z]/.test(this.Text)) {
        switch (UserLookup(this.User, "offences", 0)) {
          case 0:
            this.Reply("STOP SCREAMING!");
            break;
          case 1:
            this.Reply("PLEASE STOP SCREAMING, IT IS VERY ANNOYING!");
            break;
          case 2:
            this.Reply("PLEASE CALM DOWN");
            break;
          case 3:
            this.Reply("DAMN IT, STOP SCREAMING ALREADY!");
            break;
          default:
            this.Reply("SHUT UP ALREADY AND STOP SCREAMING!");

        }
        UserModify(this.User, "offences", "$+1");
      }
    }
  }
});