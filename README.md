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
  function() {
  // This function runs whenever a new message occurs
});
```

You can additionally add a function through the `.onmessage` function.


```js
MyChatbot.onmessage = function() {
  // Handle Message
};
```

> **NOTE:** `(formatted)` means that `$Name` will be replaced with the Chatbot's name

---

If you're looking for Chatgoat's source code that's in `chatgoat/`
