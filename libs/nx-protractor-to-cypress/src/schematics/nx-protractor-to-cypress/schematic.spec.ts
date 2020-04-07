import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { NxProtractorToCypressSchematicSchema } from './schema';
import { NX_ANGULAR_APPLICATION_IDENTIFIER } from './utils/angular-utils';

const ANGULAR_JSON_BEFORE = {
  version: 1,
  projects: {
    myapp: {
      projectType: 'application',
      schematics: {},
      root: 'apps/myapp',
      sourceRoot: 'apps/myapp/src',
      prefix: 'protractor-to-cypress-test',
      architect: {
        build: {
          builder: '@angular-devkit/build-angular:browser',
          options: {
            outputPath: 'dist/apps/myapp',
            index: 'apps/myapp/src/index.html',
            main: 'apps/myapp/src/main.ts',
            polyfills: 'apps/myapp/src/polyfills.ts',
            tsConfig: 'apps/myapp/tsconfig.app.json',
            aot: true,
            assets: ['apps/myapp/src/favicon.ico', 'apps/myapp/src/assets'],
            styles: ['apps/myapp/src/styles.css'],
            scripts: []
          },
          configurations: {
            production: {
              fileReplacements: [
                {
                  replace: 'apps/myapp/src/environments/environment.ts',
                  with: 'apps/myapp/src/environments/environment.prod.ts'
                }
              ],
              optimization: true,
              outputHashing: 'all',
              sourceMap: false,
              extractCss: true,
              namedChunks: false,
              extractLicenses: true,
              vendorChunk: false,
              buildOptimizer: true,
              budgets: [
                {
                  type: 'initial',
                  maximumWarning: '2mb',
                  maximumError: '5mb'
                },
                {
                  type: 'anyComponentStyle',
                  maximumWarning: '6kb',
                  maximumError: '10kb'
                }
              ]
            }
          }
        },
        serve: {
          builder: '@angular-devkit/build-angular:dev-server',
          options: {
            browserTarget: 'myapp:build'
          },
          configurations: {
            production: {
              browserTarget: 'myapp:build:production'
            }
          }
        },
        'extract-i18n': {
          builder: '@angular-devkit/build-angular:extract-i18n',
          options: {
            browserTarget: 'myapp:build'
          }
        },
        lint: {
          builder: '@angular-devkit/build-angular:tslint',
          options: {
            tsConfig: [
              'apps/myapp/tsconfig.app.json',
              'apps/myapp/tsconfig.spec.json'
            ],
            exclude: ['**/node_modules/**', '!apps/myapp/**']
          }
        },
        test: {
          builder: '@nrwl/jest:jest',
          options: {
            jestConfig: 'apps/myapp/jest.config.js',
            tsConfig: 'apps/myapp/tsconfig.spec.json',
            passWithNoTests: true,
            setupFile: 'apps/myapp/src/test-setup.ts'
          }
        }
      }
    },
    'myapp-e2e': {
      root: 'apps/myapp-e2e',
      projectType: 'application',
      architect: {
        e2e: {
          builder: '@angular-devkit/build-angular:protractor',
          options: {
            protractorConfig: 'apps/myapp-e2e/protractor.conf.js',
            devServerTarget: 'myapp:serve'
          },
          configurations: {
            production: {
              devServerTarget: 'myapp:serve:production'
            }
          }
        },
        lint: {
          builder: '@angular-devkit/build-angular:tslint',
          options: {
            tsConfig: 'apps/myapp-e2e/tsconfig.e2e.json',
            exclude: ['**/node_modules/**', '!apps/myapp-e2e/**']
          }
        }
      }
    }
  },
  cli: {
    defaultCollection: '@nrwl/angular',
    analytics: false
  },
  schematics: {
    '@nrwl/angular:application': {
      unitTestRunner: 'jest',
      e2eTestRunner: 'protractor'
    },
    '@nrwl/angular:library': {
      unitTestRunner: 'jest'
    }
  },
  defaultProject: 'myapp'
};

