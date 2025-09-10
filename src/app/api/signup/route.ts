import { NextRequest, NextResponse } from "next/server";
import { signupUser } from "@/lib/signup";
import { SignupData } from "@/services/auth-service";

export async function POST(request: NextRequest) {
  try {
    const data: SignupData = await request.json();

    // Validate required fields
    if (!data.username || !data.password || !data.firstName || !data.lastName || !data.phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (data.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const user = await signupUser(data);

    return NextResponse.json(user);
  } catch (error: unknown) {
    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      if (error.message === "Username already exists") {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}