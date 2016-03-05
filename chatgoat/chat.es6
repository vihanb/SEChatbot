"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var Talk=function(t){document.getElementById("input").value=t,document.getElementById("sayit-button").click()},Data=function(t,e){return t.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g,function(t,n){return e[n]})},Chatbot=function t(e,n,a){void 0===e&&(e="a Chatbot");var r=this,u=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],s=u.Startup,o=void 0===s?"Hi my name is $Name!":s;_classCallCheck(this,t),this.Name=e,this.Options={Startup:Data(o,this),UID:CHAT.CURRENT_USER_ID},this.onmessage=a||function(){return void 0},this.Queue=[];var i=Symbol("Called");this[i]=new Set,Talk(this.Options.Startup),setInterval(function(){[].concat(_toConsumableArray(document.getElementsByClassName("message"))).filter(function(t,e,n){return r[i].has(t)?!1:(r[i].add(t),(t.parentElement.parentElement.className.match(/user-(\d+)/)||[0,UID])[1]!=UID&&e>n.map(function(t){return t.textContent.trim()}).lastIndexOf(r.Options.Startup))}).forEach(function(t){return r.onmessage.call({Text:t.textContent.trim(),HTML:t.innerHTML,Raw:t,User:t.parentElement.parentElement.getElementsByClassName("username")[0].textContent.trim(),Mentions:[].concat(_toConsumableArray(t.querySelectorAll(".mention"))).map(function(t){return(t.textContext||"").slice(1)}),Speak:function(t){return r.Queue.push(t)},Reply:function(e){return r.Queue.push(":"+t.id.split("-")[1]+" "+e)},Star:function(e){return t.querySelector(".meta > .stars > .vote").click()},"super":r})})},2100),setInterval(function(){r.Queue[0]&&Talk(r.Queue.shift())},2500)};

/*
 * CHATGOAT v2.0
**/
let Admins = new Set(["Doᴡɴɢᴏᴀᴛ", "Chatgoat"]);

let CSTART = "Hello!";
let CONVERSATION = false;
const CDATA = new Map();
const ADATA = [];

const Commands = {
  "help": self => Object.keys(Commands).join(", "),
  "learn": self => (
    Commands[self.args[0]] = () => Data(self.args.slice(1).join(" "), self["super"]),
    "Learned how to " + self.args[0] + "!"),
  "kill": self => Admins.has(self.User) ? "This conversation can serve no purpose anymore, Goodbye." : "I'm sorry " + self.User + " I'm afriad I can't let you do that",
  "start": self => (CONVERSATION = true, CSTART)
};

const UserRecord = new Map();
const UserLookup = (user, prop, value = "") => (
  UserRecord.get(user) ?
  UserRecord.get(user).get(prop) || (UserRecord.get(user).set(prop, value), value) : (
    UserRecord.set(user, new Map([[prop, value]])), value));

const UserModify = (user, prop, value) => (
  UserRecord.get(user).set(prop,
                           typeof value === "string" && value.indexOf('$') > -1 ?
                           eval(value.replace(/\$/g, UserRecord.get(user).get(prop))) : value));

const dist = (a, b) => {
  if (a.length == 0) return b.toLowerCase().length;
  if (b.length == 0) return a.toLowerCase().length;
  let matrix = [];
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

const standardize = s => (s
                          .replace(/ok|k|okay/ig, "okay")
                          .replace(/I'm/ig, "I am")
                          .replace(/wat/ig, "what")
                          .replace(/your(?= an?)/ig, "you're")
                          .replace(/you're/ig, "you are")
                          .replace(/that's/ig, "that is")
                          .replace(/teh/gi, "the")).toLowerCase();

const getfreq = SOURCE => (standardize([...SOURCE].toString()).match(/[A-Za'-z]+/g) || [""]).reduce((R, C) => {
  if (R.has(C.toLowerCase())) R.set(C.toLowerCase(), (R.get(C) || 1) + 1);
  else R.set(C.toLowerCase(), 1);
  return R;
}, new Map());

const plotfc = (src) => {
  // F: new Map([...getfreq(ADATA)].sort((a,b) => b[1] - a[1]))
  const d = [...getfreq(src)].sort((a,b) => a[1] - b[1]);

  if (d.length >= 5) { // Large enough store
    // some fancy complex calculation to detemine stats of lexicon
    const f = d.map((f,i,c) => (c[i+1]||[])[1] - f[1]).slice(0, -1);

    // Length: L3M7
    // Weight: 5 L1.5M2.5
    const wl = d.map(f => [f[0], f[1] * (f[0].length < 3 ? 2 : f[0].length < 7 ? .5 : .75)]);

    return new Map(wl);
  } else { // weight by occurence off sample size
    return new Map(d);
  }
};

const weightphrase = ph => plotfc(ph.concat(ADATA));

const weightdist = (p1, p2) => {

  if (typeof p1 !== "string") p1 = "";
  
  p1 = p1.match(/[A-Za-z'-]+/g) || "RND";
  p2 = p2.match(/[A-Za-z'-]+/g) || "RND";

  if (p1 === "RND" || p2 === "RND") return [Infinity];

  let W = weightphrase(p1);
  let P = weightphrase(p2);

  const weightfactor = 10;

  return p1.map(WORD => {
    return (
      weightfactor  // factoring weight for prescision
      * W.get(WORD) // adjusted semantic frequency weight
    ) *
      Math.min(...p2.map(MATDIF => 
                         dist(WORD, MATDIF) *           // Distance of
                         (weightfactor / P.get(MATDIF)) // The inversed weight semantic frequency
                        )
              );
  });
};

const phdif = (p1, p2) => {
  // console.log(p1);
  return weightdist(p1, p2).reduce((a,b) => a + b); // TODO: improve this
};

let Chatgoat = new Chatbot("Chatgoat", { UID: 180858, Startup: "Hello! My name is $Name!" }, function() {
  if (CONVERSATION) {
    const Trim = s => s.replace(/[^A-Za-z]/g, "").toLowerCase();

    ADATA.push(this.Text);

    if (CDATA.size === 0) {

      CDATA.set(CSTART, this.Text);

    } else if (this.Text.indexOf('@') < 0) {
      let PendingResult = [...CDATA][Math.floor(Math.random() * CDATA.size)];
      CDATA.forEach((v, k) => {
        let DV = phdif(v, this.Text);
        let PV = phdif(PendingResult[0], this.Text);
        if (DV == PV) {
          if (Math.floor(Math.random())) PendingResult = [v, k];
        } else if (DV < PV) {
          PendingResult = [v, k];
        }
      });

      CDATA.set(CSTART, this.Text);

      CSTART = PendingResult[1];

      this.Reply((""+CSTART).replace(/undefined/g, "_UNK").replace(/@\S+\s*/, ""));
    }

    //if (/\b(is|are|'s|'re)/.test(this.Text)) {
    //  CDATA.set(this.Text.split(/\b(is|are|'s|'re)/)[0], this.Text.split(/\b(is|are|'s|'re)/)[1]);
    //}
  } else {

    if (this.Text[0] === "/") {
      // Command

      const [Command, ...Arguments] = this.Text.split(" ");

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
      if (this.Text.replace(/@\S+/, "").replace(/[a-z]/g, s => s.toUpperCase())
          === this.Text.replace(/@\S+/, "") && /[A-Z][AEIOU]|[AEIOU][A-Z]/.test(this.Text)) {
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

setInterval(() => $(".message.pending a:first-child").click(), 1000);