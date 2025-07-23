// Get today's date for sample data
const today = new Date();
const todayISO = today.toISOString().split("T")[0]; // YYYY-MM-DD

interface EnergyPoint {
  id: number;
  time: string; // e.g. "14:00"
  level: number; // energy level between 0 and 1
}

interface EnergyHighlight {
  time: string;
  label: string;
  color: string;
}

interface TimelineMessage {
  title: string;
  description: string;
}
// Sample data representing energy levels throughout the day
export const energyData: EnergyPoint[] = [
  { id: 0, time: `${todayISO}T00:00:00Z`, level: 0.05 },
  { id: 1, time: `${todayISO}T01:00:00Z`, level: 0.05 },
  { id: 2, time: `${todayISO}T02:00:00Z`, level: 0.03 },
  { id: 3, time: `${todayISO}T03:00:00Z`, level: 0.02 },
  { id: 4, time: `${todayISO}T04:00:00Z`, level: 0.02 },
  { id: 5, time: `${todayISO}T05:00:00Z`, level: 0.1 },
  { id: 6, time: `${todayISO}T06:00:00Z`, level: 0.3 },
  { id: 7, time: `${todayISO}T07:00:00Z`, level: 0.5 },
  { id: 8, time: `${todayISO}T08:00:00Z`, level: 0.7 },
  { id: 9, time: `${todayISO}T09:00:00Z`, level: 0.85 },
  { id: 10, time: `${todayISO}T10:00:00Z`, level: 0.9 },
  { id: 11, time: `${todayISO}T11:00:00Z`, level: 0.75 },
  { id: 12, time: `${todayISO}T12:00:00Z`, level: 0.6 },
  { id: 13, time: `${todayISO}T13:00:00Z`, level: 0.5 },
  { id: 14, time: `${todayISO}T14:00:00Z`, level: 0.55 },
  { id: 15, time: `${todayISO}T15:00:00Z`, level: 0.7 },
  { id: 16, time: `${todayISO}T16:00:00Z`, level: 0.8 },
  { id: 17, time: `${todayISO}T17:00:00Z`, level: 0.75 },
  { id: 18, time: `${todayISO}T18:00:00Z`, level: 0.6 },
  { id: 19, time: `${todayISO}T19:00:00Z`, level: 0.5 },
  { id: 20, time: `${todayISO}T20:00:00Z`, level: 0.4 },
  { id: 21, time: `${todayISO}T21:00:00Z`, level: 0.3 },
  { id: 22, time: `${todayISO}T22:00:00Z`, level: 0.2 },
  { id: 23, time: `${todayISO}T23:00:00Z`, level: 0.15 },
  {
    id: 24,
    time: `${
      new Date(new Date().setDate(today.getDate() + 1))
        .toISOString()
        .split("T")[0]
    }T00:00:00Z`,
    level: 0.1,
  },
];

// Energy highlights/markers
export const highlights: EnergyHighlight[] = [
  { time: `${todayISO}T00:00:00Z`, label: "Bedtime", color: "#4a4a85" },
  { time: `${todayISO}T05:00:00Z`, label: "Early Morning", color: "#7d6bb3" },
  { time: `${todayISO}T07:00:00Z`, label: "Wake up", color: "#e77fd9" },
  { time: `${todayISO}T08:00:00Z`, label: "Morning Peak", color: "#4287f5" },
  { time: `${todayISO}T13:00:00Z`, label: "Midday Dip", color: "#b5703d" },
  {
    time: `${todayISO}T15:00:00Z`,
    label: "Afternoon Rebound",
    color: "#4287f5",
  },
  {
    time: `${todayISO}T19:00:00Z`,
    label: "Evening Wind Down",
    color: "#8c74e9",
  },
  { time: `${todayISO}T21:00:00Z`, label: "Bedtime", color: "#4a4a85" },
];

// Current time and message
export const currentTime = `${todayISO}T10:00:00Z`;

export const customMessage: TimelineMessage = {
  title: "Your energy level is high right now as you are in your morning peak.",
  description:
    "We recommend you try a task or some other copy that makes more sense.",
};
