/* jslint browser: true */
/* global Handlebars */
/* global Config */
/* global _gaq */
/* global _ */
/* global $ */

var PORTAL = PORTAL || {};
PORTAL.VIEWS = PORTAL.VIEWS || {};


(function() {
	"use strict";

	// Only show this many features in the dialog. Also use alternative download based on the bounding box of the
	// features that are shown.
	var FEATURE_LIMIT = 50;

	var FEATURE_INFO_TEMPLATE = Handlebars.compile(
		'{{#if exceedsFeatureLimit}}' +
		'Retrieved {{features.length}} sites, only showing ' + FEATURE_LIMIT + '<br />' +
		'{{/if}}' +
		'{{#each features}}' +
			'<br /><table>' +
			'<tr><th>Station ID: </th><td class="details-site-id">{{values_.name}}</td></tr>' +
			'<tr><th>Name: </th><td>{{values_.locName}}</td></tr>' +
			'<tr><th>Type: </th><td>{{values_.type}}</td></tr>' +
			'<tr><th>HUC 8: </th><td>{{values_.huc8}}</td></tr>' +
			'<tr><th>Org ID: </th><td>{{values_.orgId}}</td></tr>' +
			'<tr><th>Org Name: </th><td>{{values_.orgName}}</td></tr>' +
			'</table>' +
		'{{/each}}'
	);

	var HIDDEN_FORM_TEMPLATE = Handlebars.compile(
		'{{#if exceedsFeatureLimit}}' +
		'<input type="hidden" name="bBox" value="{{boundingBox}}" />' +
		'{{#each queryParamArray}}' +
		'<input type="hidden" name="{{name}}" value="{{value}}" />' +
		'{{/each}}' +
		'{{else}}' +
		'{{#each features}}' +
		'<input type="hidden" name="siteid" value="{{values_.name}}" />' +
		'{{/each}}' +
		'<input type="hidden" name="zip" checked="checked" id="zip" value="yes"/>' +
		'{{/if}}'
	);

	/*
	 * @param {Object} options
	 * 		@prop {Jquery element} $dialog - Contains the identify dialog
	 * 	    @prop {Jquery element} $popover - Contains the div where the popover identifier will be rendered.
	 */
	PORTAL.VIEWS.identifyDialog = function(options) {

		var self = {};

		self.initialize = function(closeActionFnc) {
			var closeFunc = (closeActionFnc) ? closeActionFnc : undefined;

			// Initialize UI dialog
			options.$dialog.find('#download-map-info-button').click(function() {
				var resultType = options.$dialog.find('input[name="resultType"]:checked').val();
				var $form = options.$dialog.find('form');
				var url = Config.QUERY_URLS[resultType];

				$form.attr('action', url);
				_gaq.push(['_trackEvent', 'Portal Page', 'IdentifyDownload' + resultType, url + '?' + $form.serialize()]);
				$form.submit();
			});

			options.$dialog.dialog({
				autoOpen: false,
				modal: false,
				title: 'Detailed site information',
				width: 450,
				height: 400,
				close: closeFunc
			});

			//Initialize popover
			options.$popover.on('hide.bs.popover', closeFunc);
		};

		/*
		 * @param {Array of Object} features - json object representing the features from a WFS GetFeature call.
		 * @param {Array of Object} with name and value properties} queryParamArray
		 * @param {String} boundingBox - string which is suitable to send as the WQP service bbox parameter value.
		 */
		self.showDialog = function(features, queryParamArray, boundingBox) {
			var exceedsFeatureLimit = features.length > FEATURE_LIMIT;
			var $detailDiv = options.$dialog.find('#map-info-details-div');
			var $hiddenFormInputDiv = options.$dialog.find('#map-id-hidden-input-div');
			var $popover = $('#map-popover');

			var context = {
				features: features,
				exceedsFeatureLimit: exceedsFeatureLimit,
				boundingBox: boundingBox,
				queryParamArray: _.reject(queryParamArray, function (param) {
					return (param.name === 'bBox') || (param.name === 'mimeType');
				})
			};

			if ($('body').width() < 750) {
				options.$popover.popover('destroy');
				if (features.length > 0) {
					options.$popover.popover({
						placement: 'top',
						animation: false,
						content: FEATURE_INFO_TEMPLATE(context),
						html: true
					});
					options.$popover.popover('show');
				}
			}
			else {
				if (features.length > 0) {
					$detailDiv.html(FEATURE_INFO_TEMPLATE(context));
					$hiddenFormInputDiv.html(HIDDEN_FORM_TEMPLATE(context));

					options.$dialog.dialog('open');
				}
				else {
					options.$dialog.dialog('close');
				}
			}
		};

		return self;
	};
})();

