import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [CommonModule, AuthModule, TaskModule, SecurityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
