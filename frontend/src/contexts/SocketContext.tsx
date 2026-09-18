import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('campuscare_token');

    if (!user || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('appointment:updated', (data: { status: string }) => {
      toast({
        title: 'Appointment update',
        description: `Your appointment is now ${data.status}.`,
      });
    });

    // Note: 'notification:new' is intentionally NOT toasted here - it's
    // consumed by NotificationBell to populate the persisted bell dropdown.
    // Toasting it too would duplicate the appointment/broadcast toasts below.

    newSocket.on('broadcast:announcement', (data: { message: string }) => {
      toast({ title: '📢 Campus announcement', description: data.message });
    });

    newSocket.on('crisis:self', (data: { message: string }) => {
      toast({
        title: data.message,
        description: 'You are not alone. AASRA: 91-9820466726 • Kiran (Govt.): 1800-599-0019. Consider booking a counselor session.',
      });
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
