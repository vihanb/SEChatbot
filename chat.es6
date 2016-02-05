//// chat.js is the transpiled (ES5) version 

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
        "Text": message.textContent.trim().replace(/([A-Za-z]+\.)+(?:com|org|net|xyz)/g, "http://$&"),
        "HTML": message.innerHTML,
        "Raw" : message,
        "User": message.parentElement.parentElement.getElementsByClassName("username")[0].textContent.trim(),

        // Special Functions
        "Speak": Text => this.Queue.push(Text),
        "Reply": Text => this.Queue.push(`:${message.id.split("-")[1]} ${Text}`),
        "Data" : Text => Data(Text, this),
        
        // Other
        "super": this
      }));
    }, 2100);

    setInterval(() => this.Queue[0] && Talk(this.Queue.shift()), 1000);
  }
}

/*
 * CHATGOAT v2.0
**/
const Admins = new Set(["Doᴡɴɢᴏᴀᴛ", "Chatgoat"]);

const Commands = {
  "help": args => Object.keys(Commands).join(", "),
  "learn": (args, c) => ( Commands[ args[0] ] = () => Data(args.slice(1).join(" "), c), `Learned how to ${args[0]}!`),
};

const Chatgoat = new Chatbot("Chatgoat", { UID: 180858, Startup: "Hello! My name is $Name!" }, function() {
  if (this.Text[0] === "/") { // Command
    let [Command, ...Arguments] = Arguments = this.Text.split(" ");
    this.Speak(
      Commands[Command.slice(1)](Arguments, this)
    );
  } else {
    if (/(Hello|Hi|Hey)(?=[^A-Za-z]|$)/i.test(this.Text)) {
      this.Reply("Hello " + this.User + "!");
    }
  }
});

// EXTRA FUNCTIONS

Commands["golf"] =  args => {
  let len = Math.floor(Math.random()*args.join(" ").length*.5)+1;
  return Array(len).fill().map(() => String.fromCharCode(Math.floor(Math.random()*1200+255))).join("") + " is only " + 
    (Math.floor(Math.random() * (len - 1)) + 1) + " bytes in the " +
    Array(Math.floor(Math.random() * 2) + 2).fill().map(() => String.fromCharCode(Math.floor(Math.random() * 25) + 65)).join("") + "-" +
    Math.floor(Math.random()*Math.pow(10, Math.floor(Math.random() * 4) + 2)) +
    " encoding"
};