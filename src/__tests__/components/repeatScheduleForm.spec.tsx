import { act, renderHook } from '@testing-library/react';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { Event } from '../../types.ts';

const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

describe('반복 일정 처리', () => {
  it('반복 일정 생성 시 반복 유형/반복 간격/종료 날짜가 올바르게 저장된다', async () => {
    setupMockHandlerCreation();
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    const newEvent: Event = {
      id: '1',
      title: '새 회의',
      date: '2024-10-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '프로젝트 진행 상황 논의',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'weekly', interval: 1, endDate: '2025-02-13' },
      notificationTime: 10,
    };

    await act(async () => {
      await result.current.saveEvent(newEvent);
    });

    expect(result.current.events).toEqual([
      { ...newEvent, repeat: { type: 'weekly', interval: 1, id: '1', endDate: '2025-02-13' } },
    ]);
  });

  it('반복 일정을 수정하면 단일 일정으로 변경된다.', async () => {
    setupMockHandlerUpdating();
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    expect(result.current.events.length).toBe(3);
    const repeatEvents = result.current.events.filter((event) => event.repeat.type !== 'none');
    expect(repeatEvents.length).toBe(1);

    //반복일정->단일일정
    const updatedEvent: Event = {
      ...repeatEvents[0],
      repeat: { type: 'none', interval: 0 },
    };

    await act(async () => {
      await result.current.saveEvent(updatedEvent);
    });

    const updatedRepeatEvents = result.current.events.filter(
      (event) => event.repeat.type !== 'none'
    );
    expect(updatedRepeatEvents.length).toBe(1);
  });

  it('반복일정을 삭제하면 해당 일정만 삭제한다.', async () => {
    setupMockHandlerDeletion();
    const { result } = renderHook(() => useEventOperations(false));

    await act(() => Promise.resolve(null));

    const repeatEvents = result.current.events.filter((event) => event.repeat.type !== 'none');
    expect(repeatEvents.length).toBe(1);

    await act(async () => {
      await result.current.deleteEvent('2');
    });

    const remainingRepeatEvents = result.current.events.filter(
      (event) => event.repeat.type !== 'none'
    );
    expect(remainingRepeatEvents.length).toBe(0);
    expect(result.current.events.length).toBe(1);
  });
});
