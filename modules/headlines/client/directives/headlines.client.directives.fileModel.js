angular.module('fileModelDirective', [])

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel),
                    parsedFileSetter = parsedFile.assign;
            
                element.bind('change', function () {
                    scope.$apply(function () {
                        parsedFileSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

//var getter = $parse('created');
//var setter = getter.assign;