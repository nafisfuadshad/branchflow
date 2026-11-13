import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

// Validates a U.S. ZIP code and returns the city and state it belongs to.
export const lookupZipcode = createServerFn({ method: "GET" })
  .validator(z.object({ zip: z.string().min(1).max(10) }))
  .handler(async ({ data }) => {
    const zip = data.zip.trim();
    if (!/^\d{5}$/.test(zip)) return { valid: false, reason: "format" };

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (response.status === 404) return { valid: false, reason: "not_found" };
      if (!response.ok) return { valid: false, reason: "unavailable" };

      const json = await response.json();
      const place = json?.places?.[0];
      if (!place) return { valid: false, reason: "not_found" };

      return {
        valid: true,
        zip,
        city: place["place name"],
        state: place["state abbreviation"] || place.state,
      };
    } catch {
      return { valid: false, reason: "unavailable" };
    }
  });

const AppointmentEmailInput = z.object({
  email: z.string().email().max(200),
  service: z.string().max(120),
  branch: z.string().max(120),
  branch_address: z.string().max(200),
  date: z.string().max(60),
  time: z.string().max(20),
  wait: z.string().max(40),
  documents: z.array(z.string().max(160)).max(10),
});

export const sendAppointmentConfirmation = createServerFn({ method: "POST" })
  .validator(AppointmentEmailInput)
  .handler(async ({ data, context }) => {
    const result = await context
      .getBase44()
      .asServiceRole.integrations.Core.SendEmail({
        to: data.email,
        template_name: "AppointmentConfirmation",
        category: "transactional",
        variables: {
          service: data.service,
          branch: data.branch,
          branch_address: data.branch_address,
          date: data.date,
          time: data.time,
          wait: data.wait,
          documents: data.documents.join(" · "),
        },
      });

    return {
      success: result?.success !== false,
      message: result?.message ?? null,
    };
  });

const NEARBY_RADIUS_MILES = 25;

// Sample (prototype) wait estimates — BranchFlow is not connected to Wells Fargo.
const SAMPLE_WAITS = [
  { wait: "0–5 minutes", tier: "short" },
  { wait: "5–10 minutes", tier: "short" },
  { wait: "10–20 minutes", tier: "medium" },
  { wait: "15–25 minutes", tier: "medium" },
  { wait: "20–30 minutes", tier: "long" },
];

const SAMPLE_HOURS = "Mon–Fri 9:00 AM – 5:00 PM · Sat 9:00 AM – 1:00 PM";

const toRadians = (value) => (value * Math.PI) / 180;

const milesBetween = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  return hash;
};

// Finds real Wells Fargo branch locations within about 25 miles of a U.S. ZIP code
// using public OpenStreetMap data. Wait times stay sample data.
export const findNearbyBranches = createServerFn({ method: "GET" })
  .validator(z.object({ zip: z.string().min(1).max(10) }))
  .handler(async ({ data }) => {
    const zip = data.zip.trim();
    if (!/^\d{5}$/.test(zip)) return { ok: false, reason: "format" };

    let place;
    try {
      const zipResponse = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!zipResponse.ok) return { ok: false, reason: "zip" };
      const zipJson = await zipResponse.json();
      place = zipJson?.places?.[0];
    } catch {
      return { ok: false, reason: "unavailable" };
    }
    if (!place) return { ok: false, reason: "zip" };

    const lat = Number(place.latitude);
    const lon = Number(place.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return { ok: false, reason: "zip" };

    const latDelta = NEARBY_RADIUS_MILES / 69;
    const lonDelta = latDelta / Math.max(Math.cos(toRadians(lat)), 0.25);
    const viewbox = [lon - lonDelta, lat - latDelta, lon + lonDelta, lat + latDelta].join(",");
    const searchUrl =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=50" +
      `&bounded=1&viewbox=${viewbox}&q=Wells%20Fargo`;

    let results;
    try {
      const response = await fetch(searchUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BranchFlowStudentPrototype/1.0 (student project)",
        },
      });
      if (!response.ok) return { ok: false, reason: "unavailable" };
      results = await response.json();
    } catch {
      return { ok: false, reason: "unavailable" };
    }

    const seen = new Set();
    const branches = [];

    for (const result of Array.isArray(results) ? results : []) {
      const label = `${result.name || ""} ${result.display_name || ""}`.toLowerCase();
      if (!label.includes("wells fargo")) continue;

      const branchLat = Number(result.lat);
      const branchLon = Number(result.lon);
      if (!Number.isFinite(branchLat) || !Number.isFinite(branchLon)) continue;

      const key = `${branchLat.toFixed(4)},${branchLon.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const miles = milesBetween(lat, lon, branchLat, branchLon);
      if (miles > NEARBY_RADIUS_MILES) continue;

      const details = result.address || {};
      const city = details.city || details.town || details.village || details.hamlet || details.suburb || "";
      const state = (details["ISO3166-2-lvl4"] || "").split("-")[1] || details.state || "";
      const street = [details.house_number, details.road].filter(Boolean).join(" ");
      const locality = [city, [state, details.postcode].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ");
      const address =
        [street, locality].filter(Boolean).join(", ") ||
        (result.display_name || "").split(", ").slice(0, 3).join(", ");

      const sample = SAMPLE_WAITS[hashString(key) % SAMPLE_WAITS.length];

      branches.push({
        id: key,
        name: details.road ? `Wells Fargo – ${details.road} Branch` : "Wells Fargo Branch",
        address,
        distance: miles,
        distanceLabel: `${miles.toFixed(1)} mi`,
        wait: sample.wait,
        waitTier: sample.tier,
        hours: SAMPLE_HOURS,
      });
    }

    branches.sort((a, b) => a.distance - b.distance);

    return {
      ok: true,
      place: {
        zip,
        city: place["place name"],
        state: place["state abbreviation"] || place.state,
      },
      branches: branches.slice(0, 8),
    };
  });