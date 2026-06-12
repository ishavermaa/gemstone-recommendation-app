import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = 'success') => {
    const id = crypto.randomUUID();
    setNotifications((items) => [{ id, message, type }, ...items].slice(0, 5));
    window.setTimeout(() => {
      setNotifications((items) => items.filter((item) => item.id !== id));
    }, 4200);
  };

  const value = useMemo(() => ({ notifications, notify }), [notifications]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);
