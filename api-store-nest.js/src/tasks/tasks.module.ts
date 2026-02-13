import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CleanupJobs } from './jobs/cleanup.jobs';

@Module({
  providers: [TasksService, CleanupJobs],
})
export class TasksModule {}
