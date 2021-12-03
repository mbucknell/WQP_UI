from unittest import TestCase, mock
import pandas as pd

from requests import Response
import requests_mock

from .. import app
from ..utils import retrieve_lookups, retrieve_providers, retrieve_organization, \
    retrieve_organizations, retrieve_county, retrieve_sites_geojson, retrieve_site, \
    create_request_resp_log_msg, get_site_summary_data_with_period_of_record, \
    get_summary_dataframe


class RetrieveLookupsTestCase(TestCase):

    def setUp(self):
        self.codes_endpoint = 'mock://wqpfake.com/test_lookup/endpoint'
        app.config['CODES_ENDPOINT'] = self.codes_endpoint

    @mock.patch('wqp.session.get')
    def test_request_with_default_params(self, mock_get):
        retrieve_lookups('/test')

        mock_get.assert_called_with(self.codes_endpoint + '/test', params={'mimeType': 'json'})

    @mock.patch('wqp.session.get')
    def test_request_with_params(self, mock_get):
        retrieve_lookups('/test', {'param1': 'value1'})

        mock_get.assert_called_with(self.codes_endpoint + '/test', params={'mimeType': 'json',
                                                                           'param1': 'value1'})

    @requests_mock.Mocker()
    def test_request_with_valid_response(self, m):
        m.get(self.codes_endpoint + '/test',
              json={'recordCount': 2,
                    'codes': [
                        {'value': 'V1', 'desc': 'Value1'},
                        {'value': 'V2', 'desc': 'Value2'}
                    ]})

        self.assertEqual(retrieve_lookups('/test'),
                         {'recordCount': 2,
                          'codes': [
                              {'value': 'V1', 'desc': 'Value1'},
                              {'value': 'V2', 'desc': 'Value2'}
                          ]})

    @requests_mock.Mocker()
    def test_request_with_invalid_response(self, m):
        m.get(self.codes_endpoint + '/test', status_code=500)

        self.assertIsNone(retrieve_lookups('/test'))


@requests_mock.Mocker()
class RetrieveProviders(TestCase):

    def setUp(self):
        self.codes_endpoint = 'mock://wqpfake.com/test_lookup/endpoint'
        app.config['CODES_ENDPOINT'] = self.codes_endpoint

    def test_with_valid_request(self, m):
        m.get(self.codes_endpoint + '/providers',
              json={'recordCount': 2,
                    'codes': [
                        {'value': 'P1', 'desc': 'Provider1'},
                        {'value': 'P2', 'desc': 'Provider2'}
                    ]})

        self.assertEqual(retrieve_providers(), ['P1', 'P2'])

    def test_with_invalid_request(self, m):
        m.get(self.codes_endpoint + '/providers', json={})

        self.assertIsNone(retrieve_providers())

    def test_with_unexpected_response(self, m):
        m.get(self.codes_endpoint + '/providers',
              json={'error': 'Unexpected'})

        self.assertIsNone(retrieve_providers())


@requests_mock.Mocker()
class RetrieveOrganization(TestCase):

    def setUp(self):
        self.codes_endpoint = 'mock://wqpfake.com/test_lookup/endpoint'
        app.config['CODES_ENDPOINT'] = self.codes_endpoint

    def test_with_response_containing_org_and_provider(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 2,
                    'codes': [
                        {'value': 'Org10', 'desc': 'Organization10', 'providers': 'P1 P2 P3'},
                        {'value' : 'Org1', 'desc': 'Organization1', 'providers': 'P1 P2'}
                    ]})

        self.assertEqual(retrieve_organization('P2', 'Org1'), {'id': 'Org1', 'name': 'Organization1'})

    def test_with_response_containing_org_but_not_provider(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 2,
                    'codes': [
                        {'value': 'Org10', 'desc': 'Organization10', 'providers': 'P1 P2 P3'},
                        {'value': 'Org1', 'desc': 'Organization1', 'providers': 'P1 P2'}
                    ]})

        self.assertEqual(retrieve_organization('P3', 'Org1'), {})

    def test_with_response_containing_no_orgs(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 0,
                    'codes': []})

        self.assertEqual(retrieve_organization('P3', 'Org1'), {})

    def test_with_nonsense_response(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'error': 'Unexpected error'})
        self.assertIsNone(retrieve_organization('P3', 'Org1'))

    def test_with_response_without_providers(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 2,
                    'codes': [
                        {'value': 'Org10', 'desc': 'Organization10'},
                        {'value': 'Org1', 'desc': 'Organization1'}
                    ]})
        self.assertEqual(retrieve_organization('P3', 'Org1'), {})

    def test_with_bad_response(self, m):
        m.get(self.codes_endpoint + '/organization', status_code=500)

        self.assertIsNone(retrieve_organization('P3', 'Org1'))


