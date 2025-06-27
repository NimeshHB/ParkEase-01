"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { bookParkingSpot } from "@/lib/api"

export default function ParkingMap({ spots = [] }) {
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSpotClick = (spot) => {
    if (!spot.occupied) {
      setSelectedSpot(spot)
      setBookingDialogOpen(true)
    }
  }

  const handleBookSpot = async () => {
    if (!selectedSpot) return

    setLoading(true)
    try {
      await bookParkingSpot(selectedSpot.id)
      // Close dialog and refresh data
      setBookingDialogOpen(false)
      // In a real app, you would refresh the spots data here
    } catch (error) {
      console.error("Error booking spot:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create a grid layout for the parking spots
  const rows = 3
  const cols = 5

  // Generate sample spots if none provided
  const parkingSpots =
    spots.length > 0
      ? spots
      : Array(rows * cols)
          .fill()
          .map((_, index) => ({
            id: index + 1,
            name: `Spot ${index + 1}`,
            occupied: Math.random() > 0.7,
            type: index % 3 === 0 ? "handicap" : "standard",
          }))

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Occupied</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm">Handicap</span>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {parkingSpots.map((spot) => (
            <div
              key={spot.id}
              className={`
                aspect-[3/2] rounded-md flex items-center justify-center cursor-pointer
                ${spot.occupied ? "bg-red-100 border-red-300" : "bg-emerald-100 border-emerald-300 hover:bg-emerald-200"}
                ${spot.type === "handicap" ? "border-blue-500 border-2" : "border"}
              `}
              onClick={() => handleSpotClick(spot)}
            >
              <div className="text-center">
                <div className={spot.occupied ? "text-red-700" : "text-emerald-700"}>{spot.name}</div>
                <div className="text-xs text-gray-500">{spot.occupied ? "Occupied" : "Available"}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-4">
          <div className="bg-gray-200 h-8 rounded-md flex items-center justify-center text-gray-600 text-sm">
            Entrance/Exit
          </div>
        </div>
      </div>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Parking Spot</DialogTitle>
            <DialogDescription>Confirm your parking spot reservation.</DialogDescription>
          </DialogHeader>

          {selectedSpot && (
            <div className="py-4">
              <p className="font-medium">Spot Details:</p>
              <p className="text-sm text-gray-500">Spot Number: {selectedSpot.name}</p>
              <p className="text-sm text-gray-500">
                Type: {selectedSpot.type === "handicap" ? "Handicap Accessible" : "Standard"}
              </p>

              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">Booking Duration</p>
                <p className="text-sm text-gray-500">From: {new Date().toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  To: {new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookSpot} disabled={loading}>
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
