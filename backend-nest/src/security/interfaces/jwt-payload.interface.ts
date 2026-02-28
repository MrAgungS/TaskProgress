export interface JwtPayload {
  sub: number; // sesuaikan dengan tipe id di Prisma
  email: string;
}
