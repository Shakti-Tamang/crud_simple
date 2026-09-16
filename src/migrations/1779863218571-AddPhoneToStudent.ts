import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToStudent1779863218571 implements MigrationInterface {
    name = 'AddPhoneToStudent1779863218571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "nickname" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "nickname"`);
    }

}
