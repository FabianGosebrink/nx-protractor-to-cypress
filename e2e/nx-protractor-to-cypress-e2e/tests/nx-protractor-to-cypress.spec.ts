import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('nx-protractor-to-cypress e2e', () => {
  it('should create nx-protractor-to-cypress', async (done) => {
    const plugin = uniq('nx-protractor-to-cypress');
    ensureNxProject(
      '@offeringsolutions/nx-protractor-to-cypress',
      'dist/packages/nx-protractor-to-cypress'
    );
    await runNxCommandAsync(
      `generate @offeringsolutions/nx-protractor-to-cypress:nx-protractor-to-cypress ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('nx-protractor-to-cypress');
      ensureNxProject(
        '@offeringsolutions/nx-protractor-to-cypress',
        'dist/packages/nx-protractor-to-cypress'
      );
      await runNxCommandAsync(
        `generate @offeringsolutions/nx-protractor-to-cypress:nx-protractor-to-cypress ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('nx-protractor-to-cypress');
      ensureNxProject(
        '@offeringsolutions/nx-protractor-to-cypress',
        'dist/packages/nx-protractor-to-cypress'
      );
      await runNxCommandAsync(
        `generate @offeringsolutions/nx-protractor-to-cypress:nx-protractor-to-cypress ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});
