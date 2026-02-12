import { Injectable } from '@nestjs/common';
import { CleanupJobs } from './jobs/cleanup.jobs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly cleanUp: CleanupJobs) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  cleanOtpData() {
    this.cleanUp.cleanOtp();
  }
}
