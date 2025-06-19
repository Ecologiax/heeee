jQuery.format = function jQueryFormat(c) { if (arguments.length <= 1) { return c } var b = arguments.length - 2; for (var a = 0; a <= b; ++a) { c = c.replace(new RegExp("\\{" + a + "\\}", "gi"), arguments[a + 1]) } return c }; jQuery.pad = function jQueryPad(c, b, a) { c = c.toString(); if (arguments.length <= 2) { return c } while (c.length < b) { c = a.toString() + c } return c };

/*
* jQuery JSON Plugin
* version: 2.1 (2009-08-14)
*
* This document is licensed as free software under the terms of the
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
* website's http://www.json.org/json2.js, which proclaims:
* "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
* I uphold.
*
* It is also influenced heavily by MochiKit's serializeJSON, which is 
* copyrighted 2005 by Bob Ippolito.
*/

(function($) {
    /** jQuery.toJSON( json-serializble )
    Converts the given argument into a JSON respresentation.

        If an object has a "toJSON" function, that will be used to get the representation.
    Non-integer/string keys are skipped in the object, as are keys that point to a function.

        json-serializble:
    The *thing* to be converted.
    **/
    $.toJSON = function(o) {
        if (typeof (JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o);

        var type = typeof (o);

        if (o === null)
            return "null";

        if (type == "undefined")
            return undefined;

        if (type == "number" || type == "boolean")
            return o + "";

        if (type == "string")
            return $.quoteString(o);

        if (type == 'object') {
            if (typeof o.toJSON == "function")
                return $.toJSON(o.toJSON());

            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();

                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;

                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;

                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;

                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds +
                             '.' + milli + 'Z"';
            }

            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push($.toJSON(o[i]) || "null");

                return "[" + ret.join(",") + "]";
            }

            var pairs = [];
            for (var k in o) {
                var name;
                var type = typeof k;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys

                if (typeof o[k] == "function")
                    continue;  //skip pairs where the value is a function.

                var val = $.toJSON(o[k]);

                pairs.push(name + ":" + val);
            }

            return "{" + pairs.join(", ") + "}";
        }
    };

    /** jQuery.evalJSON(src)
    Evaluates a given piece of json source.
    **/
    $.evalJSON = function(src) {
        if (typeof (JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };

    /** jQuery.secureEvalJSON(src)
    Evals JSON in a way that is *more* secure.
    **/
    $.secureEvalJSON = function(src) {
        if (typeof (JSON) == 'object' && JSON.parse)
            return JSON.parse(src);

        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** jQuery.quoteString(string)
    Returns a string-repr of a string, escaping quotes intelligently.  
    Mostly a support function for toJSON.
    
    Examples:
    >>> jQuery.quoteString("apple")
    "apple"
        
    >>> jQuery.quoteString('"Where are we going?", she asked.')
    "\"Where are we going?\", she asked."
    **/
    $.quoteString = function(string) {
        if (string.match(_escapeable)) {
            return '"' + string.replace(_escapeable, function(a) {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };

    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;

    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
})(jQuery);

/*
* ----------------------------- JSTORAGE -------------------------------------
* Simple local storage wrapper to save data on the browser side, supporting
* all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
*
* Copyright (c) 2010 Andris Reinman, andris.reinman@gmail.com
* Project homepage: www.jstorage.info
*
* Licensed under MIT-style license:
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

/**
* $.jStorage
* 
* USAGE:
*
* jStorage requires Prototype, MooTools or jQuery! If jQuery is used, then
* jQuery-JSON (http://code.google.com/p/jquery-json/) is also needed.
* (jQuery-JSON needs to be loaded BEFORE jStorage!)
*
* Methods:
*
* -set(key, value)
* $.jStorage.set(key, value) -> saves a value
*
* -get(key[, default])
* value = $.jStorage.get(key [, default]) ->
*    retrieves value if key exists, or default if it doesn't
*
* -deleteKey(key)
* $.jStorage.deleteKey(key) -> removes a key from the storage
*
* -flush()
* $.jStorage.flush() -> clears the cache
* 
* -storageObj()
* $.jStorage.storageObj() -> returns a read-ony copy of the actual storage
* 
* -storageSize()
* $.jStorage.storageSize() -> returns the size of the storage in bytes
*
* -index()
* $.jStorage.index() -> returns the used keys as an array
* 
* <value> can be any JSON-able value, including objects and arrays.
*
**/

(function($) {
    if (!$ || !($.toJSON || Object.toJSON || window.JSON)) {
        throw new Error("jQuery, MooTools or Prototype needs to be loaded before jStorage!");
    }

    var 
    /* This is the object, that holds the cached values */
        _storage = {},

    /* Actual browser storage (localStorage or globalStorage['domain']) */
        _storage_service = { jStorage: "{}" },

    /* DOM element for older IE versions, holds userData behavior */
        _storage_elm = null,

    /* How much space does the storage take */
        _storage_size = 0,

    /* function to encode objects to JSON strings */
        json_encode = $.toJSON || Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify)),

    /* function to decode objects from JSON strings */
        json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str) {
            return String(str).evalJSON();
        },

    /* which backend is currently used */
        _backend = false;

    /**
    * XML encoding and decoding as XML nodes can't be JSON'ized
    * XML nodes are encoded and decoded if the node is the value to be saved
    * but not if it's as a property of another object
    * Eg. -
    *   $.jStorage.set("key", xmlNode);        // IS OK
    *   $.jStorage.set("key", {xml: xmlNode}); // NOT OK
    */
    _XMLService = {

        /**
        * Validates a XML node to be XML
        * based on jQuery.isXML function
        */
        isXML: function(elm) {
            var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        },

        /**
        * Encodes a XML node to string
        * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
        */
        encode: function(xmlNode) {
            if (!this.isXML(xmlNode)) {
                return false;
            }
            try { // Mozilla, Webkit, Opera
                return new XMLSerializer().serializeToString(xmlNode);
            } catch (E1) {
                try {  // IE
                    return xmlNode.xml;
                } catch (E2) { }
            }
            return false;
        },

        /**
        * Decodes a XML node from string
        * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
        */
        decode: function(xmlString) {
            var dom_parser = ("DOMParser" in window && (new DOMParser()).parseFromString) ||
                        (window.ActiveXObject && function(_xmlString) {
                            var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                            xml_doc.async = 'false';
                            xml_doc.loadXML(_xmlString);
                            return xml_doc;
                        }),
                resultXML;
            if (!dom_parser) {
                return false;
            }
            resultXML = dom_parser.call("DOMParser" in window && (new DOMParser()) || window, xmlString, 'text/xml');
            return this.isXML(resultXML) ? resultXML : false;
        }
    };

    $.fn.remainingCharacterCounter = function (limit, counter) {
        /// <summary>Updates the remaining characters counter.</summary>
        function updateCounter() {
            var text = $(this).val();
            var newLines = (text.match(/\n/g) || []).length;
            var remainingCharacters = limit - text.length - newLines;
            counter.html("(" + remainingCharacters + ")");
            return true;
        }

        return this.each(function () {
            updateCounter.call(this);
            $(this).on('keyup blur paste change', updateCounter);
        });
    };

    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
    * Initialization function. Detects if the browser supports DOM Storage
    * or userData behavior and behaves accordingly.
    * @returns undefined
    */
    function _init() {
        /* Check if browser supports localStorage */
        var isLocalStorage = false;
        try {
            isLocalStorage = (window.localStorage);
        } catch (e) {
            isLocalStorage = false;
        }
        if (isLocalStorage) {
            try {
                _storage_service = window.localStorage;
                _backend = "localStorage";
            } catch (E3) { /* Firefox fails when touching localStorage and cookies are disabled */ }
        }
        /* Check if browser supports globalStorage */
        else if (window.globalStorage) {
            try {
                _storage_service = window.globalStorage[window.location.hostname];
                _backend = "globalStorage";
            } catch (E4) { /* Firefox fails when touching localStorage and cookies are disabled */ }
        }
        /* Check if browser supports userData behavior */
        else {
            _storage_elm = document.createElement('link');
            if (_storage_elm.addBehavior) {

                /* Use a DOM element to act as userData storage */
                _storage_elm.style.behavior = 'url(#default#userData)';

                /* userData element needs to be inserted into the DOM! */
                document.getElementsByTagName('head')[0].appendChild(_storage_elm);

                _storage_elm.load("jStorage");
                var data = "{}";
                try {
                    data = _storage_elm.getAttribute("jStorage");
                } catch (E5) { }
                _storage_service.jStorage = data;
                _backend = "userDataBehavior";
            } else {
                _storage_elm = null;
                return;
            }
        }

        /* if jStorage string is retrieved, then decode it */
        if (_storage_service.jStorage) {
            try {
                _storage = json_decode(String(_storage_service.jStorage));
            } catch (E6) { _storage_service.jStorage = "{}"; }
        } else {
            _storage_service.jStorage = "{}";
        }
        _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;
    }

    /**
    * This functions provides the "save" mechanism to store the jStorage object
    * @returns undefined
    */
    function _save() {
        try {
            _storage_service.jStorage = json_encode(_storage);
            // If userData is used as the storage engine, additional
            if (_storage_elm) {
                _storage_elm.setAttribute("jStorage", _storage_service.jStorage);
                _storage_elm.save("jStorage");
            }
            _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;
        } catch (E7) { /* probably cache is full, nothing is saved this way*/ }
    }

    /**
    * Function checks if a key is set and is string or numberic
    */
    function _checkKey(key) {
        if (!key || (typeof key != "string" && typeof key != "number")) {
            throw new TypeError('Key name must be string or numeric');
        }
        return true;
    }

    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    $.jStorage = {
        /* Version number */
        version: "0.1.4.1",

        /**
        * Sets a key's value.
        * 
        * @param {String} key - Key to set. If this value is not set or not
        *              a string an exception is raised.
        * @param value - Value to set. This can be any value that is JSON
        *              compatible (Numbers, Strings, Objects etc.).
        * @returns the used value
        */
        set: function(key, value) {
            _checkKey(key);
            if (_XMLService.isXML(value)) {
                value = { _is_xml: true, xml: _XMLService.encode(value) };
            }
            _storage[key] = value;
            _save();
            return value;
        },

        /**
        * Looks up a key in cache
        * 
        * @param {String} key - Key to look up.
        * @param {mixed} def - Default value to return, if key didn't exist.
        * @returns the key value, default value or <null>
        */
        get: function(key, def) {
            _checkKey(key);
            if (key in _storage) {
                if (typeof _storage[key] == "object" &&
                        _storage[key]._is_xml &&
                            _storage[key]._is_xml) {
                    return _XMLService.decode(_storage[key].xml);
                } else {
                    return _storage[key];
                }
            }
            return typeof (def) == 'undefined' ? null : def;
        },

        /**
        * Deletes a key from cache.
        * 
        * @param {String} key - Key to delete.
        * @returns true if key existed or false if it didn't
        */
        deleteKey: function(key) {
            _checkKey(key);
            if (key in _storage) {
                delete _storage[key];
                _save();
                return true;
            }
            return false;
        },

        /**
        * Deletes everything in cache.
        * 
        * @returns true
        */
        flush: function() {
            _storage = {};
            _save();
            /*
            * Just to be sure - andris9/jStorage#3
            */
            try {
                window.localStorage.clear();
            } catch (E8) { }
            return true;
        },

        /**
        * Returns a read-only copy of _storage
        * 
        * @returns Object
        */
        storageObj: function() {
            function F() { }
            F.prototype = _storage;
            return new F();
        },

        /**
        * Returns an index of all used keys as an array
        * ['key1', 'key2',..'keyN']
        * 
        * @returns Array
        */
        index: function() {
            var index = [], i;
            for (i in _storage) {
                if (_storage.hasOwnProperty(i)) {
                    index.push(i);
                }
            }
            return index;
        },

        /**
        * How much space in bytes does the storage take?
        * 
        * @returns Number
        */
        storageSize: function() {
            return _storage_size;
        },

        /**
        * Which backend is currently in use?
        * 
        * @returns String
        */
        currentBackend: function() {
            return _backend;
        }
    };

    // Initialize jStorage
    _init();

})(window.jQuery || window.$);

/*
  jQuery-fireEvent v0.2, by Francois-Guillaume Ribreau.

  http://blog.fgribreau.com/2010/08/jquery-fireevent-plugin-for-firing-real.html

  Copyright (c)2010 Francois-Guillaume Ribreau. All rights reserved.
  Released under the Creative Commons BY-SA Conditions.
    http://creativecommons.org/licenses/by-sa/3.0/

  Usage:
    $('#button').fireEvent('click').text('Event sent');
*/

(function($, undefined) {

    $.fireEvent = function(el, eventName, opt) {
        if (el === undefined)
            return false;
        
        if('jquery' in el){
          el = el[0];
        }

    if(!evts[eventName]){
            return false;
    }
    
    var evt;
    
        if (typeof(document.createEvent) != 'undefined') {//W3C way
            evt = document.createEvent(evts[eventName].w3c);
            evts[eventName].initEvt(evt, el, opt);
            el.dispatchEvent(evt);

        } else {//IE
            if (eventName == 'click') { 
                // we use jquery to fire the click event because of a bug in IE7-8
                $(el).click();
            } else {
                el.fireEvent(evts[eventName].ie);
            }
        }
    };

    $.fn.fireEvent = function(eventName, opt) {
        if (this.length == 0)
            return this;

        $.fireEvent.call({},this[0], eventName, opt);

        return this;
    };

    /* -- Event cross-browser implementation -- */
    var evts = {
        'click': {//Tested/Work with Firefox 3.6 & Safari 5.0.1 & Chromium 6.0
            ie: 'onclick',
            w3c: 'MouseEvents',
            initEvt: function(evt, target, opt) {
                var _def = $.extend({
                        type: 'click',
                        canBubble: true,
                        cancelable: true,
                        view: window,
                        detail: 1,
                        screenX: 1,
                        screenY: 1,
                        clientX: 1,
                        clientY: 1,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        button: 0,
                        relatedTarget: target}, opt);

                evt.initMouseEvent(_def.type,
                _def.canBubble, _def.cancelable, _def.view, _def.detail,
                _def.screenX, _def.screenY, _def.clientX, _def.clientY,
                _def.ctrlKey, _def.altKey, _def.shiftKey, _def.metaKey, _def.button, _def.relatedTarget);
            }
        },

        'dblclick': {//Tested/Work with Firefox 3.6 & Safari 5.0.1 & Chromium 6.0
            ie: 'ondblclick',
            w3c: 'MouseEvents',
            initEvt: function(evt, target, opt) {
                evts['click'].initEvt(evt, target, $.extend({type: 'dblclick'}, opt));
            }
        },

        'keyup': {//Tested/Work with Firefox 3.6 & Safari 5.0.1 & Chromium 6.0 (not opera)
            ie: 'onkeyup',
            w3c: 'KeyboardEvent',
            initEvt: function(evt, target, opt) {
                var _def = $.extend({keyCode: null, CharCode: null}, opt);
        //initKeyboardEvent doesn't work with Opera (tested with Firefox 3.6 & Safari 5.0.1)
                evt.initKeyboardEvent('keyup', true, true, window, false, false, false, false, _def.keyCode, _def.CharCode)
            }

        },
        
        'blur': {//Tested/Work with Firefox 3.6 & Safari 5.0.1 & Chromium 6.0
            ie: 'onblur',
            w3c: 'HTMLEvents',
            initEvt: function(evt, target, opt) {
                evt.initEvent('blur', true, true);
            }

        },
        
        'change': {//Tested/Work with Firefox 3.6 & Safari 5.0.1 & Chromium 6.0
            ie: 'onchange',
            w3c: 'HTMLEvents',
            initEvt: function(evt, target, opt) {
                evt.initEvent('change', true, true);
            }
        }
    };

})(jQuery);

function getAbsolutePath() {
    ///	<summary>getAbsolutePath get the absolute url path</summary>
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}

/*
Exception and Debug Logging to the server side (Synxis.Enterprise.Logging)
*/
function LogError(error, appendMessage) {
    ///	<summary>LogError logs the error to the ajax call server side Logging</summary>
    ///	<param name="error" type="object"> exception object</param>
    ///	<param name="appendMessage" type="String"> append message</param>
    LogError(error, appendMessage, '');
}

function LogError(error, appendMessage, appCode) {
    ///	<summary>LogError logs the error to the ajax call server side Logging</summary>
    ///	<param name="error" type="object"> exception object</param>
    ///	<param name="appendMessage" type="String"> append message</param>
    ///	<param name="appCode" type="String">logging appcode for better searches within splunk</param>
    LogErrorWithPostUrl(error, appendMessage, appCode, '');
};

function LogErrorWithPostUrl(error, appendMessage, appCode, postUrl) {
    ///	<summary>LogError logs the error to the ajax call server side Logging</summary>
    ///	<param name="error" type="object"> exception object</param>
    ///	<param name="appendMessage" type="String"> append message</param>
    ///	<param name="appCode" type="String">logging appcode for better searches within splunk</param>
    ///	<param name="postUrl" type="String">CUstom url for Post logging call</param>
    var message = 'Unknown error';
    if (typeof error == 'string' || typeof error == 'String')
        HandleLogging(4, error, null, '', postUrl);
    else {
        var exception = {};
        exception.appcode = appCode;
        exception.message = (jQuery.browser.msie) ? error.description : error.message;
        exception.url = (jQuery.browser.msie) ? '' : error.fileName;
        exception.lineNumber = (jQuery.browser.msie) ? (error.number & 0xFFFF) : error.lineNumber;
        exception.stackTrace = (typeof (error.stack) != 'undefined') ? error.stack : '';
        exception.name = error.name;
        if (typeof (appendMessage) != 'undefined')
            exception.appendMessage = appendMessage;
        else
            exception.appendMessage = '';
        HandleLogging(4, '', exception, '', postUrl);
    }
};

function LogDebug(message) {
    ///	<summary>LogDebug logs the dugging info to the ajax call server side Logging</summary>
    ///	<param name=message" type="String">message</param>
    LogDebug(message, '');
}
function LogDebug(message, appCode) {
    ///	<summary>LogDebug logs the dugging info to the ajax call server side Logging</summary>
    ///	<param name="message" type="String">message</param>
    ///	<param name="appCode" type="String">logging appcode for better searches within splunk</param>
    HandleLogging(2, message, null, appCode,'');
}

function HandleLogging(type, message, exception, appCode, postUrl) {
    ///	<summary>HandleLogging handles the ajax call server side Logging</summary>
    ///	<param name="type" type="int"> 2=debuging; 4=Error</param>
    ///	<param name="exception" type="object"> contains the exception information</param>
    ///	<param name="appCode" type="String">logging appcode for better searches within splunk</param>
    var jsException = {};
    jsException.Type = type;
    var browser = 'IE';
    if (jQuery.browser.opera)
        browser = 'Opera';
    else if (jQuery.browser.safari)
        browser = 'Safari';
    else if (jQuery.browser.mozilla)
        browser = 'FireFox (mozilla)';
    jsException.Browser = browser;
    jsException.BrowserVersion = jQuery.browser.version;
    if (exception != null) {
        jsException.AppCode = exception.appcode;
        jsException.Message = exception.message;
        jsException.Url = exception.url;
        jsException.LineNumber = exception.lineNumber;
        jsException.AppendMessage = exception.appendMessage;
        jsException.StackTrace = exception.stackTrace;
        jsException.Name = exception.name;
    } else {
        jsException.AppCode = appCode;
        jsException.Message = message;
        jsException.LineNumber = null;
        jsException.Url = '';
        jsException.AppendMessage = '';
        jsException.StackTrace = '';
        jsException.Name = '';
    }

    var dto = { 'jsException': jsException };
    var url = $.IsNullOrEmpty(postUrl) ? jQuery.format('{0}services/CcServices.asmx/JQueryLogging', getAbsolutePath()) : postUrl;
    var data = JSON.stringify(dto);
    jQuery.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: data,
        async: false,
        success: HandlingLoggingSuccess
    });
}

