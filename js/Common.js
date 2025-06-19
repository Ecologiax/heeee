/// <reference path="jquery-3.4.1.min.js" />
/// <reference path="ui/jquery-ui-1.12.1.js" />
/// <reference path="plugins/jquery.simplemodal.js" />
/// <reference path="plugins/jquery.message.js" />
/// <reference path="plugins/jquery.extensions.js" />

/*
    dependences:
    jquery
    jquery.ui
    jquery.simplemodal
    jquery.message
    jquery.extensions ($.format)
*/

/*
    display dialog message using instead of alert('');
*/
if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
    $(window).on("load", function (e) { addKeyboardAccessibility() });
}
else {
    $(document).ready(function () { addKeyboardAccessibility() });
}

$(document).ready(function () {
    if ($('#loginFrm').length > 0 && !$('#loginFrm').attr('action').toLowerCase().startsWith("./login.aspx")) {
        $('form').each(function (k, v) {
            v.remove();
        });
    }
    SetAddfavorites();
    getLanguageCode();
    if ((/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) || (/Edge\/\d./i.test(navigator.userAgent)))
    addKeyboadAccessibilityForUserActionsIE();
});
function addKeyboadAccessibilityForUserActionsIE() {
    $('#UserActions > ul > li > ul > li a').focus(function () {
        $(this).parent().is("div") ? $(this).parent().parent().addClass('focus-within'): $(this).parent().addClass('focus-within');

    });
    $('#UserActions > ul > li').focus(function () {
        $(this).addClass('focus-within');
        $(this).keydown(function (event) {
            if (event.shiftKey && event.which === 9 && document.activeElement === $(this)[0]) {
                $(this).removeClass('focus-within');
            }
        });
    });
    $('#UserActions > ul > li > ul > li  a').keydown(function (event) {
        if (event.which === 9) {
            $(this).parent().is("div") ? $(this).parent().parent().removeClass('focus-within') : $(this).parent().removeClass('focus-within');
            if (!event.shiftKey && $(this).parent().next().length === 0)               
            $(this).parent().is("div") ? $(this).parent().parent().parent().parent().removeClass('focus-within') : $(this).parent().parent().parent().removeClass('focus-within');
        }
    });

}

function getLanguageCode() {
    var paramStartIndex = window.location.href.indexOf('?');
    var paramList = window.location.href.substring(paramStartIndex);
    var langExists = paramList.indexOf('lang');
    var cookieExists = document.cookie.indexOf("CurrentlySelectedLanguage");
    var languageCode = '';
    if (langExists !== -1) {
        var languageAttr = paramList.substring(langExists, paramList.indexOf('&'));
        languageCode = languageAttr.substring(languageAttr.indexOf('=') + 1);
      }
    else if (cookieExists !== -1) {
        var readCookieToken = function (name) {
            var cookieArray = document.cookie.split(';');
            for (var i = 0; i < cookieArray.length; i++) {
                if (cookieArray[i] && cookieArray[i].indexOf(name + '=') != -1) {
                    return cookieArray[i].split('=')[1];
                }
            }
            return null;
        };
        languageCode = readCookieToken("CurrentlySelectedLanguage");
    }
    else {
         languageCode = window.navigator.language || window.navigator.userLanguage;
    }
    if (document.getElementsByTagName("html") !== null && document.getElementsByTagName("html").length !== 0)
        document.getElementsByTagName("html")[0].setAttribute("lang", languageCode);
   
}

function addKeyboardAccessibility() {
    /*KEY EVENTS
     9  - Tab Key
     13 - Enter Key
     27 - Esc Key
     40 - Down Arrow
     */
    addTabindexForFocus();
    showSecondLevelMenu();
    showOrHideChangeHotelContainerByKeyboard();
    trapFocusInsideModal();
}

function addTabindexForFocus() {
    $('[navid], [onclick],#UserActions > ul >li,.rtPlus,.rtMinus,#ChangeHotelLink').each(function () {
        $(this).attr('tabindex', '0');
        $(this).keyup(function (event) {
            if (event.which === 13) {
                $(this).click();
            }
        });
    });
}

function showSecondLevelMenu() {
    $('#MenuRow div.frstLvl > ul > li > a').keyup(function (event) {
        if (event.which === 40) {
            $(this).click();
        }
    });
}

function showOrHideChangeHotelContainerByKeyboard() {
    $('#ChangeHotelLink').keyup(function (event) {
        if (event.which === 13) {
            if ($('#ChangeHotelContainer').is(':visible'))
                $('#ChangeHotelContainer').hide();
            else {
                $('#ChangeHotelContainer').show();
                $('#ChangeHotelContainer').find(':tabbable').first().focus();
            }
        }
    });
}

function trapFocusInsideModal() {
    $('body.popupmodal').each(function () {
        var targetedElements = $(':tabbable');
        var targetedElementsLength = targetedElements.length;
        if (targetedElementsLength !== 0)
            targetedElements[0].focus()
        for (var i = 0; i < targetedElementsLength; i++) {
            targetedElements[i].addEventListener('keydown', function (event) {
                var index = $.inArray(this, targetedElements);
                if (event.shiftKey && event.which === 9) {
                    event.preventDefault();
                    index !== 0 ? targetedElements[index - 1].focus() : targetedElements[targetedElementsLength - 1].focus();
                }
                else if (event.which === 9) {
                    event.preventDefault();
                    index !== targetedElementsLength - 1 ? targetedElements[index + 1].focus() : targetedElements[0].focus();
                }
                else if (event.which === 27) {
                    parent.onCloseModal();
                }
            });
        }
    });
}

function getDomainsTopWindow() {
    var domainsTopWindow = window;
    try {
        while (domainsTopWindow.parent.location.href !== domainsTopWindow.location.href &&
            domainsTopWindow.parent.location.host === domainsTopWindow.location.host) {
            domainsTopWindow = domainsTopWindow.parent;
        }
    }
    catch (ex) {
    }
    finally {
        return domainsTopWindow;
    }
}

function SetAddfavorites() {
    ///	<summary>SetAddfavorites hides and shows the Add favorites item</summary>
    var pageNavId = $('#menu_CurrentPageID').val();
    
    // hide the Add favorites item for Home Page
    if (pageNavId == '1001' || pageNavId == '200001' || pageNavId == '201001')
        $('#AddFavoriteID').hide();
    else
        $('#AddFavoriteID').show();
}

function displayConfirmMessage(title, message, error, buttonObjects) {
    /// <summary>displayConfirmMessage is a custom messaging exception dom display for client side errors</summary>
    /// <param name="title" type="String">The title for the confirmation message box</param>
    /// <param name="message" type="String">The question string. [required]</param>
    /// <param name="error" type="exception object">he error exception object. [optional]</param>
    /// <param name="buttonObjects" type="buttons object array">buttons objects  object.</param>
    /// <returns type="dialog mdoel object" />
    return displayMessage(title, message, error, 2, null, null, true, buttonObjects);
}
////function displayMessage(title, message, error, type, buttonObjects) {
////    /// <summary>displayMessage is a custom messaging exception dom display for client side errors</summary>
////    /// <param name="title" type="String">The title for the message box</param>
////    /// <param name="message" type="String">The message string.</param>
////    /// <param name="error" type="exception object">The error exception object.</param>
////    /// <param name="type" type="int">
////    /// The type of error enumeration int for image
////    ///     1 = ui-icon-notice
////    ///     2 = ui-icon-info
////    ///     3 = ui-icon-help
////    ///     4 = ui-icon-alert
////    ///     default = icon_exclamation
////    /// </param>
////    /// <param name="buttonObjects" type="buttons object array">The error exception object.</param>
////    /// <returns type="dialog mdoel object" />
////    return displayMessage(title, message, error, type, null, null, false, buttonObjects);
////}
function displayMessage(title, message, error, type, height, width, isConfirm, buttonObjects) {
    /// <summary>displayMessage is a custom messaging exception dom display for client side errors</summary>
    /// <param name="title" type="String">The title for the error message box</param>
    /// <param name="message" type="String">The message string.</param>
    /// <param name="error" type="exception object">The error exception object.</param>
    /// <param name="type" type="int">
    ///  The type of error enumeration int for image
    ///     1 = ui-icon-notice
    ///     2 = ui-icon-info
    ///     3 = ui-icon-help
    ///     4 = ui-icon-alert
    ///     default = 2
    /// </param>
    /// <param name="height" type="int">The height of the dialog modal</param>
    /// <param name="width" type="int">The width of the dialog modal</param>
    /// <param name="isConfirm" type="bool">Create a confirmation dialog</param>
    /// <param name="buttonObjects" type="buttons object array">he error exception object.</param>
    /// <returns type="dialog mdoel object" />

    // Defaults
    var dialogHeight = 200;
    var dialogWidth = 400;
    var imageClassName = '';

    if (height != null)
        dialogHeight = height;
    if (width != null)
        dialogWidth = width;

    switch (type) {
        case 1: // ui-icon-notice
            imageClassName = 'ui-icon-notice';
            break;
        case 2: // ui-icon-info
            imageClassName = 'ui-icon-info';
            break;
        case 3: // ui-icon-help
            imageClassName = 'ui-icon-help';
            break;
        case 4: // ui-icon-alert
            imageClassName = 'ui-icon-alert';
            break;
        case 5: //no icon
            imageClassName = '';
            break;
        default: // ui-icon-info
            imageClassName = 'ui-icon-info';
            break;
    }
    if ($("#dialog-message").data("ui-dialog")) {
        $("#dialog-message").dialog("destroy");
    }
    $("#dialog-message").attr("title", title);
    var errorDescription = (error != null) ? $.format('<p>Error description:{0}</p>', error.description) : '';
    if (imageClassName != '')
        imageClassName = $.format('<span class="ui-icon {0}" style="float:left; margin:0 7px 50px 0;"></span>', imageClassName);
    var html = $.format('<p>{0}{1}</p>{2}', imageClassName, message, errorDescription);
    $("#dialog-message").html(html);
    if (isConfirm) {
        $("#dialog-message").dialog({
            resizable: true,
            height: dialogHeight,
            width: dialogWidth,
            modal: true,
            buttons: buttonObjects
        });
    } else {
        if (buttonObjects == null) {
            $("#dialog-message").dialog({
                modal: true,
                height: dialogHeight,
                width: dialogWidth,
                buttons: {
                    Ok: function () {
                        $(this).dialog('close');
                    }
                }
            });
        } else {
            $("#dialog-message").dialog({
                modal: true,
                height: dialogHeight,
                width: dialogWidth,
                buttons: buttonObjects
            });
        }
    }
    $("#dialog-message").parent().css({ "z-index": "1002" });
}

