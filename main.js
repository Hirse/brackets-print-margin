define(function (require, exports, module) {
    "use strict";

    var EditorManager       = brackets.getModule("editor/EditorManager");
    var PreferencesManager  = brackets.getModule("preferences/PreferencesManager");
    var AppInit             = brackets.getModule("utils/AppInit");
    var ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    var KeyEvent            = brackets.getModule("utils/KeyEvent");
    var StatusBar           = brackets.getModule("widgets/StatusBar");

    var Strings             = require("strings");
    var IndicatorTemplate   = require("text!templates/status-bar-indicator.html");

    ExtensionUtils.loadStyleSheet(module, "styles/styles.css");

    var prefix = "hirse.print-margin";
    var prefs = PreferencesManager.getExtensionPrefs(prefix);

    var $indicatorLabel;
    var $indicatorInput;

    /**
     * Change CSS to display the print margin on the requested column.
     * The column value is taken directly from the preferences.
     */
    function _applyPrintMargin() {
        $(".CodeMirror-lines").css("backgroundPosition", prefs.get("column") + "ch 0");
    }

    /**
     * Change Print Margin Column.
     * Update the Preference in the file if the new column is a positive integer.
     * @param {Number} value Column entered into the status bar.
     */
    function _changePrintMarginColumn(value) {
        $indicatorLabel.removeClass("hidden");
        $indicatorInput.addClass("hidden");
        $indicatorInput.off("blur keyup");
        if (value >= 0) {
            $indicatorLabel.text(value);
            prefs.set("column", value);
            prefs.save();
            _applyPrintMargin();
        }
    }

    function _init() {
        prefs.definePreference("column", "number", 120, {
            name: Strings.PREF_COLUMN_NAME,
            description: Strings.PREF_COLUMN_DESC
        });
        prefs.save();
        _applyPrintMargin();
        EditorManager.on("activeEditorChange", _applyPrintMargin);

        var $indicator = Mustache.render(IndicatorTemplate, {
            Strings: Strings,
            column: prefs.get("column")
        });
        $indicator = $($indicator);
        $indicatorLabel = $indicator.children("#print-margin-column-label");
        $indicatorInput = $indicator.children("#print-margin-column-input");

        $indicatorLabel.click(function () {
            $indicatorInput.val(prefs.get("column"));
            $indicatorLabel.addClass("hidden");
            $indicatorInput.removeClass("hidden");
            $indicatorInput.focus();
            $indicatorInput.blur(function () {
                _changePrintMarginColumn(parseInt($indicatorInput.val(), 10));
            });
            $indicatorInput.keyup(function (event) {
                if (event.keyCode === KeyEvent.DOM_VK_RETURN) {
                    $indicatorInput.blur();
                } else if (event.keyCode === KeyEvent.DOM_VK_ESCAPE) {
                    _changePrintMarginColumn(-1);
                }
            });
        });

        $indicatorInput.focus(function () {
            $indicatorInput.select();
        });

        StatusBar.addIndicator(prefix, $indicator, true);
    }

    AppInit.htmlReady(_init);
});
