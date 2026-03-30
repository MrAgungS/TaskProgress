export interface JwtPayload {
  sub: number; // adjust according to the ID type in Prisma
  email: string;
}
