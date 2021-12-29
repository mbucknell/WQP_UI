### ***Are the data from the Water Quality Portal (WQP) available through web services?***

Yes. The WQP provides an easy way to access data stored in three large water quality databases. Data can be accessed through input parameters on ***[this form](https://www.waterqualitydata.us/portal/)*** or ***standalone web services*** (*computer-to-computer protocol that allows for the direct sharing of information. Internet portals use web services to access databases without an authorized database connection*). Input parameters on the web include *location*, *site*, *sampling*, and *date* parameters. The WQP can return ***site information*** (locations where samples were collected), or it can return ***sample results*** (analytical data of collected samples). The same inputs parameters can be used to make data retrievals using web services. For more information and examples on accessing the web services, see the [Web Services Guide](https://www.waterqualitydata.us/webservices_documentation/).

### ***How often are the data refreshed?***

The NWIS (USGS) services are refreshed every 24 hours. The WQX (EPA) services are refreshed once a week on Thursday evening. The STEWARDS (ARS) data are refreshed once a week on Saturdays. For each data provider, the date of the last content change can be found in the footer section of the site page.

### ***How much data are available?***

As of December 2021, results from over 2.6 million monitoring locations were accessible through the portal. The portal reports samples and results collected from each location since the beginning of the databases.

***Why do I have to add "USGS-" or other organization identifiers in front of my NWIS (USGS) Site ID when searching? Why do I have to add the Organization ID in front of my WQX (EPA) Site ID when searching?***

The **Site IDs** in the WQX (EPA) and NWIS (USGS) systems have not been harmonized; therefore, a **Site ID** may be *duplicated* across the two systems. Additionally, WQX (EPA) aggregates data from different organizations who have not harmonized their identifiers. 

### ***Why is the MonitoringLocationIdentifier not the same as the Site ID?***

The **MonitoringLocationIdentifier** is unique across all data in the WQP regardless of the submitting organization or database from which it derives. This is necessary because it is possible that an identical **Site ID** is used by more than one data provider or database.


### ***Why do some queries take longer than others? How can I reduce the time it takes for the WQP to return my dataset?***

Large datasets will take longer to return depending on file size and internet connection speed. The **"Filter Results"** section of the query page, which requires working through 100x more data than site-dependent queries, can often slow query response.  Using filters also affects query run time. Use the **Date Range** filters to reduce the size of the resulting dataset and to reduce query run time.
