import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
    ) {}

    async validateGoogleUser(profile: Profile) {
        const { name, emails, photos } = profile;

        const user = await this.usersService.findOne({email: emails[0].value || ''});

        if (user) {
            return user;
        }

        const newUser = await this.usersService.create({
            email: emails[0].value,
                name: name.givenName,
                profilePicture: photos[0].value,
        });

        return newUser;
    }
}
