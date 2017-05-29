var inst_counter = 0;
var urls = [];
var vidUrl = '';
var useragent = window.navigator.userAgent.toLowerCase();
var platform = window.navigator.platform.toLowerCase();
var fallbackUrl2 = '';
//var fallbackUrl2 = 'http://live.espx.media/LiveTV/smp_cna.m3u8';
var fallbackUrl3 = '';
//var fallbackUrl3 = 'http://live.espx.media/LiveTV/smp_cna.m3u8';
var fallbackUrl4 = '';
//var fallbackUrl4 = 'http://live.espx.media/LiveTV/smp_cna.m3u8';
var viewportcfg = '';


function plugin0() {
  return document.getElementById('plugin0');
}
plugin = plugin0;
vidIdxArr = ['video1', 'video2', 'video3', 'video4'];
var hls1, hls2, hls3, hls4;
var viewSwitchOk = true;

function addEvent(obj, name, func) {
  if (obj.attachEvent) {
    obj.attachEvent("on" + name, func);
  } else {
    obj.addEventListener(name, func, false);
  }
}
function pluginLoaded() {
  // plugin set to 1+3 for onr2016
  if ( ((-1 === useragent.indexOf("android")) && (-1 < vidUrl.indexOf('multi-viewport'))) || (document.getElementById("plugin0"))) {
      // urls = new Array("espx://verizoncdn.azureedge.net/espfiles/ONR2016CamA.mpd",
      //     "espx://verizoncdn.azureedge.net/espfiles/ONR2016CamC.mpd",
      //     "espx://verizoncdn.azureedge.net/espfiles/ONR2016CamD.mpd",
      //     "espx://verizoncdn.azureedge.net/espfiles/ONR2016CamI.mpd");
    /*urls = new Array("espx://live.espx.media/LiveTV/smp_cna.mpd",
      "espx://live.espx.media/LiveTV/smp_cna.mpd",
      "espx://live.espx.media/LiveTV/smp_cna.mpd",
      "espx://live.espx.media/LiveTV/smp_cna.mpd");*/
    multiplay();
  } else {
    //This function must be kept even if it's not used
    Play();
  }
}

function multiplay() {
  plugin().SMP_PlayWithSource(inst_counter, urls[inst_counter]);
  inst_counter++;
  if (inst_counter <= 4)
    setTimeout(multiplay, 100);
}

function addSMPEvent() {
  addEvent(plugin(), 'firesmpevent', function (param1, param2) {
    console.log('addSMPEvent - '+ param1 + ' - ' + param2);
  });
}

function Play() {
  plugin().play();
}

function Pause() {
  plugin().pause();
}

function Stop() {
  plugin().stop();
}

function tryReloadPlugin() {
  console.log('tryReloadPlugin - plugin0='+ document.getElementById('plugin0'));
  if (document.getElementById('plugin0')) {
    console.log('tryReloadPlugin - valid='+plugin().valid);
    if (!plugin().valid) {
      loadPlugin();
      window.setTimeout(tryReloadPlugin, 5000);
    }
  }
  else {
    loadPlugin();
    window.setTimeout(tryReloadPlugin, 5000);
  }
}


function loadPlugin() {
  console.log('loadPlugin - vidUrl='+vidUrl);
  console.log('loadPlugin - esp='+ document.getElementById('esp'));
  if (document.getElementById('esp')) {
    var pluginNode = document.getElementById('plugin0');
    console.log('Removing plugin0='+pluginNode);
    document.getElementById('esp').removeChild(pluginNode);
    // 1440 X 900 <-- recommended by John
    // 1024 x 576 + (3 * 512 x 288) = 1536 X 864
    // 768 x 432 + (3 * 256 x 144) = 1024 X 432
    // 1024 x 576 + (3 * 256 x 144) = 1280 X 576
    document.getElementById('esp').innerHTML = '<object id="plugin0" type="application/x-smpplayer" width="1440" height="900">'
      + '<param name="src" value="' + vidUrl + '">'
      + '<param name="windowless" value="false" /><param name="ignoreupdate" value="true" /><param name="onload" value="pluginLoaded" />'
      + '<param name="updturl" value="https://backend.southeastasia.cloudapp.azure.com/espxplugin"/>'
      + '<a href="/assets/install/ESPxPlyrPlgn_Inst.exe" target="_blank"> <img src="/assets/images/install.png" alt="Get ESPxPlayer Plugin" style="border-style:none; margin: 120px 0 70px 0;"/></a>'
      + '<br><span style="color:#000; text-align:center">Click <a href="/assets/install/ESPxPlyrPlgn_Inst.exe" target="_blank" style="text-decoration:none;color:#66c2ff"> HERE </a> to download and install ESPxPlayer.</span></object>';
  }
  console.log('loadPlugin - esp1=' + document.getElementById('esp').innerHTML);
}

