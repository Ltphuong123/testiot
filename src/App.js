import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue, update } from 'firebase/database';
import { SunIcon, WaterIcon, LightBulbIcon, CloudIcon } from '@heroicons/react/solid';

function App() {
  const [pump, setPump] = useState(false);
  const [light, setLight] = useState(false);
  const [systemMode, setSystemMode] = useState('auto');
  const [soilMoistureThreshold, setSoilMoistureThreshold] = useState(50);
  const [lightIntensityThreshold, setLightIntensityThreshold] = useState(50);
  const [temperatureThreshold, setTemperatureThreshold] = useState(50);
  
  // Dữ liệu cảm biến
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);

  // Đọc dữ liệu từ Firebase
  useEffect(() => {
    const modeRef = ref(database, '/modes/mode');
    onValue(modeRef, (snapshot) => {
      setSystemMode(snapshot.val());
    });

    const pumpRef = ref(database, '/manualControl/pump');
    onValue(pumpRef, (snapshot) => {
      setPump(snapshot.val());
    });

    const lightRef = ref(database, '/manualControl/light');
    onValue(lightRef, (snapshot) => {
      setLight(snapshot.val());
    });

    const soilMoistureRef = ref(database, '/thresholds/soilMoisture');
    onValue(soilMoistureRef, (snapshot) => {
      setSoilMoistureThreshold(snapshot.val());
    });

    const lightIntensityRef = ref(database, '/thresholds/lightIntensity');
    onValue(lightIntensityRef, (snapshot) => {
      setLightIntensityThreshold(snapshot.val());
    });

    const temperatureRef = ref(database, '/thresholds/temperature');
    onValue(temperatureRef, (snapshot) => {
      setTemperatureThreshold(snapshot.val());
    });

    // Đọc dữ liệu cảm biến
    const temperatureSensorRef = ref(database, '/sensor/temperature');
    onValue(temperatureSensorRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    const humiditySensorRef = ref(database, '/sensor/humidity');
    onValue(humiditySensorRef, (snapshot) => {
      setHumidity(snapshot.val());
    });

    const soilMoistureSensorRef = ref(database, '/sensor/soilMoisture');
    onValue(soilMoistureSensorRef, (snapshot) => {
      setSoilMoisture(snapshot.val());
    });

    const lightIntensitySensorRef = ref(database, '/sensor/lightIntensity');
    onValue(lightIntensitySensorRef, (snapshot) => {
      setLightIntensity(snapshot.val());
    });
  }, []);

  // Chuyển đổi chế độ hệ thống giữa auto và manual
  const toggleSystemMode = () => {
    const newMode = systemMode === 'auto' ? 'manual' : 'auto';
    update(ref(database, '/modes'), { mode: newMode });
    setSystemMode(newMode);
  };

  // Điều khiển máy bơm và bóng đèn trong chế độ manual
  const togglePump = () => {
    update(ref(database, '/manualControl'), { pump: !pump });
    setPump(!pump);
  };

  const toggleLight = () => {
    update(ref(database, '/manualControl'), { light: !light });
    setLight(!light);
  };

  // Cập nhật ngưỡng cảm biến
  const handleThresholdChange = (type, value) => {
    if (type === 'soilMoisture') {
      update(ref(database, '/thresholds'), { soilMoisture: value });
      setSoilMoistureThreshold(value);
    } else if (type === 'lightIntensity') {
      update(ref(database, '/thresholds'), { lightIntensity: value });
      setLightIntensityThreshold(value);
    } else if (type === 'temperature') {
      update(ref(database, '/thresholds'), { temperature: value });
      setTemperatureThreshold(value);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg mt-10">
      {/* Hiển thị dữ liệu cảm biến */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-green-50 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Nhiệt độ: {temperature}°C</h3>
        </div>
        <div className="p-6 bg-blue-50 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Độ ẩm: {humidity}%</h3>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">Độ ẩm đất: {soilMoisture}%</h3>
        </div>
        <div className="p-6 bg-red-50 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Cường độ ánh sáng: {lightIntensity}%</h3>
        </div>
      </div>

      {/* Ngưỡng cảm biến */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Ngưỡng độ ẩm đất &lt; {soilMoistureThreshold}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={soilMoistureThreshold}
            onChange={(e) => handleThresholdChange('soilMoisture', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="p-6 bg-yellow-50 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300">
          <h3 className="text-lg font-semibold mb-4 text-yellow-600">Ngưỡng cường độ ánh sáng &lt; {lightIntensityThreshold}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={lightIntensityThreshold}
            onChange={(e) => handleThresholdChange('lightIntensity', parseInt(e.target.value))}
            className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="p-6 bg-red-50 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Ngưỡng nhiệt độ &gt; {temperatureThreshold}°C</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={temperatureThreshold}
            onChange={(e) => handleThresholdChange('temperature', parseInt(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Chế độ hệ thống */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Chế độ hệ thống: {systemMode === 'auto' ? 'Tự động' : 'Thủ công'}</h2>
        <button
          className={`px-6 py-2 rounded-lg text-white font-semibold focus:outline-none transition-colors ease-in-out duration-300 ${systemMode === 'auto' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          onClick={toggleSystemMode}
        >
          {systemMode === 'auto' ? 'Chuyển sang chế độ Thủ công' : 'Chuyển sang chế độ Tự động'}
        </button>
      </div>

      {/* Hiển thị trạng thái máy bơm và bóng đèn */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Trạng thái máy bơm: {pump ? 'Bật' : 'Tắt'}</h3>
        {systemMode === 'manual' && (
          <button
            className={`px-6 py-2 rounded-lg text-white font-semibold focus:outline-none transition-colors ease-in-out duration-300 ${pump ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={togglePump}
          >
            {pump ? 'Tắt máy bơm' : 'Bật máy bơm'}
          </button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700">Trạng thái bóng đèn: {light ? 'Bật' : 'Tắt'}</h3>
        {systemMode === 'manual' && (
          <button
            className={`px-6 py-2 rounded-lg text-white font-semibold focus:outline-none transition-colors ease-in-out duration-300 ${light ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            onClick={toggleLight}
          >
            {light ? 'Tắt bóng đèn' : 'Bật bóng đèn'}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;