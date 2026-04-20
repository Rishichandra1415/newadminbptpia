"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Strip '/api' from the URL for socket connection if it exists
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const socketUrl = apiUrl.replace(/\/api$/, '');

        const socketInstance = io(socketUrl, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socketInstance.on('connect', () => {
            console.log('🔌 Connected to Notification Socket');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔌 Disconnected from Notification Socket');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
