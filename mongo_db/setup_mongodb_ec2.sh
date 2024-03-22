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

db.createCollection("user_data", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["name", "address_line_1", "address_line_2", "n_times_used", "pincode", "is_delivery", "phone_number", "country_code"],
      properties: {
        name: {
          bsonType: "string",
        },
        address_line_1: {
          bsonType: "string",
        },
        address_line_2: {
          bsonType: "string",
        },
        landmark: {
          bsonType: "string",
        },
        n_times_used: {
          bsonType: "number",
        },
        pincode: {
          bsonType: "string",
        },
        is_delivery: {
          bsonType: "bool",
        },
        phone_number: {
          bsonType: "string",
        },
        country_code: {
          bsonType: "string",
        },
      },
    },
  },
});


db.user_data.createIndex({ name: 1 }, { unique: true });

db.createCollection("payment_method", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["method_type", "max_transactions_count", "single_transaction_limit", "total_amount_limit", "is_available", "method_info_column_1", "name", "priority"],
      properties: {
        method_type: {
          bsonType: "string",
        },
        max_transactions_count: {
          bsonType: "number",
        },
        single_transaction_limit: {
          bsonType: "number",
        },
        total_amount_limit: {
          bsonType: "number",
        },
        is_available: {
          bsonType: "bool",
        },
        method_info_column_1: {
          bsonType: "string",
        },
        method_info_column_2: {
          bsonType: "string",
        },
        method_info_column_3: {
          bsonType: "string",
        },
        name: {
          bsonType: "string",
        },
        priority: {
          bsonType: "number",
        },
      },
    },
  },
});

db.payment_method.createIndex({ name: 1 }, { unique: true });

db.payment_method.insertOne({
  method_type: "UPI",
  max_transactions_count: 100,
  single_transaction_limit: 100000,
  total_amount_limit: 100000,
  is_available: true,
  method_info_column_1: "9346001616@ybl",
  method_info_column_2: "9346001616@ybl",
  name: "Bhanu UPI 3",
  priority: 7
});

db.payment_method.insertOne({
  method_type: "UPI",
  max_transactions_count: 100,
  single_transaction_limit: 100000,
  total_amount_limit: 100000,
  is_available: true,
  method_info_column_1: "yash.tiwari3565@okhdfc",
  method_info_column_2: "yash.tiwari3565@okhdfc",
  name: "Yash UPI",
  priority: 10
});


db.createCollection("runner", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["email", "name"],
      properties: {
        email: {
          bsonType: "string",
        },
        name: {
          bsonType: "string",
        },
      },
    },
  },
});

db.runner.createIndex({ email: 1, name: 1 }, { unique: true });


db.createCollection("transactions", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["payment_method_id", "runner_id", "amount", "date"],
      properties: {
        payment_method_id: {
          bsonType: "objectId",
        },
        runner_id: {
          bsonType: "objectId",
        },
        amount: {
          bsonType: "number",
        },
        date: {
          bsonType: "date",
        },
      },
    },
  },
});

db.createCollection("insider_data", {
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["event_name", "event_metadata", "created_at"],
      properties: {
        event_name: {
          bsonType: "string",
        },
        event_metadata: {
          bsonType: "object",
        },
        created_at: {
          bsonType: "date",
        },
        items: {
          bsonType: "object",
        },
      },
    },
  },
});

db.insider_data.createIndex({ event_name: 1 }, { unique: true });

db.email_data.insertOne({
  id: new Date(),
  from_mail: "example@example.com",
  to_mail: "example@example.com",
  date: "date",
  email_s3_key: "This is an example email s3 key.",
  otp : "otp",
  is_already_used: false
});

db.user_data.insertOne({
  name: "Yash Tiwari",
  address_line_1: "Ground floor, room 001",
  address_line_2: "Diwan Alcove Manor, Langford Rd",
  n_times_used: 0,
  pincode: "560025",
  phone_number: "6388182964",
  country_code: "91",
  is_delivery: true
});

EOT

# Create the Dockerfile
cat <<EOT > Dockerfile
FROM mongo:latest
COPY initdb /docker-entrypoint-initdb.d/
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 27017
ENTRYPOINT ["entrypoint.sh"]
EOT

# # Build the Docker image
# sudo docker build -t mongodb-custom . --no-cache

# Create the data directory
sudo mkdir -p /opt/mongodb/data

# Run the MongoDB container
# sudo docker run -d --name mongodb -p 27017:27017 -v /opt/mongodb/data:/data/db mongodb-custom

# TODO: Run the script only once during first container creation to create the admin user and the database.

# # Create the admin user
# sudo docker exec -it mongodb mongosh --eval \
#   'db.getSiblingDB("admin").createUser({user: "mongoadmin", pwd: "secret", roles: [{role: "userAdminAnyDatabase", db: "admin"}]});'

# # Execute the init.js script
# sudo docker exec -it mongodb mongosh /docker-entrypoint-initdb.d/init.js
