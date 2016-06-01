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
     * example for data attributes:
     * <button data-ga-track data-ga-event="click" data-ga-category="category" data-ga-action="action" data-ga-label="label" data-ga-value="value">click button</button>
     *
     * example for javascript:
     * The third parameter defines if the event should be directly bound, this should be set
     * to `false` if the element should just be added to the list of trackables and the .init()
     * is executed after the building the trackable.
     * gaTrackables.buildTrackableElement($('.element'), {
     *     gaEvent: 'click',
     *     gaCategory: 'category',
     *     gaAction: 'action'
     * }, true);
     */
    var gaTrackables = (function () {

        /** var {boolean} isConsoleActivated */
        var isConsoleActivated = false;

        /** var {boolean} logOutputOnly */
        var isLogOutputOnlyActivated = false;

        /** var {boolean} isDebugActive */
        var isDebugActivated = false;

        /** var {object} trackables */
        var trackables = null;

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
            if (isConsoleActivated && isDebugActivated) {
                console.log(message, data);
            }
        };

        /**
         * @private
         */
        pushGoogleAnalytics = function () {
            var trackableData = $(this).data();

            debug('trackable data: ', trackableData);

            var eventData = [
                '_trackEvent',
                trackableData.gaCategory,
                trackableData.gaAction,
                trackableData.gaLabel || null,
                trackableData.gaValue || null
            ];

            if (isLogOutputOnlyActivated) {
            	console.log(eventData);
            } else {
            	_gaq.push(eventData);
            }
        };

        /**
         * @param {object} $trackable
         * @private
         */
        bindTrackable = function ($trackable) {
            debug('current trackable: ', $trackable);

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
             * @param {boolean} logOnly
             * @public
             */
            init: function (debugMode, logOnly) {
                isConsoleActivated 	     = (window.console) ? true : false;
                isDebugActivated         = debugMode;
                isLogOutputOnlyActivated = logOnly;

                trackables = $('*[data-ga-track]');
                debug('trackables: ', trackables);

                $.each(trackables, function () {
                    bindTrackable($(this));
                });
            },

            /**
             * @param {object} $element
             * @param {object} config
             * @param {boolean} bindDirectly
             * @public
             */
            buildTrackableElement: function ($element, config, bindDirectly) {
                debug('to build trackable: ', $element, config);

                $element.data(config);
                trackables.push($element[0]);

                if (bindDirectly) {
                	bindTrackable($element);
                }
            }
        };
    })();

    $(document).ready(function () {
        gaTrackables.init(
            false,
            typeof _gaq === 'undefined'
        );
    });
})(jQuery);
