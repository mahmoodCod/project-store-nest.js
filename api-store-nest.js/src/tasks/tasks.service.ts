import { Injectable } from '@nestjs/common';
import { CleanupJobs } from './jobs/cleanup.jobs';

@Injectable()
export class TasksService {
  constructor(private readonly cleanUp: CleanupJobs) {}

  cleanOtpData() {
    this.cleanUp.cleanOtp();
  }
}
