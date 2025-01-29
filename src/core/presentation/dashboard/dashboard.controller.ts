import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from '@app/use-cases/dashboard/dashboard.service';
import { DashboardResponseDto } from '@app/dto/dashboard/dashboard-response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOkResponse({
    type: DashboardResponseDto,
    description: 'Dados do dashboard recuperados com sucesso',
  })
  async getDashboard(): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData();
  }
}