/* Global Parms */
var isIE = window.navigator.appName.indexOf("Microsoft") > -1;
var _tabOnClass = 'tabon';
var _tabOffClass = 'taboff';
var _ToolbarButtonClicked = false;
var COOKIENAME = 'LastiFrameSourceCookie';
var LASTPAGEIDCOOKIE = 'LastPageNavIDCookie';
var LASTSPHPAGEIDCOOKIE = 'LastSPHPageNavIDCookie';
var SPHINTERNALPAGEURLCOOKIE = 'SPHInternalPageUrlCookie';

function OnToolbarButtonClicked() {
    if (_ToolbarButtonClicked == true)
        return false;

    _ToolbarButtonClicked = true;
    return true;
}

function ResetToolbarButtonClicked() {
    _ToolbarButtonClicked = false;
}

/* Window display functions */
function GetClientWidth(isFromParent) {
    ///	<summary>GetClientWidth gets the windows Width</summary>
    ///	<param name="isFromParent" type="bool">true or false</param>
    ///	<returns type="int" />
    if (isFromParent) {
        return FilterResults(
            window.innerWidth ? window.innerWidth : 0,
            document.documentElement ? document.documentElement.clientWidth : 0,
            document.body ? document.body.clientWidth : 0
        );
    } else {
        // if not from the parent get the width from the parent
        return FilterResults(
            parent.window.innerWidth ? parent.window.innerWidth : 0,
            parent.document.documentElement ? parent.document.documentElement.clientWidth : 0,
            parent.document.body ? parent.document.body.clientWidth : 0
        );
    }
}

function GetClientHeight(isFromParent) {
    ///	<summary>GetClientHeight gets the windows Height</summary>
    ///	<param name="isFromParent" type="bool">true or false</param>
    ///	<returns type="int" />
    if (isFromParent) {
        return FilterResults(
            window.innerHeight ? window.innerHeight : 0,
            document.documentElement ? document.documentElement.clientHeight : 0,
            document.body ? document.body.clientHeight : 0
        );
    } else {
        // if not from the parent get the height from the parent
        return FilterResults(
            parent.window.innerHeight ? parent.window.innerHeight : 0,
            parent.document.documentElement ? parent.document.documentElement.clientHeight : 0,
            parent.document.body ? parent.document.body.clientHeight : 0
        );
    }
}

function FilterResults(win, doc, body) {
    ///	<summary>FilterResults calculates the results</summary>
    ///	<param name="win" type="int">Window width or height</param>
    ///	<param name="doc" type="int">Document width or height</param>
    ///	<param name="body" type="int">body width or height</param>
    ///	<returns type="int" />
    var result = win ? win : 0;
    /* Opera */
    if (doc &&
        (!result ||
         (result > doc)))
        result = doc;
    return body && (!result || (body > result)) ? body : result;
}

var _ParentWindowHeight;
var _ParentWindowWidth;
function SetBodyHeightWidth(isFromParent) {
    ///	<summary>SetBodyHeightWidth Sets the elements Width and Height</summary>
    ///	<param name="isFromParent" type="bool">true or false</param>
    try {
        // top div header search control
        var searchRow = document.getElementById("SearchRow");
        var domainsTopWindow = getDomainsTopWindow();
        if (searchRow == null)
            searchRow = domainsTopWindow.document.getElementById("SearchRow");

        // div that contains the iframe
        var containerIframe = document.getElementById("ContainerIframe");
        if (containerIframe == null)
            containerIframe = domainsTopWindow.document.getElementById("ContainerIframe");

        // iFrame control
        var contentIframe = document.getElementById('ContentIframe');
        if (contentIframe == null)
            contentIframe = domainsTopWindow.document.getElementById('ContentIframe');

        // SPH iFrame control
        var sphContentIframe = document.getElementById('SphContentIframe');
        if (sphContentIframe == null)
            sphContentIframe = domainsTopWindow.document.getElementById('SphContentIframe');

        // is new menu?
        var isNewMenu = (typeof (isNewMenu) != 'undefined' && isNewMenu) || (typeof (domainsTopWindow.isNewMenu) != 'undefined' && domainsTopWindow.isNewMenu);

        // need offset for both IE and Firefox
        var offset = 32;
        var leftOffset = 200;
        if (isNewMenu) {
            offset = 84;
            leftOffset = 0;
        }
        //need offset for chrome and ie
        if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
            var menuItem = domainsTopWindow.document.getElementById('MenuRow');
            var pageHeader = domainsTopWindow.document.getElementById('PageHeader');
            if (menuItem != null && pageHeader != null)
                offset = menuItem.offsetHeight + pageHeader.offsetHeight;
        }
        //console.log($.format('offsett: {0}, isNewMenu: {1}', offset, isNewMenu));
        var clientHeight = GetClientHeight(isFromParent);

        var width = 0;
        if (isFromParent) {
            if (typeof (window.innerWidth) == 'number') {
                // Non-IE
                width = window.innerWidth;
            } else if (document.documentElement && (document.documentElement.clientWidth ||
                                                    document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'
                width = document.documentElement.clientWidth;
            }
            if (width == 0)
                width = domainsTopWindow.document.activeElement.clientWidth;
        } else {
            if (typeof (domainsTopWindow.window.innerWidth) == 'number') {
                // Non-IE
                width = domainsTopWindow.window.innerWidth;
            } else if (domainsTopWindow.document.documentElement &&
                       domainsTopWindow.document.documentElement.clientWidth) {
                // IE 6+ in 'standards compliant mode'
                width = domainsTopWindow.document.documentElement.clientWidth;
            }
            if (width == 0)
                width = domainsTopWindow.document.activeElement.clientWidth;
        }

        // setting height
        _ParentWindowHeight = (clientHeight - offset);
        //console.log($.format('_ParentWindowHeight: {0}, offset: {1}', _ParentWindowHeight, offset));
        if (containerIframe != null)
            containerIframe.style.height = $.format('{0}px', _ParentWindowHeight);
        if (contentIframe != null && isFromParent)
            contentIframe.style.height = $.format('{0}px', _ParentWindowHeight);
        if (sphContentIframe != null && isFromParent)
            sphContentIframe.style.height = $.format('{0}px', _ParentWindowHeight);
        // set widths
        _ParentWindowWidth = (width - leftOffset);
        if (searchRow != null)
            searchRow.style.width = $.format('{0}px', _ParentWindowWidth);
        if (containerIframe != null)
            containerIframe.style.width = $.format('{0}px', _ParentWindowWidth);
        if (contentIframe != null && isFromParent)
            contentIframe.style.width = $.format('{0}px', _ParentWindowWidth);
        if (sphContentIframe != null && isFromParent)
            sphContentIframe.style.width = '100%';

        // with in Iframe controls
        var contentContainer = document.getElementById("ContentContainer");
        if (contentContainer == null)
            contentContainer = domainsTopWindow.document.getElementById('ContentContainer');
        if (contentContainer == null && window.frames.length > 0 && canAccessIFrame(window.frames[0]) && window.frames[0].document != null)
            contentContainer = window.frames[0].document.getElementById('ContentContainer');

        var pageHeadContainer = document.getElementById("PageHeadContainer");
        if (pageHeadContainer == null)
            pageHeadContainer = domainsTopWindow.document.getElementById('PageHeadContainer');
        if (pageHeadContainer == null && window.frames.length > 0 && canAccessIFrame(window.frames[0]) && window.frames[0].document != null)
            pageHeadContainer = window.frames[0].document.getElementById('PageHeadContainer');
        // debug info
        //window.status = $.format('_OuterWindowWidth = {0}px & _OuterWindowHeight = {1}px', _ParentWindowWidth, _ParentWindowHeight);
        if (contentContainer != null &&
            pageHeadContainer != null) {
            offset = 170;
            if (isNewMenu)
                offset = 165;
            contentLeftOffset = 0;
            var newContentHeight = (_ParentWindowHeight - offset);
            // set height
            contentContainer.style.height = $.format('{0}px', newContentHeight);
            // set width
            contentContainer.style.width = $.format('{0}px', (_ParentWindowWidth - contentLeftOffset));
            pageHeadContainer.style.width = $.format('{0}px', (_ParentWindowWidth - contentLeftOffset));
        }
        CheckUrlAndToggleIframe(isFromParent);
    } catch (ex) {
        if (ex.message.indexOf('Blocked a frame with origin') == -1 && ex.message.indexOf('Access is denied.') == -1 &&
            ex.message.indexOf('Permission denied.') == -1)
            displayMessage('SetBodyHeightWidth', 'Error setting body height and weight.', ex, 4, null);
    }

    if (isNewMenu)
        return;

    // resize left hand menu
    if (isFromParent)
        SetNavDisplay();
}

