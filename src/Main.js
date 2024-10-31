import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue, update } from 'firebase/database';
import { FaTemperatureHigh, FaTint, FaSun } from 'react-icons/fa';
import { MdOutlineWaterDrop } from 'react-icons/md';

function Main() {
  // Các trạng thái sử dụng useState
  const [pump, setPump] = useState(false);
  const [light, setLight] = useState(false);
  const [systemMode, setSystemMode] = useState('auto'); // Chế độ hệ thống: tự động hay thủ công
  const [thresholds, setThresholds] = useState({
    soilMoisture: 50,
    lightIntensity: 50,
    temperature: 50,
  }); // Ngưỡng cho các cảm biến
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    lightIntensity: 0,
  }); // Dữ liệu cảm biến
  const [schedule, setSchedule] = useState({
    date: '',
    time: '',
    pumpDuration: '',
  }); // Thời gian lịch tưới
  const [timing, setTiming] = useState({
    manualModeDuration: 0, // Thời gian chế độ thủ công
    minPumpOnDuration: 0, // Thời gian tối thiểu máy bơm hoạt động
  });

  // useEffect để lắng nghe thay đổi từ cơ sở dữ liệu Firebase
  useEffect(() => {
    const refs = [
      { path: '/modes/mode', setter: setSystemMode },
      { path: '/thresholds/soilMoisture', setter: (val) => setThresholds(prev => ({ ...prev, soilMoisture: val })) },
      { path: '/thresholds/lightIntensity', setter: (val) => setThresholds(prev => ({ ...prev, lightIntensity: val })) },
      { path: '/thresholds/temperature', setter: (val) => setThresholds(prev => ({ ...prev, temperature: val })) },
      { path: '/sensor/temperature', setter: (val) => setSensorData(prev => ({ ...prev, temperature: val })) },
      { path: '/sensor/humidity', setter: (val) => setSensorData(prev => ({ ...prev, humidity: val })) },
      { path: '/sensor/soilMoisture', setter: (val) => setSensorData(prev => ({ ...prev, soilMoisture: val })) },
      { path: '/sensor/lightIntensity', setter: (val) => setSensorData(prev => ({ ...prev, lightIntensity: val })) },
      { path: '/timing/manualModeDuration', setter: (val) => setTiming(prev => ({ ...prev, manualModeDuration: val !== null ? val : 0 })) },
      { path: '/timing/minPumpOnDuration', setter: (val) => setTiming(prev => ({ ...prev, minPumpOnDuration: val !== null ? val : 0 })) },
    ];

    // Đăng ký listener cho từng tham chiếu
    refs.forEach(({ path, setter }) => {
      const dbRef = ref(database, path);
      onValue(dbRef, (snapshot) => setter(snapshot.val())); // Cập nhật trạng thái khi có thay đổi
    });
  }, []);

  useEffect(() => {
    const pumpRef = ref(database, '/manualControl/pump');
    onValue(pumpRef, (snapshot) => {
      setPump(snapshot.val());
    });

    const lightRef = ref(database, '/manualControl/light');
    onValue(lightRef, (snapshot) => {
      setLight(snapshot.val());
    });
  }, []);

  // Hàm xử lý khi gửi form lịch tưới
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    update(ref(database, '/schedule'), { ...schedule }); // Cập nhật lịch tưới vào cơ sở dữ liệu
  };

  // Hàm xử lý thay đổi thời gian
  const handleDurationChange = (type, value) => {
    setTiming((prev) => {
      const updatedTiming = { ...prev, [type]: value };
      update(ref(database, '/timing'), updatedTiming); // Cập nhật thời gian vào cơ sở dữ liệu
      return updatedTiming; // Trả về trạng thái đã cập nhật
    });
  };

  // Hàm chuyển đổi chế độ hệ thống
  const toggleSystemMode = () => {
    const newMode = systemMode === 'auto' ? 'manual' : 'auto'; // Chuyển đổi chế độ
    update(ref(database, '/modes'), { mode: newMode }); // Cập nhật chế độ mới vào cơ sở dữ liệu
    setSystemMode(newMode); // Cập nhật trạng thái chế độ
  };

  // Điều khiển máy bơm và bóng đèn 
  const togglePump = () => {
    update(ref(database, '/manualControl'), { pump: !pump });
    setPump(!pump);
  };

  const toggleLight = () => {
    update(ref(database, '/manualControl'), { light: !light });
    setLight(!light);
  };

  // Hàm xử lý thay đổi ngưỡng
  const handleThresholdChange = (type, value) => {
    const updatedThresholds = { ...thresholds, [type]: value }; // Cập nhật ngưỡng
    setThresholds(updatedThresholds); // Cập nhật trạng thái ngưỡng
    update(ref(database, '/thresholds'), updatedThresholds); // Cập nhật ngưỡng vào cơ sở dữ liệu
  };

  // Hàm xử lý thay đổi lịch tưới
  const handleScheduleChange = (e) => {
    const { name, value } = e.target; // Lấy tên và giá trị từ input
    setSchedule((prev) => ({ ...prev, [name]: value })); // Cập nhật lịch tưới
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg mt-10">
    {/* Hiển thị dữ liệu cảm biến */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-lg text-center flex flex-col items-center">
            <FaTemperatureHigh className="text-4xl text-green-600 mb-2" />
            <h3 className="text-xl font-semibold mb-4 text-green-600">Nhiệt độ: {sensorData.temperature}°C</h3>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-lg text-center flex flex-col items-center">
            <FaTint className="text-4xl text-blue-600 mb-2" />
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Độ ẩm: {sensorData.humidity}%</h3>
            </div>
            <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg shadow-lg text-center flex flex-col items-center">
            <MdOutlineWaterDrop className="text-4xl text-yellow-600 mb-2" />
            <h3 className="text-xl font-semibold mb-4 text-yellow-600">Độ ẩm đất: {sensorData.soilMoisture}%</h3>
            </div>
            <div className="p-6 bg-gradient-to-r from-red-100 to-red-50 rounded-lg shadow-lg text-center flex flex-col items-center">
            <FaSun className="text-4xl text-red-600 mb-2" />
            <h3 className="text-xl font-semibold mb-4 text-red-600">Cường độ ánh sáng: {sensorData.lightIntensity}%</h3>
            </div>
        </div>

        {/* Ngưỡng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
            { label: 'Ngưỡng độ ẩm đất', color: 'blue', value: thresholds.soilMoisture, key: 'soilMoisture' },
            { label: 'Ngưỡng cường độ ánh sáng', color: 'yellow', value: thresholds.lightIntensity, key: 'lightIntensity' },
            { label: 'Ngưỡng nhiệt độ', color: 'red', value: thresholds.temperature, key: 'temperature' }
            ].map(({ label, color, value, key }) => (
            <div
                key={key}
                className={`p-6 bg-${color}-50 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300 text-center`}
            >
                <h3 className={`text-lg font-semibold mb-4 text-${color}-600`}>
                {label}: {value}%
                </h3>
                <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => handleThresholdChange(key, parseInt(e.target.value))}
                className={`w-full h-2 bg-${color}-200 rounded-lg appearance-none cursor-pointer`}
                />
            </div>
            ))}
        </div>

        {/* Chế độ hệ thống */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-700">
            Chế độ hệ thống: {systemMode === 'auto' ? 'Tự động' : 'Thủ công'}
            </h2>
            <button
            className={`px-6 py-3 rounded-lg text-white font-semibold focus:outline-none transition-colors ease-in-out duration-300 ${
                systemMode === 'auto' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={toggleSystemMode}
            >
            {systemMode === 'auto' ? 'Chuyển sang chế độ Thủ công' : 'Chuyển sang chế độ Tự động'}
            </button>
        </div>

        {/* Hiển thị trạng thái máy bơm và bóng đèn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[{ state: pump, label: 'máy bơm', onClick: togglePump }, { state: light, label: 'bóng đèn', onClick: toggleLight }].map(
            ({ state, label, onClick }, index) => (
                <div key={index} className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                    Trạng thái {label}: {state ? 'Bật' : 'Tắt'}
                </h3>
                {systemMode === 'manual' && (
                    <button
                    className={`px-6 py-2 mt-3 rounded-lg text-white font-semibold focus:outline-none transition-colors ease-in-out duration-300 ${
                        state ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    onClick={onClick}
                    >
                    {state ? `Tắt ${label}` : `Bật ${label}`}
                    </button>
                )}
                </div>
            )
            )}
        </div>

        {/* Cài đặt thời gian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {Object.entries(timing).map(([key, value]) => (
            <div key={key} className="p-6 bg-gray-50 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                {key === 'manualModeDuration' ? 'Đặt thời gian tự chuyển chế độ' : 'Đặt thời gian bật bơm tối thiểu'}: {value} phút
                </h3>
                <input
                type="number"
                min="0"
                value={value || ''}
                onChange={(e) => handleDurationChange(key, parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            ))}
        </div>

        {/* Form lịch tưới */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Đặt lịch tưới</h2>
            {['date', 'time'].map((field) => (
            <div key={field} className="mb-4">
                <label className="block mb-1 text-gray-600">{field === 'date' ? 'Ngày' : 'Giờ'}</label>
                <input
                type={field === 'date' ? 'date' : 'time'}
                name={field}
                value={schedule[field]}
                onChange={handleScheduleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                />
            </div>
            ))}
            <div className="mb-4">
            <label className="block mb-1 text-gray-600">Thời gian bật (phút)</label>
            <input
                type="number"
                name="pumpDuration"
                min="0"
                value={schedule.pumpDuration || ''}
                onChange={handleScheduleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            </div>
            <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full"
            >
            Lưu lịch
            </button>
        </form>
    </div>

  );
}

export default Main;
