import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1685082490484 implements MigrationInterface {
  name = 'User1685082490484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` bigint NOT NULL PRIMARY KEY AUTO_INCREMENT'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query('ALTER TABLE `user` ADD `id` bigint NOT NULL');
    await queryRunner.query('ALTER TABLE `user` ADD PRIMARY KEY (`id`)');
  }
}
