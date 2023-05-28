import { Controller, Post, Body } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth')
  async login(@Body() body) {
    return this.authService.login(body)
  }
}
