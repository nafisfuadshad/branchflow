import { DAY_LONG, dayWindow, formatTime, isoFromDate } from "@/lib/hours";

const minutesNow = (now) => now.getHours() * 60 + now.getMinutes();
const capitalize = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

// Whether the branch is open right now, and if not, when it next opens.
export const getBranchStatus = (schedule, now = new Date()) => {
  const today = dayWindow(schedule, isoFromDate(now));
  const current = minutesNow(now);

  if (today && current >= today.open && current < today.close) {
    return { isOpen: true, opensLaterToday: false, message: "" };
  }

  // A branch that opens later today is closed right now, but not for the day.
  const opensLaterToday = Boolean(today && current < today.open);

  for (let offset = opensLaterToday ? 0 : 1; offset <= 8; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const window = dayWindow(schedule, isoFromDate(date));
    if (!window) continue;

    const dayLabel =
      offset === 0
        ? "today"
        : offset === 1
          ? "tomorrow"
          : `on ${DAY_LONG[date.getDay()]}`;

    return {
      isOpen: false,
      opensLaterToday,
      message: `Opens ${dayLabel} at ${formatTime(window.open)}.`,
    };
  }

  return {
    isOpen: false,
    opensLaterToday,
    message: "No upcoming opening hours available for this branch.",
  };
};