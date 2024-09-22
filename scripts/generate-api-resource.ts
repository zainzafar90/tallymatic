#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function generateFiles(resourceName) {
  const files = [
    'index.ts',
    `${resourceName}.controller.ts`,
    `${resourceName}.interfaces.ts`,
    `${resourceName}.model.ts`,
    `${resourceName}.route.ts`,
    `${resourceName}.service.ts`,
    `${resourceName}.validation.ts`,
  ];

  const baseDir = path.join(process.cwd(), 'apps', 'api', 'src', 'modules');
  const resourceDir = path.join(baseDir, resourceName);

  if (!fs.existsSync(baseDir)) {
    console.error('Error: The directory apps/api/src/modules does not exist.');
    process.exit(1);
  }

  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true });
    console.log(`Created directory: ${resourceDir}`);
  }

  files.forEach((file) => {
    const filePath = path.join(resourceDir, file);
    const content = `// ${file}\n// Add your ${resourceName} ${file.split('.')[1]} logic here\n`;

    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: node generate-resource.js <resourceName>');
    process.exit(1);
  }

  const resourceName = args[0].toLowerCase();
  generateFiles(resourceName);
}

main();
