/**
 * Created by adityaaggarwal on 31/5/17.
 */
'use strict'

var player1, player2, player3, player4, create_count=false;

function createPlayer(urls, options) {
    Clappr.Log.setLevel(1);

    console.log(urls + options)

    createSecondPlayer();
    createThirdPlayer();
    createFourthPlayer();

    player1 = new Clappr.Player({
        source: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        baseUrl: "http://localhost:8080/latest",
        height: '100%',
        width: '100%',
        plugins: [Player2Plugin, shareLikePlugin],
        parentId: '#container1',
        watermark: "assets/espx_logo_old.png", position: 'top-left',
        hideMediaControl: false,
        autoPlay: true,
        events: {
            onSeek: function(){
                console.log("Player one seeked ")
            },
            onError: function(error){
                console.log("error" +error)
            },
            onReady: function(){
                console.log("ON READY ISSUED" + create_count)
            }
        },
        mediacontrol: {seekbar: "#E113D3", buttons: "#66B2FF" , volumeBar: "#bcff00"}
    });
    player1.getPlugin('click_to_pause').disable();
    return player1;
}

$(document).ready(function() {
    createPlayer("","")
});

var shareLikePlugin = Clappr.UIContainerPlugin.extend({
    name: 'like-share-plugin',
    initialize : function(){

        this.$el.html("<div id='share-like' style='margin-top: 300%'>"+
            "<button  class='btn btn-info' type='button' onclick='createPopup()' ><span class='glyphicon glyphicon-film'></span></button><br/><br/>" +
            "<button  class='btn btn-info' type='button' id='sharelike'><span class='glyphicon glyphicon-heart'></span></button><br/><br/> "+
            "<button  class='btn btn-info' type='button' id='sharelike'><span class='glyphicon glyphicon-paperclip'></span></button>" +
            "</div> "
        );

        this.$el.css('z-index', '10000 !important');
        this.$el.css('position', "absolute");
        this.container.$el.append(this.$el);
    }
})
function createPopup(){
    player1.pause();
    console.log("modalsadasdasdasdsa should popp")
    $( "#myModal" ).dialog({
        dialogClass: "no-close",
        buttons: [
            {
                text: "OK",
                click: function() {
                    $( this ).dialog( "close" );
                    player1.play();
                }
            }
        ]
    });
}


var Player2Plugin = Clappr.UIContainerPlugin.extend({
    name: 'player-2-plugin',
    initialize: function(){
        console.log("INITIALIZE CALLED")

        this.$el.html("<div id='player1controls'>"+
            "<button type='submit' class='btn btn-warning' onclick='onClick(1)'>Chat</button>   ; " +
            "<button type='submit' class='btn btn-danger' onclick='onClick(2)'>Dialogs</button>    ; "+
            "<button type='submit' class='btn btn-info' onclick='onClick(3)'>2</button> ; " +
            "<button type='submit' class='btn btn-info' onclick='onClick(4)'>3</button> ; " +
            "<button type='submit' class='btn btn-info' onclick='onClick(5)'>4</button> ; " +
            "</div> "
        );

        this.$el.css('z-index', '10000 !important');
        this.$el.css('position', "absolute");
        this.container.$el.append(this.$el);
        this.render();
    },
    bindEvents: function(){
        this.listenTo(this.container, Clappr.Events.CONTAINER_PLAY, this.play);
        this.listenTo(this.container, Clappr.Events.CONTAINER_PAUSE, this.pause);
        this.listenTo(this.container, Clappr.Events.CONTAINER_FULLSCREEN, this.fullscreenHandler);
    },
    render: function(){
        return this;
    },
    play: function(){
        player2.play();
        player3.play();
        player4.play();
    },
    seek: function(){
        var current_time = player1.getCurrentTime();
        player2.seek(current_time);
        player3.seek(current_time);
        player4.seek(current_time);
    },
    pause: function(){
        player2.pause();
        player3.pause();
        player4.pause();
    },
    fullscreenHandler: function(){
        console.log("full screend")
        return this;
    }
})

function onClick(button_type) {
    if(button_type === 1) {
        console.log("Button Clicked---->" + "chat")
    }
    else
    if(button_type === 2)
        console.log("Button Clicked---->" + "dialog")

    else
    if(button_type === 3 || button_type === 4 || button_type === 5) {

        var seek_time = player1.getCurrentTime();
        var temp_source;
        if (button_type === 3){
            console.log("switch player 1-2")
            temp_source = player2.options.source;

            player2.configure({
                source: player1.options.source,
            })
            player2.attachTo("#container2")
        }
        else
        if(button_type === 4){
            console.log("switch player 1-3")
            temp_source = player3.options.source;
            player3.configure({
                source: player1.options.source,
            })
            player3.attachTo("#container3")
        }
        else
        if(button_type === 5){
            console.log("switch player 1-4")

            temp_source = player4.options.source;

            player4.configure({
                source: player1.options.source,
            })
            player4.attachTo("#container4")
        }

        player1.configure({
            source: temp_source, //Place the temp source here.
        })

        player1.seek(seek_time)
        player2.seek(seek_time)
        player3.seek(seek_time)
        player4.seek(seek_time)

        player1.play();
    }
}

function  createSecondPlayer(){
    player2 = new Clappr.Player(
        {
            source: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            baseUrl: "http://localhost:8080/latest",
            width: '100%',
            height: '100%',
            autoPlay: true,
            chromeless: true,
        });

    player2.mute();
    player2.attachTo("#container2")
}
function  createThirdPlayer(){
    player3 = new Clappr.Player(
        {
            source: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            baseUrl: "http://localhost:8080/latest",
            width: '100%',
            height: '100%',
            autoPlay: true,
            chromeless: true
        });
    player3.mute();
    player3.attachTo("#container3")

}
function  createFourthPlayer(){
    player4 = new Clappr.Player(
        {
            source: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
            baseUrl: "http://localhost:8080/latest",
            width: '100%',
            height: '100%',
            autoPlay: true,
            chromeless: true
        });

    player4.mute()
    player4.attachTo("#container4")
}