const PACKAGE_JSON_BEFORE = {
  name: 'protractor-to-cypress-test',
  version: '0.0.0',
  license: 'MIT',
  scripts: {
    ng: 'ng',
    nx: 'nx',
    start: 'ng serve',
    build: 'ng build',
    test: 'ng test',
    lint: 'nx workspace-lint && ng lint',
    e2e: 'ng e2e',
    'affected:apps': 'nx affected:apps',
    'affected:libs': 'nx affected:libs',
    'affected:build': 'nx affected:build',
    'affected:e2e': 'nx affected:e2e',
    'affected:test': 'nx affected:test',
    'affected:lint': 'nx affected:lint',
    'affected:dep-graph': 'nx affected:dep-graph',
    affected: 'nx affected',
    format: 'nx format:write',
    'format:write': 'nx format:write',
    'format:check': 'nx format:check',
    update: 'ng update @nrwl/workspace',
    'workspace-schematic': 'nx workspace-schematic',
    'dep-graph': 'nx dep-graph',
    help: 'nx help',
    postinstall:
      'ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points'
  },
  private: true,
  dependencies: {
    '@angular/animations': '9.1.0',
    '@angular/common': '9.1.0',
    '@angular/compiler': '9.1.0',
    '@angular/core': '9.1.0',
    '@angular/forms': '9.1.0',
    '@angular/platform-browser': '9.1.0',
    '@angular/platform-browser-dynamic': '9.1.0',
    '@angular/router': '9.1.0',
    'core-js': '^2.5.4',
    rxjs: '~6.5.4',
    'zone.js': '^0.10.2'
  },
  devDependencies: {
    '@angular/cli': '9.1.0',
    '@nrwl/workspace': '9.2.1',
    '@types/node': '~8.9.4',
    dotenv: '6.2.0',
    'ts-node': '~7.0.0',
    tslint: '~6.0.0',
    eslint: '6.8.0',
    typescript: '~3.8.3',
    prettier: '1.19.1',
    '@angular/compiler-cli': '9.1.0',
    '@angular/language-service': '9.1.0',
    '@angular-devkit/build-angular': '0.901.0',
    codelyzer: '~5.0.1',
    'jest-preset-angular': '8.1.2',
    '@nrwl/jest': '9.2.1',
    jest: '25.2.3',
    '@types/jest': '25.1.4',
    'ts-jest': '25.2.1',
    protractor: '~5.4.0',
    'jasmine-core': '~2.99.1',
    'jasmine-spec-reporter': '~4.2.1',
    '@types/jasmine': '~2.8.6',
    '@types/jasminewd2': '~2.0.3'
  }
};