function CheckUrlAndToggleIframe(isFromParent) {
    if (!isFromParent)
        return;
    var url = $('#menu_HiddenFieldLastUrl') != undefined ? $('#menu_HiddenFieldLastUrl').val() : null;
    ToggleIframe(IsSphUrl(url));
}

function IsSphUrl(url) {
    return jQuery.IsNotNullOrEmpty(url) && url.indexOf('sphPageId') != -1;
}

function ToggleIframe(showSphFrame) {
    var domainsTopWindow = getDomainsTopWindow();
    // iFrame control
    var contentIframe = document.getElementById('ContentIframe');
    if (contentIframe == null)
        contentIframe = domainsTopWindow.document.getElementById('ContentIframe');

    // SPH iFrame control
    var sphContentIframe = document.getElementById('SphContentIframe');
    if (sphContentIframe == null)
        sphContentIframe = domainsTopWindow.document.getElementById('SphContentIframe');
    
    if(showSphFrame)
    {
        $(contentIframe).attr("hidden", "hidden");
        SetAddfavorites();
    }
    else
    {
        sphContentIframe.style.width = "0";
        sphContentIframe.style.height = "0";
        $(contentIframe).removeAttr("hidden");
    }
}

function canAccessIFrame(iframe) {
    var html = null;
    try {
        // deal with older browsers
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        html = doc.body.innerHTML;
    } catch (err) {
        // do nothing
    }

    return (html !== null);
}


//Gets the height of the Content Container 
function getContentContainerHeight() {
    var height = "0px";
    var contentContainer = $("#ContentContainer");
    if (contentContainer.length) {
        height = contentContainer.css("height");
    }
    return height;
}

function setPopupBodyHeight() {
    var content = document.getElementById("PopupContentContainer");
    var toolBarContainer = document.getElementById("PopupToolBarContainer");
    var countHeader = $("#PopupToolBarContainer").find("div[id*='PopupPageHeader']").length;

    var toolBarHeight = 0;
    var headerHeight = 0;
    var offsetHeight = 25;
    var offset = 100;


    if (toolBarContainer != null) {

        offsetHeight = 50;
        //Popup has toolbar and header enabled
        if (countHeader != 0) {
            toolBarHeight = toolBarContainer.offsetHeight;
            headerHeight = 29;
        }
    }

    var topHeight = toolBarHeight + headerHeight + offsetHeight;

    if (!isIE)
        topHeight += 9;
    if (content != null)
        content.style.top = topHeight + "px";
    try {
        content.style.height = (GetClientHeight(true) - topHeight - offset) + "px";
    } catch (e) { }
}

function setInfoPanelBodyHeight() {
    var content = document.getElementById("InfoPanelContentContainer");
    var toolBarContainer = document.getElementById("InfoPanelToolbarContainer");
    var countHeader = $("#InfoPanelToolbarContainer").find("div[id*='InfoPanelPageHeader']").length;

    var toolBarHeight = 0;
    var headerHeight = 0;
    var offsetHeight = 25;

    if (toolBarContainer != null) {

        offsetHeight = 50;
        //Popup has toolbar and header enabled
        if (countHeader != 0) {
            toolBarHeight = toolBarContainer.offsetHeight;
            headerHeight = 29;
        }
    }

    var topHeight = toolBarHeight + headerHeight + offsetHeight;

    if (!isIE)
        topHeight += 9;

    content.style.top = topHeight + "px";
    try {
        content.style.height = (GetClientHeight(true) - topHeight) + "px";
    } catch (e) { }
}

function GetWindowDimensions() {
    var w = screen.width;
    //var h = screen.height;
    switch (w) {
        case 640: // 480
            return "height=400,width=600,";
        case 800: // x 600
            return "height=550,width=750,";
        case 1024: // x 768
            return "height=600,width=800,";
        case 1152: // 864
            return "height=700,width=900,";
        case 1280: // 1024
            return "height=800,width=900,";
        default:
            // all other cases
            return "height=400,width=600,";
    }
}

function initializePopup() {
    var formNode = document.body.childNodes.item(0);

    if (formNode.nodeName != "FORM")
        formNode = document.body.childNodes.item(1);

    var screenHeight;
    var screenWidth;
    var newHeight;
    var newWidth;
    window.moveTo(0, 0);
    if (formNode) {
        screenHeight = window.screen.availHeight;
        screenWidth = window.screen.availWidth;
        newHeight = formNode.offsetHeight + 100;
        newWidth = formNode.offsetWidth + 39;

        if (isNaN(newHeight)) newHeight = 300;
        if ((isNaN(newWidth)) || (newWidth < 300)) newWidth = 300; //The smallest size should be 300

        if (newHeight > screenHeight) newHeight = screenHeight - 10; //Test to make sure the pop-up isn't 
        if (newWidth > screenWidth) newWidth = screenWidth - 10; 	//larger than the current resolution

        window.resizeTo(newWidth, newHeight);
    }
}
/* End window display functions */

function OpenHelpPopup(pageId) {
    var url = $.format('/CC/help/default.htm#{0}.htm', pageId);
    window.open(url, 'Help');
}

