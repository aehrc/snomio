## Jira ticket export/import process into Snomio database

### Step 1.) Export Jira tickets
The `utils/jira-ticket-export` project is used to export Jira tickets from the Blue Jira instance in the NCTS AWS Tenancy.

To export tickets, you must be connected to the AWS CTI VPN network.

#### Steps to export tickets:
- Make sure you have created an export directory on your local machine that is write accessible. The default directory is `/opt/jira-export`.
- Open a Terminal end export two environment variables:
  ```
  export JIRA_USERNAME=<exiting blue jira username with access to the AMT Jira project>
  export JIRA_PASSWORD=<password for the user above>
  ```
- Sync the Attachment directory from the Jira server into your export directory's `attachments` subdirectory.
  ```
  # rsync -avz -e "ssh -i ~/nehtadevops.pem" --rsync-path='sudo rsync' \
  usertouse@jira.aws.tooling:/home/jira/jira-home/data/attachments/AA/ \
  /opt/jira-export/attachments/
  ```
  Note you will need <usertouse> and <nehtadevops.pem> from Attila/Luke/Kyle or Dion.
- Change directory to the `utils/jira-ticket-export` directory in the Snomio repository checkout.
- Execute the following command to spin up the React utility frontend:
  ```
  npm run dev
  ```
- Open a browser and go to the url http://localhost:3000/
- Make sure the `Export Directory` input box has the correct directory name.
- Click on `EXPORT JIRA TICKETS` button.

The export utility will create an import file for Snomio in your export directory called `snomio-jira-export.json`

### Step 2.) Import Jira Tickets into an empty local database.
Use the `ticketImport` Snomio API call to import the tickets and the attachments into you empty Snomio database.

#### Steps to import tickets:
- Make sure you have an empty database to import the tickets into. To do that set up your local Snomio dev environment with a PostgreSQL database. If you have an existing database just run `SELECT drop_all_tables_in_schema();` to clrear your database, this way you don't have to worry about creating a new database and assigning the proper roles to the DB.
- Spin up a local Snomio API instance either via a Java IDE or a docker image that connects to the database you have cleared above.
- Check what `ihtsdo.ims.api.url` is your API instance connects to and get a cookie from that IHTSDO service.
- Use the API call `ticketimport` to import the tickets. E.g via Postman or curl
  ```
  # curl --location --request POST 'http://localhost:8080/api/ticketimport?importPath=%2Fopt%2Fjira-export%2Fsnomio-jira-export.json' \
  --header 'Cookie: IHTSDO Cookie'
  ```
