import { type NextRequest, NextResponse } from "next/server"

interface ZohoTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface StudentData {
  id: string
  name: string
  phone: string
  email: string
}

interface CheckInRequest {
  studentData: StudentData
  timestamp: string
  source: string
}

// Zoho OAuth Configuration
const ZOHO_CONFIG = {
  refreshToken: "1000.919560f1d6d1dcc211e026dd6eafcfb7.9e665b58cbbc5a9a088687e65504f62c",
  clientSecret: "509e7b2d3fe91102bd981371a29eb777481c0dfe48",
  clientId: "1000.HEVLHX2MH2TQBOJ3OW1ZV3E9J8F4DB",
  dealId: "3250887001176218862",
}

// Generate Zoho Access Token
async function generateAccessToken(): Promise<string> {
  try {
    const tokenUrl = new URL("https://accounts.zoho.com/oauth/v2/token")
    tokenUrl.searchParams.append("refresh_token", ZOHO_CONFIG.refreshToken)
    tokenUrl.searchParams.append("client_secret", ZOHO_CONFIG.clientSecret)
    tokenUrl.searchParams.append("client_id", ZOHO_CONFIG.clientId)
    tokenUrl.searchParams.append("grant_type", "refresh_token")

    console.log("🔑 Generating Zoho access token...")

    const response = await fetch(tokenUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Token generation failed:", response.status, errorText)
      throw new Error(`Token generation failed: ${response.status} - ${errorText}`)
    }

    const tokenData: ZohoTokenResponse = await response.json()
    console.log("✅ Access token generated successfully")
    return tokenData.access_token
  } catch (error) {
    console.error("❌ Error generating access token:", error)
    throw new Error("Failed to generate access token")
  }
}

// Update Zoho Deal with Check-in Status
async function updateZohoDeal(accessToken: string): Promise<any> {
  try {
    const dealUrl = `https://www.zohoapis.com/crm/v8/Deals/${ZOHO_CONFIG.dealId}`

    console.log("📝 Updating Zoho deal with check-in status...")

    const response = await fetch(dealUrl, {
      method: "PUT",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            Visitor_Check_in: true,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Deal update failed:", response.status, errorText)
      throw new Error(`Deal update failed: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ Zoho deal updated successfully:", result)
    return result
  } catch (error) {
    console.error("❌ Error updating Zoho deal:", error)
    throw new Error("Failed to update Zoho deal")
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckInRequest = await request.json()

    console.log("🎓 Processing Euro School check-in:", body.studentData)

    // Validate student data
    if (!body.studentData || !body.studentData.id || !body.studentData.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid student data",
          details: "Student ID and name are required",
        },
        { status: 400 },
      )
    }

    // Step 1: Generate Zoho access token
    console.log("🔄 Step 1: Generating access token...")
    const accessToken = await generateAccessToken()

    // Step 2: Update Zoho deal with check-in status
    console.log("🔄 Step 2: Updating Zoho CRM...")
    const zohoResult = await updateZohoDeal(accessToken)

    // Log successful check-in
    console.log("🎉 Check-in completed successfully for student:", body.studentData.name)

    return NextResponse.json(
      {
        success: true,
        message: "Student check-in completed successfully",
        data: {
          student: body.studentData,
          timestamp: body.timestamp,
          zohoResponse: zohoResult,
        },
        checkInId: `CHECKIN_${Date.now()}`,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("❌ Check-in process failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Check-in failed",
        details: error.message || "An unexpected error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Euro School Zoho CRM Check-in API",
      endpoints: {
        POST: "/api/zoho-checkin - Process student check-in to Zoho CRM",
        GET: "/api/zoho-checkin - Get API information",
      },
      workflow: [
        "1. Generate Zoho access token using refresh token",
        "2. Update deal record with Visitor_Check_in: true",
        "3. Return success confirmation",
      ],
      config: {
        dealId: ZOHO_CONFIG.dealId,
        hasValidCredentials: !!(ZOHO_CONFIG.refreshToken && ZOHO_CONFIG.clientSecret && ZOHO_CONFIG.clientId),
      },
    },
    { status: 200 },
  )
}
