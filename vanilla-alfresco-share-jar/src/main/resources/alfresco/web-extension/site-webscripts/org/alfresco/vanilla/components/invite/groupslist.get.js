// Find the default DocumentList widget and replace it with the custom widget
var groupsList = widgetUtils.findObject(model.widgets, "id", "GroupsList");

if (groupsList)
{
    groupsList.name =  "Alfresco.GroupsList.Custom";
}