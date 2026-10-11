import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { setServers } from "node:dns";

setServers(["8.8.8.8", "1.1.1.1"]);

const addressCache = new Map();

function lookupMongoHost(hostname, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};

  const cachedResult = addressCache.get(hostname);

  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    if (options.all) {
      callback(null, cachedResult.addresses.map((address) => ({ address, family: 4 })));
    } else {
      callback(null, cachedResult.addresses[0], 4);
    }
    return;
  }

  const dnsUrls = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`,
    `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=A`,
  ];

  const findAddresses = async () => {
    for (const url of dnsUrls) {
      try {
        const response = await fetch(url, {
          headers: { accept: "application/dns-json" },
        });

        if (!response.ok) continue;

        const data = await response.json();
        const records = (data.Answer || []).filter((answer) => answer.type === 1);

        if (records.length > 0) {
          return records;
        }
      } catch {
        continue;
      }
    }

    throw new Error(`Could not resolve the MongoDB hostname: ${hostname}`);
  };

  findAddresses()
    .then((records) => {
      const addresses = records.map((record) => record.data);

      const ttl = Math.min(...records.map((record) => record.TTL || 60));
      addressCache.set(hostname, {
        addresses,
        expiresAt: Date.now() + ttl * 1000,
      });

      if (options.all) {
        callback(null, addresses.map((address) => ({ address, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    })
    .catch((error) => callback(error));
}

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL, {
  lookup: lookupMongoHost,
});
const db = client.db();

const authBaseURL =
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_URL,
  "http://localhost:3000",
]
  .filter(Boolean)
  .map((origin) => new URL(origin).origin);

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [...new Set(trustedOrigins)],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET, 
        }, 
        github: { 
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET, 
        }
    },

  database: mongodbAdapter(db, {
    client,
  }),
});
