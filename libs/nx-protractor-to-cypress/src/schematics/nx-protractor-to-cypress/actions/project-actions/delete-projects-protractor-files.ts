import { experimental } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { safeFileDelete } from '../../utils/angular-utils';

export function deleteProjectProtractorFiles(
  workspace: experimental.workspace.WorkspaceSchema,
  projectName: string
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const projectFilesToDelete = [
      `src/app.e2e-spec.ts`,
      `src/app.po.ts`,
      `protractor.conf.js`
    ];

    const project = workspace.projects[
      projectName
    ] as experimental.workspace.WorkspaceProject;

    if (!project.architect) {
      throw new SchematicsException(`Project ${projectName} not found`);
    }
    projectFilesToDelete.forEach(file => {
      const fileNameAndPath = `${project.root}/${file}`;
      if (tree.exists(fileNameAndPath)) {
        safeFileDelete(tree, fileNameAndPath);
      }
    });

    return tree;
  };
}
