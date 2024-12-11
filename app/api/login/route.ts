import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import { Resource } from "sst";

export async function POST(req: Request) {
  const body = await req.json();
  const region = process.env.COGNITO_REGION;
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const client = new CognitoIdentityProviderClient({
    region: region,
  });

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: Resource.MyUserClient.id,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const response = await client.send(command);
    
    // 获取认证结果
    const authResult = response.AuthenticationResult;
    
    // 创建响应
    const jsonResponse = NextResponse.json({
      success: true,
      accessToken: authResult?.AccessToken,
      refreshToken: authResult?.RefreshToken,
      idToken: authResult?.IdToken,
      expiresIn: authResult?.ExpiresIn,
    });

    // 计算过期时间 (expiresIn 是秒，需要转换为毫秒)
    const expiresIn = authResult?.ExpiresIn || 3600; // 默认1小时
    const expirationDate = new Date(Date.now() + expiresIn * 1000);

    // 设置 cookies
    jsonResponse.cookies.set('idToken', authResult?.IdToken || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expirationDate
    });

    jsonResponse.cookies.set('refreshToken', authResult?.RefreshToken || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // refreshToken 可以设置更长的过期时间
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    return jsonResponse;
    
  } catch (error) {
    console.log("Login error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}