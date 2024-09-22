#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generateFiles(resourceName) {
  const files = [
    path.join('routes', resourceName, 'components', 'forms', `create-${resourceName}-form.tsx`),
    path.join('routes', resourceName, 'components', 'forms', `edit-${resourceName}-form.tsx`),
    path.join('routes', resourceName, 'components', 'forms', `${resourceName}-form.tsx`),
    path.join('routes', resourceName, 'components', 'forms', `${resourceName}.schema.tsx`),
    path.join('routes', resourceName, 'components', 'dialogs', `create-${resourceName}-dialog.tsx`),
    path.join('routes', resourceName, 'components', 'dialogs', `edit-${resourceName}-dialog.tsx`),
    path.join('routes', resourceName, 'components', 'tables', `${resourceName}-list-table.tsx`),
    path.join('routes', resourceName, 'components', 'tables', `use-${resourceName}-table-actions.tsx`),
    path.join('routes', resourceName, 'hooks', `use-${resourceName}-table-columns.tsx`),
    path.join('routes', resourceName, 'hooks', `use-${resourceName}-table-query.ts`),
    path.join('routes', resourceName, `${resourceName}-list.tsx`),
    path.join('lib', 'client', `${resourceName}.requests.ts`),
    path.join('hooks', 'api', `${resourceName}.hooks.ts`),
  ];

  const resourceDir = path.join(process.cwd(), 'apps', 'dashboard', 'src');

  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true });
    console.log(`Created directory: ${resourceDir}`);
  }

  files.forEach((file) => {
    const filePath = path.join(resourceDir, file);
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }

    const content = `// ${file}\n// Add your ${resourceName} ${file.split('.')[1]} logic here\n`;

    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: node generate-ui-resource.ts <resourceName>');
    process.exit(1);
  }

  const resourceName = args[0].toLowerCase();
  generateFiles(resourceName);
}

main();