function OpenReportPopup(updateUrl, windowName) {
    var winH = screen.availHeight - 100;
    var winW = screen.availWidth - 25;
    var reportPopup = window.open(updateUrl, windowName, 'height=' + winH + ',width=' + winW + ',scrollbars,resizable,status,top=0,left=0');
    if (reportPopup != null && reportPopup != undefined) {
        reportPopup.focus();
    }
}
function OpenUpdatePopup(updateUrl, windowName) {
    /// <summary>Creates popup window for any source url.</summary>
    /// <param name="updateURL">The page url path [required]</param>
    /// <param name="windowName">The title of Popup [required]</param>
    OpenUpdatePopup(updateUrl, windowName, false);
}
function OpenUpdatePopup(updateUrl, windowName, isModal) {
    /// <summary>Creates popup window for any source url.</summary>
    /// <param name="updateURL">The page url path [required]</param>
    /// <param name="windowName">The title of Popup [required]</param>
    /// <param name="isModal">The create the Modal instead of the popup window (bool) [required]</param>
    OpenUpdatePopup2(updateUrl, windowName, isModal, null, null);
}
function OpenUpdatePopup2(updateUrl, windowName, isModal, overrideTitleName, rowIndexSuffix) {
    /// <summary>Creates popup window or Modal display popup using (jQuery) plugin for any source.</summary>
    /// <param name="updateURL">The page url path [required]</param>
    /// <param name="windowName">The title of Popup [required]</param>
    /// <param name="isModal">The create the Modal instead of the popup window (bool) [optional]</param>
    /// <param name="overrideTitleName">To override the window name for the title of the dialog (string)[optional]</param>
    /// <param name="rowIndexSPackageDescriptionsTranslationuffix">row Index Suffix which will be appended on the iframe id text unique ids (string)[required]</param>
    var winH, winW;
    var functionName = 'modalOnCloseGlobal';
    var isEscClose = false;
    var isOverlayClose = false;
    var useJqueryUiDialog = false;
    switch (windowName) {
        case "FavoritesUpdate":
            winH = 530;
            winW = 760;
            functionName = 'modalOnCloseFavorites';
            break;
        case "AddToFavorites":
            winH = 380;
            winW = 450;
            functionName = 'modalOnCloseFavorites';
            break;
        case "AccessDenied":
            winH = 325;
            winW = 500;
            break;
        case "ResetPassword":
            winH = 500;
            winW = 850;
            break;
        case "PickAirport":
        case "RezDetails":
            winH = 550;
            winW = 750;
            break;
        case "OPBEBanner":
            winH = 550;
            winW = 850;
            break;
        case "OPBEMenu":
        case "OPBEForms":
        case "OPBEConfirm":
            winH = 550;
            winW = 950;
            break;
        case "RateSeasonUpdate":
            winH = 375;
            winW = 675;
            break;
        case "AllOffsets":
        case "ViewAllOffsets":
            winH = 600;
            winW = 750;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "CorpTranslations":
        case "LookupCodes":
        case "GdsViewershipReference":
        case "TaxCodesReference":
        case "ProductAssignmentCodesReference":
        case "RateTranslationReference":
        case "TranslateIataGroups":
        case "LoyaltyDescriptions":
        case "LoyaltyLevelDescriptions":
        case "TranslateRateFilters":
        case "TerminalTranslations":
        case "PackageDescriptions":
        case "AlertDescriptions":
        case "RateGroupDescriptions":
        case "RoomGroupDescriptions":
        case "PolicyTranslations":
        case "TravelAgents":
            winH = 600;
            winW = 1000;
            useJqueryUiDialog = true;
            break;
        case "UserPref":
            winH = 768;
            winW = 800;
            useJqueryUiDialog = true;
            break;
        case "HotelTerminalsTranslation":
            winH = 200;
            winW = 500;
            useJqueryUiDialog = true;
        case "MealPlanTranslation":
            winH = 300;
            winW = 800;
            useJqueryUiDialog = true;
        case "PackageDescriptionsTranslation":
            winH = 600;
            winW = 1000;
            useJqueryUiDialog = true;
        case "GuestProfile":
            winH = 600;
            winW = 830;
            break;
        case "AssignedTo":
            winH = 500;
            winW = 810;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "CSSFiles":
        case "DescriptionsUpdate":
        case "UpsellRanking":
        case "SortSellOffers":
            winH = 550;
            winW = 700;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "StayControlsUpdate":
        case "InventoryUpdate":
        case "ShellPreview":
        case "OverrideUpdate":
            winH = 650;
            winW = 1300;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "GeoCode":
            winH = 700;
            winW = 850;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "SmallDescriptionUpdate":
        case "PickFromDropDown":
        case "PickFromCheckbox":
            winH = 300;
            winW = 650;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "PickTimeZonePopup":
            winH = 275;
            winW = 700;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'FeatureChannelAssignment':
            winH = 400;
            winW = 700;
            isEscClose = false;
            isOverlayClose = false;
            functionName = 'modalOnCloseFeatureChannelAssignment';
            useJqueryUiDialog = true;
            break;
        case 'ServicesChannelAssignment':
            winH = 420;
            winW = 800;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'BulkChannelAssignment':
            winH = 500;
            winW = 760;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'ReasonSorter':
        case 'PromotionSort':
        case 'SortRoomServices':
        case 'SortVips':
        case 'SortTypes':
        case 'SortLoyaltyProgramLevels':
        case 'SortRateFilters':
        case 'SortAirports':
        case 'SortAreaFeatures':
        case 'SortDiningOptions':
        case 'TaxesSort':
        case 'SortTerminals':
        case 'SortMeetingRooms':
        case 'SortPackages':
        case 'RoomGroupSort':
        case 'SortWrapUp':
        case 'CancelReasonSort':
        case 'VisaApplicationTypeSort':
        case 'VisaApplicationStatusSort':
        case 'WaitListReasonSort':
        case 'PolicyAssignment':
        case 'ReferencesPopup':
            winH = 550;
            winW = 650;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "DefaultHotelIdSearch":
            winH = 430;
            winW = 750;
            useJqueryUiDialog = true;
            break;
        case 'TemplateRateExclusion':
        case 'TermsAcceptance':
        case 'ManageCompetitiveData':
        case 'DefaultHotelSearch':
            winH = 500;
            winW = 640;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'BulkMappingGridChannelAssignment':
            winH = 420;
            winW = 760;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'BulkChannelAssignmentModal':
            winH = 500;
            winW = 999;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "BarOverRange":
        case "PickCorporation":
        case "EmailSubTemplates":
            winH = 670;
            winW = 1200;
            isEscClose = true;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'ProfileReservationsEmailPopup':
            winH = 400;
            winW = 700;
            isEscClose = true;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'SeasonCopy':
            winH = 450;
            winW = 700;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "RateCodesReference":
        case "StayRestrictionImportLookupCodes":
        case "ThirdPartyTraking":
            winH = 650;
            winW = 1250;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "BulkFileStatus":
        case "AsyncJobStatus":
        case "FileStatus":
            winH = 550;
            winW = 800;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case "Authenticate":
            winH = 400;
            winW = 500;
            isEscClose = false;
            isOverlayClose = false;
            useJqueryUiDialog = true;
            break;
        case 'APIKeyCreate':
            winH = 450;
            winW = 550;
            useJqueryUiDialog = true;
            break;
        case 'PriceSeasonUpdateTaskStatus':
            winH = 600;
            winW = 1300;
            useJqueryUiDialog = true;
            break;
        case 'RatePropagationUpdateTaskStatus':
            winH = 600;
            winW = 1200;
            useJqueryUiDialog = true;
            break;
        case 'ContextModal':
            winH = 800;
            winW = 1300;
            isEscClose = false;
            useJqueryUiDialog = true;
            break;
        default:
            winH = 500;
            winW = 700;
            break;
    }
    if (!isModal) {
        var updatePopup = window.open(updateUrl, (overrideTitleName == null) ? windowName : overrideTitleName, $.format('height={0},width={1},scrollbars,resizable,status', winH, winW));
        if (updatePopup != null)
            updatePopup.focus();
    } else
        OpenModalGlobal(updateUrl, '', winH, winW, functionName, isEscClose, isOverlayClose, useJqueryUiDialog, overrideTitleName, rowIndexSuffix);
}
function OpenModalGlobal(source, title, modalHeight, modalWidth, onCloseFunction) {
    /// <summary>Creates a Modal display popup using (jQuery) plugin for any source.</summary>
    /// <param name="source">The page source path [required]</param>
    /// <param name="title">The title of Modal which is for future use [optional]</param>
    /// <param name="modalHeight">The height of the Modal (int) [optional]</param>
    /// <param name="modalWidth">The width of the Modal (int) [optional]</param>
    /// <param name="onCloseFunction">The onClose function name (string) [required]</param>
    OpenModalGlobal(source, title, modalHeight, modalWidth, onCloseFunction, false, false, false, null);
}

var _modal = null;
function OpenModalGlobal(source, title, modalHeight, modalWidth, onCloseFunction, isEscClose, isOverlayClose, useJqueryUiDialog, overrideTitleName, rowIndexSuffix) {
    /// <summary>Creates a Modal display popup using (jQuery) plugin for any source.</summary>
    /// <param name="source">The page source path [required]</param>
    /// <param name="title">The title of Modal which is for future use [optional]</param>
    /// <param name="modalHeight">The height of the Modal (int) [optional]</param>
    /// <param name="modalWidth">The width of the Modal (int) [optional]</param>
    /// <param name="onCloseFunction">The onClose function name (string) [required]</param>
    /// <param name="isEscClose">The isEscClose click the esc key will close modal (bool) [required]</param>
    /// <param name="isOverlayClose">The isOverlayClose click the overlay will close modal, hides the dialog close button (bool) [required]</param>
    /// <param name="overrideTitleName">To override the window name for the title of the dialog (string)[required]</param>
    /// <param name="rowIndexSuffix">row Index Suffix which will be appended on the iframe id text unique ids (string)[required]</param>
    var height = '500';
    var width = '700';
    if (modalHeight != null)
        height = modalHeight;
    if (modalWidth != null)
        width = modalWidth;

    var iframeName = (rowIndexSuffix == null) ? 'dialogIframeControl' : $.format('dialogIframeControl{0}', rowIndexSuffix);
    var iframe = $.format('<iframe height="{0}" width="{1}" id="{2}" frameBorder="0">', height, width, iframeName);

    // destroying other dialog will prevent duplicate controls in dom
    if (typeof (_modal) != 'undefined' && _modal != null) {
        _modal.dialog('destroy');
        _modal = null;
    }

    if (useJqueryUiDialog) {
        //$(iframe).dialog('destroy');
        //var $this = $(this);
        var horizontalPadding = 30;
        var verticalPadding = 30;
        var newTitle = (overrideTitleName == null) ? title : overrideTitleName;
        _modal = $(iframe).attr("src", source).dialog({
            title: newTitle,
            autoOpen: true,
            width: width,
            height: height,
            modal: true,
            resizable: true,
            autoResize: true,
            overlay: {
                opacity: 0.5,
                background: '#fff'
            },
            closeOnEscape: isEscClose
        }).width(width - horizontalPadding).height(height - verticalPadding).css({ "z-index": "1002" });
        
        // display X Close icon
        //if (!isOverlayClose)
        //    _modal.dialog('widget').find('.ui-dialog-titlebar-close').hide();

    } else {
        $.modal(iframe, {
            onShow: function (dialog) {
                $('#dialogIframeControl').attr("src", source);
            },
            closeHTML: "",
            onClose: eval(onCloseFunction),
            containerCss: {
                backgroundColor: "#fff",
                borderColor: "#0063dc",
                height: $.format('{0}px', height),
                padding: 10,
                width: $.format('{0}px', width),
                zIndex: 1002
            },
            focus: true,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#CDCDCD"
            },
            escClose: isEscClose, // set to true if you want the esc key to close modal
            overlayClose: isOverlayClose // set to true if you want to close the modal if clicked on the overlay not within the modal
        });
    }
}

