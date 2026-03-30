import { Module } from '@nestjs/common';
import { TestService } from './test.service';

@Module({
  providers: [TestService],
})
export class TestModule {}
// --experimental-vm-modules is required because Prisma 7.x uses `dynamic import()` to load the WASM runtime,
// and Jest does not support this by default without that flag.
