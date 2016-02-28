# SEChatbot
A framework for making SE chatbots.

This is an engine which allows you to easily and quickly create SE Chatbot's in JavaScript. The code is in `engine.js`. This engine is written in JavaScript ES6 and transpiled to JavaScript ES5. The original source is in `engine.es6` but use `engine.js` to write your Chatbot.

## Getting Started

Place the code in `engine.js` at the beginning of your program. To start your Chatbot, use:

```js
var MyChatbot = new Chatbot("<CHATBOT NAME>", {
    UID: <USERID OF THE CHATBOT>,
    Startup: "What to say on the chatbot's startup (formatted)"
  },
  function() { // This is the `onmessage` function
  // This function runs whenever a new message occurs
});
```

> **NOTE:** `(formatted)` means that `$Name` will be replaced with the Chatbot's name

> **CAUTION:** Make sure you don't use an ES6 arrow function as a callback as that wont work

## Getting Message Data

You can use `this` within the `onmessage` function to handle the data.

---

Here are all the variables it provides you:

```js
this.Text // The text of the received message 
this.HTML // HTML of the received message (as a string)
this.Raw  // The messages DOM element

this.User     // The username of the user which posted the message
this.Mentions // usernames of all the users @-mentioned in the message
```

Here are the functions you can use:

```js
this.Speak("Hello!") // Says "Hello"
this.Reply("Hello!") // Replied to the receieved message
```

## Example Chatbot

Here's an example:

```js
var Chatgoat = new Chatbot("Chatgoat", { UID: 180858, Startup: "Hello! My name is $Name!" }, function() {
  if (/hello/i.test(this.Text)) this.Reply("Hello!")
});
```

---

If you're looking for Chatgoat's source code that's in `chatgoat/`
