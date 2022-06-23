import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config';
import type { JWTPayloadUser } from './strategies/jwt.strategy';
import { AuthService, TokenType } from './auth.service';
import ms from 'ms';
import { PasswordAuthGuard } from './guards/password.guard';

@Controller()
export class AuthController {
  private static readonly ONE_YEAR = ms('1y');
  private static readonly COOKIE_OPTIONS = {
    path: '/',
    httpOnly: true,
    domain: config.rootHost.normalised.split(':').shift(),
    secure: config.rootHost.url.startsWith('https'),
  };

  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  @UseGuards(PasswordAuthGuard)
  async login(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const payload: JWTPayloadUser = { name: request.user.username, id: request.user.id, secret: request.user.secret };
    const expiresAt = Date.now() + AuthController.ONE_YEAR;
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, payload, '1y');
    return reply
      .setCookie('token', token, {
        ...AuthController.COOKIE_OPTIONS,
        expires: new Date(expiresAt),
      })
      .send({ ok: true });
  }

  @Post('auth/logout')
  async logout(@Res() reply: FastifyReply) {
    return reply
      .setCookie('token', '', {
        ...AuthController.COOKIE_OPTIONS,
        expires: new Date(),
      })
      .send({ ok: true });
  }
}
