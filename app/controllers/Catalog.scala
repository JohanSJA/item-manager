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

  /*
   * The main purpose of this is to serve up an HTML page that will be used to
   * host all the required Javascripts and so on for user interaction.
   */
  def index() = Action {
    Ok(views.html.catalog())
  }

  /*****************
   * The JSON APIs *
   *****************/

  /*
   * List all available items if given id 0.
   * List a particular item if ID is given.
   * Note: Partial matching is currently not working as expected.
   */
  def allItems(id: Int) = Action.async {
    val cursor: Cursor[Item] =
      if (id == 0) collection.find(Json.obj()).cursor[Item]
      else collection.find(Json.obj("id" -> id)).cursor[Item]
    val futureItemList = cursor.collect[List]()
    futureItemList.map { items =>
      Ok(Json.toJson(items))
    }
  }

  /*
   * Passed a JSON document from client. Update the corresponding document from
   * database.
   */
  def updateItem() = Action.async(parse.json) { request =>
    request.body.validate[Item].fold(
      errors => {
        Future.successful(BadRequest(JsError.toFlatJson(errors)))
      },
      item => {
        val modifier = Json.obj("$set" -> item)
        collection.update(Json.obj("id" -> item.id), modifier).map { lastError =>
          if (!lastError.updatedExisting) BadRequest("No item is updated.")
          else Ok("OK....")
        }
      }
    )
  }
}
