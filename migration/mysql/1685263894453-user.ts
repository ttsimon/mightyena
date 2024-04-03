import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1685263894453 implements MigrationInterface {
  name = 'User1685263894453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT COMMENT '数据库主键，自增id'"
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `create_time` `create_time` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6)"
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `update_time` `update_time` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)"
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `delete_time` `delete_time` datetime(6) NULL COMMENT '软删除字段'"
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NULL'
    );
    await queryRunner.query('ALTER TABLE `user` CHANGE `age` `age` int NULL');
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `gender` `gender` varchar(255) NOT NULL DEFAULT '1'"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `gender` `gender` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `age` `age` int NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `name` `name` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `delete_time` `delete_time` datetime(6) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `update_time` `update_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `create_time` `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT'
    );
  }
}
