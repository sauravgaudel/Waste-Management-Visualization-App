
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWaste } from '../context/WasteContext';
import { toast } from "@/hooks/use-toast";
import { Truck, User, MapPin, Calendar, Weight } from 'lucide-react';

const TruckAssignment = () => {
  const { wasteEntries, assignTruck } = useWaste();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [truckNumber, setTruckNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingEntries = wasteEntries.filter(entry => entry.status === 'pending');
  const assignedEntries = wasteEntries.filter(entry => entry.status === 'assigned');

  const handleAssignTruck = () => {
    if (!selectedEntry || !truckNumber || !driverName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    assignTruck(selectedEntry, truckNumber, driverName);
    
    toast({
      title: "Truck Assigned Successfully",
      description: `Truck ${truckNumber} has been assigned to the pickup request.`
    });

    // Reset form
    setSelectedEntry(null);
    setTruckNumber('');
    setDriverName('');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-yellow-600" />
            Pending Pickup Requests
          </CardTitle>
          <CardDescription>
            Assign trucks to pending waste collection requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending requests</p>
            ) : (
              pendingEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{entry.wasteType}</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Weight className="h-4 w-4" />
                        {entry.quantity} kg
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {entry.pickupDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {entry.address.length > 30 ? entry.address.substring(0, 30) + '...' : entry.address}
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 italic">Note: {entry.notes}</p>
                    )}
                  </div>
                  <Dialog open={isDialogOpen && selectedEntry === entry.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setSelectedEntry(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedEntry(entry.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Assign Truck
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Truck to Pickup</DialogTitle>
                        <DialogDescription>
                          Assign a garbage truck and driver to this waste collection request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="truckNumber">Truck Number</Label>
                          <div className="relative">
                            <Truck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="truckNumber"
                              placeholder="e.g., WM-001"
                              value={truckNumber}
                              onChange={(e) => setTruckNumber(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="driverName">Driver Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="driverName"
                              placeholder="Enter driver name"
                              value={driverName}
                              onChange={(e) => setDriverName(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAssignTruck} className="w-full">
                          Assign Truck
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assigned Trucks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Active Assignments
          </CardTitle>
          <CardDescription>
            Currently assigned trucks and their routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active assignments</p>
            ) : (
              assignedEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{entry.wasteType}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Assigned
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        Truck {entry.assignedTruck?.truckNumber}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {entry.assignedTruck?.driverName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Weight className="h-4 w-4" />
                        {entry.quantity} kg
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {entry.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-500 mt-1">En Route</p>
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

export default TruckAssignment;
