'''
Views
'''

from io import BytesIO
import pickle

import arrow
from flask import render_template, request, make_response, redirect, url_for, abort, Response, jsonify, Blueprint, \
    send_file
import redis

from .. import app, session, csrf
from ..utils import get_markdown, geoserver_proxy_request, retrieve_providers, retrieve_organizations, \
    get_site_key, retrieve_organization, retrieve_sites_geojson, retrieve_site, retrieve_county, \
    generate_redis_db_number, create_request_resp_log_msg, create_redis_log_msg
from ..tasks import load_sites_into_cache_async


# Create blueprint
portal_ui = Blueprint('portal_ui', __name__,
                      template_folder='templates',
                      static_folder='static',
                      static_url_path='/portal_ui/static')

# set some useful local variables from the global config variables
redis_config = app.config['REDIS_CONFIG']
cache_timeout = app.config['CACHE_TIMEOUT']
proxy_cert_verification = app.config.get('PROXY_CERT_VERIFY', False)


@portal_ui.route('/index/')
@portal_ui.route('/portal/')
@portal_ui.route('/', endpoint='home-canonical')
def home():
    if '/index/' in request.path  or '/portal/' in request.path:
        return redirect(url_for('portal_ui.home-canonical')), 301
    return render_template('index.html', use_grid_container=True)


@portal_ui.route('/contact_us/')
def contact_us():
    return render_template('contact_us.html',
                           use_grid_container=True)


@portal_ui.route('/portal_userguide/')
def portal_userguide():
    md_path = "wqp/markdown/portal_userguide.md"
    return render_template('portal_userguide.html', md_content=get_markdown(md_path))


@portal_ui.route('/webservices_documentation/')
def webservices_documentation():
    md_path = "wqp/markdown/webservices_documentation.md"
    return render_template('webservices_documentation.html', md_content=get_markdown(md_path))


@portal_ui.route('/faqs/')
def faqs():
    md_path = "wqp/markdown/faqs.md"
    return render_template('faqs.html', md_content=get_markdown(md_path))