@requests_mock.Mocker()
class RetrieveOrganizationsTestCase(TestCase):

    def setUp(self):
        self.codes_endpoint = 'mock://wqpfake.com/test_lookup/endpoint'
        app.config['CODES_ENDPOINT'] = self.codes_endpoint

    def test_with_response_containing_provider(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 3,
                    'codes': [
                        {'value': 'Org10', 'desc': 'Organization10', 'providers': 'P1 P2 P3'},
                        {'value': 'Org1', 'desc': 'Organization1', 'providers': 'P1 P2'},
                        {'value': 'Org2', 'desc': 'Organization2', 'providers': 'P4'}
                    ]})

        self.assertEqual(retrieve_organizations('P1'), [{'id': 'Org10', 'name': 'Organization10'},
                                                        {'id': 'Org1', 'name': 'Organization1'}])
        self.assertEqual(retrieve_organizations('P4'), [{'id': 'Org2', 'name': 'Organization2'}])

    def test_with_response_without_provider(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'recordCount': 3,
                    'codes': [
                        {'value': 'Org10', 'desc': 'Organization10', 'providers': 'P1 P2 P3'},
                        {'value': 'Org1', 'desc': 'Organization1', 'providers': 'P1 P2'},
                        {'value': 'Org2', 'desc': 'Organization2', 'providers': 'P4'}
                    ]})

        self.assertEqual(retrieve_organizations('P5'), [])

    def test_with_nonsense_response(self, m):
        m.get(self.codes_endpoint + '/organization',
              json={'Error': 'Unexpected'})

        self.assertIsNone(retrieve_organizations('P5'))

    def test_with_bad_response(self, m):
        m.get(self.codes_endpoint + '/organization', status_code=500)

        self.assertIsNone(retrieve_organizations('P1'))


class RetrieveCountyTestCase(TestCase):

    def setUp(self):
        self.codes_endpoint = 'mock://wqpfake.com/test_lookup/endpoint'
        app.config['CODES_ENDPOINT'] = self.codes_endpoint

    @mock.patch('wqp.utils.retrieve_lookups')
    def test_retrieval_parameters(self, mock_retrieve):
        retrieve_county('US', '55', '005')

        mock_retrieve.assert_called_with('/countycode', {'statecode': 'US:55', 'text': 'US:55:005'})

    @requests_mock.Mocker()
    def test_response_with_data(self, m):
        m.get(self.codes_endpoint + '/countycode',
              json={'recordCount': 1,
                    'codes': [
                        {'value': 'US:55:005', 'desc': 'US, Wisconsin, Dane County', 'providers' : 'P1 P2'}
                    ]})

        self.assertEqual(retrieve_county('US', '55', '005'), {'StateName' : ' Wisconsin', 'CountyName': ' Dane County'})

    @requests_mock.Mocker()
    def test_response_with_no_records(self, m):
        m.get(self.codes_endpoint + '/countycode',
              json={'recordCount': 0, 'codes': []})

        self.assertEqual(retrieve_county('US', '55', '005'), {})

    @requests_mock.Mocker()
    def test_response_with_bad_description(self, m):
        m.get(self.codes_endpoint + '/countycode',
              json={'recordCount': 1,
                    'codes': [
                        {'value': 'US:55:005', 'desc': 'US, Wisconsin', 'providers': 'P1 P2'}
                    ]})

        self.assertEqual(retrieve_county('US', '55', '005'), {})

    @requests_mock.Mocker()
    def test_response_with_nonsense_response(self, m):
        m.get(self.codes_endpoint + '/countycode',
              json={'error': 'Unexpected error'})

        self.assertIsNone(retrieve_county('US', '55', '005'))

    @requests_mock.Mocker()
    def test_response_with_no_codes_in_response(self, m):
        m.get(self.codes_endpoint + '/countycode',
              json={'recordCount': 1})

        self.assertEqual(retrieve_county('US', '55', '005'), {})

    @requests_mock.Mocker()
    def test_with_bad_response(self, m):
        m.get(self.codes_endpoint + '/countycode', status_code=500)

        self.assertIsNone(retrieve_county('US', '55', '005'))


