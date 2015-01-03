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

  self.updateItem = function(formElement) {
    var data = {
      "id": Number(formElement.id.value),
      "title": formElement.title.value,
      "pricing": {
        "cost": Number(formElement.cost.value),
        "price": Number(formElement.price.value),
        "promo_price": Number(formElement.promo_price.value),
        "savings": Number(formElement.savings.value),
        "on_sale": Number(formElement.on_sale.value)
      }
    };
    $.ajax({
      url: "/catalog/items",
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json"
    });
  }
}

ko.applyBindings(new CatalogViewModel());
