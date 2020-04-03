import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxProtractorToCypressSchematicSchema } from './schema';

describe('nx-protractor-to-cypress schematic', () => {
  let appTree: Tree;
  const options: NxProtractorToCypressSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@offeringsolutions/nx-protractor-to-cypress',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('nxProtractorToCypress', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
