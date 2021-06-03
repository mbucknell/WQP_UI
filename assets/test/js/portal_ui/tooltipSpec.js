import { initTooltip } from '../../../js/uswdsComponents/uswdsTooltip';

describe('Creates a tooltip', function() {
    var testDiv = document.createElement('div');
    testDiv.setAttribute('id', 'test-div')
    testDiv.setAttribute('title', 'Tooltip test');;

    it('Creates a tooltip widget', () => {
        let tooltipItem;f
        initTooltip(testDiv);
        tooltipItem = testDiv.className;
        expect(tooltipItem).toContain('usa-tooltip');
    });
});
