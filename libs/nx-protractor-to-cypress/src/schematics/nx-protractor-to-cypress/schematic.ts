import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NxProtractorToCypressSchematicSchema } from './schema';
import { runNxProtractorToCypress } from './actions';

export default function(options: NxProtractorToCypressSchematicSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return runNxProtractorToCypress(host, context);
  };
}
