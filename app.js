// load env variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");

// Prometheus client for metrics
const client = require("prom-client");

const app = express();

// >>>>>>Prometheus Metrics Setup<<<<<<<
// Collect default Node.js and process metrics
client.collectDefaultMetrics({ timeout: 5000 });

// Counter (same as professor's REQUEST_COUNT)
const REQUEST_COUNT = new client.Counter({
  name: "app_requests_total",
  help: "Total number of requests",
});

// Histogram (same as professor's REQUEST_LATENCY)
const REQUEST_LATENCY = new client.Histogram({
  name: "app_request_latency_seconds",
  help: "Request latency in seconds",
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
});

// Gauge: simulated CPU usage
const CPU_USAGE = new client.Gauge({
  name: "app_cpu_usage_percent",
  help: "Simulated CPU usage percent",
});

// Gauge: simulated temperature
const TEMPERATURE = new client.Gauge({
  name: "app_temperature_celsius",
  help: "Simulated system temperature in Celsius",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection err:", err.message);
  });

app.get("/", async (req, res) => {
  // Increment request counter
  REQUEST_COUNT.inc();

  // Measure latency
  const end = REQUEST_LATENCY.startTimer();

  // Simulate processing time (same as Python time.sleep)
  const randomDelay = Math.random() * (0.5 - 0.1) + 0.1; // between 0.1–0.5 seconds

  await new Promise((resolve) => setTimeout(resolve, randomDelay * 1000));

  // Update gauges
  CPU_USAGE.set(Math.random() * (90 - 10) + 10); // 10–90%
  TEMPERATURE.set(Math.random() * (85 - 30) + 30); // 30–85°C

  // End latency timer
  end();

  res.json({ message: "Hello from the Node.js app!" });
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// page routes
const pagesRouter = require("./routes/pages");
app.use("/", pagesRouter);

// api routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// Prometheus endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running at http://localhost:" + PORT);
});
