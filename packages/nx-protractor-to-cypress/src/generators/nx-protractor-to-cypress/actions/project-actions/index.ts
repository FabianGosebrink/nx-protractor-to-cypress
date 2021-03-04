import { Rule, SchematicsException } from '@angular-devkit/schematics';
import {
  WorkspaceProject,
  WorkspaceSchema,
} from '@schematics/angular/utility/workspace-models';
import { addProjectTestingSectionToAngularJson } from './add-testing-section-to-angularjson';
import {
  copyAllCypressFiles,
  createProjectsCypressFiles,
} from './create-projects-cypress-files';
import { deleteProjectProtractorFiles } from './delete-projects-protractor-files';

export function getRulesForProjects(workspace: WorkspaceSchema) {
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

export function hasE2eSection(project: WorkspaceProject) {
  if (!project.architect) {
    throw new SchematicsException(`no 'architect' section found`);
  }

  return !!project.architect.e2e;
}