describe('nx-protractor-to-cypress schematic', () => {
  let appTree: Tree;
  const options: NxProtractorToCypressSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@offeringsolutions/nx-protractor-to-cypress',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
    //  appTree = Tree.empty();
    appTree.create(`angular.json`, JSON.stringify(ANGULAR_JSON_BEFORE));
    appTree.overwrite(`package.json`, JSON.stringify(PACKAGE_JSON_BEFORE));
    appTree.create(`karma.conf.js`, '');
    appTree.create(`/apps/myapp-e2e/tsconfig.e2e.json`, '');
    appTree.create(`/apps/myapp-e2e/tsconfig.json`, '');
    appTree.create(`/apps/myapp-e2e/protractor.conf.js`, '');
    appTree.create(`/apps/myapp-e2e/src/app.e2e-spec.ts`, '');
    appTree.create(`/apps/myapp-e2e/src/app.po.ts`, '');
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });

  describe('root actions', () => {
    it('modify the package.json', async () => {
      const expectedDependencies: { [key: string]: string } = {
        '@nrwl/cypress': '9.2.1',
        '@nrwl/workspace': '9.2.1',
        cypress: '4.3.0'
      };

      const dependenciesToRemove = ['protractor'];

      await testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise();

      expect(appTree.exists('package.json')).toBe(true);

      const jsonContent = appTree.read('package.json').toString();
      const jsonObj = JSON.parse(jsonContent);

      for (let dep in expectedDependencies) {
        expect(jsonObj.devDependencies[dep]).toBeDefined();
      }

      for (let rdep in dependenciesToRemove) {
        expect(jsonObj.devDependencies[rdep]).toBeUndefined();
      }
    });

    it('modify the angular.json', async () => {
      await testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise();

      expect(appTree.exists('angular.json')).toBe(true);

      const jsonContent = appTree.read('angular.json').toString();
      const jsonObj = JSON.parse(jsonContent);
      expect(
        jsonObj.schematics[NX_ANGULAR_APPLICATION_IDENTIFIER].e2eTestRunner
      ).toBe('cypress');
    });
  });

  describe('project actions', () => {
    it('adding testing section to angular.json', async () => {
      await testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise();

      expect(appTree.exists('angular.json')).toBe(true);

      const projectName = 'myapp-e2e';
      const projectRoot = `apps/${projectName}`;
      const parentProjectName = 'myapp';

      const expectedObject = {
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

      const jsonContent = appTree.read('angular.json').toString();
      const jsonObj = JSON.parse(jsonContent);

      const project = jsonObj.projects[projectName];

      expect(project.architect.e2e).toEqual(expectedObject);
    });

    describe('creates projects cypress files', () => {
      it('overwrites tsconfig e2e', async () => {
        await testRunner
          .runSchematicAsync('nxProtractorToCypress', options, appTree)
          .toPromise();

        const pathToCheck = '/apps/myapp-e2e/tsconfig.e2e.json';
        expect(appTree.exists(pathToCheck)).toBe(true);

        const expected = `{
            "extends": "./tsconfig.json",
            "compilerOptions": {
              "sourceMap": false,
              "outDir": "../../dist/out-tsc"
            },
            "include": ["src/**/*.ts", "src/**/*.js"]
          }

          `;

        const jsonContent = appTree.read(pathToCheck).toString();
        const jsonObj = JSON.parse(jsonContent);

        expect(jsonObj).toEqual(JSON.parse(expected));
      });

      it('overwrites tsconfig', async () => {
        await testRunner
          .runSchematicAsync('nxProtractorToCypress', options, appTree)
          .toPromise();

        const pathToCheck = '/apps/myapp-e2e/tsconfig.json';
        expect(appTree.exists(pathToCheck)).toBe(true);

        const expected = `{
          "extends": "../../tsconfig.json",
          "compilerOptions": {
            "types": ["cypress", "node"]
          },
          "include": ["**/*.ts", "**/*.js"]
        }
        `;

        const jsonContent = appTree.read(pathToCheck).toString();
        const jsonObj = JSON.parse(jsonContent);

        expect(jsonObj).toEqual(JSON.parse(expected));
      });

      it('sets correct app title in cypress file', async () => {
        await testRunner
          .runSchematicAsync('nxProtractorToCypress', options, appTree)
          .toPromise();

        const pathToCheck = '/apps/myapp-e2e/src/integration/app.spec.ts';
        expect(appTree.exists(pathToCheck)).toBe(true);

        const expectedLine = `getGreeting().contains('Welcome to myapp!');`;

        const content = appTree.read(pathToCheck).toString();
        expect(content).toContain(expectedLine);
      });
    });

    it('deleting protractor files', async () => {
      await testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise();

      const projectFilesToDelete = [
        `src/app.e2e-spec.ts`,
        `src/app.po.ts`,
        `protractor.conf.js`
      ];

      const projectName = 'myapp-e2e';
      const projectRoot = `apps/${projectName}`;

      for (const fileToDelete of projectFilesToDelete) {
        const fileNameAndPath = `${projectRoot}/${fileToDelete}`;
        expect(appTree.exists(fileNameAndPath)).toBe(false);
      }
    });
  });
});
