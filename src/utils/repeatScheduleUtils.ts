import { RepeatType } from '../types';

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const isLeapYearDate = (date: Date): boolean => {
  const year = date.getFullYear();
  return isLeapYear(year);
};

export const getLastDayOfMonth = (date: Date): number => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay.getDate();
};

export const isLastDayOfMonth = (date: Date): boolean => {
  return date.getDate() === getLastDayOfMonth(date);
};

export const adjustDate = (date: Date, isOriginalLastDay: boolean): Date => {
  const result = new Date(date);
  const originalDate = result.getDate();
  const currentMonth = result.getMonth();
  const lastDayOfCurrentMonth = getLastDayOfMonth(result);

  // 원래 날짜가 말일이었다면 현재 달의 말일로 설정
  if (isOriginalLastDay) {
    result.setDate(lastDayOfCurrentMonth);
    return result;
  }

  // 2월 특수 처리
  if (currentMonth === 1) {
    const maxDay = isLeapYearDate(result) ? 29 : 28;

    // 원래 날짜가 29일 이상이면 최대 일수로 설정
    if (originalDate > maxDay) {
      result.setDate(maxDay);
      return result;
    }
  }

  // 그 외의 경우 원래 날짜와 현재 달의 말일 중 작은 값으로 설정
  result.setDate(Math.min(originalDate, lastDayOfCurrentMonth));
  return result;
};

export const calculateNextOccurrence = (
  baseDate: Date,
  repeatType: RepeatType,
  interval: number = 1
): Date => {
  const result = new Date(baseDate);
  const originalDate = baseDate.getDate();
  const isOriginalLastDay = isLastDayOfMonth(baseDate);

  switch (repeatType) {
    case 'daily': {
      result.setDate(result.getDate() + interval);
      return result;
    }

    case 'weekly': {
      result.setDate(result.getDate() + 7 * interval);
      return result;
    }

    case 'monthly': {
      result.setMonth(result.getMonth() + interval);

      // 만약 말일이었거나 계산된 월의 말일보다 큰 날짜라면
      if (isOriginalLastDay || originalDate > getLastDayOfMonth(result)) {
        result.setDate(getLastDayOfMonth(result));
      } else {
        result.setDate(originalDate);
      }

      return result;
    }

    case 'yearly': {
      result.setFullYear(result.getFullYear() + interval);

      // 만약 말일이었거나 계산된 연도의 월 말일보다 큰 날짜라면
      if (isOriginalLastDay || originalDate > getLastDayOfMonth(result)) {
        result.setDate(getLastDayOfMonth(result));
      } else {
        result.setDate(originalDate);
      }

      return result;
    }

    default:
      throw new Error(`Unknown repeat type: ${repeatType}`);
  }
};

export const calculateRecurringDates = (
  startDate: Date,
  endDate: Date,
  repeatType: RepeatType,
  interval: number = 1
): Date[] => {
  const dates: Date[] = [new Date(startDate)];
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    currentDate = calculateNextOccurrence(currentDate, repeatType, interval);
    if (currentDate <= endDate) {
      dates.push(new Date(currentDate));
    }
  }

  return dates;
};
