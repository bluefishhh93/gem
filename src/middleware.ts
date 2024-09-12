import { NextRequest, NextResponse } from "next/server";


export const config = { matcher: ["/dashboard/(.*)"] };

export async function middleware(request: NextRequest) {

  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   const  user  = await getCurrentUser();
  //   if (!user) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }
    
  //   if (user.role !== "admin") {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }


  return NextResponse.next();
}