function KeyUpEvent(e) {
  if (e.keyCode >= 48 && e.keyCode <= 57)
    SetMainDisplay(e.keyCode - 48);
}

function swapView(idx) {
  if (idx > 0) {
    var v1 = $('#video1').parent().children(':first-child');
    var v2 = $('#video1').parent().children(':nth-child(' + (idx) + ')');
    var vn = $('#video1').parent().children(':nth-child(' + (idx + 1) + ')');
    var v1top = v1.position().top;
    var v1left = v1.position().left;
    var v1w = v1.css('width');
    var v1h = v1.css('height');
    var vntop = vn.position().top;
    var vnleft = vn.position().left;
    var vnw = vn.css('width');
    var vnh = vn.css('height');
    //v1.css('top', v3top); v1.css('left', v3left);
    v1.css('width', vnw);
    v1.css('height', vnh);
    //console.log('swapView(' + idx + ')\nv1 index=' + v1.index() + '| top=' + v1top + '| left=' + v1left + '| width=' + v1w + '| height=' + v1h
    //  + '\nvn index=' + vn.index() + '| top=' + vntop + '| left=' + vnleft + '| width=' + vnw + '| height=' + vnh);
    //vn.css('top', v1top); vn.css('left', v1left);
    vn.css('width', v1w);
    vn.css('height', v1h);
    vn.insertBefore(v1);
    if (v2.index() > v1.index()) {
      v1.insertAfter(v2);
    }
    vn[0].play();
    vn[0].muted = false;
    vn[0].controls = true;
    v1[0].play();
    v1[0].muted = true;
    v1[0].controls = false;
    //alert('vidIdxArr=' + vidIdxArr);
    vidIdxArr[0] = vn[0].id;
    vidIdxArr[idx] = v1[0].id;
    //alert('aft vidIdxArr='+vidIdxArr);
    //console.log('after\nv1 index=' + v1.index() + '| top=' + v1.position().top + '| left=' + v1.position().left + '| width=' + v1.css('width') + '| height=' + v1.css('height')
    //  + '\nvn index=' + vn.index() + '| top=' + vn.position().top + '| left=' + vn.position().left + '| width=' + vn.css('width') + '| height=' + vn.css('height'));
  }
}

