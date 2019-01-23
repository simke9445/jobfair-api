mongo piadevdb --eval "db.dropDatabase()"
mongorestore --host localhost --port 27017 --db piadevdb dump/piadevdb