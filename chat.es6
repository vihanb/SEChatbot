//// chat.js is the transpiled (ES5) version 

// Helper Functions
const Talk = text => { document.getElementById("input").value = text; document.getElementById("sayit-button").click() }
const Data = (text, instance) => text.replace(/\$([A-Za-z$_]+[A-Za-z$_0-9]*)/g, (_, v) => instance[v])

class Chatbot {
  constructor(Name = "a Chatbot", { Startup = "Hi my name is $Name!", UID = 0 } = {}, onmessage) {
    this.Name = Name;
    this.Options = { Startup: Data(Startup, this), UID };
    this.onmessage = onmessage || () => void 0;

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
          message.classList.contains("neworedit");
      }).forEach(message => this.onmessage.call({
        "Text": message.textContent,
        "HTML": message.innerHTML,
        "Raw" : message,
        
        "Reply": this.Reply(message)
      }, this));
    }, 2100);
  }
  Speak(text) { Talk(text) }
  Reply(message) { return Text => Talk(`:${message.id.split("-")[1]} ${Text}`) }
}