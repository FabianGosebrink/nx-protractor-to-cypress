import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  WorkspaceProject,
  WorkspaceSchema,
} from '@schematics/angular/utility/workspace-models';
import { normalize } from 'path';
import { getParentProjectName } from '../../utils/angular-utils';

export function copyAllCypressFiles(project: WorkspaceProject) {
  return (tree: Tree, context: SchematicContext) => {
    const path = `${project.root}/cypress.json`;
    if (tree.exists(path)) {
      context.logger.info(`${path} does exist, skipping copying files`);
      return;
    }

    const movePath = normalize(`${project.root}`);
    const templateSource = apply(url('./files/'), [move(movePath)]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

export function createProjectsCypressFiles(
  workspace: WorkspaceSchema,
  projectName: string
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const project = workspace.projects[projectName] as WorkspaceProject;

    if (!project.architect) {
      throw new SchematicsException(`Project ${projectName} not found`);
    }

    overWriteTsConfige2e(tree, _context, project);
    overWriteTsConfig(tree, _context, project);
    setAppTitleInFirstCypressTest(tree, _context, project, projectName);

    return tree;
  };
}

function overWriteTsConfige2e(
  tree: Tree,
  context: SchematicContext,
  project: WorkspaceProject
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
    "outDir": "${folderDeepness}dist/out-tsc",
    "allowJs": true,
    "types": ["cypress", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.js"]
}
`
  );
}

function overWriteTsConfig(
  tree: Tree,
  context: SchematicContext,
  project: WorkspaceProject
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
  "extends": "${folderDeepness}tsconfig.base.json",
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./tsconfig.e2e.json"
    }
  ]
}
`
  );
}

function setAppTitleInFirstCypressTest(
  tree: Tree,
  context: SchematicContext,
  project: WorkspaceProject,
  projectName: string
) {
  const parentProjectName = getParentProjectName(projectName);
  const path = `${project.root}/src/integration/app.spec.ts`;

  if (!tree.exists(path)) {
    context.logger.info(`${path} does not exist, skipping`);
    return;
  }

  const stringToWrite = `import { getGreeting } from '../support/app.po';

describe('${parentProjectName}', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Custom command example, see '../support/commands.ts' file
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see '../support/app.po.ts' file
    getGreeting().contains('Welcome to ${parentProjectName}!');
  });
});
`;

  tree.overwrite(path, stringToWrite);
}

function calculateTraverseUptoRootPath(projectRoot: string) {
  let toReturn = '../';
  const folderDeepness = projectRoot.split('/').length - 1;

  for (let index = 0; index < folderDeepness; index++) {
    toReturn += '../';
  }

  return toReturn;
}