function modalOnCloseGlobal(dialog) {
    /// <summary>Closes the Modal with special effects</summary>
    /// <param name="dialog">The dialog object</param>
    dialog.data.fadeOut('slow', function () {
        dialog.container.slideUp('slow', function () {
            dialog.overlay.fadeOut('slow', function () {
                $.modal.close(); // must call this to have SimpleModal               
            });
        });
    });
}

function modalOnCloseFavorites(dialog) {
    dialog.data.fadeOut('slow', function () {
        dialog.container.slideUp('slow', function () {
            dialog.overlay.fadeOut('slow', function () {
                $.modal.close(); // must call this to have SimpleModal
                if (_IsSaveAndClose)
                    window.location = window.location; // refresh main page
            });
        });
    });
}

function OpenNonModalDialog(source, title, modalHeight, modalWidth, isEscClose, overrideTitleName, rowIndexSuffix) {
    /// <summary>Creates a Modal display popup using (jQuery) plugin for any source.</summary>
    /// <param name="source">The page source path [required]</param>
    /// <param name="title">The title of Modal which is for future use [optional]</param>
    /// <param name="modalHeight">The height of the Modal (int) [optional]</param>
    /// <param name="modalWidth">The width of the Modal (int) [optional]</param>
    /// <param name="isEscClose">The isEscClose click the esc key will close modal (bool) [required]</param>
    /// <param name="overrideTitleName">To override the window name for the title of the dialog (string)[required]</param>
    /// <param name="rowIndexSuffix">row Index Suffix which will be appended on the iframe id text unique ids (string)[required]</param>
    var height = '500';
    var width = '700';
    if (modalHeight != null)
        height = modalHeight;
    if (modalWidth != null)
        width = modalWidth;

    var iframeName = (rowIndexSuffix == null) ? 'dialogIframeControl' : $.format('dialogIframeControl{0}', rowIndexSuffix);
    var iframe = $.format('<iframe src="{0}" height="{1}" width="{2}" id="{3}" frameBorder="0">', source, height, width, iframeName);

    // destroying other dialog will prevent duplicate controls in dom
    if (typeof (_modal) != 'undefined' && _modal != null)
        _modal.dialog('destroy');

    //var $this = $(this);
    var horizontalPadding = 30;
    var verticalPadding = 30;
    var newTitle = (overrideTitleName == null) ? title : overrideTitleName;
    _modal = $(iframe).dialog({
        title: newTitle,
        autoOpen: true,
        width: width,
        height: height,
        modal: false,
        resizable: true,
        autoResize: true,

        closeOnEscape: isEscClose
    }).width(width - horizontalPadding).height(height - verticalPadding);

}

var _IsSaveAndClose;
function onSaveAndClose(isSaveAndClose) {
    onCloseModal();
    _IsSaveAndClose = isSaveAndClose;
}

function onCloseModal() {
    if (typeof (_modal) != 'undefined' && _modal != null)
        _modal.dialog('close');
    else
        $.modal.close();
}

/* Navigation functions */
function LoadPage(pageUrl, qs) {
    if (qs == null)
        qs = '';

    parent.SetIframeSource($.format('{0}{1}', pageUrl, qs));
}

function GoBack(pageUrl) {
    // called only from Main.master page
    parent.SetIframeSource(pageUrl);
}

function activateSmallNavs(navId) {
    if (document.smallNavOn)
        toggleSmallNav();
    // if no navId passed in, we are just deactivating
    document.smallNavOn = navId ? (document.smallNavOn ? false : true) : false;
    // if we have a navId, toggle it
    if (navId)
        toggleSmallNav(navId);
}

function OnClickSmallNav(panelNameOn, panelNameOff) {
    document.smallNavOn = true;
    toggleSmallNavItem(panelNameOn, 'On');
    toggleSmallNavItem(panelNameOff, 'Off');
}

function toggleSmallNav(navId) {
    try {
        if (typeof (document.smallNavItems) != 'undefined') {
            // turn the all items on or off
            for (var i = 0; i < document.smallNavItems.length; i++) {
                var panelName = document.smallNavItems[i];
                if (panelName == navId)
                    toggleSmallNavItem(panelName, 'On');
                else
                    toggleSmallNavItem(panelName, 'Off');
            }
        }
    } catch (ex) { }
}

function omMouseOverOutSmallNavItem(name, state) {
    document.getElementById($.format('{0}Link', name)).className = $.format('SmallNavA{0}', state);
}

function toggleSmallNavItem(panelName, state) {
    // toggle an individual item
    if (!document.smallNavOn)
        return;
    var targetImg = document.getElementById($.format('{0}{1}Bullet', _ControlPrefix, panelName));
    var srcRoot = targetImg.src.substring(0, targetImg.src.lastIndexOf('_'));
    srcRoot = $.format('{0}_{1}.gif', srcRoot, state);
    targetImg.src = srcRoot;

    ToggleDisplay($.format('{0}Panel', panelName), state);
}
/* End Navigation functions */

/* General Toggle and display functions */
function ToggleDisplay(controlIds, state, sectionInstructionControlId) {
    /// <summary>ToggleDisplay - toggles the page section headers, level 1 - 3</summary>
    /// <param name="controlIds" type="string">control ids usually div or table ids as a comma delimited string [required]</param>
    /// <param name="state" type="string">state 'On' or 'Off' [not required]</param>
    /// <param name="sectionInstructionControlId" type="string">section Instruction Control Id table as a string [not required]</param>
    try {
        var controlInstruction = null;
        if (typeof (sectionInstructionControlId) != 'undefined')
            controlInstruction = $($.format('#{0}', sectionInstructionControlId));

        var idArray = controlIds.split(',');
        var selector = '';
        for (var i = 0; i < idArray.length; i++) {
            var id = $.trim(idArray[i]);
            if (id.length > 0)
                selector += '#' + id + ',';
        }
        if (selector.length > 0)
            selector = selector.substr(0, selector.length - 1);

        var control = $(selector);
        var isFadeOut = false;
        if (!state || state == null)
            isFadeOut = (control.is(":visible"));
        else
            isFadeOut = (state == 'Off');

        if (isFadeOut) {
            control.hide();
            if (controlInstruction != null)
                controlInstruction.hide();

        } else {
            control.show();
            if (controlInstruction != null)
                controlInstruction.show();
        }
    } catch (ex) {
        displayMessage('ToggleDisplay', 'Error Toggling Header Section', ex, 4, null);
    }
}

function SetPos(objId, trgtObjId, offsetTop, offsetLeft) {
    var obj1 = document.getElementById(objId);
    var obj2 = document.getElementById(trgtObjId);
    obj1.style.top = obj2.offsetTop + offsetTop + 'px';
    obj1.style.left = obj2.offsetLeft + offsetLeft + 'px';
}

function ToggleInlineDisplay(objId) {
    var obj = document.getElementById(objId);
    obj.style.display = (obj.style.display != "none") ? ("none") : ("inline");
}

function ToggleImage(image, onSrc, offSrc) {
    /// <summary>ToggleImage - toggles the image source 'src' attribute</summary>
    /// <param name="image" type="object">img dom object [required]</param>
    /// <param name="onSrc" type="string">src content on [required]</param>
    /// <param name="offSrc" type="string">src content off [required]</param>
    image.src = (image.src.indexOf(onSrc) > -1) ? offSrc : onSrc;
}

