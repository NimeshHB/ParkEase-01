// Update the API_URL to check for the environment
const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api" // Fallback to relative path for preview environments

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Similarly update the loginUser function to handle preview environments
export async function loginUser(email, password) {
  try {
    // In preview mode, simulate a successful login
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      console.log("Preview mode: Simulating successful login")
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Store mock token
      localStorage.setItem("token", "mock-jwt-token")

      return {
        success: true,
        user: {
          id: "preview-user-id",
          name: "Preview User",
          email,
          role: "user",
        },
      }
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token)
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message || "Login failed" }
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Unable to connect to the server. Please check your connection or try again later.",
    }
  }
}

// Modify the registerUser function to better handle network errors
export async function registerUser(name, email, password) {
  try {
    // In preview mode, simulate a successful registration
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      console.log("Preview mode: Simulating successful registration")
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Store mock token
      localStorage.setItem("token", "mock-jwt-token")

      return {
        success: true,
        user: {
          id: "preview-user-id",
          name,
          email,
          role: "user",
        },
      }
    }

    // Actual API call for non-preview environments
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem("token", data.token)
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message || "Registration failed" }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "Unable to connect to the server. Please check your connection or try again later.",
    }
  }
}

// Parking data functions
export async function fetchParkingSpots() {
  try {
    const response = await fetch(`${API_URL}/parking/spots`)

    if (!response.ok) {
      throw new Error("Failed to fetch parking spots")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching parking spots:", error)
    // Return sample data as fallback
    // return Array(15)
    //   .fill()
    //   .map((_, index) => ({
    //     id: index + 1,
    //     name: `Spot ${index + 1}`,
    //     occupied: Math.random() > 0.7,
    //     type: index % 3 === 0 ? "handicap" : "standard",
    //   }))
  }
}

export async function fetchUserBookings() {
  try {
    const response = await fetch(`${API_URL}/parking/bookings`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    // Return sample data as fallback
    // return [
    //   {
    //     id: 1,
    //     spotId: 3,
    //     startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    //     endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    //     status: "active",
    //   },
    //   {
    //     id: 2,
    //     spotId: 7,
    //     startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    //     endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    //     status: "completed",
    //   },
    // ]
  }
}

export async function bookParkingSpot(spotId) {
  try {
    const response = await fetch(`${API_URL}/parking/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        spotId,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to book parking spot")
    }

    return await response.json()
  } catch (error) {
    console.error("Error booking spot:", error)
    throw error
  }
}

export async function cancelBooking(bookingId) {
  try {
    const response = await fetch(`${API_URL}/parking/bookings/${bookingId}/cancel`, {
      method: "PUT",
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to cancel booking")
    }

    return await response.json()
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }
}

// Admin functions
export async function fetchAllBookings() {
  try {
    const response = await fetch(`${API_URL}/admin/bookings`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch all bookings")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    throw error
  }
}

export async function fetchAllUsers() {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}
