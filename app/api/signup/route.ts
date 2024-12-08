import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(req: Request) {
  const body = await req.json();
  const region = process.env.COGNITO_REGION;
  const { email, password } = body;

  const client = new CognitoIdentityProviderClient({
    region: region,
  });

  const command = new SignUpCommand({
    ClientId: Resource.MyUserClient.id,
    Username: email,
    Password: password,
  });

  try {
    const response = await client.send(command);
    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
