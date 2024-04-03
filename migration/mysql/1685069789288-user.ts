import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1685069789288 implements MigrationInterface {
  name = 'User1685069789288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `delete_time` datetime(6) NULL'
    );
    await queryRunner.query('ALTER TABLE `user` CHANGE `id` `id` int NOT NULL');
    await queryRunner.query('ALTER TABLE `user` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` bigint NOT NULL PRIMARY KEY'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `id`');
    await queryRunner.query(
      'ALTER TABLE `user` ADD `id` int NOT NULL AUTO_INCREMENT'
    );
    await queryRunner.query('ALTER TABLE `user` ADD PRIMARY KEY (`id`)');
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT'
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `delete_time`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `update_time`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `create_time`');
  }
}
