import rateLimit from "express-rate-limit";
import cron from "node-cron";

const limitersMap = new Map();
const scheduleCronMap = new Map(); // Stores start/end cron jobs per endpoint

function logMiddleware() {
  const getBaseEndpoint = (url) => {
    const endpoint = url.split("?")[0];
    const parts = endpoint.split("/").filter(Boolean);
    return parts.length >= 2 ? `/${parts[0]}/${parts[1]}` : endpoint;
  };

  const getLimiter = (baseEndpoint, limitValues) => {
    if (!limitersMap.has(baseEndpoint)) {
      const limiter = rateLimit({
        windowMs: (limitValues.rate || 15) * 60 * 1000,
        max: limitValues.number || 10,
        message: {
          status: "error",
          message: "Too many requests from this IP. Please try again later.",
        },
        standardHeaders: true,
        legacyHeaders: false,
      });
      limitersMap.set(baseEndpoint, limiter);
    }
    return limitersMap.get(baseEndpoint);
  };

  const isNowInSchedule = (start, end) => {
    if (!start || !end) return false;
    const now = new Date();
    const [h, m] = [now.getHours(), now.getMinutes()];
    const nowMinutes = h * 60 + m;

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes <= endMinutes) {
      return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    } else {
      // overnight
      return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
    }
  };

  return async (req, res, next) => {
    const logs = [];
    const startTime = Date.now();

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    try {
      // Fetch endpoint control config from DB
      const controlRes = await fetch("https://appmanaging.onrender.com/api/logs/control");
      const controlJson = await controlRes.json();
      const controlData = controlJson?.data || [];

      const baseEndpoint = getBaseEndpoint(req.originalUrl);
      let endpointConfig = controlData.find(
        (cfg) => cfg.endpoint === baseEndpoint
      );

      if (!endpointConfig) {
        const newConfig = {
          endpoint: baseEndpoint,
          toggles: { api: true, tracer: true, limit: false, schedule: false },
          limitValues: { number: null, rate: null },
          scheduleValues: { start: null, end: null },
        };
        await fetch("https://appmanaging.onrender.com/api/logs/control", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJQcm9qZWN0IiwiaWF0IjoxNzU5MjI1Mzg4LCJleHAiOjE3NjE4MTczODh9.x-RBO2Sv00Ut0ZYUOCRjJt36SH_ZwanTqehVQ9oyERM",
          },
          body: JSON.stringify(newConfig),
        });
        endpointConfig = newConfig;
      }

      const toggles = endpointConfig.toggles || { api: true, tracer: false };
      const limitValues = endpointConfig.limitValues || {};
      const scheduleValues = endpointConfig.scheduleValues || {};

      // --- Setup cron jobs for start/end logging ---
      if (toggles.schedule && scheduleValues.start && scheduleValues.end) {
        if (!scheduleCronMap.has(baseEndpoint)) {
          const [startH, startM] = scheduleValues.start.split(":").map(Number);
          const [endH, endM] = scheduleValues.end.split(":").map(Number);

          const startJob = cron.schedule(`${startM} ${startH} * * *`, () => {
            originalConsole.log(
              `[Tracer ON Cron] ${baseEndpoint} at ${scheduleValues.start}`
            );
          });

          const endJob = cron.schedule(`${endM} ${endH} * * *`, () => {
            originalConsole.log(
              `[Tracer OFF Cron] ${baseEndpoint} at ${scheduleValues.end}`
            );
          });

          scheduleCronMap.set(baseEndpoint, { startJob, endJob });
        }
      } else if (scheduleCronMap.has(baseEndpoint)) {
        // Stop cron if schedule disabled
        const jobs = scheduleCronMap.get(baseEndpoint);
        jobs.startJob.stop();
        jobs.endJob.stop();
        scheduleCronMap.delete(baseEndpoint);
      }

      // --- Determine if tracer should be ON for this request ---
      let tracerEnabled = false;
      if (toggles.tracer) {
        tracerEnabled = true;
      } else if (
        toggles.schedule &&
        scheduleValues.start &&
        scheduleValues.end
      ) {
        tracerEnabled = isNowInSchedule(
          scheduleValues.start,
          scheduleValues.end
        );
      }

      // --- API toggle ---
      if (toggles.api === false) {
        return res.status(503).json({
          error:
            "API is temporarily disabled for this endpoint. Please try later.",
        });
      }

      // --- Rate limiter ---
      if (toggles.limit === true) {
        const limiter = getLimiter(baseEndpoint, limitValues);
        try {
          await new Promise((resolve, reject) => {
            limiter(req, res, (err) => (err ? reject(err) : resolve()));
          });
        } catch {
          return; // limiter already sent 429 response
        }
      }

      const pushLog = (type, args) => {
        logs.push({
          timestamp: new Date(),
          type,
          method: req.method,
          endpoint: req.originalUrl,
          message: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        });
      };

      // --- Override console if tracer enabled ---
      if (tracerEnabled) {
        console.log = (...args) => {
          pushLog("LOG", args);
          originalConsole.log(...args);
        };
        console.error = (...args) => {
          pushLog("ERROR", args);
          originalConsole.error(...args);
        };
        console.warn = (...args) => {
          pushLog("WARN", args);
          originalConsole.warn(...args);
        };
        console.info = (...args) => {
          pushLog("INFO", args);
          originalConsole.info(...args);
        };
      }

      res.on("finish", async () => {
        // Restore original console
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;

        if (tracerEnabled) {
          const traceData = {
            traceId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            method: req.method,
            endpoint: req.originalUrl,
            status: res.statusCode,
            responseTimeMs: Date.now() - startTime,
            logs,
          };

          try {
            const traceRes = await fetch(
              "https://appmanaging.onrender.com/api/logs",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOiJQcm9qZWN0IiwiaWF0IjoxNzU5MjI1Mzg4LCJleHAiOjE3NjE4MTczODh9.x-RBO2Sv00Ut0ZYUOCRjJt36SH_ZwanTqehVQ9oyERM",
                },
                body: JSON.stringify(traceData),
              }
            );

            if (!traceRes.ok) {
              const errText = await traceRes.text();
              originalConsole.error(
                `❌ Trace service responded with ${traceRes.status}: ${errText}`
              );
            } else {
              originalConsole.info("✅ Trace sent to tracer service");
            }
          } catch (err) {
            originalConsole.error("❌ Failed to send trace:", err.message);
          }
        }
      });
    } catch (error) {
      originalConsole.error("❌ Couldn’t fetch control data", error.message);
    }

    next();
  };
}

export default logMiddleware;
