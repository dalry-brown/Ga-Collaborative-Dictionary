// app/api/user/settings/route.ts - User Settings API

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  contributionNotifications: z.boolean(),
  flagNotifications: z.boolean(),
  profileVisibility: z.enum(["PUBLIC", "PRIVATE"]),
  showEmail: z.boolean(),
  showLocation: z.boolean()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user settings (you may need to add a UserSettings model to your schema)
    // For now, return default settings
    const settings = {
      emailNotifications: true,
      contributionNotifications: true,
      flagNotifications: true,
      profileVisibility: "PUBLIC",
      showEmail: false,
      showLocation: true
    }

    return NextResponse.json({ settings })

  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const settings = settingsSchema.parse(body)

    // In a real implementation, you'd save these to a UserSettings table
    // For now, just return success
    
    return NextResponse.json({ 
      message: "Settings updated successfully",
      settings 
    })

  } catch (error) {
    console.error("Error updating settings:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid data",
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}