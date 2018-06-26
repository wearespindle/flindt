.. data/data:

####
Data
####

=========
GlassFrog
=========

To be able to give and receive feedback you need to run a GlassFrog import.

* Go to http://localhost:8005/admin/organization/organization/ and log in with your superuser
* Click on the *Add organization* button in the top right
* Add the name of your organization
* To import data from GlassFrog you'll need an API key, go to https://app.glassfrog.com/api_keys to obtain one
* Fill in your newly obtained API key in the *Glassfrog api key* field
* Fill in the GlassFrog anchor circle id, this is the top level circle, click on the main circle in GlassFrog and copy the id from the URL
* Press *save*
* Click on your newly generated Organization
* First click on the *Import users from this organization* button
* After the first import is completed, you can use the *Import roles for this organization* button to import all the roles, if you want to
exclude roles from being imported you can use the 'flindt-exclude' tag in GlassFrog. Go to a role in GlassFrog and click on 'add tag', to add 'flindt-exclude'.

You now have all the data necessary for starting a feedback round
