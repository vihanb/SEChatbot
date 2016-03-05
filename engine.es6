const Talk = text => { document.getElementById("input").value = text; document.getElementById("sayit-button").click() }
const Data = (text, instance) => text.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g, (_, v) => instance[v])

class Chatbot {
  constructor(Name = "a Chatbot", { Startup = "Hi my name is $Name!" } = {}, onmessage) {
    this.Name = Name;
    this.Options = { Startup: Data(Startup, this), UID: CHAT.CURRENT_USER_ID };
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
        "Star" : Text => message.querySelector(".meta > .stars > .vote").click(),
        
        "super": this
      }));
    }, 2100);

    setInterval(() => {
      if (this.Queue[0]) Talk(this.Queue.shift());
    }, 2500);
  }
}

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