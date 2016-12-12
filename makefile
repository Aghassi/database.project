all: install

database: scripts/create_database.js
	node scripts/create_database.js

data: scripts/make_data.js
	node scripts/make_data.js

install:
	npm install

run: server.js
	node server

clean: scripts/delete_database.js
	node scripts/delete_database.js