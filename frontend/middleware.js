export const config = {
  matcher: '/:path*',
}

export default function middleware(req) {
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = atob(auth).split(':')

    // Replace 'your-password' with your chosen password
    if (pwd === process.env.SITE_PASSWORD) {
      return
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
