const defaultOrigins = ["http://localhost:5173"];

export function getAllowedOrigins() {
  const configured = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaultOrigins, ...configured])];
}

export function corsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  };
}
