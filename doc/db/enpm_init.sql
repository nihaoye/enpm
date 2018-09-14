/*
Navicat SQLite Data Transfer

Source Server         : enpm
Source Server Version : 30808
Source Host           : :0
sqlite_sequence
Target Server Type    : SQLite
Target Server Version : 30808
File Encoding         : 65001

Date: 2018-09-09 22:41:02
*/

PRAGMA foreign_keys = OFF;

-- ----------------------------
-- Table structure for downloads
-- ----------------------------
DROP TABLE IF EXISTS "main"."downloads";
CREATE TABLE `downloads` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `date` INTEGER NOT NULL, `d01` BIGINT(20) NOT NULL DEFAULT 0, `d02` BIGINT(20) NOT NULL DEFAULT 0, `d03` BIGINT(20) NOT NULL DEFAULT 0, `d04` BIGINT(20) NOT NULL DEFAULT 0, `d05` BIGINT(20) NOT NULL DEFAULT 0, `d06` BIGINT(20) NOT NULL DEFAULT 0, `d07` BIGINT(20) NOT NULL DEFAULT 0, `d08` BIGINT(20) NOT NULL DEFAULT 0, `d09` BIGINT(20) NOT NULL DEFAULT 0, `d10` BIGINT(20) NOT NULL DEFAULT 0, `d11` BIGINT(20) NOT NULL DEFAULT 0, `d12` BIGINT(20) NOT NULL DEFAULT 0, `d13` BIGINT(20) NOT NULL DEFAULT 0, `d14` BIGINT(20) NOT NULL DEFAULT 0, `d15` BIGINT(20) NOT NULL DEFAULT 0, `d16` BIGINT(20) NOT NULL DEFAULT 0, `d17` BIGINT(20) NOT NULL DEFAULT 0, `d18` BIGINT(20) NOT NULL DEFAULT 0, `d19` BIGINT(20) NOT NULL DEFAULT 0, `d20` BIGINT(20) NOT NULL DEFAULT 0, `d21` BIGINT(20) NOT NULL DEFAULT 0, `d22` BIGINT(20) NOT NULL DEFAULT 0, `d23` BIGINT(20) NOT NULL DEFAULT 0, `d24` BIGINT(20) NOT NULL DEFAULT 0, `d25` BIGINT(20) NOT NULL DEFAULT 0, `d26` BIGINT(20) NOT NULL DEFAULT 0, `d27` BIGINT(20) NOT NULL DEFAULT 0, `d28` BIGINT(20) NOT NULL DEFAULT 0, `d29` BIGINT(20) NOT NULL DEFAULT 0, `d30` BIGINT(20) NOT NULL DEFAULT 0, `d31` BIGINT(20) NOT NULL DEFAULT 0, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of downloads
-- ----------------------------

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS "main"."module";
CREATE TABLE `module` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `author` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `version` VARCHAR(30) NOT NULL, `description` TEXT, `package` TEXT, `dist_shasum` VARCHAR(100), `dist_tarball` VARCHAR(2048), `dist_size` INTEGER NOT NULL DEFAULT 0, `publish_time` BIGINT(20), `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of module
-- ----------------------------

-- ----------------------------
-- Table structure for module_abbreviated
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_abbreviated";
CREATE TABLE `module_abbreviated` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `version` VARCHAR(30) NOT NULL, `package` TEXT, `publish_time` BIGINT(20), `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_abbreviated
-- ----------------------------

-- ----------------------------
-- Table structure for module_deps
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_deps";
CREATE TABLE `module_deps` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `deps` VARCHAR(100), `gmt_create` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_deps
-- ----------------------------

-- ----------------------------
-- Table structure for module_keyword
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_keyword";
CREATE TABLE `module_keyword` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `keyword` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `description` TEXT, `gmt_create` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_keyword
-- ----------------------------

-- ----------------------------
-- Table structure for module_log
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_log";
CREATE TABLE `module_log` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `username` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `log` TEXT, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_log
-- ----------------------------

-- ----------------------------
-- Table structure for module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_maintainer";
CREATE TABLE `module_maintainer` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `user` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `gmt_create` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_maintainer
-- ----------------------------

-- ----------------------------
-- Table structure for module_star
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_star";
CREATE TABLE `module_star` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `user` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `gmt_create` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_star
-- ----------------------------

-- ----------------------------
-- Table structure for module_unpublished
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_unpublished";
CREATE TABLE `module_unpublished` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `package` TEXT, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of module_unpublished
-- ----------------------------

