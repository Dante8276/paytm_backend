#!/bin/bash

# Start MongoDB
mongod --bind_ip_all &

# Wait for MongoDB to start
until mongosh --eval "print(\"waited for connection\")"
do
    sleep 1
done

# Create the admin user
mongosh --eval 'db.getSiblingDB("admin").createUser({user: "mongoadmin", pwd: "secret", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});'

# Execute the init.js script
mongosh /docker-entrypoint-initdb.d/init.js

# Keep the container running
tail -f /dev/null