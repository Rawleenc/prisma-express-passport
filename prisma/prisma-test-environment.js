const path = require('path');
const fs = require('fs');
const util = require('util');
const NodeEnvironment = require('jest-environment-node');
const exec = util.promisify(require('child_process').exec);

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

class PrismaTestEnvironment extends NodeEnvironment {
  dbName;
  dbPath;

  /**
   * @param {import("@jest/types/build/Config").ProjectConfig} config
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
    await exec(`${prismaBinary} db push --preview-feature`);
    await exec(`${prismaBinary} db seed --preview-feature`);
    return super.setup();
  }

  async teardown() {
    try {
      await fs.promises.unlink(this.dbPath);
    } catch (error) {
      // doesn't matter as the environment is torn down
    }
  }
}

module.exports = PrismaTestEnvironment;
