import { Module } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { UnderwritingService } from './underwriting.service';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, UnderwritingService, AiAnalysisService],
})
export class PropertiesModule {}
