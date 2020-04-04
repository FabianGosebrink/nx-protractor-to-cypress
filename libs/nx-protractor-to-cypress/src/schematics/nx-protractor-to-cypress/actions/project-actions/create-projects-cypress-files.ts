import { experimental } from '@angular-devkit/core';
import {
  Rule,
  apply,
  SchematicContext,
  SchematicsException,
  Tree,
  move,
  MergeStrategy,
  mergeWith,
  url
} from '@angular-devkit/schematics';
import { normalize } from 'path';

export function copyAllCypressFiles(
  project: experimental.workspace.WorkspaceProject
) {
  return (tree: Tree, context: SchematicContext) => {
    const movePath = normalize(`${project.root}`);
    if (!tree.exists(movePath)) {
      context.logger.info(`${movePath} does not exist, skipping`);
    }

    const templateSource = apply(url('./files/'), [move(movePath)]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

export function createProjectsCypressFiles(
  workspace: experimental.workspace.WorkspaceSchema,
  projectName: string
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const project = workspace.projects[
      projectName
    ] as experimental.workspace.WorkspaceProject;

    if (!project.architect) {
      throw new SchematicsException(`Project ${projectName} not found`);
    }

    overWriteTsConfige2e(tree, _context, project);
    overWriteTsConfig(tree, _context, project);

    return tree;
  };
}

function overWriteTsConfige2e(
  tree: Tree,
  context: SchematicContext,
  project: experimental.workspace.WorkspaceProject
) {
  const path = `${project.root}/tsconfig.e2e.json`;
  if (!tree.exists(path)) {
    context.logger.info(`${path} does not exist, skipping`);
    return;
  }
  const folderDeepness = calculateTraverseUptoRootPath(project.root);
  tree.overwrite(
    path,
    `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "outDir": "${folderDeepness}dist/out-tsc"
  },
  "include": ["src/**/*.ts", "src/**/*.js"]
}

`
  );
}

function overWriteTsConfig(
  tree: Tree,
  context: SchematicContext,
  project: experimental.workspace.WorkspaceProject
) {
  const path = `${project.root}/tsconfig.json`;
  if (!tree.exists(path)) {
    context.logger.info(`${path} does not exist, skipping`);
    return;
  }
  const folderDeepness = calculateTraverseUptoRootPath(project.root);
  tree.overwrite(
    path,
    `{
  "extends": "${folderDeepness}tsconfig.json",
  "compilerOptions": {
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts", "**/*.js"]
}

`
  );
}

function calculateTraverseUptoRootPath(projectRoot: string) {
  let toReturn = '../';
  const folderDeepness = projectRoot.split('/').length - 1;

  for (let index = 0; index < folderDeepness; index++) {
    toReturn += '../';
  }

  return toReturn;
}
