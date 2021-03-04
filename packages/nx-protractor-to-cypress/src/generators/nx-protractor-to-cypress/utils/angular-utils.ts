import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

export const ANGULAR_JSON_FILENAME = 'angular.json';
export const NX_ANGULAR_APPLICATION_IDENTIFIER = '@nrwl/angular:application';

export const REPLACER = '  ';

export function safeFileDelete(tree: Tree, path: string): boolean {
  if (tree.exists(path)) {
    tree.delete(path);
    return true;
  } else {
    return false;
  }
}

export function getAngularWorkspace(tree: Tree): WorkspaceSchema {
  const workspaceConfig = tree.read(ANGULAR_JSON_FILENAME);

  if (!workspaceConfig) {
    throw new SchematicsException(
      'Could not find Angular workspace configuration'
    );
  }

  const workspaceContent = workspaceConfig.toString();
  const workspace = JSON.parse(workspaceContent);

  return workspace;
}

export function getParentProjectName(projectName: string) {
  return projectName.split('-e2e')[0];
}
