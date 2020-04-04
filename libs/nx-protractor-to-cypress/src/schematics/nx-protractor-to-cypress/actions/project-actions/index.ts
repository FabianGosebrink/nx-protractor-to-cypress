import { experimental } from '@angular-devkit/core';
import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { deleteProjectProtractorFiles } from './delete-projects-protractor-files';
import {
  createProjectsCypressFiles,
  copyAllCypressFiles
} from './create-projects-cypress-files';
import { addProjectTestingSectionToAngularJson } from './add-testing-section-to-angularjson';

export function getRulesForProjects(
  workspace: experimental.workspace.WorkspaceSchema
) {
  let projectRules: Rule[] = [];

  const allProjects = Object.keys(workspace.projects);

  for (const projectName of allProjects) {
    const currentProject = workspace.projects[projectName];

    if (!hasE2eSection(currentProject)) {
      continue;
    }

    projectRules.push(copyAllCypressFiles(currentProject));
    projectRules.push(deleteProjectProtractorFiles(workspace, projectName));
    projectRules.push(createProjectsCypressFiles(workspace, projectName));
    projectRules.push(
      addProjectTestingSectionToAngularJson(workspace, projectName)
    );
  }

  return projectRules;
}

export function hasE2eSection(
  project: experimental.workspace.WorkspaceProject
) {
  if (!project.architect) {
    throw new SchematicsException(`no 'architect' section found`);
  }

  return !!project.architect.e2e;
}
