import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCasteToStudent1748340000000 implements MigrationInterface {
  name = 'AddCasteToStudent1748340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" ADD "caste" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "caste"`);
  }
}