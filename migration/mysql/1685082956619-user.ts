import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1685082956619 implements MigrationInterface {
  name = 'User1685082956619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `id` `id` bigint NOT NULL'
    );
    await queryRunner.query('ALTER TABLE `user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` bigint NOT NULL AUTO_INCREMENT'
    );
    await queryRunner.query('ALTER TABLE `user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `id` `id` bigint NOT NULL AUTO_INCREMENT'
    );
  }
}
