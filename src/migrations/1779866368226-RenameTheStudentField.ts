import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTheStudentField1779866368226 implements MigrationInterface {
    name = 'RenameTheStudentField1779866368226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "nickname" TO "usernickname"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" RENAME COLUMN "usernickname" TO "nickname"`);
    }

}
