import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION,
    });

    const params: ConfirmSignUpCommandInput = {
      ClientId: Resource.MyUserClient.id,
      Username: email,
      ConfirmationCode: code,
    };

    const command = new ConfirmSignUpCommand(params);
    const response = await client.send(command);

    console.log("response", response);
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }

    console.error("Verification error:", error);

    // Handle specific Cognito errors
    switch (error.name) {
      case "CodeMismatchException":
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        );
      case "ExpiredCodeException":
        return NextResponse.json(
          { error: "Verification code has expired" },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: "Failed to verify email" },
          { status: 500 }
        );
    }
  }
}
