
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, MapPin, Calendar, Weight, Camera } from "lucide-react";
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
    address: '',
    photo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wasteTypes = [
    'General Waste',
    'Recyclables',
    'Organic/Compost',
    'Electronic Waste',
    'Hazardous Materials',
    'Bulky Items'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
          toast({
            title: "Location obtained",
            description: "Your current location has been detected."
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter address manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.wasteType || !formData.quantity || !formData.pickupDate || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate geocoding for demo purposes
    const mockCoordinates = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    };

    addWasteEntry({
      wasteType: formData.wasteType,
      quantity: parseFloat(formData.quantity),
      pickupDate: formData.pickupDate,
      notes: formData.notes,
      address: formData.address,
      photo: formData.photo,
      coordinates: mockCoordinates
    });

    toast({
      title: "Waste Entry Submitted",
      description: "Your waste pickup request has been recorded successfully."
    });

    // Reset form
    setFormData({
      wasteType: '',
      quantity: '',
      pickupDate: '',
      notes: '',
      address: '',
      photo: ''
    });

    setIsSubmitting(false);
  };

  const userEntries = wasteEntries.filter(() => true); // All entries for demo

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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Waste Entry Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                Schedule Waste Pickup
              </CardTitle>
              <CardDescription>
                Fill out the form below to request a waste pickup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type *</Label>
                  <Select value={formData.wasteType} onValueChange={(value) => handleInputChange('wasteType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
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
                      step="0.1"
                      min="0"
                      placeholder="Enter weight in kg"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="pl-10"
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
                      onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address *</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        placeholder="Enter full address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={getCurrentLocation}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo (Optional)</Label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="pl-10"
                    />
                  </div>
                  {formData.photo && (
                    <img src={formData.photo} alt="Waste preview" className="w-full h-32 object-cover rounded-md mt-2" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or additional information"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User's Waste Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Your Waste Requests</CardTitle>
              <CardDescription>
                Track your submitted pickup requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userEntries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No waste requests yet. Submit your first request!</p>
                ) : (
                  userEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{entry.wasteType}</h4>
                          <p className="text-sm text-gray-600">{entry.quantity} kg</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          entry.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">📍 {entry.address}</p>
                      <p className="text-sm text-gray-600">📅 {entry.pickupDate}</p>
                      {entry.assignedTruck && (
                        <p className="text-sm text-blue-600">
                          🚛 Truck {entry.assignedTruck.truckNumber} - {entry.assignedTruck.driverName}
                        </p>
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
