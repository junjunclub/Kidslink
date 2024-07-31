import React, { useState, useEffect } from 'react';
import { FaRegBell, FaBook, FaComment, FaBus, FaBullhorn } from 'react-icons/fa6';
import { IoCloseSharp } from 'react-icons/io5';
import ThreeModel from '../../ThreeModel';
import { getAlarmCount, getAllAlarms } from '../../../api/alarm';

interface Notification {
  id: number;
  date: string;
  contents: string;
  code: 'NOTICE' | 'DIARY' | 'ALBUM' | 'BUS' | 'MEETING';
}

const AlaramBell: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getAlarmCount();
        setNotificationCount(count);

        const alarms = await getAllAlarms();
        setNotifications(alarms);
      } catch (error) {
        console.error('Failed to fetch alarms', error);
      }
    };

    fetchData();
  }, []);

  const handleNotificationClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRemoveNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleRemoveAllNotifications = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DIARY':
        return <FaBook className="w-6 h-6 text-gray-800" />;
      case 'MEETING':
        return <FaComment className="w-6 h-6 text-gray-800" />;
      case 'ALBUM':
        return <FaBook className="w-6 h-6 text-gray-800" />;
      case 'BUS':
        return <FaBus className="w-6 h-6 text-gray-800" />;
      case 'NOTICE':
        return <FaBullhorn className="w-6 h-6 text-gray-800" />;
      default:
        return null;
    }
  };

  return (
    <div className="font-KoPubDotum relative">
      <FaRegBell className="w-6 h-6 text-gray-700 cursor-pointer" onClick={handleNotificationClick} />
      {notificationCount > 0 && (
        <div className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-xs" style={{ transform: 'translate(50%, -50%)' }}>
          {notificationCount}
        </div>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={handleNotificationClick}></div>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-screen-sm px-4">
            <div className="space-y-4 mt-8">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  onClick={() => handleRemoveNotification(index)}
                  className="relative flex items-center p-4 bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-md backdrop-filter backdrop-blur-md text-black cursor-pointer"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {getIcon(notification.code)}
                  <div className="ml-4">
                    <div className="flex items-center mb-1">
                      <span className="font-bold text-gray-800">{notification.code}</span>
                    </div>
                    <span className="text-xs text-gray-600">{new Date(notification.date).toLocaleDateString()}</span>
                    <p className="text-gray-700">{notification.contents}</p>
                  </div>
                </div>
              ))}
              {notifications.length > 0 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRemoveAllNotifications}
                    className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-90 border border-gray-300 rounded-full shadow-md backdrop-filter backdrop-blur-md text-black"
                    style={{
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <IoCloseSharp className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <ThreeModel />
          </div>
        </>
      )}
    </div>
  );
};

export default AlaramBell;
