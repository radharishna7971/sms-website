#  Riot Media Studios Site

Please contact Ben if you have any questions (bdstein33@gmail.com).

### Purpose

1. Landing page to collect emails from people who visit the site

2. Internal tools for Riot Media Studios employees to manage their industry contacts

### Stack

This web app is hosted on Steve's digital ocean account. The server is built with Node.js and the frontend is built with AngularJS. Data is stored in a MySQL database that is also hosted through Steve's digital ocean account. Continuous integration is set up between this repo and the server using CircleCI.

### Local Installation

I recommend that you use [brew](http://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/) to manage the installation of needed technologies. My instructions assume that you are using brew but you do not need to.

1. Install node (brew install node)
2. Install mysql (brew install mysql)
3. Install npm (brew install npm) - package manager for node

Once these are all installed, open the repo in your terminal and type npm install. This will download all of the needed dependences into the repo's node_modules folder.


Next, create a folder in /server/config called env and create a development.js file with the environmental varibles that are provided.  Make sure that a database exists in your local MySQL server with a name that matches process.env.DB_NAME (also make sure that your MySQL server is on).


Once this folder is created, type 'npm start' in terminal fto turn the local server on on port 8000 (you can view the site locally if you go to 127.0.0.1:8000 in your browser)  


### Committing Code

Before you start working on a new feature, go to your local master branch and rebase from origin master (git rebase origin master). Once your code is up to date with the latest commit in origin master, create a new branch named after your initils and the feature you will be working on (e.g. git branch bs/newfeature). When you are done working on your feature, commit the changes and push to this branch at origin (git push origin bs/newfeature). Once pull requests are made, you or someone else can review all the code changes before acepting the pull request.

Once code is pulled in, the code will automatically be pushed to the hosted server.  Node is kept running on the server using pm2.  Any time I push code that changes server functionality, I like to restart pm2 to make sure everything changes properly.  To do this, ssh into the server with the information provided, navigate to the /server folder and type 'pm2 restart server.js' to restart the server.

### Repo Structure

/client - all client side files
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/app 
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/components - folders correspond to pages of the web app, each folder has a html file (template) and js file (controller) which passes data and adds functionality to the template
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/shared - folders correspond to functionality shared across different controllers (e.g. authentication and the top navbar)
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/assets - static files used by the rest of the app
  <br />index.html - the single page web app that is powered by the files in /app and /assets
<br />/node_modules - contains all the modules that are used by the server, when you type 'npm install', all of the dependencies declared in package.json will be installed here
<br />/server
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/config - contains files that deal with the app's settings and db connection
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/db - contain migrations, if any exist
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/env - contain the environmental variables
      <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;development.js - this file contains sensitive information and is not saved in Github for security reasons (it is ignored because it is listed in the .gitignore file), ask Ben or Steve for the development.js file
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;config.js - tells the server to use environmental variables from development.js if not in production
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;db.js - establishes connection to database based on environmental variables
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;express.js - defines route paths and some express middleware
    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;schema.js - defines database schema and create tables that do not already exist in your database
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/controllers - the functions that respond the requests that come in through the site, requests are routed from the routes folder to functions in this folder 
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/models - contain the logic for all of the database schema, used by functions in the controllers folder to access database data
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/routes - route the different site paths to the corresponding server logic, each route (except for redirect routes which are in place to avoid Angular's # in the url) pass the request on to a function in the controllers folder
  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;server.js - this file must be run to activate the service

