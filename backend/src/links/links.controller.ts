import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LinksService } from './links.service';

@UseGuards(JwtAuthGuard)
@Controller('links')
export class LinksController {
  constructor(private linksService: LinksService) {}

  @Post('process')
  process(@Body('url') url: string) {
    return this.linksService.processLink(url);
  }
}
