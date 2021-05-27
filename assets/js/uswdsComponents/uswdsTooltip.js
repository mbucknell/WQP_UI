/*
 * Function adds USWDS tooltip classes to element
 * @param {Object} elem - element selection to append the tooltip
 */

export const initTooltip = function(elem) {
    elem.setAttribute('class', 'usa-tooltip');
    elem.setAttribute('data-position', 'right'); 
};