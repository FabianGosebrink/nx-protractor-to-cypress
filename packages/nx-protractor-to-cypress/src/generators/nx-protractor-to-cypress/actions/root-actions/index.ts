import { Rule } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { modifyDependenciesInPackageJson } from './modify-dependencies';
import { updateAngularJson } from './update-angularjson';

export function getRulesForWorkspaceRoot(workspace: WorkspaceSchema) {
  let rulesToApply: Rule[] = [];

  rulesToApply.push(updateAngularJson(workspace));
  rulesToApply.push(modifyDependenciesInPackageJson());

  return rulesToApply;
}