@portal_ui.route('/upload_data/')
def upload_data():
    md_path = "wqp/markdown/upload_data.md"
    return render_template('upload_data.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True);


@portal_ui.route('/wqp_description/')
def wqp_description():
    md_path = "wqp/markdown/wqp_description.md"
    return render_template('wqp_description.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True)


@portal_ui.route('/orgs/')
def orgs():
    md_path = "wqp/markdown/orgs.md"
    return render_template('orgs.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True)


@portal_ui.route('/apps_using_portal/')
def apps_using_portal():
    md_path = "wqp/markdown/apps_using_portal.md"
    return render_template('apps_using_portal.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True)


@portal_ui.route('/publications/')
def publications():
    md_path = "wqp/markdown/publications.md"
    return render_template('publications.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True)


@portal_ui.route('/other_portal_links/')
def other_portal_links():
    md_path = "wqp/markdown/other_portal_links.md"
    return render_template('other_portal_links.html',
                           md_content=get_markdown(md_path),
                           use_grid_container=True)


@portal_ui.route('/public_srsnames/')
def public_srsnames():
    resp = session.get(app.config['PUBLIC_SRSNAMES_ENDPOINT'] + '?mimeType=json')
    msg = create_request_resp_log_msg(resp)
    app.logger.info(msg)

    return render_template('public_srsnames.html', status_code=resp.status_code, content=resp.json())

@portal_ui.route('/wqp_geoserver/<op>', methods=['GET', 'POST'])
def wqp_geoserverproxy(op):
    target_url = app.config['WQP_MAP_GEOSERVER_ENDPOINT'] + '/' + op
    return geoserver_proxy_request(target_url, proxy_cert_verification)


@portal_ui.route('/sites_geoserver/<op>', methods=['GET', 'POST'])
def sites_geoserverproxy(op):
    target_url = app.config['SITES_MAP_GEOSERVER_ENDPOINT'] + '/' + op
    return geoserver_proxy_request(target_url, proxy_cert_verification)


@portal_ui.route('/crossdomain.xml')
def crossdomain():
    xml = render_template('crossdomain.xml')
    response = make_response(xml)
    response.headers["Content-Type"] = "application/xml"
    return response


@portal_ui.route('/kml/wqp_styles.kml')
def kml():
    xml = render_template('wqp_styles.kml')
    response = make_response(xml)
    response.headers["Content-Type"] = "application/vnd.google-earth.kml+xml"
    return response


@portal_ui.route('/img/<image_file>')
def images(image_file):
    return app.send_static_file('img/'+image_file)


@portal_ui.route('/markdown/<md_file>')
def markdowns(md_file):
    return app.send_static_file('markdown/'+md_file)


@portal_ui.route('/provider/', endpoint='uri_base')
def uri_base():
    providers = retrieve_providers()
    if not providers:
        abort(500)
    return render_template('provider_base.html', providers=sorted(providers),
                           use_grid_container=True)


@portal_ui.route('/provider/<provider_id>/', endpoint='uri_provider')
def uri_provider(provider_id):
    organizations = retrieve_organizations(provider_id)
    if organizations is None:
        abort(500)
    elif not organizations:
        abort(404)
    return render_template('provider_page.html', provider=provider_id, organizations=organizations,
                           use_grid_container=True)


@portal_ui.route('/provider/<provider_id>/<organization_id>/', endpoint='uri_organization')
def uri_organization(provider_id, organization_id):
    #Check for the information in redis first
    rendered_template = None
    if redis_config:
        redis_db_number = generate_redis_db_number(provider_id)
        redis_key = 'all_sites_' + provider_id + '_' + organization_id
        msg = create_redis_log_msg(redis_config['host'], redis_config['port'], redis_db_number)
        app.logger.debug(msg)
        redis_session = redis.StrictRedis(host=redis_config['host'], port=redis_config['port'],
                                          db=redis_db_number, password=redis_config.get('password'))
        redis_org_data = redis_session.get(redis_key)
        if redis_org_data:
            rendered_template = pickle.loads(redis_org_data)

    if rendered_template is None:
        # Check to see  if the organization_id/provider_id exists before making a search query
        organization = retrieve_organization(provider_id, organization_id)
        if organization is None:
            abort(500)
        elif not organization:
            abort(404)

        sites = retrieve_sites_geojson(provider_id, organization_id)
        if sites is None:
            abort(500)
        else:
            rendered_site_template = render_template('sites.html',
                                                     provider=provider_id,
                                                     organization=organization_id,
                                                     sites_geojson=sites,
                                                     total_site_count=len(sites['features']),
                                                     use_grid_container=True)

        if redis_config:
            redis_session.set(redis_key, pickle.dumps(rendered_template, protocol=2))

    return Response(rendered_site_template)


@portal_ui.route('/provider/<provider_id>/<organization_id>/<path:site_id>/', endpoint='uri_site')
def uris(provider_id, organization_id, site_id):
    site_data = None
    if redis_config:
        redis_db_number = generate_redis_db_number(provider_id)
        redis_key = get_site_key(provider_id, organization_id, site_id)
        msg = create_redis_log_msg(redis_config['host'], redis_config['port'], redis_db_number)
        app.logger.debug(msg)
        redis_session = redis.StrictRedis(host=redis_config['host'],
                                          port=redis_config['port'],
                                          db=redis_db_number,
                                          password=redis_config.get('password'))
        redis_data = redis_session.get(redis_key)
        if redis_data:
            site_data = pickle.loads(redis_data)

    if site_data is None:
        site_data = retrieve_site(provider_id, organization_id, site_id)
        if site_data is None:
            abort(500)
        elif site_data:
            if redis_config:
                redis_session.set(redis_key, pickle.dumps(site_data, protocol=2))
        else:
            abort(404)

    additional_data = {}
    country = site_data.get('CountryCode')
    state = site_data.get('StateCode')
    county = site_data.get('CountyCode')

    if country == 'US' and state and county:
        county_data = retrieve_county(country, state, county)
        if county_data:
            additional_data = county_data

    if provider_id == 'NWIS':
        org_and_number = site_data['MonitoringLocationIdentifier'].split('-')
        additional_data['NWISOrg'] = org_and_number[0]
        additional_data['NWISNumber'] = org_and_number[1]

    if 'mimetype' in request.args and request.args.get('mimetype') == 'json':
        return jsonify(site_data)

    return render_template('site.html',
                           site=site_data,
                           site_data_additional=additional_data,
                           provider=provider_id,
                           organization=organization_id,
                           site_id=site_id,
                            use_grid_container=True,
                           cache_timeout=cache_timeout)  # Why are we using this here and nowhere else


@portal_ui.route('/clear_cache/<provider_id>/')
def clear_cache(provider_id=None):
    if redis_config:
        redis_db_number = generate_redis_db_number(provider_id)
        connect_msg = create_redis_log_msg(redis_config['host'], redis_config['port'], redis_db_number)
        r = redis.StrictRedis(host=redis_config['host'], port=redis_config['port'], db=redis_db_number,
                              password=redis_config.get('password'))
        r.flushdb()
        msg = 'site cache cleared for: ' + provider_id
    else:
        connect_msg = 'No redis cache to connect to.'
        msg = "no redis cache, no cache to clear"
    app.logger.debug(connect_msg)
    return msg


@portal_ui.route('/sites_cache_task/<provider_id>', methods=['POST'])
def sitescachetask(provider_id):
    providers = retrieve_providers()
    if provider_id not in providers:
        abort(404)
    task = load_sites_into_cache_async.apply_async(args=[provider_id])
    response_content = {'Location': '/'.join([app.config['LOCAL_BASE_URL'], "status", task.id])}
    # passing the content after the response code sets a custom header, which the task status javascript needs
    return jsonify(response_content), 202, response_content


@portal_ui.route('/status/<task_id>')
def taskstatus(task_id):
    task = load_sites_into_cache_async.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)


@portal_ui.route('/manage_cache')
def manage_cache():
    provider_list = ['NWIS', 'STORET', 'STEWARDS', 'BIODATA']
    status_list = []
    if redis_config:
        for provider in provider_list:
            redis_db_number = generate_redis_db_number(provider)
            msg = create_redis_log_msg(redis_config['host'], redis_config['port'], redis_db_number)
            app.logger.debug(msg)
            r = redis.StrictRedis(host=redis_config['host'], port=redis_config['port'], db=redis_db_number,
                                  password=redis_config.get('password'))
            provider_site_load_status = r.get('{0}_sites_load_status'.format(provider))
            if provider_site_load_status:
                load_status = pickle.loads(provider_site_load_status, encoding='bytes')
                app.logger.debug('load_status: %s', str(load_status))
                time = arrow.get(load_status['time_utc'])
                load_status['time_zulu'] = time.format('YYYY-MM-DD HH:mm:ss ZZ')
                load_status['time_human'] = time.humanize()
                status_list.append(load_status)
    return render_template('cache_manager.html', status=status_list)


@portal_ui.route('/robots.txt')
def robots():
    return render_template('robots.txt')
