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
      required: ["name", "address_line_1", "address_line_2", "n_times_used", "pincode"],
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
      },
    },
  },
});


db.user_data.createIndex({ name: 1 }, { unique: true });

db.createCollection("payment_method", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["method_type", "max_transactions_count", "single_transaction_limit", "total_amount_limit", "is_available", "method_info_column_1", "name"],
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
      },
    },
  },
});

db.payment_method.createIndex({ name: 1 }, { unique: true });

db.payment_method.insertOne({
  method_type: "UPI",
  max_transactions_count: 10,
  single_transaction_limit: 1000000,
  total_amount_limit: 100000000,
  is_available: true,
  method_info_column_1: "yash.tiwari3565@okhdfcbank",
  method_info_column_2: "yash.tiwari3565@okaxis",
  name: "Yash Tiwari UPI"
});


db.createCollection("runner", {
  validator: {
    $jsonSchema: {
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
  address_line_1: "Ground floor, room 001, Diwan Alcove Manor",
  address_line_2: "7, Zen House, 7/1, 1 Langford Gardens",
  n_times_used: 0,
  pincode: "560025"
});

