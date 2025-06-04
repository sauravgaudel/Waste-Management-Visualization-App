
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Truck, CheckCircle, MapPin, Calendar, Weight, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useWaste } from "../context/WasteContext";
import { toast } from "@/hooks/use-toast";

const DriverDashboard = () => {
  const { wasteEntries, updateEntryStatus } = useWaste();
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  // Get unique drivers from assigned entries
  const drivers = Array.from(new Set(
    wasteEntries
      .filter(entry => entry.assignedTruck)
      .map(entry => entry.assignedTruck!.driverName)
  ));

  // Get entries for selected driver
  const driverEntries = wasteEntries.filter(
    entry => entry.assignedTruck && entry.assignedTruck.driverName === selectedDriver
  );

  const handleCompletePickup = (entryId: string) => {
    updateEntryStatus(entryId, 'collected');
    toast({
      title: "Pickup Completed",
      description: "The waste pickup has been marked as completed."
    });
  };

  const assignedEntries = driverEntries.filter(entry => entry.status === 'assigned');
  const completedEntries = driverEntries.filter(entry => entry.status === 'collected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        </div>

        {/* Driver Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Select Driver
            </CardTitle>
            <CardDescription>
              Choose your driver profile to view assigned pickups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drivers.length === 0 ? (
                <p className="text-gray-500 col-span-3 text-center py-4">No drivers assigned to any pickups yet.</p>
              ) : (
                drivers.map((driverName) => {
                  const driverInfo = wasteEntries.find(
                    entry => entry.assignedTruck?.driverName === driverName
                  )?.assignedTruck;
                  
                  return (
                    <Card 
                      key={driverName}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDriver === driverName ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedDriver(driverName)}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-lg">{driverName}</h3>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            Truck: {driverInfo?.truckNumber}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {driverInfo?.driverPhone}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {selectedDriver && (
          <>
            {/* Driver Info */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-blue-800">Driver Name</h3>
                    <p className="text-blue-600">{selectedDriver}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-green-800">Truck Number</h3>
                    <p className="text-green-600">
                      {driverEntries[0]?.assignedTruck?.truckNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-purple-800">Phone Number</h3>
                    <p className="text-purple-600">
                      {driverEntries[0]?.assignedTruck?.driverPhone || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{assignedEntries.length}</p>
                      <p className="text-sm text-gray-600">Pending Pickups</p>
                    </div>
                    <Truck className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{completedEntries.length}</p>
                      <p className="text-sm text-gray-600">Completed Today</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Pickups */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-yellow-600" />
                  Assigned Pickups
                </CardTitle>
                <CardDescription>
                  Pickups assigned to you that need to be completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedEntries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending pickups assigned.</p>
                  ) : (
                    assignedEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{entry.wasteType}</h4>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Assigned
                            </span>
                          </div>
                          <Button 
                            onClick={() => handleCompletePickup(entry.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Weight className="h-4 w-4" />
                            {entry.quantity} kg
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {entry.pickupDate}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {entry.id}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{entry.address}</span>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm text-gray-600 italic bg-white p-2 rounded border">
                            Note: {entry.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Completed Pickups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Completed Pickups
                </CardTitle>
                <CardDescription>
                  Pickups you have successfully completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedEntries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No completed pickups yet.</p>
                  ) : (
                    completedEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{entry.wasteType}</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          </div>
                          <div className="text-right">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Weight className="h-4 w-4" />
                            {entry.quantity} kg
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {entry.pickupDate}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {entry.id}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{entry.address}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
