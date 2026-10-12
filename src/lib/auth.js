import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

if (!process.env.BETTER_AUTH_DB_URL) {
  throw new Error("BETTER_AUTH_DB_URL is not configured.");
}

const DNS_OVER_HTTPS = [
  "https://cloudflare-dns.com/dns-query",
  "https://dns.google/resolve",
];

async function resolveDns(name, type) {
  for (const endpoint of DNS_OVER_HTTPS) {
    try {
      const response = await fetch(
        `${endpoint}?name=${encodeURIComponent(name)}&type=${type}`,
        { headers: { accept: "application/dns-json" } },
      );
      const body = response.ok ? await response.json() : null;
      const answers = body?.Answer?.filter((answer) => answer.type === type);
      if (answers?.length) return answers.map((answer) => answer.data);
    } catch {
      // Try the other HTTPS DNS provider.
    }
  }

  throw new Error(`MongoDB DNS lookup failed for ${name}`);
}

async function createMongoConnectionString(connectionString) {
  if (!connectionString.startsWith("mongodb+srv://")) return connectionString;

  const source = new URL(connectionString);
  const [srvRecords, txtRecords] = await Promise.all([
    resolveDns(`_mongodb._tcp.${source.hostname}`, 33),
    resolveDns(source.hostname, 16).catch(() => []),
  ]);
  const hosts = srvRecords.map((record) => {
    const [, , port, hostname] = record.trim().split(/\s+/);
    return `${hostname.replace(/\.$/, "")}:${port}`;
  });
  const txtOptions = txtRecords
    .join("")
    .replace(/^"|"$/g, "")
    .replace(/"\s*"/g, "");
  const options = new URLSearchParams(txtOptions);

  for (const [key, value] of source.searchParams) options.set(key, value);
  options.set("tls", "true");

  return `mongodb://${source.username}:${source.password}@${hosts.join(",")}/${process.env.BETTER_AUTH_DB_NAME || "bazar-dor"}?${options}`;
}

function lookupMongoHost(hostname, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  resolveDns(hostname, 1)
    .then((addresses) => {
      if (options?.all) {
        callback(
          null,
          addresses.map((address) => ({ address, family: 4 })),
        );
        return;
      }
      callback(null, addresses[0], 4);
    })
    .catch((error) => callback(error));
}

const mongoConnectionString = await createMongoConnectionString(
  process.env.BETTER_AUTH_DB_URL,
);
const globalForMongo = globalThis;
const client =
  globalForMongo.__bazarDorMongoClient ||
  new MongoClient(mongoConnectionString, {
    lookup: lookupMongoHost,
    serverSelectionTimeoutMS: 15_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__bazarDorMongoClient = client;
}

const db = client.db(process.env.BETTER_AUTH_DB_NAME || "bazar-dor");

const authBaseURL =
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

const allowedHosts = [
  "localhost:*",
  "127.0.0.1:*",
  process.env.BETTER_AUTH_URL,
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_URL,
]
  .filter(Boolean)
  .map((value) => {
    try {
      return new URL(value).host;
    } catch {
      return value;
    }
  });

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.URL,
  process.env.DEPLOY_PRIME_URL,
  process.env.DEPLOY_URL,
  "http://localhost:3000",
  "http://localhost:*",
  "http://127.0.0.1:*",
]
  .filter(Boolean)
  .map((origin) => {
    if (origin.includes("*")) return origin;

    try {
      return new URL(origin).origin;
    } catch {
      return origin;
    }
  });

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [...new Set(allowedHosts)],
    protocol: "auto",
    fallback: authBaseURL,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [...new Set(trustedOrigins)],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  database: mongodbAdapter(db, { client }),
});
