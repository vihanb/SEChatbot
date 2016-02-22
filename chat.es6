// chat.js is the transpiled (ES5) version 

// Helper Functions
const Talk = text => { document.getElementById("input").value = text; document.getElementById("sayit-button").click() }
const Data = (text, instance) => text.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g, (_, v) => instance[v])

class Chatbot {
  constructor(Name = "a Chatbot", { Startup = "Hi my name is $Name!", UID = 0 } = {}, onmessage) {
    this.Name = Name;
    this.Options = { Startup: Data(Startup, this), UID };
    this.onmessage = onmessage || () => void 0;

    this.Queue = [];
    // Private
    let Called = Symbol("Called");

    this[Called] = new Set();

    // Startup
    Talk(this.Options.Startup);

    // Read
    setInterval(() => {
      [...document.getElementsByClassName("message")].filter((message, index, transcript) => {
        if (this[Called].has(message)) return false;
        else this[Called].add(message);
        return ( message.parentElement.parentElement.className.match(/user-(\d+)/) || [0, UID] )[1] != UID &&
          index > transcript.map(t => t.textContent.trim()).lastIndexOf(this.Options.Startup)
      }).forEach(message => this.onmessage.call({
        "Text": message.textContent.trim()/*.replace(/\b[a-z\.]+(?:com|org|net|xyz)/g, "http://$&")*/,
        "HTML": message.innerHTML,
        "Raw" : message,

        "User": message.parentElement.parentElement.getElementsByClassName("username")[0].textContent.trim(),

        "Mentions": [...message.querySelectorAll(".mention")].map(m => (m.textContext||"").slice(1)),

        "Speak": Text => this.Queue.push(Text),
        "Reply": Text => this.Queue.push(`:${message.id.split("-")[1]} ${Text}`),

        "super": this
      }));
    }, 2100);

    setInterval(() => {
      if (this.Queue[0]) Talk(this.Queue.shift());
    }, 1000);
  }
}

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

const getfreq = SOURCE => ([...SOURCE].toString().match(/[A-Za-z]+/g) || [""]).reduce((R, C) => {
  if (R.has(C.toLowerCase())) R.set(C.toLowerCase(), R.get(C) + 1);
  else R.set(C.toLowerCase(), 1);
  return R;
}, new Map());

const plotfc = (src) => {
  // F: new Map([...getfreq(CDATA)].sort((a,b) => b[1] - a[1]))
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

const weightdist = (p1 = "", p2) => {

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

    } else if (this.Mentions.length < 1) {
      let PendingResult = [];
      CDATA.forEach((v, k) => {
        console.log(v, this.Text, PendingResult[0]);
        if (!PendingResult[0]) {
          let i = Math.floor(Math.random() * CDATA.size);
          PendingResult = [[...CDATA.keys()][i], CDATA.get([...CDATA.keys()][i])];
        } else if (phdif(v, this.Text) == phdif(PendingResult[0], this.Text)) {
          if (Math.floor(Math.random())) PendingResult = [v, k];
        } else if (phdif(v, this.Text) < phdif(PendingResult[0], this.Text)) {
          PendingResult = [v, k];
        }
      });

      CDATA.set(CSTART, this.Text);
      
      CSTART = PendingResult[1];

      this.Reply((""+CSTART).replace(/undefined/g, "_UNK"));
    }

    if (/is|are|'s|'re/.test(this.Text)) {
      CDATA.set(this.Text.split("is")[0], this.Text.split("is")[1]);
    }
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