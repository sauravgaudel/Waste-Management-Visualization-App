
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Building2, Recycle, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Waste Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting communities with efficient waste collection through intelligent tracking and real-time analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-green-200 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">User Dashboard</CardTitle>
              <CardDescription className="text-lg">
                Schedule waste pickups, track your requests, and contribute to a cleaner community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Location-based pickup scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Recycle className="h-4 w-4" />
                  <span>Multiple waste type categorization</span>
                </div>
              </div>
              <Link to="/user-dashboard" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Access User Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-blue-200 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Municipal Dashboard</CardTitle>
              <CardDescription className="text-lg">
                Manage city-wide waste collection with real-time tracking and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Real-time truck tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Recycle className="h-4 w-4" />
                  <span>Comprehensive analytics & insights</span>
                </div>
              </div>
              <Link to="/municipal-dashboard" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Access Municipal Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Powered by AI insights and real-time tracking technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
