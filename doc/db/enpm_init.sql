/*
Navicat SQLite Data Transfer

Source Server         : enpm
Source Server Version : 30808
Source Host           : :0

Target Server Type    : SQLite
Target Server Version : 30808
File Encoding         : 65001

Date: 2018-10-30 17:23:56
*/

PRAGMA foreign_keys = OFF;

-- ----------------------------
-- Table structure for db_history
-- ----------------------------
DROP TABLE IF EXISTS "main"."db_history";
CREATE TABLE "db_history" (
"id"  VARCHAR(32) NOT NULL,
"gmt_create"  DATETIME NOT NULL,
"sqlstr"  TEXT,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for downloads
-- ----------------------------
DROP TABLE IF EXISTS "main"."downloads";
CREATE TABLE "downloads" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"date"  INTEGER NOT NULL,
"d01"  BIGINT(20) NOT NULL DEFAULT 0,
"d02"  BIGINT(20) NOT NULL DEFAULT 0,
"d03"  BIGINT(20) NOT NULL DEFAULT 0,
"d04"  BIGINT(20) NOT NULL DEFAULT 0,
"d05"  BIGINT(20) NOT NULL DEFAULT 0,
"d06"  BIGINT(20) NOT NULL DEFAULT 0,
"d07"  BIGINT(20) NOT NULL DEFAULT 0,
"d08"  BIGINT(20) NOT NULL DEFAULT 0,
"d09"  BIGINT(20) NOT NULL DEFAULT 0,
"d10"  BIGINT(20) NOT NULL DEFAULT 0,
"d11"  BIGINT(20) NOT NULL DEFAULT 0,
"d12"  BIGINT(20) NOT NULL DEFAULT 0,
"d13"  BIGINT(20) NOT NULL DEFAULT 0,
"d14"  BIGINT(20) NOT NULL DEFAULT 0,
"d15"  BIGINT(20) NOT NULL DEFAULT 0,
"d16"  BIGINT(20) NOT NULL DEFAULT 0,
"d17"  BIGINT(20) NOT NULL DEFAULT 0,
"d18"  BIGINT(20) NOT NULL DEFAULT 0,
"d19"  BIGINT(20) NOT NULL DEFAULT 0,
"d20"  BIGINT(20) NOT NULL DEFAULT 0,
"d21"  BIGINT(20) NOT NULL DEFAULT 0,
"d22"  BIGINT(20) NOT NULL DEFAULT 0,
"d23"  BIGINT(20) NOT NULL DEFAULT 0,
"d24"  BIGINT(20) NOT NULL DEFAULT 0,
"d25"  BIGINT(20) NOT NULL DEFAULT 0,
"d26"  BIGINT(20) NOT NULL DEFAULT 0,
"d27"  BIGINT(20) NOT NULL DEFAULT 0,
"d28"  BIGINT(20) NOT NULL DEFAULT 0,
"d29"  BIGINT(20) NOT NULL DEFAULT 0,
"d30"  BIGINT(20) NOT NULL DEFAULT 0,
"d31"  BIGINT(20) NOT NULL DEFAULT 0,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS "main"."module";
CREATE TABLE "module" (
"id"  VARCHAR(32),
"author"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"version"  VARCHAR(30) NOT NULL,
"description"  TEXT,
"package"  TEXT,
"dist_shasum"  VARCHAR(100),
"dist_tarball"  VARCHAR(2048),
"dist_size"  INTEGER NOT NULL DEFAULT 0,
"publish_time"  BIGINT(20),
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_abbreviated
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_abbreviated";
CREATE TABLE "module_abbreviated" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"version"  VARCHAR(30) NOT NULL,
"package"  TEXT,
"publish_time"  BIGINT(20),
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_deps
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_deps";
CREATE TABLE "module_deps" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"deps"  VARCHAR(100),
"gmt_create"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_keyword
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_keyword";
CREATE TABLE "module_keyword" (
"id"  VARCHAR(32),
"keyword"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"description"  TEXT,
"gmt_create"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_log
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_log";
CREATE TABLE "module_log" (
"id"  VARCHAR(32),
"username"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"log"  TEXT,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_maintainer";
CREATE TABLE "module_maintainer" (
"id"  VARCHAR(32),
"user"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"gmt_create"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_star
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_star";
CREATE TABLE "module_star" (
"id"  VARCHAR(32),
"user"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"gmt_create"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for module_unpublished
-- ----------------------------
DROP TABLE IF EXISTS "main"."module_unpublished";
CREATE TABLE "module_unpublished" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"package"  TEXT,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for npm_module_maintainer
-- ----------------------------
DROP TABLE IF EXISTS "main"."npm_module_maintainer";
CREATE TABLE "npm_module_maintainer" (
"id"  VARCHAR(32),
"user"  VARCHAR(100) NOT NULL,
"name"  VARCHAR(100) NOT NULL,
"gmt_create"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for package_readme
-- ----------------------------
DROP TABLE IF EXISTS "main"."package_readme";
CREATE TABLE "package_readme" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"version"  VARCHAR(30) NOT NULL,
"readme"  TEXT,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "main"."sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);

-- ----------------------------
-- Table structure for sync_task
-- ----------------------------
DROP TABLE IF EXISTS "main"."sync_task";
CREATE TABLE "sync_task" (
"id"  VARCHAR(32) NOT NULL,
"taskId"  VARCHAR(32),
"name"  VARCHAR(32) NOT NULL,
"version"  VARCHAR(32) NOT NULL,
"sync_dev"  INTEGER,
"sync_type"  VARCHAR(8),
"description"  TEXT,
"state"  INTEGER,
"result"  VARCHAR(255),
"trace_id"  INTEGER,
"gmt_create"  DATETIME NOT NULL DEFAULT 0,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS "main"."tag";
CREATE TABLE "tag" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"tag"  VARCHAR(30) NOT NULL,
"version"  VARCHAR(30) NOT NULL,
"module_id"  BIGINT(20) NOT NULL,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

-- ----------------------------
-- Table structure for total
-- ----------------------------
DROP TABLE IF EXISTS "main"."total";
CREATE TABLE `total` (`name` VARCHAR(100) PRIMARY KEY, `module_delete` BIGINT(20) NOT NULL DEFAULT 0, `last_sync_time` BIGINT(20) NOT NULL DEFAULT 0, `last_exist_sync_time` BIGINT(20) NOT NULL DEFAULT 0, `sync_status` INTEGER NOT NULL DEFAULT 0, `need_sync_num` INTEGER NOT NULL DEFAULT 0, `success_sync_num` INTEGER NOT NULL DEFAULT 0, `fail_sync_num` INTEGER NOT NULL DEFAULT 0, `left_sync_num` INTEGER NOT NULL DEFAULT 0, `last_sync_module` VARCHAR(100), `gmt_modified` DATETIME NOT NULL);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "main"."user";
CREATE TABLE "user" (
"id"  VARCHAR(32),
"name"  VARCHAR(100) NOT NULL,
"salt"  VARCHAR(100) NOT NULL,
"password_sha"  VARCHAR(100) NOT NULL,
"ip"  VARCHAR(64) NOT NULL,
"roles"  VARCHAR(200) NOT NULL DEFAULT '[]',
"rev"  VARCHAR(40) NOT NULL,
"email"  VARCHAR(400) NOT NULL,
"json"  TEXT,
"npm_user"  TINYINT(1) NOT NULL DEFAULT 0,
"gmt_create"  DATETIME NOT NULL,
"gmt_modified"  DATETIME NOT NULL,
PRIMARY KEY ("id" ASC)
);

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
CREATE INDEX "main"."sync_task_taskId"
ON "sync_task" ("taskId" ASC);

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
