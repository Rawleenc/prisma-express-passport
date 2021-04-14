const path = require('path');
const fs = require('fs');
const util = require('util');
const NodeEnvironment = require('jest-environment-node');
const exec = util.promisify(require('child_process').exec);
const { ProjectConfig } = require('@jest/types/build/Config');
class PrismaTestEnvironment extends NodeEnvironment {
  /**
   * @param {ProjectConfig} config
   */
  constructor(config) {
    super(config);

    // Generate a unique sqlite identifier for this test context
    this.dbName = `test_${Date.now()}.db`;
    process.env.DATABASE_URL = `file:${this.dbName}`;
    this.global.process.env.DATABASE_URL = `file:${this.dbName}`;
    this.dbPath = path.join(__dirname, this.dbName);
  }

  async setup() {
    // Run the migrations to ensure our schema has the required structure
    await exec('yarn migrate --name test');
    await exec('yarn seed');

    return super.setup();
  }

  async teardown() {
    await fs.promises.unlink(this.dbPath);
  }
}

module.exports = PrismaTestEnvironment;
