import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanupJobs {
  cleanOtp() {
    console.log('cleaning...');
  }
}
