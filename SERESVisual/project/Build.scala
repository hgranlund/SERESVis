import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "SERESVisual_Web"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    javaCore,
    javaJdbc,
    javaEbean,
    "org.apache.jena" % "apache-jena-libs" % "2.10.1"

  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
      resolvers += "Jena repo" at "https://repository.apache.org/content/repositories/releases/"
         
    // Add your own project settings here      
  )

}
