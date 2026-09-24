const { build } = require('next');
const path = require('path');

const projectDir = process.cwd();

async function testBuild() {
  try {
    console.log('Starting test build...');
    const result = await build({
      dir: projectDir,
      dev: false,
      logLevel: 3,
      experimental: {
        inspect: false
      }
    });
    console.log('Build completed successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Build failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testBuild();
