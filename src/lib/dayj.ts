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
