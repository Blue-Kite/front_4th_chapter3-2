import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),
    http.post('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };
      const repeatId = String(mockEvents.length + 1);
      const newEvents = events.map((event) => {
        const isRepeatEvent = event.repeat.type !== 'none';
        return {
          ...event,
          id: String(mockEvents.length + 1),
          repeat: {
            ...event.repeat,
            id: isRepeatEvent ? repeatId : undefined,
          },
        };
      });
      mockEvents = [...newEvents];
      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  let mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
    {
      id: '3',
      title: '반복 회의',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '14:00',
      description: '반복 회의',
      location: '회의실 D',
      category: '업무 회의',
      repeat: {
        id: '1',
        type: 'daily',
        interval: 1,
        endDate: '2024-10-25',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    }),
    http.put('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };

      const newEvents = [...mockEvents];
      let isUpdated = false;
      events.forEach((event) => {
        const eventIndex = mockEvents.findIndex((e) => e.id === event.id);
        if (eventIndex > -1) {
          isUpdated = true;
          newEvents[eventIndex] = { ...mockEvents[eventIndex], ...event };
        }
      });

      if (!isUpdated) {
        return new HttpResponse(null, { status: 404 });
      }

      mockEvents = [...newEvents];
      return HttpResponse.json(events);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '반복 회의',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '14:00',
      description: '반복 회의',
      location: '회의실 D',
      category: '업무 회의',
      repeat: {
        id: '1',
        type: 'daily',
        interval: 1,
        endDate: '2024-10-25',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};
