function CatalogViewModel() {
  var self = this;
  self.itemId = ko.observable("");
  self.matchingProducts = ko.observableArray();

  self.searchMatching = function(formElement) {
    var itemId = formElement.itemId.value;
    $.getJSON("/catalog/items?id=" + itemId, function(data) {
      self.matchingProducts(data);
    });
  };
}

ko.applyBindings(new CatalogViewModel());
