(function (document, window) {
    'use-strict';

    _tagg = function () {

        function _send(path, method, props) {
            const url = path;
            const options = {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(props)
            };

            fetch(url, options)
                .then(response => {
                    console.log(response);
                });
        }

        function _init() {
            _pushUserId(_cookieCheckId());
            // _setCookie();
        }

        function _push(props) {
            // console.log(event.target.parentNode);
            _pushUserId(_cookieCheckId());
            props.eventName = props.contentType + '_' + props.eventName + '_' + props.contentTitle;
            props.userId = _cookieRead('_taggUserId');
            props.pagetitle = _pagetitleParser();
            props.pathname = pageOn();
            props.timestamp = new Date();

            // console.log('props', props);

            _send('http://localhost:4000/notagg/track/', 'POST', props);
        }

        // _push datalayer helper functions
        function _pagetitleParser() {
            if (window.location.pathname === "/") {
                return 'home';
            }
        }

        function _setCookie() {

            _send('http://localhost:4000/cookie/create/', 'GET');
        }

        function _pushUserId(userId) {
            console.log('_pushUser:', userId);
            _send('http://localhost:4000/notagg/cookieUserId/', 'POST', {userId: userId, timestamp: new Date()});
        }


        // function to check the user cookie
        //
        function _cookieCheckId() {
            console.log('_cookieCheckId');
            var userId = _cookieRead('_taggUserId');
            var date = new Date();
            if (userId === null) {
                userId = date.getTime().toString(16) + (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString(16);
            }

            date.setTime(date.getTime() + (2 * 365 * 24 * 60 * 60 * 1000)); // expires in 2 years
            _cookieWrite('_taggUserId', userId, location.hostname, new Date(date).toUTCString());

            return userId;
        }

        // cookie functions starts here
        //
        function _cookieGetAll() {
            return dataCookies1(); // return document.cookie
        }

        function _cookieRead(key) {
            var result;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
        }

        function _cookieWrite(name, value, domain, expire) {
            document.cookie = name+"="+value+";domain=."+domain+";path=/;expires="+expire;
        }


        function initTagger() {
            console.log('tagger init: start --->');

            // time
            //
            timeOpened:new Date();
            timezone:(new Date()).getTimezoneOffset()/60;


            //
            //
            console.log('pathname: ', pageOn());
            console.log('referrer: ', referrer());
            console.log('previousSitesLength: ', previousSitesLength());

            // browser data
            //
            // browser cookie data
            console.log('dataCookiesEnabled: ', dataCookiesEnabled());
            console.log('dataCookies1: ', dataCookies1());
            console.log('dataCookies2: ', dataCookies2());
            console.log('dataStorage: ', dataStorage());

        }

        // user data functions starts here
        //
        function pageOn() {
            return window.location.pathname;
        }

        function referrer() {
            return document.referrer;
        }
        
        function previousSitesLength() {
            return history.length;
        }
        
        // browser data
        //
        function dataCookiesEnabled() {
            return navigator.cookieEnabled;
        }

        function dataCookies1() {
            return document.cookie;
        }

        function dataCookies2() {
            return decodeURIComponent(document.cookie.split(";"));
        }

        function dataStorage() {
            return localStorage;
        }

        return {
            init: _init,
            push: _push,
            getCookieUserId: _cookieRead,

            tagger: initTagger
        }
    }();

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return _tagg;
        });
    } else {
        window._tagg = _tagg;
    }
}(document, window))
