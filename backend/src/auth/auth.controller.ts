import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {


    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    googleLogin() {
        return 
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    googleLoginCallback(@Req() req) {
        return req.user;
    }
}
