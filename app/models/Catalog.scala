package models

case class Pricing(
  cost: Double,
  price: Double,
  promo_price: Double,
  savings: Double,
  on_sale: Int)

case class Item(
  id: Int,
  title: String,
  pricing: Pricing)

object CatalogFormats {
  import play.api.libs.json.Json
  import play.api.data._
  import play.api.data.Forms._

  // Generate Writes and Reads based on Json Macros
  implicit val pricingFormat = Json.format[Pricing]
  implicit val itemFormat = Json.format[Item]
}
