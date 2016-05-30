(function ($) {
    /**
     * Google Analytics Trackables Module
     *
     * Checks on elements for data attributes
     * and pushes them to google analytics
     *
     * - data-ga-track     to instantiate (required)
     * - data-ga-event     for js event binding (required)
     * - data-ga-category  ga event category (required)
     * - data-ga-action    ga event action (required)
     * - data-ga-label     ga event label
     * - data-ga-value     ga event value
     *
     * example:
     * <button data-ga-track data-ga-event="click" data-ga-category="category" data-ga-action="action" data-ga-label="label" data-ga-value="value">mouseover</button>
     */
    var gaTrackables = (function () {

        /** var {boolean} isConsoleActivated */
        var isConsoleActivated = false;

        /** var {boolean} isDebugActive */
        var isDebugActive = false;

        /**
         * @param {string|undefined} trackableDataItem
         * @private
         */
        isTrackableDataAvailable = function (trackableDataItem) {
            return typeof trackableDataItem !== 'undefined' && trackableDataItem !== '';
        };

        /**
         * @param {string} message
         * @param {object} data
         * @private
         */
        debug = function (message, data) {
            if (isConsoleActivated && isDebugActive) {
                console.log(message, data);
            }
        };

        /**
         * @private
         */
        pushGoogleAnalytics = function () {
            var trackableData = $(this).data();

            debug('trackable data: ', trackableData);

            _gaq.push([
                '_trackEvent',
                trackableData.gaCategory,
                trackableData.gaAction,
                trackableData.gaLabel || null,
                trackableData.gaValue || null
            ]);
        };

        /**
         * @param {object} $trackable
         * @private
         */
        bindTrackable = function ($trackable) {
            var trackableData  = $trackable.data(),
                trackableEvent = trackableData.gaEvent;

            if (!isTrackableDataAvailable(trackableEvent)) {
                debug('not able to bind tracker, no trackable event on element: ', $trackable);
                return;
            }

            if (!isTrackableDataAvailable(trackableData.gaCategory)) {
                debug('not able to bind tracker, no category data given on element: ', $trackable);
                return;
            }

            if (!isTrackableDataAvailable(trackableData.gaAction)) {
                debug('not able to bind tracker, no action data given on element: ', $trackable);
                return;
            }

            $trackable.on(trackableEvent, pushGoogleAnalytics);
        };

        return {
            /**
             * @param {boolean} debug
             * @public
             */
            init: function (debug) {
                isConsoleActivated = (window.console) ? true : false;
                isDebugActive      = debug;

                /** var {object} trackables */
                var trackables = $('*[data-ga-track]');
                $.each(trackables, function () {
                    bindTrackable($(this));
                });
            },

            /**
             * @param {object} $element
             * @param {object} config
             * @public
             */
            buildTrackable: function ($element, config) {
                $element.data(config);
                bindTrackable($element);
            }
        };
    })();

    $(document).ready(function () {
        if (typeof _gaq !== 'undefined') {
            gaTrackables.init(false);
        }
    });
})(jQuery);