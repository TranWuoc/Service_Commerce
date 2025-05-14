import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Kích hoạt plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Đặt ngôn ngữ tiếng Việt
dayjs.locale('vi');

export function VNEDayj(utcTime) {
    return dayjs.utc(utcTime).tz("Asia/Ho_Chi_Minh").fromNow();
}

export function VNEFormat(utcTime) {
    return dayjs.utc(utcTime).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
}

export function VNESoSanh(date1: Date, date2: string | null) {
    if (!date2) return 1;
    const day1 = dayjs(date1).tz("Asia/Ho_Chi_Minh");
    const day2 = dayjs.utc(date2).tz("Asia/Ho_Chi_Minh");

    if (day1.isAfter(day2)) return 1;
    if (day1.isBefore(day2)) return -1;
    return 0;
}

export function VNEToString(date: Date) {
  return dayjs(date).tz("Asia/Ho_Chi_Minh").toISOString();
}