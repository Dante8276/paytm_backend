#!/bin/bash

# Update package list
# sudo apt-get update


# Create the initdb directory
mkdir -p initdb

# Create the init.js script
cat <<EOT > initdb/init.js
db = db.getSiblingDB("paytmdb");

db.createCollection("email_data", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["id", "from_mail", "to_mail", "date", "email_s3_key","otp","is_already_used"],
      properties: {
        id: {
          bsonType: "date",
        },
        from_mail: {
          bsonType: "string",
        },
        to_mail: {
          bsonType: "string",
        },
        date: {
          bsonType: "string",
        },
        email_s3_key: {
          bsonType: "string",
        },
        otp: {
          bsonType: "string",
        },
        is_already_used: {
          bsonType: "bool"
        }
      },
    },
  },
});

db.email_data.insertOne({
  id: new Date(),
  from_mail: "example@example.com",
  to_mail: "example@example.com",
  date: "date",
  email_s3_key: "This is an example email s3 key.",
  otp : "otp",
  is_already_used: false
});

EOT

# Create the Dockerfile
cat <<EOT > Dockerfile
FROM mongo:latest
COPY initdb /docker-entrypoint-initdb.d/
EXPOSE 27017
CMD ["mongod"]
EOT

# Build the Docker image
sudo docker build -t mongodb-custom . --no-cache

# Create the data directory
sudo mkdir -p /opt/mongodb/data

# Run the MongoDB container
sudo docker run -d --name mongodb -p 27017:27017 -v /opt/mongodb/data:/data/db mongodb-custom

# TODO: Run the script only once during first container creation to create the admin user and the database.

# Create the admin user
sudo docker exec -it mongodb mongosh --eval \
  'db.getSiblingDB("admin").createUser({user: "mongoadmin", pwd: "secret", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});'

# Execute the init.js script
sudo docker exec -it mongodb mongosh /docker-entrypoint-initdb.d/init.js
