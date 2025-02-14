import {
  adjustDate,
  getLastDayOfMonth,
  isLastDayOfMonth,
  isLeapYear,
  isLeapYearDate,
} from '../../utils/repeatScheduleUtils';

describe('repeatScheduleUtils', () => {
  test('isLeapYear는 윤년을 정확히 판단해야 함', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
  });

  test('isLeapYearDate는 Date 객체의 윤년을 정확히 판단해야 함', () => {
    expect(isLeapYearDate(new Date('2024-01-01'))).toBe(true);
    expect(isLeapYearDate(new Date('2025-01-01'))).toBe(false);
  });

  test('getLastDayOfMonth는 각 달의 마지막 날을 정확히 반환해야 함', () => {
    expect(getLastDayOfMonth(new Date('2024-02-15'))).toBe(29); // 윤년 2월
    expect(getLastDayOfMonth(new Date('2025-02-15'))).toBe(28); // 평년 2월월
    expect(getLastDayOfMonth(new Date('2024-04-15'))).toBe(30);
  });

  test('isLastDayOfMonth는 말일 여부를 정확히 판단해야 함', () => {
    expect(isLastDayOfMonth(new Date('2024-01-31'))).toBe(true);
    expect(isLastDayOfMonth(new Date('2024-01-30'))).toBe(false);
  });

  test('adjustDate는 날짜를 올바르게 조정해야 함', () => {
    // 윤년 2월 말일
    const date = new Date('2024-02-28');
    const adjusted = adjustDate(date, true);
    expect(adjusted.getDate()).toBe(29);

    //말일 아닌 경우
    const date15 = new Date('2024-02-15');
    const adjusted15 = adjustDate(date15, false);
    expect(adjusted15.getDate()).toBe(15);

    // 평년 2월
    const date2025 = new Date('2025-02-28');
    const adjusted2025 = adjustDate(date2025, true);
    expect(adjusted2025.getDate()).toBe(28);

    const date20 = new Date('2025-02-20');
    const adjusted20 = adjustDate(date20, false);
    expect(adjusted20.getDate()).toBe(20);
  });
});
