// external module to run form builder app
var formBuilderApp = angular.module("extranetFormBuilder", ["ui.bootstrap", "ui.select", "ngFormBuilder"])
                  .controller('saveFormBuilderJson', ['$scope', '$rootScope',
                      function ($scope, $rootScope) {
                          $scope.save = function () {
                              return JSON.stringify($rootScope.form)
                          }
                      }
                  ])


window.extranetFormBuilder = { 

  renderFormBuilder: function(form) {
    formBuilderApp.run(["$rootScope",
                     function($rootScope) {
                        $rootScope.builder = false;
                        $rootScope.form = form;
                        $rootScope.builder = true;
                        $rootScope.$on('$locationChangeStart', function (event, nextLocation, currentLocation) {
                            $rootScope.form = form;
                        });
                      }
     ]);
     angular.element(function() {
      angular.bootstrap(document, ['extranetFormBuilder']);
    });
  },

  getDataToSubmit: function(form) {
    var returnedForm;
    var scope = angular.element(document.getElementById('container')).scope();
    scope.$apply(function(){
      returnedForm = scope.save();
    })
    return returnedForm;
  },

}