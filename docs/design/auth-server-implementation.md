# NestJS 서버 인증 구현 가이드

## 1. 개요

이 문서는 durubitteo 프로젝트의 NestJS 서버에서 인증 시스템을 구현하기 위한 가이드입니다.

### 인증 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                     서버 인증 처리 흐름                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /auth/login                                               │
│       │                                                         │
│       ▼                                                         │
│  1. 요청 검증 (type, identifier, password)                      │
│       │                                                         │
│       ▼                                                         │
│  2. 사용자 조회 (역할별 테이블)                                  │
│       │                                                         │
│       ▼                                                         │
│  3. 인증 검증 (관리자: bcrypt, 기업/직원: 고유번호만)            │
│       │                                                         │
│       ▼                                                         │
│  4. JWT 발급 (Access Token + Refresh Token)                     │
│       │                                                         │
│       ▼                                                         │
│  5. Cookie 설정 (Set-Cookie 헤더)                               │
│       │                                                         │
│       ▼                                                         │
│  6. 사용자 정보 반환                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 모듈 구조

```
durubitteo_server/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── auth-response.dto.ts
│   │
│   ├── common/
│   │   └── types/
│   │       └── user-role.enum.ts
│   │
│   └── config/
│       └── jwt.config.ts
```

---

## 3. JWT 설정

### 환경 변수

```env
# .env
JWT_ACCESS_SECRET=your-access-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### JWT 설정 모듈

```typescript
// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
```

---

## 4. DTO 정의

### 로그인 요청

```typescript
// src/auth/dto/login.dto.ts
import { IsEnum, IsString, IsOptional, ValidateIf } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  COMPANY = 'company',
  EMPLOYEE = 'employee',
}

export class LoginDto {
  @IsEnum(UserRole)
  type: UserRole;

  @IsString()
  identifier: string;  // admin: 이메일, company: 고유번호, employee: 생년월일4자리+전화번호뒤4자리

  @ValidateIf((o) => o.type === UserRole.ADMIN)
  @IsString()
  password?: string;
}
```

### 로그인 응답

```typescript
// src/auth/dto/auth-response.dto.ts
export class AuthUserDto {
  id: string;
  role: 'admin' | 'company' | 'employee';
  name: string;
  email?: string;      // admin만
  code?: string;       // company/employee
  companyId?: string;  // employee만
  companyName?: string; // employee만
}

export class LoginResponseDto {
  user: AuthUserDto;
}
```

---

## 5. 인증 서비스

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto, UserRole } from './dto/login.dto';
import { AuthUserDto } from './dto/auth-response.dto';

interface JwtPayload {
  sub: string;
  role: UserRole;
  companyId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // Repository 주입 (AdminRepository, CompanyRepository, EmployeeRepository)
  ) {}

  async login(dto: LoginDto): Promise<{ user: AuthUserDto; tokens: { accessToken: string; refreshToken: string } }> {
    let user: AuthUserDto;
    let payload: JwtPayload;

    switch (dto.type) {
      case UserRole.ADMIN:
        user = await this.validateAdmin(dto.identifier, dto.password!);
        payload = { sub: user.id, role: UserRole.ADMIN };
        break;

      case UserRole.COMPANY:
        user = await this.validateCompany(dto.identifier);
        payload = { sub: user.id, role: UserRole.COMPANY };
        break;

      case UserRole.EMPLOYEE:
        user = await this.validateEmployee(dto.identifier);
        payload = { sub: user.id, role: UserRole.EMPLOYEE, companyId: user.companyId };
        break;

      default:
        throw new UnauthorizedException('잘못된 로그인 유형입니다.');
    }

    const tokens = await this.generateTokens(payload);
    return { user, tokens };
  }

  private async validateAdmin(email: string, password: string): Promise<AuthUserDto> {
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return {
      id: admin.id,
      role: 'admin',
      name: admin.name,
      email: admin.email,
    };
  }

  private async validateCompany(code: string): Promise<AuthUserDto> {
    const company = await this.companyRepository.findByCode(code);
    if (!company || !company.isActive) {
      throw new UnauthorizedException('등록되지 않은 고유번호입니다.');
    }

    return {
      id: company.id,
      role: 'company',
      name: company.name,
      code: company.code,
    };
  }

  private async validateEmployee(uniqueCode: string): Promise<AuthUserDto> {
    // uniqueCode: 생년월일4자리 + 전화번호뒤4자리 (예: 99011234)
    const employee = await this.employeeRepository.findByUniqueCode(uniqueCode);
    if (!employee || !employee.isActive) {
      throw new UnauthorizedException('등록되지 않은 고유번호입니다.');
    }

    return {
      id: employee.id,
      role: 'employee',
      name: employee.name,
      code: employee.uniqueCode,
      companyId: employee.companyId,
      companyName: employee.company.name,
    };
  }

  private async generateTokens(payload: JwtPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const newPayload: JwtPayload = {
        sub: payload.sub,
        role: payload.role,
        companyId: payload.companyId,
      };

      return this.generateTokens(newPayload);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  async getMe(userId: string, role: UserRole): Promise<AuthUserDto> {
    switch (role) {
      case UserRole.ADMIN:
        const admin = await this.adminRepository.findById(userId);
        return { id: admin.id, role: 'admin', name: admin.name, email: admin.email };

      case UserRole.COMPANY:
        const company = await this.companyRepository.findById(userId);
        return { id: company.id, role: 'company', name: company.name, code: company.code };

      case UserRole.EMPLOYEE:
        const employee = await this.employeeRepository.findById(userId);
        return {
          id: employee.id,
          role: 'employee',
          name: employee.name,
          code: employee.uniqueCode,
          companyId: employee.companyId,
          companyName: employee.company.name,
        };

      default:
        throw new UnauthorizedException();
    }
  }
}
```

