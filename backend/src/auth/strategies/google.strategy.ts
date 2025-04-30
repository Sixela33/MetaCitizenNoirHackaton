import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
    ) {

        const clientID = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const callbackURL = 'http://localhost:3000/auth/google/callback';

        if (!clientID || !clientSecret || !callbackURL) {
            throw new Error('Missing Google OAuth credentials');
        }

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
      
        const user = await this.authService.validateGoogleUser(profile);

        console.log({profile})

        return user;
    }


}