import {initTooltip} from '../../../js/uswdsComponents/uswdsTooltip';

describe('Creates a tooltip', function() {

    it('Creates a tooltip widget', () => {
        let tooltipItem;
        var testDiv = document.createElement('div');
        testDiv.className = 'usa-tooltip';
        document.body.append(testDiv);
        initTooltip(document.querySelectorAll('.usa-tooltip'));
        tooltipItem = testDiv.className;
        expect(tooltipItem).toContain('usa-tooltip__trigger');
    });
});