function load(urls, viewportConfig) {
  viewportcfg = viewportConfig;
  console.log(urls);
  urls = urls;
  vidUrl = urls[0];
  var win = ((-1 != platform.indexOf("win32")) || (-1 != platform.indexOf("win64")));
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var mac = navigator.userAgent.indexOf('Mac OS X') != -1;
  //alert(navigator.userAgent);

  if (document.getElementById('video_name')) {
    document.getElementById("video_name").innerHTML = '<h1>' + videoName + '</h1>';
  }
  if (win) {
    if ((-1 != useragent.indexOf("firefox")) || (-1 != useragent.indexOf("msie")) || (-1 != useragent.indexOf("trident")) || (-1 != useragent.indexOf("qqbrowser")) || (-1 != useragent.indexOf(" se "))) {
      //alert('firefox, msie, et al\nvidUrl='+vidUrl);
      document.body.onkeyup = KeyUpEvent;
      if (document.getElementById('plugin0')) {
        if (!plugin().valid) {
            console.log("Plugin invalid-- retrying")
          window.setTimeout(tryReloadPlugin, 1000);
        }
      } else {
          console.log("Retry loading plugin")
        window.setTimeout(tryReloadPlugin, 1000);
      }
      //if (-1 < vidUrl.indexOf('multi-viewport')) {
      // plugin set to 1+3 for onr2016
        document.getElementById('esp').innerHTML = '<object id="plugin0" type="application/x-smpplayer" width="1440" height="900">'
          + '<param name="src" value="espx://espxlive.azureedge.net/RPiA/live.mpd" />'
          + '<param name="windowless" value="false" />'
          + '<param name="viewportcfg" value="'+viewportcfg+'" /><param name="viewportprm" value="0,0,0,0,1" />'
          + '<param name="updturl" value="https://backend.southeastasia.cloudapp.azure.com:80/espxplugin"/>'
          + '<param name="onload" value="pluginLoaded" /></object>';
      /*} else {
        document.getElementById('esp').innerHTML = '<object id="plugin0" type="application/x-smpplayer" width="720" height="405">'
          + '<param name="src" value=' + vidUrl + ' />'
          + '<param name="windowless" value="false" />'
          + '<param name="updturl" value="https://backend.southeastasia.cloudapp.azure.com/espxplugin"/>'
          + '<param name="onload" value="pluginLoaded" /></object>';
      }*/

    } else if (-1 != useragent.indexOf("edge") && (mode && mode.length > 0)) {
      //alert('Edge!');
      var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd'));
      if ('live' == mode.toLowerCase()) {
        fallbackUrl = fallbackUrl + '.m3u8';
        //alert('Edge (live)\nfallbackUrl=' + fallbackUrl);
        document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;">' +
          '<video id="video1" controls autoplay width="1024px" height="576px" class="col-2-3" style="border:1px solid black"></video>' +
          '<video id="video2" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid red"></video>' +
          '<video id="video3" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #3efa00"></video>' +
          '<video id="video4" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #009cfa"></video></div>';
        if (Hls.isSupported()) {
          var video1 = document.getElementById('video1');
          hls1 = new Hls();
          hls1.loadSource(fallbackUrl);
          hls1.attachMedia(video1);
          hls1.on(Hls.Events.MANIFEST_PARSED, function () {
            video1.play();
            //video1.muted = true;
          });
          video1.onclick = function() { swapView($('#video1').index()) };

          var video2 = document.getElementById('video2');
          hls2 = new Hls();
          hls2.loadSource(fallbackUrl2);
          hls2.attachMedia(video2);
          hls2.on(Hls.Events.MANIFEST_PARSED, function () {
            video2.play();
            video2.muted = true;
          });
          video2.onclick = function() { swapView($('#video2').index()) };

          var video3 = document.getElementById('video3');
          hls3 = new Hls();
          hls3.loadSource(fallbackUrl3);
          hls3.attachMedia(video3);
          hls3.on(Hls.Events.MANIFEST_PARSED, function () {
            video3.play();
            video3.muted = true;
          });
          video3.onclick = function() { swapView($('#video3').index()) };

          var video4 = document.getElementById('video4');
          hls4 = new Hls();
          hls4.loadSource(fallbackUrl4);
          hls4.attachMedia(video4);
          hls4.on(Hls.Events.MANIFEST_PARSED, function () {
            video4.play();
            video4.muted = true;
          });
          video4.onclick = function() { swapView($('#video4').index()) };
        }
      } else {
        if (fallbackUrl2.length > 0) {
          fallbackUrl = fallbackUrl.replace('espfiles', 'mp4files').replace('esp_', 'avc_') + '.mp4';
          //alert('Edge (not live)\nfallbackUrl=' + fallbackUrl);
          document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;">' +
            '<video id="video1" controls autoplay width="768px" height="432px" class="col-2-3"><source src=' + fallbackUrl + ' type="video/mp4" /></video>' +
            '<video id="video2" autoplay muted width="256px" height="144px" class="col-1-3"><source src=' + fallbackUrl2 + ' type="video/mp4" /></video>' +
            '<video id="video3" autoplay muted width="256px" height="144px" class="col-1-3"><source src=' + fallbackUrl3 + ' type="video/mp4" /></video>' +
            '<video id="video4" autoplay muted width="256px" height="144px" class="col-1-3"><source src=' + fallbackUrl4 + ' type="video/mp4" /></video>' +
            ' Your browser does not support HTML5 video, Please update to the latest version.</video></div>';
        } else {
          document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;color:#ffffff;">Please use firefox or IE11 to view VOD content.</div>';
        }
      }
      /*document.getElementById('esp').innerHTML = '<video id="video1" controls autoplay width="1280" height="576">'
        + ' <source src=' + fallbackUrl + ' type="video/mp4" />'
        + ' Your browser does not support HTML5 video, Please update to the latest version.'
        + ' </video>';*/

    } else if (mode && mode.length > 0) {
      if ('live' == mode.toLowerCase()) {
        var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd'))+'.m3u8';
        //alert('Chrome - live\nfallbackUrl=' + fallbackUrl);
        document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;">'+
          '<video id="video1" controls autoplay width="1024px" height="576px" class="col-2-3" style="border:1px solid black"></video>'+
          '<video id="video2" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid red"></video>'+
          '<video id="video3" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #3efa00"></video>'+
          '<video id="video4" autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #009cfa"></video></div>';
        if (Hls.isSupported()) {
          var video1 = document.getElementById('video1');
          hls1 = new Hls();
          hls1.loadSource(fallbackUrl);
          hls1.attachMedia(video1);
          hls1.on(Hls.Events.MANIFEST_PARSED, function () {
            //video1.play();
            //video1.muted = true;
          });
          video1.onclick = function() { swapView($('#video1').index()) };

          var video2 = document.getElementById('video2');
          hls2 = new Hls();
          hls2.loadSource(fallbackUrl2);
          hls2.attachMedia(video2);
          hls2.on(Hls.Events.MANIFEST_PARSED, function () {
            //video2.play();
            video2.muted = true;
          });
          video2.onclick = function() { swapView($('#video2').index()); };

          var video3 = document.getElementById('video3');
          hls3 = new Hls();
          hls3.loadSource(fallbackUrl3);
          hls3.attachMedia(video3);
          hls3.on(Hls.Events.MANIFEST_PARSED, function () {
            //video3.play();
            video3.muted = true;
          });
          video3.onclick = function() { swapView($('#video3').index()); };

          var video4 = document.getElementById('video4');
          hls4 = new Hls();
          hls4.loadSource(fallbackUrl4);
          hls4.attachMedia(video4);
          hls4.on(Hls.Events.MANIFEST_PARSED, function () {
            //video4.play();
            video4.muted = true;
          });
          video4.onclick = function() { swapView($('#video4').index()); };
        }
      } else {
        if (fallbackUrl2.length > 0) {
          //var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd')).replace('espfiles', 'mp4files').replace('esp_','avc_') + '.mp4';
          var fallbackUrl = 'http://espvod.azureedge.net/mp4files/avc_big_buck_bunny_1080p_h264_mov.mp4';
          //alert('Chrome - not live\nfallbackUrl='+fallbackUrl);
          document.getElementById('esp').innerHTML = '<video id="video" class="video-js" controls autoplay preload width="1280" height="576" style="width:1280px;height:576px;margin:0 auto;" poster="onr2016_500.png">'
            + '<source src=' + fallbackUrl + ' type="video/mp4">'
            + '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a> </p>'
            + '</video>';
        } else {
          document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;color:#ffffff;">Please use firefox or IE11 to view VOD content.</div>';
        }
      }
    } else {
      document.getElementById("video_name").innerHTML = "";
      document.getElementById('esp').innerHTML = '<h4>Sorry, your browser is not supported yet, <br/>please use Internet Explore or Mozilla Firefox instead.</h4>'
      document.getElementById('esp').style.display = "block";
    }
  } else if (-1 != useragent.indexOf("android")) {
    //alert('Android');
    if (document.getElementById('esp')) {
      document.getElementById('esp').innerHTML = "<h2 style='color:#eeeeee;'>Please install the <a href='https://play.google.com/store/apps/details?id=com.espxmedia.onr2016&hl=en' target='_blank' style='color:#eeeeee;'>One-North Run ESPxMobile App</a>.</h2>";
      window.setTimeout(function () {
        window.location = vidUrl;
      }, 1);
      $('#switchViewPanel').hide();
      window.open('espx://onr2016', '_blank');
    }

  } else if (iOS || mac) {
    //alert('iOS/Mac');
    if ('live' == mode.toLowerCase()) {
      var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd')) + '.m3u8';
      document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;">' +
        '<video id="video1" playsinline controls autoplay width="1024px" height="576px" class="col-2-3" style="border:1px solid black"src="' + fallbackUrl + '"></video>' +
        '<video id="video2" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid red"src="' + fallbackUrl2 + '"></video>' +
        '<video id="video3" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #3efa00"src="' + fallbackUrl3 + '"></video>' +
        '<video id="video4" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #009cfa"src="' + fallbackUrl4 + '"></video></div>';
      var video1 = document.getElementById('video1');
      video1.onclick = function () {
        swapView($('#video1').index())
      };

      var video2 = document.getElementById('video2');
      video2.onclick = function () {
        swapView($('#video2').index());
      };

      var video3 = document.getElementById('video3');
      video3.onclick = function () {
        swapView($('#video3').index());
      };

      var video4 = document.getElementById('video4');
      video4.onclick = function () {
        swapView($('#video4').index());
      };
    } else {
      if (fallbackUrl2.length > 0) {
        var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd')) + '.mp4';
        document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;">' +
          '<video id="video1" playsinline controls autoplay width="1024px" height="576px" class="col-2-3" style="border:1px solid black"src="' + fallbackUrl + '"></video>' +
          '<video id="video2" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid red"src="' + fallbackUrl2 + '"></video>' +
          '<video id="video3" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #3efa00"src="' + fallbackUrl3 + '"></video>' +
          '<video id="video4" playsinline autoplay muted width="256px" height="144px" class="col-1-3" style="border:1px solid #009cfa"src="' + fallbackUrl4 + '"></video></div>';
        var video1 = document.getElementById('video1');
        video1.onclick = function () {
          swapView($('#video1').index())
        };

        var video2 = document.getElementById('video2');
        video2.onclick = function () {
          swapView($('#video2').index());
        };

        var video3 = document.getElementById('video3');
        video3.onclick = function () {
          swapView($('#video3').index());
        };

        var video4 = document.getElementById('video4');
        video4.onclick = function () {
          swapView($('#video4').index());
        };
      } else {
        document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;color:#ffffff;">Please use firefox or IE11 to view VOD content.</div>';
      }
    }

  } else if (mode && mode.length > 0) {
    //alert('Anything else');
    if ('live' == mode.toLowerCase()) {
      var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd')) + '.m3u8';
      document.getElementById('esp').innerHTML = '<video id="video" controls autoplay></video>';
      if (Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.loadSource(fallbackUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
      }
    } else {
      if (fallbackUrl2.length > 0) {
        var fallbackUrl = 'http' + vidUrl.slice(4, vidUrl.lastIndexOf('.mpd')).replace('espfiles', 'mp4files').replace('esp_', 'avc_') + '.mp4';
        document.getElementById('esp').innerHTML = '<video id="video" class="video-js" controls autoplay preload width="1280" height="576" poster="onr2016_500.png">'
          + '<source src=' + fallbackUrl + ' type="video/mp4">'
          + '<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a> </p>'
          + '</video>';
      } else {
        document.getElementById('esp').innerHTML = '<div style="width:1280px;height:576px;color:#ffffff;">Please use firefox or IE11 to view VOD content.</div>';
      }
    }
  } else {
    document.getElementById("video_name").innerHTML = "";
    document.getElementById('esp').innerHTML = 'Sorry, your system is not supported yet, <br/>please use Internet Explore/Mozilla Firefox on Windows PC or Android devices instead.'
  }
}

/* -- Slide Out Panel -- */
jQuery(document).ready(function ($) {
  $('.cd-btn').on('click', function (event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $(".esp_container").offset().top - 20
      }, 300);
  });

  // Handle ESC key (key code 27)
  document.addEventListener('keyup', function (e) {
    if (e.keyCode == 27) {
      hideMap();
    }
  });
});
/* -- e: Slide Out Panel -- */

