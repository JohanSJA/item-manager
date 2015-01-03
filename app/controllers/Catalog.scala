package controllers

import play.api._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import scala.concurrent.Future

// ReactiveMongo imports
import reactivemongo.api._

// ReactiveMongo plugin, including the JSON-specialized collection
import play.modules.reactivemongo.MongoController
import play.modules.reactivemongo.json.collection.JSONCollection

object Catalog extends Controller with MongoController {
  /*
   * Get a JSONCollection (a Collection implementation that is designed to work
   * with JsObject, Reads and Writes.)
   */
  def collection = db.collection[JSONCollection]("catalog")

  // Using case classes + Json Writes and Reads
  import play.api.data.Form
  import models._
  import models.CatalogFormats._

  def allItems() = Action.async {
    val cursor: Cursor[Item] = collection.find(Json.obj()).cursor[Item]
    val futureItemList = cursor.collect[List]()
    futureItemList.map { items =>
      Ok(Json.toJson(items))
    }
  }
}
