
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWaste } from '../context/WasteContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { wasteEntries } = useWaste();

  // Waste type distribution
  const wasteTypeData = wasteEntries.reduce((acc, entry) => {
    acc[entry.wasteType] = (acc[entry.wasteType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = {
    labels: Object.keys(wasteTypeData),
    datasets: [
      {
        data: Object.values(wasteTypeData),
        backgroundColor: [
          '#10B981', // green
          '#3B82F6', // blue
          '#F59E0B', // amber
          '#EF4444', // red
          '#8B5CF6', // violet
          '#06B6D4', // cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Monthly pickup trends
  const monthlyData = wasteEntries.reduce((acc, entry) => {
    const month = new Date(entry.pickupDate).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + entry.quantity;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Waste Quantity (kg)',
        data: Object.values(monthlyData),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Weight (kg)',
        },
      },
    },
  };

  // Calculate statistics
  const totalWeight = wasteEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const avgWeight = wasteEntries.length > 0 ? (totalWeight / wasteEntries.length).toFixed(1) : '0';
  const mostCommonWaste = Object.entries(wasteTypeData).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{totalWeight.toFixed(1)} kg</p>
                <p className="text-sm text-gray-600">Total Waste Collected</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{avgWeight} kg</p>
                <p className="text-sm text-gray-600">Average per Request</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {mostCommonWaste ? mostCommonWaste[0] : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Most Common Waste</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Waste Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of waste categories collected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              {wasteEntries.length > 0 ? (
                <Pie data={pieChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Monthly Collection Trends
            </CardTitle>
            <CardDescription>
              Weight of waste collected over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: '300px' }}>
              {wasteEntries.length > 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Status Overview</CardTitle>
          <CardDescription>
            Current status of all waste pickup requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No waste entries to display</p>
            ) : (
              wasteEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{entry.wasteType}</h4>
                    <p className="text-sm text-gray-600">{entry.address}</p>
                    <p className="text-sm text-gray-600">{entry.quantity} kg • {entry.pickupDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      entry.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                    {entry.assignedTruck && (
                      <p className="text-sm text-gray-600 mt-1">
                        Truck {entry.assignedTruck.truckNumber}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
