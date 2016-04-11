/// <reference path="../../../../../web/js/typedefinitions/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../../../web/js/typedefinitions/angular.d.ts" />

module Application.Directives {
    // =============== MessageCenter Directive ===============

    interface MessagecenterScope extends ng.IScope {
        $timeout:ng.ITimeoutService;
        alerts: Array<Object>;
        mode: string;
        template: string;
        hasAlerts(type:string);
        addAlert(message:string, type?:string);
        clearAlerts();
    }



    /**
     * Centralized message handling
     */
    export class MessageCenter implements ng.IDirective {
        static $timeout;
        static sharedMessageService;

        constructor(private $timeout:ng.ITimeoutService, sharedMessageService) {
            MessageCenter.$timeout = $timeout;
            MessageCenter.sharedMessageService = sharedMessageService;
        }

        restrict = 'E';
        template = '<ng-include src="template"/>';
        scope ={ mode:'@' };
        link = (scope:MessagecenterScope) => {
            scope.mode = scope.mode || 'list';
            scope.template = '/web/js/angular/vema/vema-messagecenter/'+scope.mode+'.html';
            scope.alerts = [];

            scope.$on('event:error-serverError', function(event, args) {
                scope.addAlert(args, "error");
            });

            scope.$on('sharedMessageServiceBroadcast', function() {
                scope.addAlert(MessageCenter.sharedMessageService.message);
            });

            scope.hasAlerts = function(type:string) {
                var alerts = $.grep(scope.alerts, function(e:any){ return e.type == type; });
                return alerts.length > 0;
            };

            scope.addAlert = function(message:string, type?:string) {
                type = type||"info";
                scope.alerts.push({message: message, type: type});
                MessageCenter.$timeout(function() {scope.clearAlerts()}, 15000);
            };

            scope.clearAlerts = function() {
                scope.alerts = [];
            };
        };
    }

}

angular.module('messagecenter', [])
    .constant('MODULE_VERSION', '0.0.1')
    .directive("messagecenter", ["$timeout", "sharedMessageService", ($timeout, sharedMessageService) =>
        new Application.Directives.MessageCenter($timeout, sharedMessageService)])
    .factory('sharedMessageService', ["$rootScope", ($rootScope) => {
        var sharedService:any = {};

        sharedService.message = '';

        sharedService.broadcast = function(msg) {
            this.message = msg;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function() {
            $rootScope.$broadcast('sharedMessageServiceBroadcast');
        };

        return sharedService;
    }]);