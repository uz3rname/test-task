import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OccupancyByMonthReportEntry } from '../common/common.types';
import { StoreService } from '../store/store.service';

@Controller('stats')
@ApiTags('stats')
@ApiProduces('application/json')
export class StatsController {
  constructor(private readonly store: StoreService) {}

  @Get('occupancy')
  @ApiResponse({ type: [OccupancyByMonthReportEntry], status: HttpStatus.OK })
  async getAverageOccupancyByMonth(): Promise<OccupancyByMonthReportEntry[]> {
    return this.store.getAverageOccupancyByMonth();
  }
}
