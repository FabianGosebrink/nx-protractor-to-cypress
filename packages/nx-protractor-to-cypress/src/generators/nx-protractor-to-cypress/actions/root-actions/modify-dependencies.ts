import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

const dependenciesToAdd: { [key: string]: string } = {
  '@nrwl/cypress': '11.4.0',
  cypress: '6.0.1',
};

const dependenciesToRemove = ['protractor'];

export function modifyDependenciesInPackageJson(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    deleteDependenciesFromPackageJson(tree);
    addDependenciesToPackageJson(tree);

    _context.addTask(new NodePackageInstallTask());

    return tree;
  };
}

function addDependenciesToPackageJson(tree: Tree): void {
  for (let pack in dependenciesToAdd) {
    const nodeDependency: NodeDependency = createNodeDependency(
      pack,
      dependenciesToAdd[pack]
    );

    addPackageJsonDependency(tree, nodeDependency);
  }
}

function createNodeDependency(
  packageName: string,
  version: string
): NodeDependency {
  return {
    type: NodeDependencyType.Dev,
    name: packageName,
    version: version,
    overwrite: true,
  };
}

function deleteDependenciesFromPackageJson(tree: Tree): void {
  dependenciesToRemove.forEach((toRemove) => {
    removePackageJsonDependency(tree, toRemove);
  });
}
