function Pricing(data) {
  var self = this;

  self.cost = ko.observable(data.cost);
  self.price = ko.observable(data.price);
  self.promoPrice = data.promo_price;
  self.savings = data.savings;
  self.onSale = data.on_sale;

  this.minPrice = ko.computed(function() {
    return self.cost() + 0.01
  });
}

function Item(data) {
  var self = this;

  self.id = data.id;
  self.title = ko.observable(data.title);
  self.pricing = new Pricing(data.pricing);
}

function CatalogViewModel() {
  var self = this;
  self.itemId = ko.observable("");
  self.matchingItems = ko.observableArray();

  self.searchMatching = function(formElement) {
    var itemId = formElement.itemId.value;
    $.getJSON("/catalog/items?id=" + itemId, function(data) {
      var mappedItems = $.map(data, function(item) { return new Item(item); });
      self.matchingItems(mappedItems);
    });
  };

  self.updateItem = function(formElement) {
    var data = {
      "id": Number(formElement.id.value),
      "title": formElement.title.value,
      "pricing": {
        "cost": Number(formElement.cost.value),
        "price": Number(formElement.price.value),
        "promo_price": Number(formElement.promoPrice.value),
        "savings": Number(formElement.savings.value),
        "on_sale": Number(formElement.onSale.value)
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
