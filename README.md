# Database Project

Based on https://github.com/manjeshpv/node-express-passport-mysql

## Complete Guide to Node Authentication with MySQL

Code for the entire scotch.io tutorial series: Complete Guide to Node Authentication with MongoDB

Current version database is ported to MySQL

We will be using Passport to authenticate users locally,

## Instructions

If you would like to download the code and try it for yourself:

1. Clone the repo
2. Install packages: `make install`
3. Edit the database configuration: `config/database.js`
4. Create the database schema: `make database`
	- Create dummy data (currently alpha): `make data`
	- Clean database: `make clean`
5. Launch: `make run`
6. Visit in your browser at: `http://localhost:8080`