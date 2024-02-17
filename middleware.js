import { NextResponse } from 'next/server'

export function middleware(request) {
    
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}