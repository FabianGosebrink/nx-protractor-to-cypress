# Nx Protractor To Cypress Schematic for Angular Projects

![commandline usage](.github/ng-cmd.png 'Commandline usage')

## Usage

```
ng add @offeringsolutions/nx-protractor-to-cypress
```

## Description

This schematic will migrate your Nx Workspace from using Protractor to use Cypress. It will scan the workspace, find all projects and update them all including the workspace itself.

## Actions

This schematic will

- Create Cypress files inside your project-e2e folders
- Delete protractor files
- Update all used sections in the `angular.json` file
- Update the e2e test runner in the `angular.json` file from `protractor` to `cypress`
- Modify `package.json` (removing Protractor deps, adding Cypress deps) and install them
