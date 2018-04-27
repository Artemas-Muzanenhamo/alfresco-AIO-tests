/**
 * CustomGroupsList component.
 *
 * @namespace Alfresco
 * @class Alfresco.Custom.GroupsList
 */
(function()
{
    /**
     * YUI Library aliases
     */
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Element = YAHOO.util.Element;

    /**
     * Alfresco Slingshot aliases
     */
    var $html = Alfresco.util.encodeHTML;

    /**
     * CustomGroupsList constructor.
     *
     * @param {String} htmlId The HTML id of the parent element
     * @return {Alfresco.GroupsList.Custom} The new CustomGroupsList instance
     * @constructor
     */
    Alfresco.GroupsList.Custom = function GroupsListCustom_constructor(htmlId)
    {
        Alfresco.GroupsList.Custom.superclass.constructor.call(this, htmlId);
        return this;
    };

    YAHOO.lang.extend(Alfresco.GroupsList.Custom, Alfresco.GroupsList,
        {
            /**
             * Setup YUI DataTable widget
             *
             * @method _setupDataTable
             * @private
             */
            _setupDataTable: function GroupsList_setupDataTable()
            {
                /**
                 * DataTable Cell Renderers
                 *
                 * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
                 * These MUST be inline in order to have access to the Alfresco.GroupsList class (via the "me" variable).
                 */
                var me = this;

                /**
                 * Description/detail custom datacell formatter
                 *
                 * @method renderCellDescription
                 * @param elCell {object}
                 * @param oRecord {object}
                 * @param oColumn {object}
                 * @param oData {object|string}
                 */
                var renderCellDescription = function GroupsList_renderCellDescription(elCell, oRecord, oColumn, oData)
                {
                    // we currently render all results the same way
                    var itemName = oRecord.getData("itemName"),
                        displayName = oRecord.getData("displayName");

                    elCell.innerHTML = '<h3 class="itemname">' + $html(displayName) + ' <span class="lighter theme-color-1">(' + $html(itemName) + ')</span></h3>';
                };

                /**
                 * Role selector datacell formatter
                 *
                 * @method renderCellRole
                 * @param elCell {object}
                 * @param oRecord {object}
                 * @param oColumn {object}
                 * @param oData {object|string}
                 */
                var renderCellRole = function GroupsList_renderCellActions(elCell, oRecord, oColumn, oData)
                {
                    Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");
                    Dom.setStyle(elCell, "overflow", "visible");

                    // cell where to add the element
                    var cell = new Element(elCell),
                        id = oRecord.getData('id'),
                        buttonId = me.id + '-roleselector-' + id;

                    // create a clone of the template
                    var actionsColumnTemplate = Dom.get(me.id + '-role-column-template'),
                        templateInstance = actionsColumnTemplate.cloneNode(true);
                    templateInstance.setAttribute("id", "actionsDiv" + id);
                    Dom.setStyle(templateInstance, "display", "");

                    // define the role dropdown menu and the event listeners
                    var rolesMenu = [], role;
                    for (var i = 0, j = me.options.roles.length; i < j; i++)
                    {
                        if (me.options.roles[i] === 'SiteCollaborator' || me.options.roles[i] === 'SiteConsumer') {
                            role = me.options.roles[i];
                            rolesMenu.push(
                                {
                                    text: me.msg("role." + role),
                                    value: role,
                                    onclick:
                                        {
                                            fn: me.onRoleSelect,
                                            obj:
                                                {
                                                    record: oRecord,
                                                    role: role
                                                },
                                            scope: me
                                        }
                                });
                        }
                    }

                    // Insert the templateInstance to the column.
                    cell.appendChild (templateInstance);

                    // Create a yui button for the role selector.
                    var fButton = Dom.getElementsByClassName("role-selector-button", "button", templateInstance);
                    var button = new YAHOO.widget.Button(fButton[0],
                        {
                            type: "menu",
                            name: buttonId,
                            label: me.getRoleLabel(oRecord) + " " + Alfresco.constants.MENU_ARROW_SYMBOL,
                            menu: rolesMenu
                        });
                    me.listWidgets[id] =
                        {
                            button: button
                        };
                };

                /**
                 * Remove item datacell formatter
                 *
                 * @method renderCellRemoveButton
                 * @param elCell {object}
                 * @param oRecord {object}
                 * @param oColumn {object}
                 * @param oData {object|string}
                 */
                var renderCellRemoveButton = function GroupsList_renderCellRemoveButton(elCell, oRecord, oColumn, oData)
                {
                    Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

                    var desc =
                        '<span id="' + me.id + '-removeItem">' +
                        '  <a href="#" class="remove-item-button"><span class="removeIcon">&nbsp;</span></a>' +
                        '</span>';
                    elCell.innerHTML = desc;
                };

                // DataTable column defintions
                var columnDefinitions =
                    [
                        { key: "item", label: "Item", sortable: false, formatter: renderCellDescription },
                        { key: "role", label: "Role", sortable: false, formatter: renderCellRole, width: 140 },
                        { key: "remove", label: "Remove", sortable: false, formatter: renderCellRemoveButton, width: 30 }
                    ];

                // DataTable definition
                this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-inviteelist", columnDefinitions, this.widgets.dataSource,
                    {
                        MSG_EMPTY: this.msg("groupslist.empty-list")
                    });
            }
        });
})();
