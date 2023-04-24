import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { UserNotExistPipe } from './user/user-not-exist.pipe';
import { TokensDto } from './dto/tokens.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { LoginDto } from './dto/login.dto';
import { ApiLogin } from './docs/api-login.decorator';
import { ApiRegister } from './docs/api-register.decorator';
import { ApiRefresh } from './docs/api-refresh.decorator';

@ApiTags('Authorization')
@ApiBearerAuth()
@Controller('auth')
@ApiExtraModels(TokensDto)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authServise: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  login(@Body() { username, password }: LoginDto): Promise<TokensDto> {
    return this.authServise.login(username, password);
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiRegister()
  async register(
    @Body(UserNotExistPipe) { username, password }: RegisterDto,
  ): Promise<TokensDto> {
    return this.authServise.register(username, password);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiRefresh()
  refresh(@Body() dto: RefreshDto): Promise<TokensDto> {
    return this.authServise.refresh(dto.refreshToken);
  }
}
