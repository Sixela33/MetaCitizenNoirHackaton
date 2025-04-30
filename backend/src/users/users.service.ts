import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
    
    /**
     * TODO implement DTOS with validations in user creation and fetching 
    */

    async findOne(dto: {id?: number, name?: string, email?: string}): Promise<User> {
        const { id, name, email  } = dto;
        
        const conditions: FindOptionsWhere<User> = {
            ...(id ? {id} : {}),
            ...(name ? {name} : {}),
            ...(email ? {email} : {})
        };

        return await this.userRepository.findOne({where: conditions});
    }

    async create(dto: {email: string, name: string, profilePicture: string}): Promise<User> {
        const user = this.userRepository.create(dto);
        return this.userRepository.save(user);
    }
}