function HandlingLoggingSuccess(results) {
    ///	<summary>HandlingLoggingSuccess handles the results returned from the ajax call</summary>
    ///	<param name="results" type="array"> results</param>
    var data = results.d;
    // future: handle a special return values
    return (data[0] == 'Success');
}

jQuery.extend({
    IsNull: function(object) {
        /// <summary>IsNull jquery function to check the object</summary>
        /// <param name="object" type="object">the object being checked</param>
        if (typeof (object) == 'undefined' || object == null)
            return true;
        return false;
    },
    IsNotNull: function(object) {
        /// <summary>IsNotNull jquery function to check the object</summary>
        /// <param name="object" type="object">the object being checked</param>
        if (typeof (object) != 'undefined' && object != null)
            return true;
        return false;
    },
    IsNotNullOrEmpty: function(object) {
        /// <summary>IsNotNullOrEmpty jquery function to check the object</summary>
        /// <param name="object" type="object">the object being checked</param>
        if (jQuery.IsNotNull(object) && object != '')
            return true;
        return false;
    },
    IsNullOrEmpty: function(object) {
        /// <summary>IsNullOrEmpty jquery function to check the object</summary>
        /// <param name="object" type="object">the object being checked</param>
        if (jQuery.IsNull(object) || object == '')
            return true;
        return false;
    },
    EnsureGet: function(selector, functionName) {
        /// <summary>Find using jQuery while ensuring that the resulting jQuery object exists (has at least one element), otherwise throws an exception.</summary>
        /// <param name="selector" type="string">A selector expression used to find some element/s. Like in "$(selector)"</param>
        /// <param name="functionName" type="string">(optional) Used only in case the selector doesn't match any element to show it in the exception</param>
        var result = $(selector);
        if (!result.length) {
            var errorMessage = $.format('Could not find any element using the selector "{0}"', selector);
            if (functionName)
                errorMessage = $.format('{0} when calling {1}', errorMessage, functionName);
            throw errorMessage;
        }
        return result;
    }
});

$.fn.ForceNumericOnly = function(allowNegative) {
    /// <summary>ForceNumericOnly jquery function to Force Numeric chars Only</summary>
    /// <param name="allowNegative" type="Boolean">(optional) specifies whether to allow negative numbers or not</param>
    if ($.IsNullOrEmpty(allowNegative))
        allowNegative = false;
    return this.each(function() {
        $(this).keydown(function(e) {
            var key = e.charCode || e.keyCode || 0;
            // allow ctrl+c, ctrl+v, backspace, tab, delete, arrows, numbers and keypad numbers ONLY 
            return (!e.shiftKey &&
                ((e.ctrlKey && (key == 67 || key == 86)) || key == 8 || key == 9 || key == 46 ||
                    (key >= 37 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105) || (allowNegative && !$(this).val() && (key == 109 || key == 173 || key == 189))));
        });
    });
};