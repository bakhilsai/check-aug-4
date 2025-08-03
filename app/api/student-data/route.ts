import { type NextRequest, NextResponse } from "next/server"

interface StudentSubmission {
  id: string
  name: string
  phone: string
  email: string
  timestamp: string
  source: string
}

// In-memory storage for demo (use a real database in production)
const submissions: StudentSubmission[] = []

export async function POST(request: NextRequest) {
  try {
    const body: StudentSubmission = await request.json()

    // Validate required fields
    if (!body.id || !body.name || !body.phone || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "All fields (ID, Name, Phone, Email) are required",
        },
        { status: 400 },
      )
    }

    // Validate ID format (should be numeric)
    if (!/^\d+$/.test(body.id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID format",
          details: "Student ID must contain only numbers",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          details: "Please provide a valid email address",
        },
        { status: 400 },
      )
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s-()]+$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone format",
          details: "Please provide a valid phone number",
        },
        { status: 400 },
      )
    }

    // Validate name (should contain only letters and spaces)
    if (!/^[a-zA-Z\s]+$/.test(body.name)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid name format",
          details: "Name should contain only letters and spaces",
        },
        { status: 400 },
      )
    }

    // Check for duplicate submissions
    const existingSubmission = submissions.find((sub) => sub.id === body.id)
    if (existingSubmission) {
      // Update existing submission
      const index = submissions.findIndex((sub) => sub.id === body.id)
      submissions[index] = body

      return NextResponse.json(
        {
          success: true,
          message: "Student data updated successfully",
          data: body,
          submissionId: `UPD_${Date.now()}`,
          isUpdate: true,
        },
        { status: 200 },
      )
    }

    // Add new submission
    submissions.push(body)

    // Log the submission (in production, save to database)
    console.log("New Euro School student submission:", body)

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(
      {
        success: true,
        message: "Student data submitted successfully to Euro School system",
        data: body,
        submissionId: `SUB_${Date.now()}`,
        isUpdate: false,
        stats: {
          totalSubmissions: submissions.length,
          submittedAt: new Date().toLocaleString(),
          school: "Euro School",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error processing Euro School student data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: "Something went wrong while processing your request. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Euro School Student Data Management API",
      school: "Euro School - Excellence in Education",
      stats: {
        totalSubmissions: submissions.length,
        apiVersion: "v1.0 - Professional Edition",
        lastUpdated: new Date().toLocaleString(),
      },
      endpoints: {
        POST: "/api/student-data - Submit student information",
        GET: "/api/student-data - Get API information",
      },
      features: [
        "Professional QR code scanning system",
        "Comprehensive data validation",
        "Secure data handling and storage",
        "Real-time submission tracking",
        "Mobile-responsive interface",
        "International curriculum support",
      ],
      about: {
        mission: "Providing world-class education with global standards",
        vision: "Nurturing future leaders through excellence in education",
        values: ["Academic Excellence", "Global Standards", "Innovation", "Integrity"],
      },
    },
    { status: 200 },
  )
}