-- ----------------------------
-- Table structure for npm_module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS "main"."npm_module_maintainer";
CREATE TABLE `npm_module_maintainer` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `user` VARCHAR(100) NOT NULL, `name` VARCHAR(100) NOT NULL, `gmt_create` DATETIME NOT NULL);

-- ----------------------------
-- Records of npm_module_maintainer
-- ----------------------------

-- ----------------------------
-- Table structure for package_readme
-- ----------------------------
DROP TABLE IF EXISTS "main"."package_readme";
CREATE TABLE `package_readme` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `version` VARCHAR(30) NOT NULL, `readme` TEXT, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of package_readme
-- ----------------------------


-- ----------------------------
-- Table structure for sync_task
-- ----------------------------
DROP TABLE IF EXISTS "main"."sync_task";
CREATE TABLE "sync_task" (
"id"  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
"name"  VARCHAR(20) NOT NULL,
"version"  VARCHAR(20) NOT NULL,
"description"  TEXT,
"state"  INTEGER,
"result"  VARCHAR(255),
"gmt_create"  DATETIME NOT NULL
);

-- ----------------------------
-- Records of sync_task
-- ----------------------------
INSERT INTO "main"."sync_task" VALUES (1, 'gulp', '*', '', 0, null, '2018-09-09 14:39:46.574 +00:00');
INSERT INTO "main"."sync_task" VALUES (2, 'webpack', '*', '', 0, null, '2018-09-09 14:39:46.715 +00:00');
INSERT INTO "main"."sync_task" VALUES (3, 'grunt', '*', '', 0, null, '2018-09-09 14:39:46.820 +00:00');
INSERT INTO "main"."sync_task" VALUES (4, 'http-server', '*', '', 0, null, '2018-09-09 14:39:46.921 +00:00');
INSERT INTO "main"."sync_task" VALUES (5, 'pm2', '*', '', 0, null, '2018-09-09 14:39:47.043 +00:00');
INSERT INTO "main"."sync_task" VALUES (6, 'fs-extra', '*', '', 0, null, '2018-09-09 14:39:47.162 +00:00');
INSERT INTO "main"."sync_task" VALUES (7, 'vue', '*', '', 0, null, '2018-09-09 14:39:47.271 +00:00');
INSERT INTO "main"."sync_task" VALUES (8, 'element-ui', '*', '', 0, null, '2018-09-09 14:39:47.371 +00:00');
INSERT INTO "main"."sync_task" VALUES (9, 'semver', '*', '', 0, null, '2018-09-09 14:39:47.477 +00:00');
INSERT INTO "main"."sync_task" VALUES (10, 'express', '*', '', 0, null, '2018-09-09 14:39:47.589 +00:00');
INSERT INTO "main"."sync_task" VALUES (11, 'koa', '*', '', 0, null, '2018-09-09 14:39:47.703 +00:00');
INSERT INTO "main"."sync_task" VALUES (12, 'koa-router', '*', '', 0, null, '2018-09-09 14:39:47.813 +00:00');
INSERT INTO "main"."sync_task" VALUES (13, 'egg', '*', '', 0, null, '2018-09-09 14:39:47.920 +00:00');
INSERT INTO "main"."sync_task" VALUES (14, 'egg-mock', '*', '', 0, null, '2018-09-09 14:39:48.019 +00:00');
INSERT INTO "main"."sync_task" VALUES (15, 'sequelize', '*', '', 0, null, '2018-09-09 14:39:48.127 +00:00');
INSERT INTO "main"."sync_task" VALUES (16, 'egg-sequelize', '*', '', 0, null, '2018-09-09 14:39:48.225 +00:00');
INSERT INTO "main"."sync_task" VALUES (17, 'mysql2', '*', '', 0, null, '2018-09-09 14:39:48.336 +00:00');
INSERT INTO "main"."sync_task" VALUES (18, 'sqlite3', '*', '', 0, null, '2018-09-09 14:39:48.436 +00:00');
INSERT INTO "main"."sync_task" VALUES (19, 'angularjs', '*', '', 0, null, '2018-09-09 14:39:48.538 +00:00');
INSERT INTO "main"."sync_task" VALUES (20, 'iview', '*', '', 0, null, '2018-09-09 14:39:48.644 +00:00');
INSERT INTO "main"."sync_task" VALUES (21, 'axios', '*', '', 0, null, '2018-09-09 14:39:48.746 +00:00');
INSERT INTO "main"."sync_task" VALUES (22, 'fetch', '*', '', 0, null, '2018-09-09 14:39:48.862 +00:00');
INSERT INTO "main"."sync_task" VALUES (23, 'vue-router', '*', '', 0, null, '2018-09-09 14:39:48.979 +00:00');
INSERT INTO "main"."sync_task" VALUES (24, 'mock', '*', '', 0, null, '2018-09-09 14:39:49.086 +00:00');
INSERT INTO "main"."sync_task" VALUES (25, 'mocha', '*', '', 0, null, '2018-09-09 14:39:49.200 +00:00');
INSERT INTO "main"."sync_task" VALUES (26, 'chai', '*', '', 0, null, '2018-09-09 14:39:49.317 +00:00');
INSERT INTO "main"."sync_task" VALUES (27, 'ol', '*', '', 0, null, '2018-09-09 14:39:49.443 +00:00');
INSERT INTO "main"."sync_task" VALUES (28, 'typescript', '*', '', 0, null, '2018-09-09 14:39:49.569 +00:00');
INSERT INTO "main"."sync_task" VALUES (29, 'cesium', '*', '', 0, null, '2018-09-09 14:39:49.693 +00:00');
INSERT INTO "main"."sync_task" VALUES (30, 'echarts', '*', '', 0, null, '2018-09-09 14:39:49.811 +00:00');
INSERT INTO "main"."sync_task" VALUES (31, 'd3', '*', '', 0, null, '2018-09-09 14:39:49.927 +00:00');
INSERT INTO "main"."sync_task" VALUES (32, 'three', '*', '', 0, null, '2018-09-09 14:39:50.053 +00:00');
INSERT INTO "main"."sync_task" VALUES (33, 'utility', '*', '', 0, null, '2018-09-09 14:39:50.200 +00:00');
INSERT INTO "main"."sync_task" VALUES (34, 'moment', '*', '', 0, null, '2018-09-09 14:39:50.324 +00:00');
INSERT INTO "main"."sync_task" VALUES (35, 'dayjs', '*', '', 0, null, '2018-09-09 14:39:50.428 +00:00');
INSERT INTO "main"."sync_task" VALUES (36, ' @babel/core', '*', '', 0, null, '2018-09-09 14:39:50.544 +00:00');
INSERT INTO "main"."sync_task" VALUES (37, '@babel/cli', '*', '', 0, null, '2018-09-09 14:39:50.678 +00:00');
INSERT INTO "main"."sync_task" VALUES (38, '@babel/preset-env', '*', '', 0, null, '2018-09-09 14:39:50.819 +00:00');
INSERT INTO "main"."sync_task" VALUES (39, '@babel/generator', '*', '', 0, null, '2018-09-09 14:39:50.952 +00:00');
INSERT INTO "main"."sync_task" VALUES (40, 'html2canvas', '*', '', 0, null, '2018-09-09 14:39:51.076 +00:00');
INSERT INTO "main"."sync_task" VALUES (41, 'imagemagick', '*', '', 0, null, '2018-09-09 14:39:51.185 +00:00');
INSERT INTO "main"."sync_task" VALUES (42, 'gm', '*', '', 0, null, '2018-09-09 14:39:51.295 +00:00');
INSERT INTO "main"."sync_task" VALUES (43, 'jsdoc', '*', '', 0, null, '2018-09-09 14:39:51.417 +00:00');

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS "main"."tag";
CREATE TABLE `tag` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `tag` VARCHAR(30) NOT NULL, `version` VARCHAR(30) NOT NULL, `module_id` BIGINT(20) NOT NULL, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of tag
-- ----------------------------

