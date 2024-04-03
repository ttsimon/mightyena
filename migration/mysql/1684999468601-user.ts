import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1684999468601 implements MigrationInterface {
  name = 'User1684999468601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `gender` varchar(255) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `gender`');
  }
}
