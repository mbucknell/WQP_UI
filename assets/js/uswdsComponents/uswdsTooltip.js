/*
 * Function adds USWDS tooltip classes to element
 * @param {Object} elem - element selection to append the tooltip
 */
import { tooltip as uswds_tooltip } from "../../node_modules/uswds/src/js/components";

export const initTooltip = function(elem) {
    uswds_tooltip.on(elem);
};