class RetrieveSitesGeojsonTestCase(TestCase):

    def setUp(self):
        self.sites_endpoint = 'mock://wqpfake.com/search/'
        app.config['SEARCH_QUERY_ENDPOINT'] = self.sites_endpoint

    @mock.patch('wqp.session.get')
    def test_request_parameters(self, mock_get):
        retrieve_sites_geojson('P1', 'Org1')

        mock_get.assert_called_with(
            self.sites_endpoint + 'Station/search',
            params={
                'organization': 'Org1',
                'providers': 'P1',
                'mimeType': 'geojson',
                'sorted': 'no',
                'minresults': 1,
                'uripage': 'yes'
            }
        )

    @requests_mock.Mocker()
    def test_with_valid_response(self, m):
        geojson = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [-111.4837694, 36.9369326]
                },
                'properties': {
                    'ProviderName': 'NWIS',
                    'OrganizationIdentifier': 'USGS-AZ',
                    'OrganizationFormalName': 'USGS Arizona Water Science Center',
                    'MonitoringLocationIdentifier': 'AZ003-365613111285900'
                }
            }, {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point', 'coordinates': [-113.4837694, 37.9369326]
                },
                'properties': {
                    'ProviderName': 'NWIS',
                    'OrganizationIdentifier': 'USGS-AZ',
                    'OrganizationFormalName': 'USGS Arizona Water Science Center',
                    'MonitoringLocationIdentifier': 'AZ003-3656131112565656'
                }
            }]
        }
        m.get(self.sites_endpoint + 'Station/search', json=geojson)

        self.assertEqual(retrieve_sites_geojson('NWIS', 'USGS-AZ'), geojson)

    @requests_mock.Mocker()
    def test_with_bad_request(self, m):
        m.get(self.sites_endpoint + 'Station/search', status_code=400)

        self.assertEqual(retrieve_sites_geojson('NWIS', 'USGS-AZ'), {})

    @requests_mock.Mocker()
    def test_with_server_error(self, m):
        m.get(self.sites_endpoint + 'Station/search', status_code=500)

        self.assertIsNone(retrieve_sites_geojson('NWIS', 'USGS-AZ'))


