import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('sms-queue')
export class SmsProcessor {
  @Process('send-sms')
  async handleSend(job: Job<{ mobile: string; message: string }>) {
    console.log(
      `Sending sms to ${job.data.mobile} with message: ${job.data.message}`,
    );

    if (Math.random() < 0.5) {
      console.log('Sms sending failed. will retry...');
      throw new Error('Sms service error');
    }

    console.log('Sms send sucessfully');
    return true;
  }
}
