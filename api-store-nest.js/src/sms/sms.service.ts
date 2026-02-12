import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SmsService {
  constructor(@InjectQueue('sms-queue') private smsQueue: Queue) {}

  async sendMultiSms(number: string, text: string) {
    await this.smsQueue.add(
      'send-sms',
      { number, text },
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
