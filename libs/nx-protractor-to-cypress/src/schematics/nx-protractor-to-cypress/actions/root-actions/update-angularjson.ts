import { experimental } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  NX_ANGULAR_APPLICATION_IDENTIFIER,
  ANGULAR_JSON_FILENAME,
  REPLACER
} from '../../utils/angular-utils';

export function updateAngularJson(
  workspace: experimental.workspace.WorkspaceSchema
): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    updateSchematicTestRunner(workspace, _context);
    tree.overwrite(
      ANGULAR_JSON_FILENAME,
      JSON.stringify(workspace, null, REPLACER)
    );
    return tree;
  };
}

function updateSchematicTestRunner(
  workspace: experimental.workspace.WorkspaceSchema,
  _context: SchematicContext
) {
  if (!workspace.schematics) {
    _context.logger.error(`\tNo schematic section found`);
    return;
  }

  if (!workspace?.schematics[NX_ANGULAR_APPLICATION_IDENTIFIER]) {
    _context.logger.error(`\tNo application identifier section found`);
    return;
  }

  workspace.schematics[NX_ANGULAR_APPLICATION_IDENTIFIER].e2eTestRunner =
    'cypress';
}
