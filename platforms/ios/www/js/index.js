/*
Course: MAD9022 Cross-Platform App Development
Students: Justin Bennet & Vladimir Tonkonogov
Project: Final App
 */

var app = {
    // Application Constructor
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    canvas: null,
    context: null,
    img: null,
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('DOMContentLoaded', this.onContentLoaded, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // DOMContentLoaded Event Handler function
    //
    onContentLoaded: function () {
        pages = document.querySelectorAll('[data-role="page"]');
        numPages = pages.length;
        links = document.querySelectorAll('[data-role="pagelink"]');
        numLinks = links.length;
        for (var i = 0; i < numLinks; i++) {
            //either add a touch or click listener

            links[i].addEventListener('click', app.handleNav, false);
        }
        app.loadPage(null);
    },

    // Handle the click event

    handleNav: function (ev) {
        ev.preventDefault();
        var href = ev.currentTarget.href;
        var parts = href.split('#');
        console.log('Clicked: page ' + parts[1]);
        app.loadPage(parts[1]);
        return false;
    },

    // Deal with history API and switching between tabs, and enable transitions

    loadPage: function (url) {
        if (url == null) {
            //home page first call
            pages[0].style.display = 'block';
            history.replaceState(null, null, '#home');
        } else {

            for (var i = 0; i < numPages; i++) {
                if (pages[i].id == url) {
                    pages[i].style.display = 'block';
                    pages[i].className = 'active';
                    history.pushState(null, null, '#' + url);
                } else {
                    pages[i].className = '';
                    pages[i].style.display = 'block';
                }
            }
            for (var t = 0; t < numLinks; t++) {
                links[t].className = '';
                if (links[t].href == location.href) {
                    links[t].className = 'activetab';
                }
            }
        }
    },

    // deviceready Event Handler function
    //
    onDeviceReady: function () {
        var deviceID = device.uuid;
        console.log('Device ID: ' + deviceID);
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function () {
        var camlink = document.querySelector('#camlink');
        camlink.addEventListener('click', app.takePhoto);


    },

    takePhoto: function () {
        console.log('takePhoto func');
        //        var sourceType = navigator.camera.PictureSourceType;
        //        var destType = navigator.camera.DestinationType;
        navigator.camera.getPicture(app.cameraSuccess, app.cameraError, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    },

    cameraSuccess: function (imageData) {
        canvas = document.querySelector('#canvas');
        context = canvas.getContext('2d');
        canvas.width = 700;
        canvas.height = 500;
        //        context.drawImage("data:image/jpeg;base64," + imageData, 0, 0, canvas.width, canvas.height);
        img = document.createElement('img');
        img.addEventListener('load', function (ev) {
            console.log(img.width + " " + img.height)
            var imgWidth = ev.currentTarget.width;
            var imgHeight = ev.currentTarget.height;
            var aspectRatio = imgWidth / imgHeight;
            console.log(aspectRatio);
            ev.currentTarget.height = canvas.height;
            ev.currentTarget.width = canvas.height * aspectRatio;
            var w = img.width;
            var h = img.height;
            console.log('width: ', w, ' height: ', h, ' aspect ratio: ', aspectRatio);
            canvas.width = w;
            canvas.style.width = w + 'px';
            context.drawImage(img, 0, 0, w, h);
        });
        img.src = 'data:image/jpeg;base64,' + imageData;
        document.querySelector('#btnAdd').addEventListener('click', app.addText);
    },

    addText: function (ev) {
        var txt = document.querySelector('#txt').value;
        if (txt != '') {
            //clear the canvas
            context.clearRect(0, 0, canvas.w, canvas.h);
            //reload the image
            var w = img.width;
            var h = img.height;
            context.drawImage(img, 0, 0, w, h);
            //THEN add the new text to the image
            var middle = canvas.width / 2;
            if (document.getElementById('radiotop').checked == true) {
                var bottom = canvas.height - 100;
                console.log('raio button top clicked');
            } else {
                var bottom = canvas.height - 50;
            }
            context.font = '30px "Helvetica Neue", Helvetica, Arial, sans-serif';
            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.textAlign = "center";
            context.fillText(txt, middle, bottom);
            context.strokeText(txt, middle, bottom);
        }
        document.querySelector('#btnSave').addEventListener('click', app.saveImage);
    },

    saveImage: function () {

        function createAJAXObj() {
            'use strict';
            try {
                return new XMLHttpRequest();
            } catch (er1) {
                try {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                } catch (er2) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                    } catch (er3) {
                        try {
                            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                        } catch (er4) {
                            try {
                                return new ActiveXObject("Msxml2.XMLHTTP");
                            } catch (er5) {
                                try {
                                    return new ActiveXObject("Microsoft.XMLHTTP");
                                } catch (er6) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }

        function sendRequest(url, callback, postData) {
            'use strict';
            var req = createAJAXObj(),
                method = (postData) ? "POST" : "GET";
            if (!req) {
                return;
            }
            req.open(method, url, true);
            //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
            if (postData) {
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            req.onreadystatechange = function () {
                if (req.readyState !== 4) {
                    return;
                }
                if (req.status !== 200 && req.status !== 304) {
                    return;
                }
                callback(req);
            }
            req.send(postData);
        }
    },

    cameraError: function (message) {
        //        alert('Error: ' + message);
        console.log('Error: ' + message);
    }

};

app.initialize();