/* -- Modal Image -- */

function showMap(imgSrc) {
  var modal = document.getElementById('myModal');
// Get the image and insert it inside the modal - use its "alt" text as a caption
  var img = document.getElementById('myImg');
  var modalImg = document.getElementById("img01");
  modal.style.display = "block";
  modalImg.src = imgSrc;
}

function hideMap() {
  var modal = document.getElementById('myModal');
  modal.style.display = "none";
}
/* -- e: Modal Image -- */

function switchView() {
  viewSwitchOk = true;
  var vidIdx = $('#viewportForm input[name=viewport]:checked').val();
  var newUrl = $('#viewportForm input[name=camera]:checked').val();
  if (!vidIdx) {
    alert('Please select a viewport.');
    viewSwitchOk = false;
  }
  if (viewSwitchOk && !newUrl) {
    alert('Please select a camera.');
    viewSwitchOk = false;
  }
  if (vidIdx && newUrl) {
    if (document.getElementById('plugin0') && plugin().valid) {
      //alert(vidIdx + ' = ' + newUrl);
      plugin().SMP_PlayWithSource(vidIdx, newUrl);
    } else {
      if (Hls.isSupported()) {
        var fallbackUrl = 'http' + newUrl.slice(4, newUrl.lastIndexOf('.mpd')) + '.m3u8';
        //alert(vidIdx + ' = ' + fallbackUrl);
        var tgtVp = document.getElementById(vidIdxArr[vidIdx]);
        //alert(tgtVp.id);
        tgtVp.pause();
        var hls = eval('hls' + (tgtVp.id.substr(5, 1)));
        if (hls) {
          hls.detachMedia();
          hls.loadSource(fallbackUrl);
          hls.attachMedia(tgtVp);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            tgtVp.play();
            //video1.muted = true;
          });
        }
      } else {
        var fallbackUrl = 'http' + newUrl.slice(4, newUrl.lastIndexOf('.mpd')) + '.m3u8';
        //alert(vidIdx + ' = ' + fallbackUrl);
        var tgtVp = document.getElementById('video' + (+vidIdx + 1));
        tgtVp.src = fallbackUrl;
      }
    }
    viewSwitchOk = true;
    $('#viewportForm input[name=viewport]').prop('checked', false);
    $('#viewportForm input[name=camera]').prop('checked', false);
  }
}
