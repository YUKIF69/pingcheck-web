import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Тип одного оновлення яке приходить від сервера
interface MonitorUpdate {
  monitorId: string;
  isUp: boolean;
  responseMs: number;
  checkedAt: string;
}

// Зберігаємо останній статус кожного монітора
// Ключ — monitorId, значення — останнє оновлення
type MonitorStatuses = Record<string, MonitorUpdate>;

export function useMonitorSocket() {
  const [statuses, setStatuses] = useState<MonitorStatuses>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Підключаємось до NestJS WebSocket сервера
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

    // Коли з'єднання встановлено
    socket.on('connect', () => {
      setConnected(true);
    });

    // Коли з'єднання розірвано
    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Слухаємо подію яку пушить SchedulerService після кожного пінгу
    // Оновлюємо статус конкретного монітора в state
    socket.on('monitor.updated', (data: MonitorUpdate) => {
      setStatuses((prev) => ({
        ...prev,
        [data.monitorId]: data,
      }));
    });

    // Закриваємо з'єднання коли компонент розмонтовується
    return () => {
      socket.disconnect();
    };
  }, []);

  return { statuses, connected };
}
