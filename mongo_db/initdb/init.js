db = db.getSiblingDB("paytmdb");

db.createCollection("email_data", {
  validator: {
    $jsonSchema: {
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
    $jsonSchema: {
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
    $jsonSchema: {
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
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "ip", "is_active"],
      properties: {
        email: {
          bsonType: "string",
        },
        name: {
          bsonType: "string",
        },
        ip: {
          bsonType: "string",
        },
        is_active: {
          bsonType: "bool",
        },
      },
    },
  },
});

db.runner.createIndex({ ip: 1 }, { unique: true });

db.createCollection("urls", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["url", "priority"],
      properties: {
        url: {
          bsonType: "string",
        },
        priority: {
          bsonType: "int",
        },
      },
    },
  },
});

db.urls.createIndex({ url: 1 }, { unique: true });

db.createCollection("domains", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["domain", "priority", "count"],
      properties: {
        domain: {
          bsonType: "string",
        },
        priority: {
          bsonType: "int",
        },
        count: {
          bsonType: "int",
        },
      },
    },
  },
});

db.domains.createIndex({ domain: 1 }, { unique: true });

db.createCollection("email", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "domain"],
      properties: {
        email: {
          bsonType: "string",
        },
        domain: {
          bsonType: "string",
        },
      },
    },
  },
});

db.email.createIndex({ email: 1 }, { unique: true });


db.createCollection("transactions", {
  validator: {
    $jsonSchema: {
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
    $jsonSchema: {
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

db.createCollection("runner_url", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["runner_id", "url_id", "ip"],
      properties: {
        runner_id: {
          bsonType: "objectId",
        },
        url_id: {
          bsonType: "objectId",
        },
        ip: {
          bsonType: "string",
        },
      },
    },
  },
});

db.runner_url.createIndex({ runner_id: 1, url_id: 1 }, { unique: true });

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

db.domains.insertOne({
  domain: "antarcticadverts.xyz",
  priority: 1,
  count: 0
});

db.domains.insertOne({
  domain: "basiccamping.club",
  priority: 2,
  count: 0
});

db.urls.insertOne({
  url: "https://insider.in/tata-ipl-2024-match-5-gujarat-titans-vs-mumbai-indians-mar-24/event",
  priority: 1
});

db.urls.insertOne({
  url: "https://insider.in/tata-ipl-2024-match-17-gujarat-titans-vs-punjab-kings-april-4/event",
  priority: 1
});

