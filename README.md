# Alfresco AIO Project - SDK 3

This is an All-In-One (AIO) project for Alfresco SDK 3.0. 

Run with `mvn clean install -DskipTests=true alfresco:run` or `./run.sh` and verify that it 

 * Runs the embedded Tomcat + H2 DB 
 * Runs Alfresco Platform (Repository)
 * Runs Alfresco Solr4
 * Runs Alfresco Share
 * Packages both as JAR and AMP assembly for modules
 
# Few things to notice

 * No parent pom
 * No WAR projects, all handled by the Alfresco Maven Plugin 
 * No runner project - it's all in the Alfresco Maven Plugin
 * Standard JAR packaging and layout
 * Works seamlessly with Eclipse and IntelliJ IDEA
 * JRebel for hot reloading, JRebel maven plugin for generating rebel.xml, agent usage: `MAVEN_OPTS=-Xms256m -Xmx1G -agentpath:/home/martin/apps/jrebel/lib/libjrebel64.so`
 * AMP as an assembly
 * [Configurable Run mojo](https://github.com/Alfresco/alfresco-sdk/blob/sdk-3.0/plugins/alfresco-maven-plugin/src/main/java/org/alfresco/maven/plugin/RunMojo.java) in the `alfresco-maven-plugin`
 * No unit testing/functional tests just yet
 * Resources loaded from META-INF
 * Web Fragment (this includes a sample servlet configured via web fragment)
 
## Extend an existing Surf component

* `invitationlist-custom.js` -> _alfresco-share-jar/src/main/resources/META-INF/components/invite/invitationlist-custom.js_
* `alfresco-share-jar-example-widgets.xml` :point_down:
```xml
<extension>
    <modules>
        <module>
            <id>alfresco-share-jar - Example Aikau Widgets</id>
            <version>1.0</version>
            <auto-deploy>true</auto-deploy>
            <configurations>
                <config evaluator="string-compare" condition="WebFramework" replace="false">
                    <web-framework>
                        <dojo-pages>
                            <packages>
                                <package name="tutorials" location="resources/alfresco-share-jar/js/tutorials"/>
                            </packages>
                        </dojo-pages>
                    </web-framework>
                </config>
            </configurations>

            <customizations>
                <!-- Custom InviteList for adding Users -->
                <customization>
                    <targetPackageRoot>org.alfresco.components.invite</targetPackageRoot>
                    <sourcePackageRoot>org.alfresco.company.components.invite</sourcePackageRoot>
                </customization>
            </customizations>

        </module>
    </modules>
</extension>
```
located at _alfresco-share-jar/src/main/resources/alfresco/web-extension/site-data/extensions/alfresco-share-jar-example-widgets.xml_

* `invitationlist.get.html.ftl` :point_down:
```javascript
<@markup id="user-list-custom-js" target="js" action="after" scope="template">
<#-- JavaScript Dependencies -->
    <@script type="text/javascript" src="${url.context}/res/components/invite/invitationlist-custom.js" group="invite"/>
</@>
```

* `invitationlist.get.js` :point_down:

```javascript
// Find the default InvitationList widget and replace it with the custom widget
var invitationList = widgetUtils.findObject(model.widgets, "id", "InvitationList");

if (invitationList)
{
    invitationList.name =  "Alfresco.InvitationList.Custom";
}
```

located at _alfresco-share-jar/src/main/resources/alfresco/web-extension/site-webscripts/org/alfresco/company/components/invite_
