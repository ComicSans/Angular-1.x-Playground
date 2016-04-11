/// <reference path="../../../../../web/js/typedefinitions/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../../../web/js/typedefinitions/angular.d.ts" />

module Application.Directives {
    // =============== Refresh-HTML Directive ===============

    interface RefreshHtmlScope extends ng.IScope {
        $compile:ng.ICompileService
        $parse: ng.IParseService;
    }
    interface RefreshHtmlAttributes extends ng.IAttributes {
        refreshHtml: string;
    }

    /**
     * Refreshes a directive at runtime.
     */
    export class RefreshHtml implements ng.IDirective {

        static $compile;
        static $parse;

        constructor(private $compile:ng.ICompileService,
                    private $parse:ng.IParseService) {
            RefreshHtml.$compile = $compile;
            RefreshHtml.$parse = $parse;
        }

        scope = true;
        compile = (el:JQuery) => {
            var template = angular.element('<a></a>').append(el.clone()).html();

            return function link(scope:RefreshHtmlScope, el:JQuery, attrs:RefreshHtmlAttributes) {
                var stopWatching = scope.$parent.$watch(attrs.refreshHtml, function (_new, _old) {
                    var useBoolean = attrs.hasOwnProperty('useBoolean');
                    if (
                        (useBoolean && (!_new || _new === 'false'))
                        ||
                        (!useBoolean && (!_new || _new === _old))
                    ) {
                        return;
                    }
                    if (useBoolean) {
                        RefreshHtml.$parse(attrs.refreshHtml).assign(scope.$parent, false);
                    }
                    var newEl = RefreshHtml.$compile(template)(scope.$parent);
                    el.replaceWith(newEl);
                    stopWatching();
                    scope.$destroy();
                });
            };
        }
    }
}

angular.module('refreshHtml', [])
       .constant('MODULE_VERSION', '0.0.1')
       .directive("refreshHtml", ["$compile", "$parse", ($compile, $parse) =>
           new Application.Directives.RefreshHtml($compile, $parse)]);