import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName         = "SERESVisual_Web"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    javaCore,
    javaJdbc,
    javaEbean
    //"jena.apache.org" % "jena" % "2.10.1" % "test"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
    resolvers += "apache-jena-2.10.1.zip" at "http://www.apache.org/dist/jena/binaries/"
  )

}