function ToggleImageById(imageId) {
    /// <summary>ToggleImageById - toggles the image control</summary>
    /// <param name="imageId" type="string">image control id [required]</param>
    try {
        if (typeof (imageId) == 'undefined' || imageId == '')
            return;

        var targetImg = document.getElementById(imageId);
        var className = targetImg.className;
        if (className.indexOf("accordianIconOpen") > -1) {
            targetImg.className = className.replace('accordianIconOpen', 'accordianIconClosed');
            return;
        }
        else if (className.indexOf("accordianIconClosed") > -1) {
            targetImg.className = className.replace('accordianIconClosed', 'accordianIconOpen');
            return;
        }

        var srcRoot = targetImg.src.substring(0, targetImg.src.lastIndexOf('_'));
        var state = (targetImg.src.indexOf('_on') > -1 ? "off" : "on");
        var ext = targetImg.src.substring(targetImg.src.lastIndexOf('.') + 1);

        srcRoot = $.format('{0}_{1}.{2}', srcRoot, state, ext);
        var imageFile = srcRoot;
        targetImg.src = imageFile;
    } catch (ex) {
        displayMessage('ToggleImageById', 'Error Toggling Header Section Image', ex, 4, null);
    }
}

function SetDisplayState(hfId) {
    var hf = document.getElementById(hfId);
    if (hf)
        hf.value = (hf.value != "0") ? ("0") : ("1");
}
/* End general toggle and display functions */

/* Misc functions */
function EnableDisable(objEnable, objDisable) { // in use
    var enable = objEnable;
    var disable = objDisable;
    if (objEnable != '')
        enable = document.getElementById(objEnable);
    if (objDisable != '')
        disable = document.getElementById(objDisable);

    if (enable != null)
        enable.disabled = false;
    if (disable != null) {
        if (disable.type == "select-multiple") {
            for (var i = 0; i < disable.options.length; i++) {
                disable.options[i].selected = false;
            }
        }
        disable.disabled = true;
    }
}

function jsDebug(msg) {
    var debug = window.open('', "debug", "width=1000,height=200,scrollbars,resizable");
    debug.document.writeln(msg + "<br />\n");
}

function trim(content) {
    while (content.substring(0, 1) == ' ')
        content = content.substring(1, content.length);

    while (content.substring(content.length - 1, content.length) == ' ')
        content = content.substring(0, content.length - 1);

    return content;
}

function ShowPageDesc(node) {
    var panel = document.getElementById("pageDescPanel");
    panel.innerHTML = node.Name;
}

function ClearPageDesc() {
    var panel = document.getElementById("pageDescPanel");
    panel.innerHTML = '';
}

function applyAllOffsets() {
    var container = document.getElementById('PriceControl_AssigedSeasonPricePanel');
    displayMessage('', message, container.id, 4, null);
}

function GetNumberOfLines(editControlText) {
    var numLines = 1;
    var index = -1;

    while (((index = editControlText.indexOf('\n')) != -1) && (numLines < 20)) {
        numLines++;
        editControlText = editControlText.substr(index + 1);
    }
    return numLines;
}

function checkTextLines(e, controlId, maxCharPerLine, maxLines) {
    var editControl = document.getElementById(controlId);
    var editControlText = editControl.value;
    var key, keychar, line, numberOfLines, index;

    key = getkey(e);
    if (key == null)
        return true;

    // get character
    keychar = String.fromCharCode(key);
    keychar = keychar.toLowerCase();

    if (key == 13) {
        numberOfLines = GetNumberOfLines(editControlText);
        return (numberOfLines < maxLines);
    } else {
        line = editControlText;
        index = editControlText.lastIndexOf('\n');

        if (index != -1)
            line = editControlText.substr(index + 1);

        return (line.length < maxCharPerLine);
    }
}

function checkTextLinesForTotalSize(e, controlId, maxSize) {
    var editControl = document.getElementById(controlId);
    var editControlText = editControl.value;
    if (editControlText.length > maxSize) {
        editControl.value = editControlText.substring(0, maxSize);
    }
}

/* End misc functions */

/* Tab Functions */
function ToggleTabSetting(tabName) {
    var panel = document.getElementById($.format('{0}Panel', tabName));
    var tabLink = document.getElementById($.format('{0}Link', tabName));
    // SelectedTabName is the global var in RadTabbedTree.ascx
    if (tabName == SelectedTabName) {
        panel.style.display = "block";
        tabLink.className = "tabon";
    } else {
        panel.style.display = "none";
        tabLink.className = "taboff";
    }
}
/* End Tab Functions */

/* Key Handlers */
function getkey(e) {
    if (window.event)
        return window.event.keyCode;
    else if (e)
        return e.which;
    else
        return null;
}

var lastKey = '';
var submitButton = '';
function trackKeyPress(key) {
    if (key == 13)
        lastKey = 'enter';
    else
        lastKey = '';
}

function checkForEnter() {
    var isReturn = true;

    if (lastKey == 'enter' && submitButton == 'logout')
        isReturn = false;
    else if (lastKey == 'enter' && submitButton == 'gotoHotelID')
        isReturn = false;

    lastKey = '';
    submitButton = '';
    return isReturn;
}
/* End Key Handlers */

function RadUpdateAllChildren(nodes, checked) {
    for (var i = 0; i < nodes.get_count() ; i++) {
        if (checked)
            nodes.getNode(i).check();
        else
            nodes.getNode(i).uncheck();

        if (nodes.getNode(i).get_nodes().get_count() > 0)
            RadUpdateAllChildren(nodes.getNode(i).get_nodes(), checked);
    }
}

function RadUncheckParents(node) {
    if (node.get_parent() != null) {
        node.get_parent().uncheck();
        RadUncheckParents(node.get_parent());
    }
}

function RadCheckParents(node) {
    var allChecked = true;
    if (node.get_parent() != null) {
        for (var i = 0; i < node.get_parent().get_nodes().get_count() ; i++) {
            if (!node.get_parent().get_nodes().getNode(i).get_checked())
                allChecked = false;
        }

        if (allChecked && !node.get_parent().get_checked())
            node.get_parent().check();

        RadCheckParents(node.get_parent());
    }
}

function ClientNodeClicked(sender, eventArgs) {
    var node = eventArgs.get_node();

    RadUpdateAllChildren(node.get_nodes(), node.get_checked());
    try {
        if (node.get_checked())
            RadCheckParents(node);
        else
            RadUncheckParents(node);
    } catch (e) { }
}

function RadCheckParentsForPageAccess(node) {
    if (node.get_parent() != null) {
        node.get_parent().check();
        RadCheckParentsForPageAccess(node.get_parent());
    }
}

function ClientNodeClicking(sender, eventArgs) {
    var node = eventArgs.get_node();
    RadAfterCheckForPageAccess(node);
}

function RadAfterCheckForPageAccess(node) {
    RadUpdateAllChildren(node.get_nodes(), node.get_checked());
    if (node.get_checked())
        RadCheckParentsForPageAccess(node);
}

function openHelp() {
    var navId = document.getElementById("NavigationID").firstChild.nodeValue.replace(/^\s*|\s*$/g, '');
    var url = $.format('/cc/help/default.htm#{0}.htm', navId);
    window.open(url, 'Help');
}

function openBuildSummaryHelp(fileNm) {
    var url = $.format('/cc/help/default.htm#t={0}', fileNm);
    window.open(url, 'Help');
}

function toggleLoadingMessage() {
    try {
        var msg = document.getElementById('LoadingMessageContainer');
        msg.style.display = 'none';
        var msgShadow = document.getElementById('LoadingMessageContainerShadow');
        msgShadow.style.display = 'none';
    } catch (e) { }
}

function Checkall(tabnm, chknm, removechknm = null) {
    var name = tabnm;
    var check = chknm;
    // Go through all items of a check list control
    var table = document.getElementById(name);
    var cells = table.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
        var ctrl = cells[i].firstChild;
        if (ctrl.type == 'checkbox') {
            if (document.getElementById(check).checked == true)
                ctrl.checked = true;
            else
                ctrl.checked = false;
        }
    }
    if(removechknm !== null || removechknm != undefined) {
        if (document.getElementById(check).checked == true)
            document.getElementById(removechknm).checked = false;
    }
}

function RemoveAll(tabnm, removechknm, allchnm) {

    if(!document.getElementById(removechknm).checked)
        return;
    
    // Go through all items of a check list control
    var table = document.getElementById(tabnm);
    var checkAllCb = document.getElementById(allchnm);
    var cells = table.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
        var ctrl = cells[i].firstChild;
        if (ctrl.type == 'checkbox') {
            ctrl.checked = false
        }
    }   
    
    if(document.getElementById(removechknm).checked)
        checkAllCb.checked = false;
}

