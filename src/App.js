import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { BatteryCharging, BrainCircuit, Activity, AlertTriangle, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PowerOptimizationApp = () => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(null);
  const [powerActivityLog, setPowerActivityLog] = useState(() => {
    const savedLog = localStorage.getItem("powerLog");
    return savedLog ? JSON.parse(savedLog) : [];
  });
  const [smartTip, setSmartTip] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [aiInsights, setAiInsights] = useState("");

  useEffect(() => {
    const fetchBatteryStatus = async () => {
      const battery = await navigator.getBattery();

      const updateBatteryInfo = () => {
        const level = Math.floor(battery.level * 100);
        const charging = battery.charging;

        setBatteryLevel(level);
        setIsCharging(charging);

        const logEntry = `Battery at ${level}%, Charging: ${charging}`;
        const timestamp = new Date().toLocaleTimeString();

        setPowerActivityLog(prev => {
          const updatedLog = [...prev, logEntry];
          localStorage.setItem("powerLog", JSON.stringify(updatedLog));
          return updatedLog;
        });

        setAnalyticsData(prev => {
          const updated = [...prev.slice(-19), { time: timestamp, level }];
          return updated;
        });

        // Smart suggestions
        if (level < 20 && !charging) {
          setSmartTip("Battery low! Consider plugging in your device.");
        } else if (charging && level >= 80) {
          setSmartTip("Battery is almost full. Consider unplugging to preserve battery health.");
        } else {
          setSmartTip("");
        }

        // AI-like simple logic to provide suggestions based on pattern
        if (level >= 50 && level <= 70 && !charging) {
          setAiInsights("Ideal battery range for device longevity. Keep usage consistent.");
        } else if (level > 90 && charging) {
          setAiInsights("Overcharging may reduce battery lifespan. Consider unplugging soon.");
        } else {
          setAiInsights("");
        }
      };

      updateBatteryInfo();

      battery.onlevelchange = updateBatteryInfo;
      battery.onchargingchange = updateBatteryInfo;
    };

    fetchBatteryStatus();
  }, []);

  const optimizationTips = [
    "Lower your screen brightness",
    "Disable background apps",
    "Use power saving mode",
    "Close unused apps",
    "Enable airplane mode when not using network"
  ];

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Power Optimization</h1>

      <Card>
        <CardContent className="flex items-center gap-4">
          <BatteryCharging className="text-green-600" />
          <div>
            <p>Battery Level: {batteryLevel !== null ? `${batteryLevel}%` : 'Loading...'}</p>
            <p>Status: {isCharging ? "Charging" : "Not Charging"}</p>
          </div>
        </CardContent>
      </Card>

      {smartTip && (
        <Card className="border-red-500 border-2">
          <CardContent className="flex items-center gap-3 text-red-600">
            <AlertTriangle />
            <p>{smartTip}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-2">Optimization Tips</h2>
          <ul className="list-disc pl-6">
            {optimizationTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="text-purple-600" />
            <h2 className="text-xl font-semibold">AI Optimization</h2>
          </div>
          <p>
            Future updates will include AI-driven optimization techniques to learn user habits and
            auto-adjust power settings for maximum efficiency.
          </p>
          {aiInsights && <p className="mt-2 text-sm text-blue-600">AI Insight: {aiInsights}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-blue-600" />
            <h2 className="text-xl font-semibold">Power Activity Log</h2>
          </div>
          <ul className="list-disc pl-6 max-h-40 overflow-auto">
            {powerActivityLog.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="text-cyan-500" />
            <h2 className="text-xl font-semibold">Battery Analytics</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerOptimizationApp;