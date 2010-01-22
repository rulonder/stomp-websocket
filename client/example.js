$(document).ready(function(){

  var client;

  $('#connect_form').submit(function() {
    url = $("#connect_url").val();
    login = $("#connect_login").val();
    passcode = $("#connect_passcode").val();
    destination = $("#destination").val();

    client = stomp(url);

    // this allows to display debug logs directly on the web page
    client.debug = function(str) {
      $("#debug").append(str + "\n");
    };
    // the client is notified when it is connected to the server.
    client.onconnect = function(frame) {
      debug("connected to Stomp");
      $('#connect').fadeOut({ duration: 'fast' });
      $('#connect').remove();
      $('#send_form_input').removeAttr('disabled');
    };
    // the client is notified when it is disconnected from the server.
    client.ondisconnect = function() {
      debug("disconnected from Stomp");
    };
    // the client is notified every time it receives a message from the server
    client.onreceive = function(message) {
      debug("received " + message);
    };

    // First thing is to connect with the credentials
    client.connect(login, passcode);

    // FIXME simutate opening the web socket
    client.onopen();
    // FIMXE simulate CONNECTED response from the server
    client.onmessage(new Frame("CONNECTED")); // => trigges a call to client.onconnect()

    // Oonce the client is connected, it can send messages to the server
    client.send(destination, {foo: 1}, "hello, world!");

    // Then, the client subscribes to a destination
    client.subscribe(destination);

    // FIXME simulates receiving a message
    message = new Frame("MESSAGE", {destination: destination, foo: 1},
                          "hello, world!");
    client.onmessage(message); // => triggers a call to client.onreceive()

    // The client can unsubscribe from the destination to stop receive messages
    client.unsubscribe(destination)

    // Finally, it disconnects from the server
    client.disconnect(); // => triggers a call to client.ondisconnect()

    return false;
  });
});