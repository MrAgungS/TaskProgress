import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { Priority } from 'generated/prisma/enums';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: { email: 'test@example.com' },
    });
  }

  async deleteOtherUser() {
    await this.prismaService.user.deleteMany({
      where: { email: 'other@example.com' },
    });
  }

  async createUser() {
    await this.prismaService.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        name: 'test',
        password: await bcrypt.hash('test123', 10),
      },
      create: {
        email: 'test@example.com',
        name: 'test',
        password: await bcrypt.hash('test123', 10),
      },
    });
  }

  async createOtherUser() {
    await this.prismaService.user.upsert({
      where: { email: 'other@example.com' },
      update: {
        name: 'other',
        password: await bcrypt.hash('test123', 10),
      },
      create: {
        email: 'other@example.com',
        name: 'other',
        password: await bcrypt.hash('test123', 10),
      },
    });
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: { email: 'test@example.com' },
    });
  }

  async deleteTask() {
    const user = await this.getUser();
    if (!user) return;
    await this.prismaService.task.deleteMany({
      where: { user_id: user.id },
    });
  }

  async createTask() {
    const user = await this.getUser();
    return this.prismaService.task.create({
      data: {
        title: 'test task',
        description: 'test description',
        priority: Priority.high,
        due_date: new Date('2026-12-01'),
        user_id: user!.id,
      },
    });
  }

  async getTask() {
    const user = await this.getUser();
    return this.prismaService.task.findFirst({
      where: { user_id: user!.id },
    });
  }
}