---

## 6. 인증 컨트롤러

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Get, Body, Res, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.login(dto);

    this.setAuthCookies(res, tokens, user.role);

    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const tokens = await this.authService.refresh(refreshToken);

    // 기존 role 쿠키에서 역할 읽기
    const userRole = req.cookies['user-role'];
    this.setAuthCookies(res, tokens, userRole);

    return { message: '토큰이 갱신되었습니다.' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { message: '로그아웃되었습니다.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: { sub: string; role: string }) {
    return this.authService.getMe(user.sub, user.role);
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
    role: string
  ) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token - HttpOnly
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000, // 1시간
    });

    // Refresh Token - HttpOnly, /auth 경로만
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // Auth Status - 클라이언트에서 읽기 가능 (middleware.ts용)
    res.cookie('auth-status', 'authenticated', {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });

    // User Role - 클라이언트에서 읽기 가능 (middleware.ts용)
    res.cookie('user-role', role, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
  }

  private clearAuthCookies(res: Response) {
    const cookieOptions = { path: '/', maxAge: 0 };

    res.cookie('accessToken', '', cookieOptions);
    res.cookie('refreshToken', '', { ...cookieOptions, path: '/auth' });
    res.cookie('auth-status', '', cookieOptions);
    res.cookie('user-role', '', cookieOptions);
  }
}
```

---

## 7. JWT Strategy & Guards

### JWT Strategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: { sub: string; role: string; companyId?: string }) {
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
```

### JWT Auth Guard

```typescript
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('인증이 필요합니다.');
    }
    return user;
  }
}
```

### Roles Guard

```typescript
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
```

---

## 8. Decorators

### Current User Decorator

```typescript
// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Roles Decorator

```typescript
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

---

## 9. Auth Module

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forFeature([Admin, Company, Employee]),  // Repository 등록
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 10. 사용 예시

### 보호된 라우트에서 사용

```typescript
// src/companies/companies.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  @Get()
  @Roles('admin')
  async findAll() {
    // 관리자만 접근 가능
  }

  @Get('me')
  @Roles('company')
  async getMyCompany(@CurrentUser() user: { sub: string; role: string }) {
    // 기업만 접근 가능
    // user.sub = company ID
  }
}
```

---

## 11. 구현 체크리스트

### 필수 구현

- [ ] Auth Module 생성
- [ ] LoginDto 유효성 검증
- [ ] 역할별 사용자 조회 로직
- [ ] 관리자 비밀번호 bcrypt 해싱 및 검증
- [ ] JWT Access/Refresh Token 발급
- [ ] Cookie 설정 (HttpOnly, Secure, SameSite)
- [ ] JWT Strategy (Cookie에서 토큰 추출)
- [ ] JwtAuthGuard, RolesGuard
- [ ] /auth/login, /auth/refresh, /auth/logout, /auth/me 엔드포인트

### 보안 고려사항

- [ ] 비밀번호 해싱 (bcrypt, saltRounds: 12)
- [ ] JWT Secret 충분한 길이 (32자 이상)
- [ ] 프로덕션 환경에서 Secure 플래그 활성화
- [ ] Refresh Token은 /auth 경로로 제한
- [ ] 로그인 실패 시 구체적인 정보 노출 금지

### 테스트

- [ ] 관리자 로그인 (이메일 + 비밀번호)
- [ ] 기업 로그인 (고유번호)
- [ ] 직원 로그인 (생년월일4자리+전화번호뒤4자리)
- [ ] 토큰 갱신
- [ ] 로그아웃 (Cookie 삭제 확인)
- [ ] 잘못된 자격 증명 에러 처리
- [ ] 만료된 토큰 에러 처리
- [ ] 역할 기반 접근 제어

---

## 참고 문서

- [프론트엔드 인증 구현](./auth-implementation.md) - Next.js 클라이언트 인증 구현 가이드
- [API 설계](./api-design.md) - 인증 API 명세
- [요구사항](./requirements.md) - 인증 방식 정의
