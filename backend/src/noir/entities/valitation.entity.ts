import { Column, Entity } from "typeorm";

/**
 * This entity is used to store the validation data for the desired circuit
 */
@Entity()
export class Validation {

    @Column()
    min_age: number;

    @Column()
    min_aml_security: number;

    @Column()
    passport_should_be_valid: boolean;

    @Column()
    restricted_countries: number[];
}