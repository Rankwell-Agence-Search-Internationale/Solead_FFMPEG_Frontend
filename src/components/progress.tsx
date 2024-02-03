// ProgressComponent.js
import React, { useEffect, useState } from 'react';

const ProgressComponent = () => {
  const [liveData, setLiveData] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/main/upload_video?count=100&ext=jpg&height=45');

    eventSource.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
      setLiveData(data.message);
    });

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Live Updates:</h2>
      <p>{liveData}</p>
    </div>
  );
};

export default ProgressComponent;
