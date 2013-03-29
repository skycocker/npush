#npush
###Simple push server based on socket.io

##Usage
###Install dependencies with npm

    npm install

###Start the server by running

    node npush.js
    
**Remember to set following environmental variables for its process:**

    PORT - port on which npush will listen to pushes
    SECRET - string which will be used as an authorization token when push is received from outside
    TECHNIQUE - **optional** - set it to "long-polling" if you can't or don't want to use websocket protocol(useful when deploying on Heroku - they don't support websockets)
    
###Client side
**Include**

    socket.io.min.js
    
or

    socket.io.js
    
from

    node_modules/socket.io/node_modules/socket.io-client/dist
    
in your client javascripts. Then, still in javascripts

    var socket = io.connect('http://localhost'); //or any address the server is located at
    socket.on('connection', function () {
      socket.emit('join channel', { channel: 'news' });
      socket.on("news", function(data) {
        console.log(news);
      });
    });
    
to join a channel or

    var socket = io.connect('http://localhost'); //or any address the server is located at
    socket.on('connection', function () {
      socket.emit('set id', { id: window.user.id });
      socket.on("news", function(data) {
        console.log(news);
      });
    });
    
to assign a unique id to the user (window.user.id is just an example, it can be any integer you want).
    
###Server side
In order to send a push notification, you need to issue a POST request to the server. It needs to contain four sections inside its body:

1. **secret** - it has to match the secret set on the server, otherwise you'll get 401 response and nothing will happen
2. **channel** or **user** - depending on the name you'll pick, push will be broadcasted to the given channel or sent directly to a single client
3. **event** - the event name
4. **obj** - the content you want to push

**The request content type has to be application/json.**

You can take a look at the Rails implementation [here](https://github.com/skycocker/npush-rails/blob/master/lib/npush-rails.rb).
