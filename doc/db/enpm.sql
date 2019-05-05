/*
Navicat MySQL Data Transfer

Source Server         : 本地
Source Server Version : 50528
Source Host           : localhost:3306
Source Database       : enpm

Target Server Type    : MYSQL
Target Server Version : 50528
File Encoding         : 65001

Date: 2019-05-05 12:36:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for db_history
-- ----------------------------
DROP TABLE IF EXISTS `db_history`;
CREATE TABLE `db_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `gmt_create` datetime NOT NULL,
  `sqlstr` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for downloads
-- ----------------------------
DROP TABLE IF EXISTS `downloads`;
CREATE TABLE `downloads` (
  `id` bigint(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `date` int(11) NOT NULL,
  `d01` bigint(20) NOT NULL DEFAULT '0',
  `d02` bigint(20) NOT NULL DEFAULT '0',
  `d03` bigint(20) NOT NULL DEFAULT '0',
  `d04` bigint(20) NOT NULL DEFAULT '0',
  `d05` bigint(20) NOT NULL DEFAULT '0',
  `d06` bigint(20) NOT NULL DEFAULT '0',
  `d07` bigint(20) NOT NULL DEFAULT '0',
  `d08` bigint(20) NOT NULL DEFAULT '0',
  `d09` bigint(20) NOT NULL DEFAULT '0',
  `d10` bigint(20) NOT NULL DEFAULT '0',
  `d11` bigint(20) NOT NULL DEFAULT '0',
  `d12` bigint(20) NOT NULL DEFAULT '0',
  `d13` bigint(20) NOT NULL DEFAULT '0',
  `d14` bigint(20) NOT NULL DEFAULT '0',
  `d15` bigint(20) NOT NULL DEFAULT '0',
  `d16` bigint(20) NOT NULL DEFAULT '0',
  `d17` bigint(20) NOT NULL DEFAULT '0',
  `d18` bigint(20) NOT NULL DEFAULT '0',
  `d19` bigint(20) NOT NULL DEFAULT '0',
  `d20` bigint(20) NOT NULL DEFAULT '0',
  `d21` bigint(20) NOT NULL DEFAULT '0',
  `d22` bigint(20) NOT NULL DEFAULT '0',
  `d23` bigint(20) NOT NULL DEFAULT '0',
  `d24` bigint(20) NOT NULL DEFAULT '0',
  `d25` bigint(20) NOT NULL DEFAULT '0',
  `d26` bigint(20) NOT NULL DEFAULT '0',
  `d27` bigint(20) NOT NULL DEFAULT '0',
  `d28` bigint(20) NOT NULL DEFAULT '0',
  `d29` bigint(20) NOT NULL DEFAULT '0',
  `d30` bigint(20) NOT NULL DEFAULT '0',
  `d31` bigint(20) NOT NULL DEFAULT '0',
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `downloads_name_date` (`name`,`date`),
  KEY `downloads_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `author` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `version` varchar(100) NOT NULL,
  `description` text,
  `package` longtext,
  `dist_shasum` varchar(100) DEFAULT NULL,
  `dist_tarball` varchar(2048) DEFAULT NULL,
  `dist_size` int(11) NOT NULL DEFAULT '0',
  `publish_time` bigint(20) DEFAULT NULL,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_name_version` (`name`,`version`),
  KEY `module_author` (`author`),
  KEY `module_gmt_modified` (`gmt_modified`),
  KEY `module_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_abbreviated
-- ----------------------------
DROP TABLE IF EXISTS `module_abbreviated`;
CREATE TABLE `module_abbreviated` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `version` varchar(100) NOT NULL,
  `package` text,
  `publish_time` bigint(20) DEFAULT NULL,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_abbreviated_name_version` (`name`,`version`),
  KEY `module_abbreviated_gmt_modified` (`gmt_modified`),
  KEY `module_abbreviated_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_deps
-- ----------------------------
DROP TABLE IF EXISTS `module_deps`;
CREATE TABLE `module_deps` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `deps` varchar(100) DEFAULT NULL,
  `gmt_create` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_deps_name_deps` (`name`,`deps`),
  KEY `module_deps_deps` (`deps`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_keyword
-- ----------------------------
DROP TABLE IF EXISTS `module_keyword`;
CREATE TABLE `module_keyword` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `keyword` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `gmt_create` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_keyword_keyword_name` (`keyword`,`name`),
  KEY `module_keyword_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_log
-- ----------------------------
DROP TABLE IF EXISTS `module_log`;
CREATE TABLE `module_log` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `username` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `log` text,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `module_log_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS `module_maintainer`;
CREATE TABLE `module_maintainer` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `user` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gmt_create` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_maintainer_user_name` (`user`,`name`),
  KEY `module_maintainer_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_star
-- ----------------------------
DROP TABLE IF EXISTS `module_star`;
CREATE TABLE `module_star` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `user` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(100) NOT NULL,
  `gmt_create` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_star_user_name` (`user`,`name`),
  KEY `module_star_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module_unpublished
-- ----------------------------
DROP TABLE IF EXISTS `module_unpublished`;
CREATE TABLE `module_unpublished` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `package` text,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `module_unpublished_name` (`name`),
  KEY `module_unpublished_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for npm_module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS `npm_module_maintainer`;
CREATE TABLE `npm_module_maintainer` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `user` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(100) NOT NULL,
  `gmt_create` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `npm_module_maintainer_user_name` (`user`,`name`),
  KEY `npm_module_maintainer_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for package_readme
-- ----------------------------
DROP TABLE IF EXISTS `package_readme`;
CREATE TABLE `package_readme` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `version` varchar(100) NOT NULL,
  `readme` longtext,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `package_readme_name` (`name`),
  KEY `package_readme_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sync_task
-- ----------------------------
DROP TABLE IF EXISTS `sync_task`;
CREATE TABLE `sync_task` (
  `id` varchar(64) NOT NULL,
  `taskId` varchar(64) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `version` varchar(100) NOT NULL,
  `sync_dev` int(11) DEFAULT NULL,
  `sync_type` varchar(8) DEFAULT NULL,
  `description` text,
  `state` int(11) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `trace_id` varchar(64) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `sync_task_taskId` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `tag` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `version` varchar(100) NOT NULL,
  `module_id` varchar(64) NOT NULL,
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_name_tag` (`name`,`tag`),
  KEY `tag_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for total
-- ----------------------------
DROP TABLE IF EXISTS `total`;
CREATE TABLE `total` (
  `name` varchar(100) NOT NULL,
  `module_delete` bigint(20) NOT NULL DEFAULT '0',
  `last_sync_time` bigint(20) NOT NULL DEFAULT '0',
  `last_exist_sync_time` bigint(20) NOT NULL DEFAULT '0',
  `sync_status` int(11) NOT NULL DEFAULT '0',
  `need_sync_num` int(11) NOT NULL DEFAULT '0',
  `success_sync_num` int(11) NOT NULL DEFAULT '0',
  `fail_sync_num` int(11) NOT NULL DEFAULT '0',
  `left_sync_num` int(11) NOT NULL DEFAULT '0',
  `last_sync_module` varchar(100) DEFAULT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(64) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `password_sha` varchar(100) NOT NULL,
  `ip` varchar(64) NOT NULL,
  `roles` varchar(200) NOT NULL DEFAULT '[]',
  `rev` varchar(40) NOT NULL,
  `email` varchar(400) NOT NULL,
  `json` text,
  `npm_user` tinyint(1) NOT NULL DEFAULT '0',
  `gmt_create` datetime NOT NULL,
  `gmt_modified` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`name`),
  KEY `user_gmt_modified` (`gmt_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
