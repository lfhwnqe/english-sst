import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION,
    });

    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: Resource.MyUserClient.id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);

    // Return the tokens
    return NextResponse.json({
      success: true,
      accessToken: response.AuthenticationResult?.AccessToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
      idToken: response.AuthenticationResult?.IdToken,
      expiresIn: response.AuthenticationResult?.ExpiresIn,
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    // Handle specific Cognito errors
    switch ((error as { name?: string }).name) {
      case "NotAuthorizedException":
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      case "UserNotConfirmedException":
        return NextResponse.json(
          { error: "Please verify your email first" },
          { status: 400 }
        );
      case "UserNotFoundException":
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      default:
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
  }
}
