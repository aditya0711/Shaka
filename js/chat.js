$(document).ready(() => {

        //const roomName = '5gdofoXCsOFopRXwDxyxopKASL7zSVpe';
        const roomName = 'GENERAL';

        const myUsername = 'George Clooney';

        const log = (text = 'No text given', title = '', color = false) => {

            let html = $(`<div class="col-sm-3"><p class="text-${color}"><strong>${title}</strong></p></div><div class="col-sm-9 text-${color}">${text}</div>`);

            $('#log').append(html);
            $('body').scrollTop(1E10);

            html.find('pre code').each(function(i, block) {
              hljs.highlightBlock(block);
            });

        };

        const rltmConfig = {
            service: 'socketio', 
            config: {
                endpoint: 'ws://sandbox-websvcs.southeastasia.cloudapp.azure.com',
                uuid: '36c993db-7d2b-4551-8a06-5ab4d80ff4bf'
            }
        };

        const user = rltm(rltmConfig);
        
        log(`<pre><code class='json'>${JSON.stringify(rltmConfig, null, 4)}</pre></code>`, 'Configure', 'info');
        
        let room = user.join(roomName);

        log(`<p>Joining ${roomName}...</p>`, 'Join', 'info');

        room.ready(() => {
            log(`<p>Joined ${roomName}</p>`, 'Connect', 'success');
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
        

        room.on('join', function(uuid, state) {
            log(`<p>User joined ${roomName} with uuid ${uuid}`, 'Join');
        });

        room.on('message', function(uuid, message){
          // --> returns message as an object:
          //     {data: "qwerty", user: { id: "36c993db-7d2b-4551-8a06-5ab4d80ff4bf", name: "George Clooney" }}
          //console.dir(message);
            log(`<p>${message.data}</p>`, message.user.name);
        });

        let state = {lastOnline: new Date()};

        // state set goes here
        room.setState(state).then(function() {
            log(`<p.Setting state as</p><pre><code>${JSON.stringify(state, null, 4)}</code></pre> `, 'Setting State...', 'info');
        });    

        room.on('state', function(uuid, state) {
            log(`<p>State set for <strong>${uuid}</strong></p> <pre><code>${JSON.stringify(state, null, 4)}</code></pre> `, 'State', 'success');
        });
        
        room.on('leave', (uuid) => {
            log(`<p>${uuid} has left</p>`, 'Leave', 'warning');
        });

        room.on('disconnect', (uuid) => {
            log(`<p>${uuid} has been disconnected</p>`, 'Disconnect', 'warning');
        });

        $('form').submit(() => {
            // --> { "data" = "Testing Test Test..." }
            room.publish('{\"data\": \"'+$('#message').val()+'\"}');
            log(`<p>${$('#message').val()}</p>`, 'Sending...', 'info');
            $('#message').val('');
            return false;
        });

    });