import { chain, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getAngularWorkspace } from '../utils/angular-utils';
import { getRulesForProjects } from './project-actions';
import { getRulesForWorkspaceRoot } from './root-actions';

export function runNxProtractorToCypress(
  host: Tree,
  context: SchematicContext
) {
  const workspace = getAngularWorkspace(host);

  const projectAndLibActions = getRulesForProjects(workspace);
  const workspaceActions = getRulesForWorkspaceRoot(workspace);
  const rulesToApply = [...projectAndLibActions, ...workspaceActions];

  return chain(rulesToApply);
}
