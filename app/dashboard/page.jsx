"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard-header"
import ParkingMap from "@/components/parking-map"
import { fetchParkingSpots, fetchUserBookings } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter()
  const [parkingSpots, setParkingSpots] = useState([])
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const spots = await fetchParkingSpots(token)
        const bookings = await fetchUserBookings(token)
        setParkingSpots(spots)
        setUserBookings(bookings)
      } catch (error) {
        console.error("Error fetching real data:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your parking spaces and reservations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Spots</CardTitle>
              <CardDescription>Current parking availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-emerald-600">
                  {parkingSpots.filter((spot) => !spot.occupied).length}
                </span>
                <span className="ml-2 text-gray-500">/ {parkingSpots.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Bookings</CardTitle>
              <CardDescription>Active reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-emerald-600">
                  {userBookings.filter((booking) => booking.status === "active").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupancy Rate</CardTitle>
              <CardDescription>Current utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-4xl font-bold text-emerald-600">
                  {parkingSpots.length > 0
                    ? Math.round((parkingSpots.filter((spot) => spot.occupied).length / parkingSpots.length) * 100)
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="map">Parking Map</TabsTrigger>
            <TabsTrigger value="bookings">Your Bookings</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Parking Map</CardTitle>
                <CardDescription>View and book available parking spots</CardDescription>
              </CardHeader>
              <CardContent>
                <ParkingMap spots={parkingSpots} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Your Active Bookings</CardTitle>
                <CardDescription>Manage your current parking reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {userBookings.filter((booking) => booking.status === "active").length > 0 ? (
                  <div className="space-y-4">
                    {userBookings
                      .filter((booking) => booking.status === "active")
                      .map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Spot {booking.spotId}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.startTime).toLocaleString()} -{" "}
                              {new Date(booking.endTime).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-emerald-500">Active</Badge>
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You don't have any active bookings</p>
                    <Button variant="outline" className="mt-4">
                      Book a Spot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>View your past parking reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {userBookings.filter((booking) => booking.status === "completed").length > 0 ? (
                  <div className="space-y-4">
                    {userBookings
                      .filter((booking) => booking.status === "completed")
                      .map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Spot {booking.spotId}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(booking.startTime).toLocaleString()} -{" "}
                              {new Date(booking.endTime).toLocaleString()}
                            </div>
                          </div>
                          <Badge className="bg-gray-500">Completed</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No booking history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
