// // middleware.ts
// import { NextRequest } from 'next/server';
// import { authmiddleware } from './middleware/authMiddleware';

// export async function middleware(request: NextRequest) {
//   return await authmiddleware(request);
// }

// export const config = {
//   matcher: [
//     '/admin/:path*',
//     '/worker/:path*',
//     '/api/auth/basic_info/:path*',
//     '/api/admin/:path*',
//   ],
// };