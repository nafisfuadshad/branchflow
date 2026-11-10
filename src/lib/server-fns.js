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