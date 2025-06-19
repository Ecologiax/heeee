
function providePlugin(pluginName, pluginConstructor) {
    var gaTracker = window[window['GoogleAnalyticsObject'] || 'ga'];
    if (gaTracker) {
        console.log('providePlugin has gaTracker object');
        gaTracker('provide', pluginName, pluginConstructor);
    }
}

var HotelLoader = function (tracker, config) {
    /// <summary> Constructor for the hotelLoader plugin.</summary>
    /// <param name="tracker">tracker object</param>
    /// <param name="config">config object settings</param>
    this.tracker = tracker;
    this.hotelId = config.hotelId || 'header_HotelIdHiddenField';
    this.uniqueId = config.uniqueId || 'header_HotelUniqueIdHiddenField';
    this.userUniqueId = config.userUniqueId || 'header_UserUniqueIdHiddenField';
    this.isDebug = config.debug;
};

HotelLoader.prototype.loadHotelFields = function () {
    /// <summary>Loads hotel fields from the URL and updates the tracker.</summary>
    this.debugMessage('Loading custom hotel parameters');

    var hotelIdValue = this.getHiddenFieldValue(this.hotelId);
    if (hotelIdValue) {
        this.tracker.set('&uid', hotelIdValue);
        this.debugMessage($.format('Loaded hotel id: {0}', hotelIdValue));
    } else
        this.debugMessage($.format('Failed hotel id: {0}', hotelIdValue));

    var uniqueIdValue = this.getHiddenFieldValue(this.uniqueId);
    if (uniqueIdValue) {
        this.tracker.set('dimension2', uniqueIdValue);
        this.debugMessage($.format('Loaded hotel unique id: {0}', uniqueIdValue));
    } else
        this.debugMessage($.format('Failed hotel unique Id: {0}', uniqueIdValue));

    var userUniqueIdValue = this.getHiddenFieldValue(this.userUniqueId);
    if (userUniqueIdValue) {
        this.tracker.set('dimension3', userUniqueIdValue);
        this.debugMessage($.format('Loaded hotel user unique Id: {0}', userUniqueIdValue));
    } else
        this.debugMessage($.format('Failed hotel user unique Id: {0}', userUniqueIdValue));
};

HotelLoader.prototype.setDebug = function (enabled) {
    /// <summary>Enables / disables debug output.</summary>
    /// <param name="enabled">boolean</param>
    this.isDebug = enabled;
};

HotelLoader.prototype.debugMessage = function (message) {
    /// <summary>Displays a debug message in the console, if debugging is enabled.</summary>
    /// <param name="message">message text to log</param>
    if (!this.isDebug)
        return;
    if (console)
        console.debug(message);
};

HotelLoader.prototype.getHiddenFieldValue = function (id) {
    /// <summary>Utility function to gets the hidden field value.</summary>
    /// <param name="id">id to search for</param>
    this.debugMessage($.format('getHiddenFieldValue for id: {0}', id));
    var controlId = $.format('#{0}', id);
    var control = window.parent.$(controlId);
    if (control.length == 0)
        control = $(controlId);
    if (control.length == 0)
        control = $(controlId, parent.document);

    if (control.length > 0) {
        this.debugMessage($.format('Success getHiddenFieldValue for id: {0}', id));
        return control.val();
    } else {
        this.debugMessage($.format('Falied getHiddenFieldValue for id: {0}', id));
        return '';
    }
};

// Register the plugin.
providePlugin('hotelLoader', HotelLoader);