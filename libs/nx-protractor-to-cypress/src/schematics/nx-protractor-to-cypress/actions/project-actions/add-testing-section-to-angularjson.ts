import { experimental } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import {
  ANGULAR_JSON_FILENAME,
  REPLACER,
  getParentProjectName
} from '../../utils/angular-utils';

export function addProjectTestingSectionToAngularJson(
  workspace: experimental.workspace.WorkspaceSchema,
  projectName: string
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    updateProjectsTestSection(tree, _context, workspace, projectName);

    return tree;
  };
}

function updateProjectsTestSection(
  tree: Tree,
  _context: SchematicContext,
  workspace: experimental.workspace.WorkspaceSchema,
  projectName: string
) {
  const project = workspace.projects[
    projectName
  ] as experimental.workspace.WorkspaceProject;

  if (!project.architect) {
    throw new SchematicsException(`Project ${projectName} not found`);
  }

  project.architect.e2e = getCypressTestingObject(project.root, projectName);

  tree.overwrite(
    ANGULAR_JSON_FILENAME,
    JSON.stringify(workspace, null, REPLACER)
  );
}

function getCypressTestingObject(projectRoot: string, projectName: string) {
  const parentProjectName = getParentProjectName(projectName);

  return {
    builder: '@nrwl/cypress:cypress',
    options: {
      cypressConfig: `${projectRoot}/cypress.json`,
      tsConfig: `${projectRoot}/tsconfig.e2e.json`,
      devServerTarget: `${parentProjectName}:serve`
    },
    configurations: {
      production: {
        devServerTarget: `${parentProjectName}:serve:production`
      }
    }
  };
}