class RetrieveSiteTestCase(TestCase):

    def setUp(self):
        self.sites_endpoint = 'mock://wqpfake.com/search/'
        app.config['SEARCH_QUERY_ENDPOINT'] = self.sites_endpoint

    @mock.patch('wqp.session.get')
    def test_request_parameters(self, mock_get):
        retrieve_site('NWIS', 'USGS-AZ', 'AZ003-365613111285900')

        mock_get.assert_called_with(self.sites_endpoint + 'Station/search',
                                    params={'organization': 'USGS-AZ',
                                            'providers': 'NWIS',
                                            'siteid': 'AZ003-365613111285900',
                                            'mimeType': 'tsv',
                                            'sorted': 'no',
                                            'uripage': 'yes'})


    @requests_mock.Mocker()
    def test_with_valid_response(self, m):
        m.get(self.sites_endpoint + 'Station/search',
              text=('OrganizationIdentifier\tOrganizationFormalName\tMonitoringLocationIdentifier\tCountryCode\tStateCode\tCountyCode\tProviderName\n' +
                    'USGS-AZ\tUSGS Arizona Water Science Center\tAZ003-365613111285900\tUS\t04\t005\tNWIS'))

        self.assertEqual(retrieve_site('NWIS', 'USGS-AZ', 'AZ003-365613111285900'),
                         {'OrganizationIdentifier': 'USGS-AZ',
                          'OrganizationFormalName': 'USGS Arizona Water Science Center',
                          'MonitoringLocationIdentifier': 'AZ003-365613111285900',
                          'CountryCode': 'US',
                          'StateCode': '04',
                          'CountyCode': '005',
                          'ProviderName': 'NWIS'})

    @requests_mock.Mocker()
    def test_with_bad_response(self, m):
        m.get(self.sites_endpoint + 'Station/search', status_code=400)

        self.assertEqual(retrieve_site('NWIS', 'USGS-AZ', 'AZ003-365613111285900'), {})

    @requests_mock.Mocker()
    def test_with_server_error(self, m):
        m.get(self.sites_endpoint + 'Station/search', status_code=500)

        self.assertIsNone(retrieve_site('NWIS', 'USGS-AZ', 'AZ003-365613111285900'))


class TestCreateRequestResponseLogMsg(TestCase):

    def setUp(self):
        self.test_resp = Response()
        self.test_resp = mock.MagicMock(status_code=601,
                                        url='https://fake.url.com',
                                        headers='blah')

    def test_message(self):
        result = create_request_resp_log_msg(self.test_resp)
        expected = 'Status Code: 601, URL: https://fake.url.com, Response headers: blah'
        self.assertEqual(result, expected)


class TestGetSiteSummaryDataWithPeriodOfRecordTestCase(TestCase):
    def setUp(self):
        self.summary_endpoint = 'mock://wqpfake.us/data/summary/monitoringlocation/search/'
        app.config['SITE_SUMMARY_ENDPOINT'] = self.summary_endpoint


    @mock.patch('wqp.utils.get_summary_with_pandas_package')
    def test_uses_correct_url(self, mock_get_summary_with_pandas_package):
        get_site_summary_data_with_period_of_record('USGS-123400')

        mock_get_summary_with_pandas_package.assert_called_with(
            'mock://wqpfake.us/data/summary/monitoringlocation/search/?'
            'siteid=USGS-123400&dataProfile=periodOfRecord&summaryYears=all&mimeType=csv&zip=no'
        )


class TestGetSummaryDataframe(TestCase):
    def test_get_summary_dataframe(self):
        starting_data = [
            {'CharacteristicType': 'char1', 'YearSummarized': 1800, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char2', 'YearSummarized': 1802, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char3', 'YearSummarized': 1920, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char1', 'YearSummarized': 1822, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char2', 'YearSummarized': 1866, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char3', 'YearSummarized': 1935, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char1', 'YearSummarized': 2024, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char2', 'YearSummarized': 2015, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'},
            {'CharacteristicType': 'char3', 'YearSummarized': 2024, 'wasteColumn1': 'foo', 'wasteColumn2': 'bar'}
        ]

        starting_dataframe = pd.DataFrame(starting_data)

        expected_data = [
            {'startYear': 1800, 'endYear':2024},
            {'startYear': 1802, 'endYear': 2015},
            {'startYear': 1920, 'endYear': 2024},
        ]

        expected_dataframe = pd.DataFrame(
            expected_data,
            index=['char1', 'char2', 'char3']
        )
        expected_dataframe.index.name='CharacteristicType'

        pd.testing.assert_frame_equal(get_summary_dataframe(starting_dataframe), expected_dataframe)
