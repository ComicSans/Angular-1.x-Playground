/// <reference path="../typedefinitions/angular.d.ts" />

module Application.Directives {
    // =============== Set-Focus Directive ===============

    interface FocusScope extends ng.IScope {
    }
    interface FocusAttributes extends ng.IAttributes {
        setFocus:any;
    }

    export class FocusElement implements ng.IDirective {
        static $parse;

        constructor(private $parse:ng.IParseService) {
            FocusElement.$parse = $parse;
        }

        link = (scope:FocusScope, element:JQuery, attributes:FocusAttributes, ngModel:ng.INgModelController) => {
            var model = FocusElement.$parse(attributes.setFocus);
            scope.$watch(model, function (value, previous) {
                if (value === true && !previous) {
                    element[0].focus();
                    element.select();
                } else if (value === false && !previous) {
                    element[0].focus();
                    element.select();
                }
            });
        }
    }
}

angular.module('focusElement', [])
       .constant('MODULE_VERSION', '0.0.1')
       .directive("setFocus", ["$parse", ($parse) =>
           new Application.Directives.FocusElement($parse)]);