function CheckBoxConfirm(enableMsg, disableMsg, chkId) {
    var chk = document.getElementById(chkId);
    if (chk == null)
        return false;
    var con;
    if (chk.checked == true)
        con = confirm(enableMsg, '');
    else
        con = confirm(disableMsg, '');

    if (con == false)
        chk.checked = !chk.checked;
}

function CheckBoxConfirmEnableOnly(enableMsg, chkId) {
    var el = $($.format('#{0}', chkId));
    if (el.prop('checked') && !confirm(enableMsg, ''))
        el.prop('checked', false);
}

function CheckBoxUndoValueChange(chkId) {
    var chk = document.getElementById(chkId);
    chk.checked = !chk.checked;
}

function OnDayChecked(checkboxListClientId, chekAllClientId, removeCbClientId = null) {
    var checkAll = document.getElementById(chekAllClientId);
    checkAll.checked = true;

    // Go through all items of a check list control
    let table = document.getElementById(checkboxListClientId);
    let cells = table.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
        let ctrl = cells[i].firstChild;
        if (ctrl.type == 'checkbox') {
            if (ctrl.checked == false) {
                checkAll.checked = false;
                break;
            }
        }
    }
    if (removeCbClientId != null) {
        for (let i = 0; i < cells.length; i++) {
            let ctrl = cells[i].firstChild;
            if (ctrl.type == 'checkbox' && ctrl.checked == true) {
                document.getElementById(removeCbClientId).checked = false;
                break;
            }
        }            
    }    
}

function UpdateStayControls(startDate, rateGuid, roomGuid, upsellGuid, stayControlLevel, openAsModal, titleText, showMonthly) {
    if (startDate == '') {
        var d = new Date();
        startDate = $.format('{0}/{1}/{2}', (d.getMonth() - 0 + 1), d.getDate(), d.getFullYear());
    }
    var windowTitle = titleText || '';
    var updateUrl = '/CC/Inventory/StayControlsUpdatePopup.aspx{0}';
    var modalClose = '&IsModal=false';
    if (openAsModal)
        modalClose = '&IsModal=true';
    showMonthly = (typeof showMonthly === "undefined") ? "false" : showMonthly;

    var paramList = $.format('?StartDate={0}&RateGuid={1}&RoomGuid={2}&UpsellGuid={3}&StayControlLevel={4}{5}&ShowMonthly={6}', startDate, rateGuid, roomGuid, upsellGuid, stayControlLevel, modalClose, showMonthly);
    OpenUpdatePopup($.format(updateUrl, paramList), 'StayControlsUpdate', openAsModal, windowTitle);
}

function SizeNestedIFrame() {
    var contentIframe = parent.document.getElementById('ContentIframe');
    var containerDiv = document.getElementById('ContentBuffer');
    var childFrames = containerDiv.getElementsByTagName('iframe');
    var height = new Number(contentIframe.style.height.replace('px', '')) - 170;
    var width = new Number(contentIframe.style.width.replace('px', '')) - 170;
    childFrames[0].style.height = height.toString() + 'px';
    childFrames[0].style.width = width.toString() + 'px';
}

/*
    Geographic locations
*/
var _GLCountryDropDownListID = null;
var _GLStateDropDownListID = null;
var _GLCountryHasStatesID = null;
var _GLStateContainerID = null;
var _GLUserGuid = null;
var _GLSelectedStateHiddenID = null;

// Executed on page load to store the values of the states in its ddl and avoid the problem with view state when a postback vs ddl populated by jQuery
function OnLoadCountryStateChange(countryDropDownListId, stateDropDownListId, countryHasStatesId, stateRowId, selectedStateId, userGuid) {

    //Keeps objects ids
    _GLCountryDropDownListID = countryDropDownListId;
    _GLStateDropDownListID = stateDropDownListId;
    _GLStateContainerID = stateRowId;
    _GLCountryHasStatesID = countryHasStatesId;
    _GLUserGuid = userGuid;
    _GLSelectedStateHiddenID = selectedStateId;

    //Getting the value of the selected country
    var countryCode = $($.format("#{0} :selected", _GLCountryDropDownListID)).val();

    //Getting the value of the hidden selected state value
    var selectedStateCode = $($.format("#{0}", _GLSelectedStateHiddenID)).val();

    //Getting the value of country has states
    var countryHasStates = $($.format("#{0}", _GLCountryHasStatesID)).val();

    //See if states ddl is empty
    var items = $("#" + _GLStateDropDownListID + " option");

    //Loads states by country when both codes are not empty but the ddl states is
    // or if country code has a value, selected State is empty but the country has states (meaning that a state was not selected)
    if (
        (countryCode != "" && selectedStateCode != null && selectedStateCode != "" && (items == null || items.length == 0))
        ||
        (countryCode != "" && selectedStateCode == "" && countryHasStates == "True" && (items == null || items.length == 0))
       ) {
        GetStatesByCountry(countryCode);

        //Select the value
        $("#" + _GLStateDropDownListID).val(selectedStateCode);

    }

    //If country code is empty, hide the state row
    if ((countryCode == "") || (countryCode != "" && countryHasStates == "False")) {
        $($.format('#{0}', _GLStateContainerID)).hide();
    }


}

function OnCountryChange() {
    // Clears the selected state hidden value
    // This hidden preserves the state value selected when the ddl has been loaded by JQuery and avoid the problem with an empty view state
    // The view state does not "realize" that the ddl has been populated in client side
    document.getElementById(_GLSelectedStateHiddenID).value = '';
    // Getting the value of the selected country
    var countryCode = $($.format('#{0} :selected', _GLCountryDropDownListID)).val();

    // Hide states
    $($.format('#{0}', _GLStateContainerID)).hide();

    // Loads states by country
    GetStatesByCountry(countryCode);
}

function OnStateChange() {
    // Getting the value of the selected state
    var stateCode = $($.format('#{0} :selected', _GLStateDropDownListID)).val();
    // Storing it into the hidden field
    var selectedState = $($.format('#{0}', _GLSelectedStateHiddenID));

    if (selectedState != null)
        selectedState.val(stateCode);
}

// Gets states by country
function GetStatesByCountry(countryCode) {
    //Getting the states for a specific country
    $.ajax({
        type: "POST",
        url: "../Reservation/ReservationAvailabilityCheck.asmx/GetStatesByCountry",
        data: "{countryCode: '" + countryCode + "', userGuid:'" + _GLUserGuid + "', addFirstElement:'True'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: handleStateCodes,
        error: handleErrorStateCodes
    });
}

// Fills the states ddl
function handleStateCodes(result) {
    if (result != null) {
        var data = result.d;
        var stateDropDownList = $($.format('select[id$={0}]', _GLStateDropDownListID));
        var countryHasStates = $($.format("#{0}", _GLCountryHasStatesID));

        // clear option first
        stateDropDownList.children().remove();

        if (data.length > 1) {

            // loop through data and append new options
            var index = 0;
            $.each(data, function () {
                var value = data[index].split("|")[0]; // type
                var text = data[index].split("|")[1]; // value
                stateDropDownList.append(jQuery("<option/>").attr("value", value).text(text));

                index++;
            });

            if (countryHasStates != null)
                countryHasStates.val("True");
            $($.format('#{0}', _GLStateContainerID)).show();
        }
        else {
            if (countryHasStates != null)
                countryHasStates.val("False");
            $($.format('#{0}', _GLStateContainerID)).hide();
        }
    }
}

function handleErrorStateCodes(result) {
    displayMessage('handleGetStatesByCountryFailure', result.status + ' ' + result.statusText, null, 4, null);
}

/*
    Controls/ChildrenQtySelectControl
*/
// default child ages label for clientside use, should be replaced on control render.
var _childAgesLabel = 'Child Ages';
var _childAgeUnknownLabel = 'Unknown';
var _childAgeNumber = 'Child {0}:';
var _childAgeRanges = [];
function LoadChildAges(qtyDivId, childAgeRanges) {
    /// <summary>Loads child age selects if necessary</summary>
    /// <param name="qtyDivId" type="string">Client id of quantities div.</param>
    var mainDiv = jQuery('#' + qtyDivId);
    _childAgeRanges = childAgeRanges.split(",");
    var childAgesDiv = mainDiv.find('div.ChildAgesDiv');
    if (childAgesDiv.length > 0) {
        var children = mainDiv.find('select.dropdownlist').val();
        var agesHiddeField = mainDiv.find('input:hidden').val();
        var ages = agesHiddeField.split(',');
        InsertChildAgeSelects(childAgesDiv, children, ages);
        if (children == 0)
            mainDiv.find('div.ChildAgesWrapDiv').hide();
        else
            mainDiv.find('div.ChildAgesWrapDiv').show();
    }
}

