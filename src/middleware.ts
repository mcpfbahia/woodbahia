import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  
  // Verifica se o acesso está sendo feito pelo domínio antigo (.site)
  if (host === 'woodbahia.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.woodbahia.com';
    url.protocol = 'https';
    
    console.log(`Redirecting from ${host} to ${url.host}`);
    
    // Retorna redirecionamento permanente (301)
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

// O matcher garante que o middleware rode em todas as requisições
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
