var endpoint = `wss://${location.host}`;

var reconnecting = false;
var connect = function() {

  console.info("Connecting to server console...", location.host);

  var socket = new WebSocket(endpoint);
  socket.onmessage = function(event) {
    var { method, args} = JSON.parse(event.data);
    console.log("processing", method, args);
    console[method](...args);
  }

  socket.onopen = () => {
    reconnecting = false;
    console.info("Server console connected!");
  }

  socket.onerror = function(error){
    console.log("WebSocket error: " + error)
  }

  socket.onclose = reconnect;

  // socket.onerror = reconnect;
};

var reconnect = () => {
  if (reconnecting) return;
  reconnecting = true;
  setTimeout(connect, 1000);
};

connect();