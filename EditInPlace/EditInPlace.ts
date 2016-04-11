/// <reference path="../../../../../web/js/typedefinitions/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../../../web/js/typedefinitions/angular.d.ts" />

module Application.Directives {
    // =============== Edit-In-Place Directive ===============

    interface InPlaceEditScope extends ng.IScope {
        editing: boolean;
        value: any;
        width: any;
        fieldwidth: any;
        property:string;
        localValue: any;
        edit(): void;
        endEdit(): void;
        valueChanged():boolean;
    }

    /**
     * Click on a element to replace its value with an input field.
     * Supports ngEnter.
     */
    export class EditInPlace implements ng.IDirective {
        restrict = 'E';
        template = '<span ng-click="edit()" ng-bind="localValue"></span>' +
            '<div class="edit">' +
            '<div style="max-width:{{fieldwidth}}px" class="input-group">' +
            '<input set-focus="editing" type="text" style="min-width:{{fieldwidth}}px;width:{{fieldwidth}}px;max-width:{{fieldwidth}}px" ng-enter="endEdit()" ng-blur="endEdit()" class="form-control input-sm" ng-model="localValue">' +
            '<div class="input-group-btn">' +
            '<button type="button" ng-click="endEdit()" class="btn btn-default btn-sm">ok</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        scope = {value: '=', property: '@', width: '@'};
        link = (scope:InPlaceEditScope, element:JQuery, attributes:ng.IAttributes, ngModel:ng.INgModelController) => {
            scope.localValue = scope.value[scope.property];
            scope.fieldwidth = scope.width||'100';
            element.addClass('edit-in-place');
            scope.editing = false;
            scope.edit = function () {
                scope.editing = true;
                element.addClass('active');
            };

            scope.valueChanged = function () {
                return scope.localValue != scope.value[scope.property];
            };

            scope.endEdit = function () {
                if (scope.localValue.length < 1) {
                    return;
                }
                if (scope.valueChanged) {
                    scope.value[scope.property] = scope.localValue;
                    scope.value.hasChanges = true;
                }

                scope.editing = false;
                element.removeClass('active');
            };
        };
    }

}

angular.module('editInPlace', [])
       .constant('MODULE_VERSION', '0.0.1')
       .directive("editInPlace", [() =>
            new Application.Directives.EditInPlace()]);