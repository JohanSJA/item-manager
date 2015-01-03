/*
 * The pricing class corresponding to the pricing table design.
 */
function Pricing(data) {
  var self = this;

  self.cost = ko.observable(data.cost);
  self.price = ko.observable(data.price);
  self.promoPrice = data.promo_price;
  self.savings = data.savings;
  self.onSale = data.on_sale;

  <!-- Minimum price can not be equal or lower than cost -->
  this.minPrice = ko.computed(function() {
    return self.cost() + 0.01
  });
}

/*
 * The item class corresponding to the database design.
 */
function Item(data) {
  var self = this;

  self.id = data.id;
  self.title = ko.observable(data.title);
  self.pricing = new Pricing(data.pricing);

  self.recentlyUpdated = ko.observable(false);
  // Update the item based on the form data passed in.
  self.update = function(formElement) {
    // Form a JSON object that match the API requirement.
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
    // Send the data to the API and update the ViewModel to show the message.
    $.ajax({
      url: "/catalog/items",
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json"
    }).done(function(data) {
      self.recentlyUpdated(true);
    });
  }
}

/*
 * The main ViewModel used by Knockout for this application.
 */
function CatalogViewModel() {
  var self = this;
  self.itemId = ko.observable("");
  self.matchingItems = ko.observableArray();

  self.itemId.subscribe(function(newValue) {
    var itemId = newValue;
    $.getJSON("/catalog/items?id=" + itemId, function(data) {
      var mappedItems = $.map(data, function(item) { return new Item(item); });
      self.matchingItems(mappedItems);
    });
  });
}

ko.applyBindings(new CatalogViewModel());
