import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1781764906803 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_Student_name_fts"
      ON "student"
      USING GIN(to_tsvector('english', name))
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_Student_name_fts"
    `)
  }
  

}