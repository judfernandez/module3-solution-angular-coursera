(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', foundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/");


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    var directive = new foundItemsDirectiveController();
    menu.searchTerm = '';
    menu.itemsList = [];

    menu.listOfMenuItems = function (searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems();

      promise.then(function (response) {
        if ((searchTerm !== null) && (searchTerm !== '')) {
          menu.itemsList = response.data.menu_items.filter(item => item.description.includes(searchTerm));
        } else {
          menu.itemsList = [];
        }
      })
        .catch(function (error) {
          menu.itemsList = [];
          console.log(error);
        })
    };

    menu.removeItem = function (itemIndex) {
      directive.removeItem(itemIndex, menu.itemsList);
    };

  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function () {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return response;
    };

  }

  function foundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: foundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true,
      transclude: true
    };

    return ddo;
  }

  function foundItemsDirectiveController() {
    var list = this;

    list.itemsInList = function () {
      for (var i = 0; i < list.items.length; i++) {
        var name = list.items[i].name;
        if (name.toLowerCase().indexOf("items") !== -1) {
          return true;
        }
      }

      return false;
    };

    list.removeItem = function (itemIndex, array) {
      array.splice(itemIndex, 1);
    }
  }

})();
