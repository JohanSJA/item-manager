import org.specs2.mutable._
import org.specs2.runner._
import org.specs2.matcher._
import org.junit.runner._

import play.api.test._
import play.api.test.Helpers._

/**
* Add your spec here.
* You can mock out a whole application including requests, plugins etc.
* For more information, consult the wiki.
*/
@RunWith(classOf[JUnitRunner])
class CatalogSpec extends Specification with JsonMatchers {

  "Catalog" should {

    "render the index page" in new WithApplication{
      val home = route(FakeRequest(GET, "/catalog")).get

      status(home) must equalTo(OK)
      contentType(home) must beSome.which(_ == "text/html")
      contentAsString(home) must contain ("Catalog")
    }

    "gives the entire list of items when item id is not specified" in new WithApplication {
      val items = route(FakeRequest(GET, "/catalog/items")).get

      status(items) must be equalTo(OK)
      contentType(items) must beSome.which(_ == "application/json")
      contentAsString(items) must /#(149) / ("id" -> 9800)
    }
  }
}
