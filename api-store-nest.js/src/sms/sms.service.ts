import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SmsService {
  constructor(@InjectQueue('sms-queue') private smsQueue: Queue) {}

  async sendSms(mobile: string, message: string) {
    await this.smsQueue.add(
      'send-sms',
      { mobile, message },
      {
        attempts: 3,
        backoff: 5000,
        delay: 2000,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
