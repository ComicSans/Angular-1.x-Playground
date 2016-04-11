/// <reference path="../../../../../web/js/typedefinitions/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../../../web/js/typedefinitions/angular.d.ts" />

module Application.Directives {
    export class StringToNumber implements ng.IDirective {
        require = 'ngModel';
        link = (scope:ng.IScope, element:JQuery, attributes:ng.IAttributes, ngModel:ng.INgModelController) => {
            ngModel.$parsers.push(function (value) {
                return '' + value;
            });
            ngModel.$formatters.push(function (value) {
                return parseFloat(value);
            });
        };
    }
}

angular.module('stringToNumber', [])
       .constant('MODULE_VERSION', '0.0.1')
       .directive("stringToNumber", [() =>
           new Application.Directives.StringToNumber()]);