function InsertChildAgeSelects(div, children, values) {
    /// <summary>Loads child age selects in given div</summary>
    /// <param name="div" type="jQuery div">Div to put age selects into</param>
    /// <param name="nChildren" type="int"># of children to collect ages for</param>
    /// <param name="values" type="int">age values int array for preselection</param>
    div.empty();
    var html = '<td><div style="float:left;margin-left:15px;"><span class="fieldLabel">' + _childAgesLabel + ': </span></div></td>';
    html += '<td><div class="ChildAgesSelects" style="margin-left:15px;">';
    var selectStyle = 'style="margin-left:12px;"';
    for (var i = 1; i <= children; i++) {
        var selectedVal = -1;
        if (values != null && values.length >= i && values[i - 1].length > 0)
            selectedVal = values[i - 1];
        if (i > 9) selectStyle = 'style="margin-left:5px;"';
        html += '<div><span>' + $.format(_childAgeNumber, i) + $.format('</span><select onchange="UpdateChildAgeValues(this);" {0}>',selectStyle);
        html += '<option value=""';
        if (selectedVal == -1) html += ' selected="selected"';
        html += '>' + _childAgeUnknownLabel + '</option>';

        for (var j = 0; j <= 21; j++) {
            html += '<option value="' + j + '"';
            if (selectedVal == j) html += ' selected="selected"';
            html += '>' + j + '</option>';
        }
        html += "</select></div>";
    }
    html += '</div></td>';

    if (children > 0)
        div.append(html);

    UpdateChildAgeValues(div);
    div.show();
}

function UpdateChildAgeValues(select) {
    /// <summary>Updates the child ages hidden field</summary>
    /// <param name="select" type="dom select">Child age select</param>
    var mainDiv = jQuery(select).parents('div.ChildQtyDiv');
    if (mainDiv.length > 0) {

        var allAges = '';
        var range1Childs, range2Childs, range3Childs, range4Childs, range5Childs, rangeXChilds;
        range1Childs = range2Childs = range3Childs = range4Childs = range5Childs = rangeXChilds = 0;
        mainDiv.find('div.ChildAgesSelects select').each(function (index) {
            allAges += jQuery(this).val() + ',';

            var selectedVal = parseInt(jQuery(this).val());
            if (Number.isNaN(selectedVal)) {
                rangeXChilds++;
            } else if (_childAgeRanges.length > 0 && selectedVal <= _childAgeRanges[0]) {
                range1Childs++;
            } else if (_childAgeRanges.length > 1 && selectedVal <= _childAgeRanges[1]) {
                range2Childs++;
            } else if (_childAgeRanges.length > 2 && selectedVal <= _childAgeRanges[2]) {
                range3Childs++;
            } else if (_childAgeRanges.length > 3 && selectedVal <= _childAgeRanges[3]) {
                range4Childs++;
            } else if (_childAgeRanges.length > 4 && selectedVal <= _childAgeRanges[4]) {
                range5Childs++;
            }
        });
        mainDiv.find('#AgeRange1Value').text(range1Childs);
        mainDiv.find('#AgeRange2Value').text(range2Childs);
        mainDiv.find('#AgeRange3Value').text(range3Childs);
        mainDiv.find('#AgeRange4Value').text(range4Childs);
        mainDiv.find('#AgeRange5Value').text(range5Childs);
        mainDiv.find('#AgeRangeXValue').text(rangeXChilds);
        if (allAges.length > 0)
            allAges = allAges.substring(0, allAges.length - 1);

        mainDiv.find('input:hidden').val(allAges);
    }
}

function UpdateChildAgeSelects(select) {
    /// <summary>Updates the # of child age selects</summary>
    /// <param name="select" type="dom select">child qty select</param>
    var mainDiv = jQuery(select).parents('div.ChildQtyDiv');
    var children = parseInt(select.options[select.selectedIndex].value);
    var childAgesDiv = mainDiv.find('div.ChildAgesDiv');
    var allAges = mainDiv.find('input:hidden').val();
    if (childAgesDiv.length > 0) {
        var ages = null;
        if (allAges.length > 0)
            ages = allAges.split(',');

        InsertChildAgeSelects(childAgesDiv, children, ages);
        if (children == 0)
            mainDiv.find('div.ChildAgesWrapDiv').hide();
        else
            mainDiv.find('div.ChildAgesWrapDiv').show();
    }
}

/*
    Number Helpers
*/
function TryParseInt(value, defaultValue) {
    /// <summary>TryParseInt converts the text value into a number</summary>
    /// <param name="value" type="string">value to parse</param>
    /// <param name="defaultValue" type="int">default int value 0 </param>
    if (typeof (defaultValue) == 'undefined' || defaultValue == null)
        defaultValue = 0;

    var content = defaultValue;
    if (typeof (value) != 'undefined' && value != null && value.length > 0) {
        if (!isNaN(value))
            content = parseInt(value);
    }
    return content;
}

function RaiseAlert(message) {
    displayMessage('', message, null, 4, null);
    return false;
}

jQuery.fn.highlight = function (content, className, style) {
    /// <summary>highlight jquery function to highlight wordfs in the given content</summary>
    /// <param name="content" type="string">content to search</param>
    /// <param name="className" type="string">class name (optional) pass null </param>
    /// <param name="style" type="string">styles (optional) pass null </param>
    var regex = new RegExp(content.toUpperCase(), "gi");
    if (content != '') {
        return this.each(function () {
            if (typeof (this.innerHTML) != 'undefined') {
                this.innerHTML = this.innerHTML.replace(regex, function (matched) {
                    if (className != null)
                        return jQuery.format("<span class=\"{0}\">{1}</span>", className, matched);
                    else
                        return jQuery.format("<span style=\"{0}\">{1}</span>", style, matched);
                });
            } else {
                this.html(this.html().replace(regex, function (matched) {
                    if (className != null)
                        return jQuery.format("<span class=\"{0}\">{1}</span>", className, matched);
                    else
                        return jQuery.format("<span style=\"{0}\">{1}</span>", style, matched);
                })
                );
            }
        });
    }
};

var _UserAccess; // used for init
var UserAccess = function (canView, canEdit, canDelete, canAdd, message, hotelGuid, userGuid, theme) {
    /// <summary>UserAccess object that is used for js function for user access on actions</summary>
    /// <param name="canView" type="bool">access view</param>
    /// <param name="canEdit" type="bool">access edit</param>
    /// <param name="canDelete" type="bool">access delete</param>
    /// <param name="canAdd" type="bool">access add</param>
    /// <param name="message" type="string">message for alert</param>
    /// <param name="hotelGuid" type="string">hotel guid</param>
    /// <param name="userGuid" type="string">user guid</param>
    /// <param name="theme" type="string">theme name</param>
    this.canView = canView;
    this.canEdit = canEdit;
    this.canDelete = canDelete;
    this.canAdd = canAdd;
    this.message = message;
    this.hotelGuid = hotelGuid;
    this.userGuid = userGuid;
    this.theme = theme;
};

jQuery.extend(UserAccess.prototype, {
    canViewEditNoDelete: function () {
        /// <summary>UserAccess readocan view and edit but no delete access</summary>
        return ((this.canView && this.canEdit) && !this.canDelete);
    },
    canViewEditAddNoDelete: function () {
        /// <summary>UserAccess readocan view and edit but no delete access</summary>
        return ((this.canView && this.canEdit && this.canAdd) && !this.canDelete);
    },
    readonly: function () {
        /// <summary>UserAccess readonly access</summary>
        return (this.canView && (!this.canEdit && !this.canDelete && !this.canAdd));
    },
    full: function () {
        /// <summary>UserAccess full access</summary>
        return (this.canView && this.canEdit && this.canDelete && this.canAdd);
    }
});

function PushState(url) {
    window.history.pushState({url}, document.title, '');
}

$(window).bind('popstate', function(event) {
    var state = event.originalEvent.state;    
    if (state != null && state.url != null) {
        SetBodyHeightWidth(true);
        ToggleIframe(IsSphUrl(state.url), false);
    }
});

function toggleTopLevelPagesForUserAcessAndCustomRoles(tableId) {
    $('#'+tableId+' .SubSectionHeader').closest('tr').bind( "click", function(e) {
        var trClass = $(this).attr('class');
        var selector = "tr." + trClass;
        $(this).nextAll(selector).toggle();

        var targetImg = $(this).find('img');
        var className = targetImg.attr('class');
        if (className.indexOf("accordianIconOpen") > -1) {
            targetImg.removeClass('accordianIconOpen').addClass('accordianIconClosed');
        }
        else if (className.indexOf("accordianIconClosed") > -1) {
            targetImg.removeClass('accordianIconClosed').addClass('accordianIconOpen');
        }
        e.stopImmediatePropagation();
    });
}

function showLoadingMessage () {
    $('#PageLoadingContainer').show();
}

function hideLoadingMessage () {
    $('#PageLoadingContainer').hide();
}
