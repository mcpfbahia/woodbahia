import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  const hostWithoutPort = host?.split(':')[0];
  
  // Verifica se o acesso está sendo feito pelo domínio principal sem www
  if (hostWithoutPort === 'woodbahia.com') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.woodbahia.com';
    url.port = ''; // Limpa a porta para evitar o :8080
    url.protocol = 'https:';
    
    console.log(`Redirecting from ${host} to ${url.toString()}`);
    
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
