var espChat = (function() {
  var room = null;
  return {
    initChat: function(uuid) {
      console.log('initChat...');
      const roomName = 'GENERAL';
      //const roomName = 'general';
      console.log('initChat - uuid=' + uuid);

      const rltmConfig = {
        service: 'socketio',
        config: {
          //endpoint: 'ws://localhost:3030',
          endpoint: 'ws://sandbox-websvcs.southeastasia.cloudapp.azure.com',
          uuid: uuid
        }
      };
      const user = rltm(rltmConfig);
      var prnConfig = document.createElement('DIV');
      prnConfig.appendChild(document.createTextNode(JSON.stringify(rltmConfig, null, 2)));
      $('#chatlogs').append(prnConfig);
      $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);

      room = user.join(roomName);
      var prnJoining = document.createElement('DIV');
      prnJoining.appendChild(document.createTextNode('Joining ' + roomName));
      prnJoining.style.fontSize = '0.8em';
      $('#chatlogs').append(prnJoining);
      $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);

      room.ready(function() {
        var prnJoined = document.createElement('DIV');
        prnJoined.appendChild(document.createTextNode('Joined ' + roomName));
        prnJoined.style.fontSize = '0.8em';
        $('#chatlogs').append(prnJoined);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
      });

      /* --> Do not use for now.
       room.here().then((users) => {
       log(`<pre><code>${JSON.stringify(users, null, 4)}</pre></code>`, 'Here', 'info');
       });*/

      /* --> Do not use for now.
       room.history().then(function(history) {
       let i = 0;
       while(i < 5) {
       if(history[i]) {
       log(`<pre><code>${JSON.stringify(history[i], null, 4)}</pre></code>`, 'History', 'muted');
       }
       i++;
       }

       }, function() {
       });*/

      room.socket.on('error', function(error) {
        alert('error=' + error);
        var prnOnError = document.createElement('DIV');
        prnOnError.appendChild(document.createTextNode(error));
        prnOnError.style.fontSize = '0.8em';
        prnOnError.style.color = '#ffeeee';
        $('#chatlogs').append(prnOnError);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
      });

      room.socket.on('senderr', function(error) {
        alert('senderr=' + error);
        var prnOnError = document.createElement('DIV');
        prnOnError.appendChild(document.createTextNode(error));
        prnOnError.style.fontSize = '0.8em';
        prnOnError.style.color = '#ffeeee';
        $('#chatlogs').append(prnOnError);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
      });

      room.on('join', function(uuid1, state) {
        var prnOnJoin = document.createElement('DIV');
        prnOnJoin.appendChild(document.createTextNode('User joined ' + roomName + ' with uuid ' + uuid1));
        prnOnJoin.style.fontSize = '0.8em';
        $('#chatlogs').append(prnOnJoin);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append('User joined ' + roomName + ' with uuid ' + uuid1 + '\n\n');
      });

      room.on('message', function(uuid1, message) {
        // --> returns message as an object:
        //     {data: "qwerty", user: { id: "36c993db-7d2b-4551-8a06-5ab4d80ff4bf", name: "George Clooney" }}
        //console.dir(message);
        var now = new Date();
        var dateStr;
        now.setDate(now.getDate() + 20);
        dateStr = (now.getFullYear() + '/' + ('0' + (now.getMonth() + 1)).slice(-2) + '/' + ('0' + now.getDate()).slice(-2) + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());

        var prnOnMsg = document.createElement('DIV');
        var prnOnMsgPre = document.createElement('DIV');
        prnOnMsgPre.appendChild(document.createTextNode(message.user.name + ' (' + dateStr + ')'));
        prnOnMsgPre.style.marginBottom = '0px';
        var msgBubble = document.createElement('DIV');
        msgBubble.appendChild(document.createTextNode(message.data));
        //console.log('uuid='+uuid+'| uuid1='+uuid1);
        if (uuid === uuid1) {
          prnOnMsgPre.style.float = 'right';
          // talk-bubble tri-right round border right-top
          msgBubble.classList.add('talk-bubble-right');
          msgBubble.classList.add('tri-right');
          msgBubble.classList.add('round');
          msgBubble.classList.add('border');
          msgBubble.classList.add('right-top');
          msgBubble.style.clear = 'right';
        } else {
          // talk-bubble tri-right round border left-top
          msgBubble.classList.add('talk-bubble');
          msgBubble.classList.add('tri-right');
          msgBubble.classList.add('round');
          msgBubble.classList.add('border');
          msgBubble.classList.add('left-top');
          msgBubble.style.clear = 'left';
        }
        prnOnMsg.appendChild(prnOnMsgPre);
        prnOnMsg.appendChild(msgBubble);
        prnOnMsg.style.clear = 'both';
        $('#chatbox').append(prnOnMsg);
        //$('#chatbox').append(message.user.name + ' -> ' + message.data + '\n\n');
        $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
      });

      var state = {lastOnline: new Date()};

      // state set goes here
      room.setState(state).then(function() {
        var prnSetState = document.createElement('DIV');
        prnSetState.appendChild(document.createTextNode('Setting state to ' + JSON.stringify(state, null, 2)));
        prnSetState.style.fontSize = '0.8em';
        $('#chatlogs').append(prnSetState);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append('Setting state to ' + JSON.stringify(state, null, 2) + '\n\n');
      });

      room.on('state', function(uuid1, state) {
        var prnOnState = document.createElement('DIV');
        prnOnState.appendChild(document.createTextNode('State set for ' + uuid1 + ' : ' + JSON.stringify(state, null, 2)));
        prnOnState.style.fontSize = '0.8em';
        $('#chatlogs').append(prnOnState);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append('State set for ' +uuid1 + ' : ' + JSON.stringify(state, null, 2) + '\n\n');
      });

      room.on('leave', function(uuid1) {
        var prnOnLeave = document.createElement('DIV');
        prnOnLeave.appendChild(document.createTextNode(uuid1 + ' has left.'));
        prnOnLeave.style.fontSize = '0.8em';
        $('#chatlogs').append(prnOnLeave);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append(uuid1 + ' has left.\n\n');
      });

      room.on('disconnect', function(uuid1) {
        var prnOnDisconnect = document.createElement('DIV');
        prnOnDisconnect.appendChild(document.createTextNode(uuid1 + ' has been disconnected.'));
        prnOnDisconnect.style.fontSize = '0.8em';
        $('#chatlogs').append(prnOnDisconnect);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append(uuid1 + ' has been disconnected.\n\n');
      });
    },
    sendMessage: function() {
      if ($('#message').val() != '') {
        // --> { "data" = "Testing Test Test..." }
        room.publish('{\"data\": \"' + $('#message').val() + '\"}');

        var prnSend = document.createElement('DIV');
        prnSend.appendChild(document.createTextNode('Sending ' + $('#message').val()));
        $('#chatlogs').append(prnSend);
        $('#chatlogs').scrollTop($('#chatbox')[0].scrollHeight);
        //$('#chatbox').append('Sending ' + $('#message').val() + '\n\n');
        $('#message').val('');
        $('#message').focus();
        return false;
      }
    }
  }

})(espChat || {});
