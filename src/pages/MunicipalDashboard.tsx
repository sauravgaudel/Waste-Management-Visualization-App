
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Truck, BarChart3, Map, Download, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useWaste } from "../context/WasteContext";
import WasteMap from "../components/WasteMap";
import Analytics from "../components/Analytics";
import TruckAssignment from "../components/TruckAssignment";
import AIInsights from "../components/AIInsights";

const MunicipalDashboard = () => {
  const { wasteEntries } = useWaste();
  const [activeTab, setActiveTab] = useState("overview");

  const pendingEntries = wasteEntries.filter(entry => entry.status === 'pending');
  const assignedEntries = wasteEntries.filter(entry => entry.status === 'assigned');
  const collectedEntries = wasteEntries.filter(entry => entry.status === 'collected');

  const exportToCSV = () => {
    const headers = ['ID', 'Waste Type', 'Quantity (kg)', 'Pickup Date', 'Address', 'Status', 'Truck Number', 'Driver'];
    const csvContent = [
      headers.join(','),
      ...wasteEntries.map(entry => [
        entry.id,
        entry.wasteType,
        entry.quantity,
        entry.pickupDate,
        `"${entry.address}"`,
        entry.status,
        entry.assignedTruck?.truckNumber || '',
        entry.assignedTruck?.driverName || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waste_management_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Municipal Dashboard</h1>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{wasteEntries.length}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingEntries.length}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{assignedEntries.length}</p>
                  <p className="text-sm text-gray-600">Assigned</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{collectedEntries.length}</p>
                  <p className="text-sm text-gray-600">Collected</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Live Map</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TruckAssignment />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  Real-time Waste Collection Map
                </CardTitle>
                <CardDescription>
                  Track waste pickup locations and garbage truck routes in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WasteMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>
                  Get intelligent recommendations and trend analysis powered by Gemini AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIInsights />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MunicipalDashboard;
