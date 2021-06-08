import { initTooltip } from '../../../js/uswdsComponents/uswdsTooltip';

describe('Creates a tooltip', function() {
    var testDiv = document.createElement('div');
    $(testDiv).attr('class', 'test-div')

    it('Creates a tooltip widget', () => {
        let tooltipItem;
        initTooltip($(testDiv));
        tooltipItem = testDiv.className;
        expect(tooltipItem).toContain('usa-tooltip');
    });
});