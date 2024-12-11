import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION,
    });

    const params: ResendConfirmationCodeCommandInput = {
      ClientId: Resource.MyUserClient.id,
      Username: email,
    };

    const command = new ResendConfirmationCodeCommand(params);
    await client.send(command);

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully"
    });

  } catch (error: unknown) {
    console.error("Resend code error:", error);
    
    switch((error as { name?: string }).name) {
      case "UserNotFoundException":
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      case "LimitExceededException":
        return NextResponse.json(
          { error: "Too many attempts. Please try again later" },
          { status: 429 }
        );
      default:
        return NextResponse.json(
          { error: "Failed to resend verification code" },
          { status: 500 }
        );
    }
  }
}