-- ----------------------------
-- Table structure for total
-- ----------------------------
DROP TABLE IF EXISTS "main"."total";
CREATE TABLE `total` (`name` VARCHAR(100) PRIMARY KEY, `module_delete` BIGINT(20) NOT NULL DEFAULT 0, `last_sync_time` BIGINT(20) NOT NULL DEFAULT 0, `last_exist_sync_time` BIGINT(20) NOT NULL DEFAULT 0, `sync_status` INTEGER NOT NULL DEFAULT 0, `need_sync_num` INTEGER NOT NULL DEFAULT 0, `success_sync_num` INTEGER NOT NULL DEFAULT 0, `fail_sync_num` INTEGER NOT NULL DEFAULT 0, `left_sync_num` INTEGER NOT NULL DEFAULT 0, `last_sync_module` VARCHAR(100), `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of total
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "main"."user";
CREATE TABLE `user` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(100) NOT NULL, `salt` VARCHAR(100) NOT NULL, `password_sha` VARCHAR(100) NOT NULL, `ip` VARCHAR(64) NOT NULL, `roles` VARCHAR(200) NOT NULL DEFAULT '[]', `rev` VARCHAR(40) NOT NULL, `email` VARCHAR(400) NOT NULL, `json` TEXT, `npm_user` TINYINT(1) NOT NULL DEFAULT 0, `gmt_create` DATETIME NOT NULL, `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Indexes structure for table downloads
-- ----------------------------
CREATE INDEX "main"."downloads_date"
ON "downloads" ("date" ASC);
CREATE UNIQUE INDEX "main"."downloads_name_date"
ON "downloads" ("name" ASC, "date" ASC);

-- ----------------------------
-- Indexes structure for table module
-- ----------------------------
CREATE INDEX "main"."module_author"
ON "module" ("author" ASC);
CREATE INDEX "main"."module_gmt_modified"
ON "module" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."module_name_version"
ON "module" ("name" ASC, "version" ASC);
CREATE INDEX "main"."module_publish_time"
ON "module" ("publish_time" ASC);

-- ----------------------------
-- Indexes structure for table module_abbreviated
-- ----------------------------
CREATE INDEX "main"."module_abbreviated_gmt_modified"
ON "module_abbreviated" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."module_abbreviated_name_version"
ON "module_abbreviated" ("name" ASC, "version" ASC);
CREATE INDEX "main"."module_abbreviated_publish_time"
ON "module_abbreviated" ("publish_time" ASC);

-- ----------------------------
-- Indexes structure for table module_deps
-- ----------------------------
CREATE INDEX "main"."module_deps_deps"
ON "module_deps" ("deps" ASC);
CREATE UNIQUE INDEX "main"."module_deps_name_deps"
ON "module_deps" ("name" ASC, "deps" ASC);

-- ----------------------------
-- Indexes structure for table module_keyword
-- ----------------------------
CREATE UNIQUE INDEX "main"."module_keyword_keyword_name"
ON "module_keyword" ("keyword" ASC, "name" ASC);
CREATE INDEX "main"."module_keyword_name"
ON "module_keyword" ("name" ASC);

-- ----------------------------
-- Indexes structure for table module_log
-- ----------------------------
CREATE INDEX "main"."module_log_name"
ON "module_log" ("name" ASC);

-- ----------------------------
-- Indexes structure for table module_maintainer
-- ----------------------------
CREATE INDEX "main"."module_maintainer_name"
ON "module_maintainer" ("name" ASC);
CREATE UNIQUE INDEX "main"."module_maintainer_user_name"
ON "module_maintainer" ("user" ASC, "name" ASC);

-- ----------------------------
-- Indexes structure for table module_star
-- ----------------------------
CREATE INDEX "main"."module_star_name"
ON "module_star" ("name" ASC);
CREATE UNIQUE INDEX "main"."module_star_user_name"
ON "module_star" ("user" ASC, "name" ASC);

-- ----------------------------
-- Indexes structure for table module_unpublished
-- ----------------------------
CREATE INDEX "main"."module_unpublished_gmt_modified"
ON "module_unpublished" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."module_unpublished_name"
ON "module_unpublished" ("name" ASC);

-- ----------------------------
-- Indexes structure for table npm_module_maintainer
-- ----------------------------
CREATE INDEX "main"."npm_module_maintainer_name"
ON "npm_module_maintainer" ("name" ASC);
CREATE UNIQUE INDEX "main"."npm_module_maintainer_user_name"
ON "npm_module_maintainer" ("user" ASC, "name" ASC);

-- ----------------------------
-- Indexes structure for table package_readme
-- ----------------------------
CREATE INDEX "main"."package_readme_gmt_modified"
ON "package_readme" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."package_readme_name"
ON "package_readme" ("name" ASC);

-- ----------------------------
-- Indexes structure for table sync_task
-- ----------------------------
CREATE UNIQUE INDEX "main"."sync_task_name_version"
ON "sync_task" ("name" ASC, "version" ASC);

-- ----------------------------
-- Indexes structure for table tag
-- ----------------------------
CREATE INDEX "main"."tag_gmt_modified"
ON "tag" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."tag_name_tag"
ON "tag" ("name" ASC, "tag" ASC);

-- ----------------------------
-- Indexes structure for table user
-- ----------------------------
CREATE INDEX "main"."user_gmt_modified"
ON "user" ("gmt_modified" ASC);
CREATE UNIQUE INDEX "main"."user_name"
ON "user" ("name" ASC);
