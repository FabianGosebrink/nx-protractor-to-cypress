import { experimental } from '@angular-devkit/core';
import { Rule } from '@angular-devkit/schematics';
import { modifyDependenciesInPackageJson } from './modify-dependencies';
import { updateAngularJson } from './update-angularjson';

export function getRulesForWorkspaceRoot(
  workspace: experimental.workspace.WorkspaceSchema
) {
  let rulesToApply: Rule[] = [];

  rulesToApply.push(updateAngularJson(workspace));
  rulesToApply.push(modifyDependenciesInPackageJson());

  return rulesToApply;
}
