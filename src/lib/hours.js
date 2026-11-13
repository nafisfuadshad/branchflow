// Branch hours helpers: turning public opening-hours data into a weekly schedule,
// carrying that schedule through the flow, and building appointment slots from it.

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_TOKENS = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };

// Typical branch hours, used only when public map data has no hours for a branch.
// Sunday is index 0; times are minutes after midnight.
export const DEFAULT_SCHEDULE = [
  null,
  { open: 540, close: 1020 },
  { open: 540, close: 1020 },
  { open: 540, close: 1020 },
  { open: 540, close: 1020 },
  { open: 540, close: 1020 },
  { open: 540, close: 780 },
];

export const formatTime = (minutes) => {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
};

const toMinutes = (value) => {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
};

const parseDayToken = (token) => {
  const [from, to] = token.split("-");
  const start = DAY_TOKENS[from];
  const end = DAY_TOKENS[to || from];
  if (start === undefined || end === undefined) return [];

  const days = [];
  let day = start;
  for (let step = 0; step < 7; step += 1) {
    days.push(day);
    if (day === end) break;
    day = (day + 1) % 7;
  }
  return days;
};

// Reads common "opening_hours" strings, e.g. "Mo-Fr 09:00-17:00, Sa 09:00-13:00".
// Returns null when the value can't be understood, so callers can fall back.
export const parseOpeningHours = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  if (/24\/7/i.test(value)) return null;

  const schedule = [null, null, null, null, null, null, null];
  let matched = false;

  const chunks = value
    .replace(/,\s*(?=[A-Za-z])/g, ";")
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const rule = chunk.match(
      /^([A-Za-z]{2}(?:-[A-Za-z]{2})?(?:,[A-Za-z]{2}(?:-[A-Za-z]{2})?)*)\s+(?:(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})|off)/i
    );
    if (!rule) continue;

    const days = rule[1].split(",").flatMap(parseDayToken);
    if (!days.length) continue;

    if (!rule[2]) {
      days.forEach((day) => {
        schedule[day] = null;
      });
      matched = true;
      continue;
    }

    const open = toMinutes(rule[2]);
    const close = toMinutes(rule[3]);
    if (close <= open) continue;

    days.forEach((day) => {
      schedule[day] = { open, close };
    });
    matched = true;
  }

  return matched ? schedule : null;
};

const sameWindow = (a, b) => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.open === b.open && a.close === b.close;
};

// e.g. "Mon–Fri 9:00 AM – 5:00 PM · Sat 9:00 AM – 1:00 PM · Sun closed"
export const formatSchedule = (schedule) => {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const parts = [];

  let index = 0;
  while (index < order.length) {
    const window = schedule?.[order[index]] || null;
    let last = index;
    while (last + 1 < order.length && sameWindow(schedule?.[order[last + 1]], window)) {
      last += 1;
    }

    const firstDay = DAY_SHORT[order[index]];
    const lastDay = DAY_SHORT[order[last]];
    const label = index === last ? firstDay : `${firstDay}–${lastDay}`;

    parts.push(
      window
        ? `${label} ${formatTime(window.open)} – ${formatTime(window.close)}`
        : `${label} closed`
    );

    index = last + 1;
  }

  return parts.join(" · ");
};

// The flow passes the schedule through URL search params, since branch details
// are looked up live rather than stored.
export const encodeSchedule = (schedule) =>
  schedule
    .map((window) => (window ? `${window.open}-${window.close}` : "-"))
    .join("|");

export const decodeSchedule = (code) => {
  if (typeof code !== "string") return DEFAULT_SCHEDULE;

  const parts = code.split("|");
  if (parts.length !== 7) return DEFAULT_SCHEDULE;

  return parts.map((part) => {
    if (!part || part === "-") return null;
    const [open, close] = part.split("-").map(Number);
    if (!Number.isFinite(open) || !Number.isFinite(close) || close <= open) return null;
    return { open, close };
  });
};

export const isoFromDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const startOfDay = (isoDate) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const weekdayName = (isoDate) => DAY_LONG[startOfDay(isoDate).getDay()];

export const dayWindow = (schedule, isoDate) => schedule?.[startOfDay(isoDate).getDay()] || null;

// 30-minute slots inside the branch's hours on that date, never earlier than now.
export const availableSlots = (schedule, isoDate, now = new Date()) => {
  const window = dayWindow(schedule, isoDate);
  if (!window) return { closed: true, slots: [] };

  const dayStart = startOfDay(isoDate).getTime();
  const slots = [];

  for (let minutes = window.open; minutes + 30 <= window.close; minutes += 30) {
    if (dayStart + minutes * 60000 <= now.getTime()) continue;
    const label = formatTime(minutes);
    slots.push({ value: label, label });
  }

  return { closed: false, slots };
};

// The next date with an available slot: skips closed days and days already over.
export const nextOpenDate = (schedule, now = new Date()) => {
  for (let offset = 0; offset < 30; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const iso = isoFromDate(day);
    if (availableSlots(schedule, iso, now).slots.length > 0) return iso;
  }
  return "";
};