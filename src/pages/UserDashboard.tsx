
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Trash2, Calendar, MapPin, Weight } from "lucide-react";
import { Link } from "react-router-dom";
import { useWaste } from "../context/WasteContext";
import { toast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { wasteEntries, addWasteEntry } = useWaste();
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    pickupDate: '',
    notes: '',
    photo: '',
    address: ''
  });

  const userEntries = wasteEntries;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.wasteType || !formData.quantity || !formData.pickupDate || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addWasteEntry({
      wasteType: formData.wasteType,
      quantity: Number(formData.quantity),
      pickupDate: formData.pickupDate,
      notes: formData.notes,
      photo: formData.photo,
      address: formData.address
    });

    toast({
      title: "Waste Entry Submitted",
      description: "Your waste pickup request has been submitted successfully."
    });

    // Reset form
    setFormData({
      wasteType: '',
      quantity: '',
      pickupDate: '',
      notes: '',
      photo: '',
      address: ''
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waste Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-green-700">Submit Waste Entry</CardTitle>
              <CardDescription>
                Fill out the form below to request waste pickup from your location.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type *</Label>
                  <Select value={formData.wasteType} onValueChange={(value) => setFormData(prev => ({ ...prev, wasteType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic Waste</SelectItem>
                      <SelectItem value="recyclable">Recyclable Materials</SelectItem>
                      <SelectItem value="electronic">Electronic Waste</SelectItem>
                      <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                      <SelectItem value="general">General Waste</SelectItem>
                      <SelectItem value="bulk">Bulk Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter quantity in kg"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="pl-10"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address including street, city, state, and ZIP code"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="pl-10 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo Upload</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    {formData.photo && (
                      <div className="relative inline-block">
                        <img
                          src={formData.photo}
                          alt="Uploaded waste"
                          className="h-32 w-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removePhoto}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Submit Waste Entry
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User Entries History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">Your Pickup Requests</CardTitle>
              <CardDescription>
                Track the status of your submitted waste pickup requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEntries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pickup requests submitted yet.</p>
                ) : (
                  userEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-lg">{entry.wasteType}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          entry.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Weight className="h-4 w-4" />
                          {entry.quantity} kg
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {entry.pickupDate}
                        </div>
                      </div>
                      <div className="flex items-start gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{entry.address}</span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 italic">Note: {entry.notes}</p>
                      )}
                      {entry.assignedTruck && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-sm font-medium text-blue-800">
                            Assigned to Truck: {entry.assignedTruck.truckNumber}
                          </p>
                          <p className="text-sm text-blue-600">
                            Driver: {entry.assignedTruck.driverName}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
