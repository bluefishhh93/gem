import { format } from "date-fns";
import { Lunar, LunarDate } from 'vietnamese-lunar-calendar';


export function formatDate(date: Date) {
  return format(date, "PPP");
}

export function getLunarDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const lunar = new LunarDate(year, month, day);
  return lunar;
}