# AngularModules
Some AngularJS modules, some in TypeScript

## ngEnter
Press the Enter key to call a function on an input field.

```html
<input type="text" ng-enter="doSomething()">
```

## bbCode
Evaluate bbCode. Include bbCodeParser.js for parsing. Not all tags are supported but the most used ones like ul, b, i, u, left, right, quote, youtube, code, img and url.

```javascript
$scope.textBBCode = "[b]bold[/b] [url=http://www.bbcode.org/]bbcode.org![/url]"
```
```html
<p bbcode ng-bind="textBBCode"></p>
```

## MessageCenter
Collect messages, warnings and info logs.

```javascript
var myApp = angular.module('crmApp', ['messagecenter']);
 
myApp.controller("mainController", ["$scope", "sharedMessageService",
    ($scope, sharedMessageService) =>
        new Application.Controllers.mainController($scope, sharedMessageService)]);
```
```javascript
export class mainController {
 
    constructor(private $scope:ImainControllerScope,
                private sharedMessageService:any)
    {
        sharedMessageService.broadcast("message: Foo.");
    }
}
```

```html
<script type="text/javascript" src="/web/js/messagecenter.js"></script>
<messagecenter></messagecenter>
```

## EditInPlace
Click on a label to change the model value it is displaying.

```javascript
app.directive("editInPlace", [() => new Application.Directives.EditInPlace()]);
```
```html
<edit-in-place value="model" property="propertyNameOfModel"></edit-in-place>
```

## FocusElement
Whenever the bound variable changes its value the input is selected.

```javascript
app.directive("setFocus", ["$parse", ($parse) => new Application.Directives.FocusElement($parse)]);```
```
```html
<input set-focus="editing" type="text">
```

## RefreshHTML
Directives are compiled by angular only once when viewing. This directives recompiles it if a variable changes to true ("use-boolean" switch) or a variable changes its value. 

```javascript
app.directive("refreshHtml", ["$compile", "$parse", ($compile, $parse) => new Application.Directives.RefreshHtml($compile, $parse)]);
```
```html
<div refresh-html="refresh" use-boolean>
    <edit-in-place value="model" property="propertyNameOfModel"></edit-in-place>
</div>
```

## StringToNumber
For some number inputs it's necessary to have a number for the model. If it is a string (for some reasons), the binding fails. This directive casts a string to a number.

```javascript
app.directive("stringToNumber", [() => new Application.Directives.StringToNumber()]);
```
```html
<input ng-model="controller.getOptionByName('user', 'NumberField_numberDetails').value" string-to-number type="number" class="form-control">
```
