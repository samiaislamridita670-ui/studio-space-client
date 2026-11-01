import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis as typeof globalThis & {
  studioSpaceMongoClient?: MongoClient;
};

const client =
  globalForMongo.studioSpaceMongoClient ??
  new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.studioSpaceMongoClient = client;
}

const db = client.db("studioSpaceDB");

export const auth = betterAuth({
  appName: "StudioSpace",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});


