import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [BullModule.registerQueue({ name: 'sms-queue' })],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
