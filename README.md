jQuery Modify on the Fly plugin
===
Edit list of entities on single page.

Plugin allows to add new entities to a list, edit and remove existing objects. It works with tables, lists and other structures.

You can find a simple example <a href="http://petr-devaikin.github.io/mof">here</a>.

Quickstart
===

Create a table and add some attributes and classes:
```html
<button id="createButton">Add new Entity</button>

<table mof-create-button-id="createButton" mof-get-new-entity-url="get_new_entity_form_url">
    <tr class="mofEntity" mof-edit-url="get_edit_entity_1_form_url" mof-delete-url="delete_entity_1_url">
        <td>Entity 1</td>
        <td>
            <button class="mofEntityEditButton">Edit</button>
            <button class="mofEntityDeleteButton">Delete</button>
            <button class="mofEntityConfirmButton">Confirm</button>
            <button class="mofEntityCancelButton">Cancel</button>
        </td>
    </tr>
</table>
```

```js
    $(function () {
        $(table).mofEntities();
    })
```

The HTML code above contains a container (table) and entities (tr).

The container has attributes
- <b>mof-create-button-id</b> --- id of the button to add new entities,
- <b>mof-get-new-entity-url</b> --- url for getting a form for creating a new entity.

Each entity has the 'mofEntity' class and attributes:
- <b>mof-edit-url</b> --- url for getting a form for modifying an entity,
- <b>mof-delete-url</b> --- url for deleting an entity.

Entities contains the buttons for editing, deleting, confirmation and canceling. By default, 'cancel' and 'confirm' buttons are hidden.

Entity has 4 states:
- normal,
- editing,
- creating,
- deleting.

Create a New Entity
---

When user clicks 'Add new entity' button, MoF plugin sends GET request to url from <b>mof-get-new-entity-url</b> attribute of the table tag.

The answer should be HTML code with a form and Confirm and Cancel buttons. For example:
```html
    <tr class="mofEntity" mof-create-url="create_entity_url">
        <td><input value="New Entity" /></td>
        <td>
            <button class="mofEntityConfirmButton">Confirm</button>
            <button class="mofEntityCancelButton">Cancel</button>
        </td>
    </tr>
```

This answer is inserted to the top of the table.

The entity in this answer also has an attribute <b>mof-create-url</b>. When user clicks 'Confirm' button, MoF plugin sends POST request to corresponding url.

The answer should be the HTML code of a new entity. For example:
```html
<tr class="mofEntity" mof-edit-url="get_edit_entity_2_form_url" mof-delete-url="delete_entity_2_url">
    <td>Entity 2</td>
    <td>
        <button class="mofEntityEditButton">Edit</button>
        <button class="mofEntityDeleteButton">Delete</button>
        <button class="mofEntityConfirmButton">Confirm</button>
        <button class="mofEntityCancelButton">Cancel</button>
    </td>
</tr>
```

This code replaces the form.

When user click 'Cancel' button, the form disappears.

Edit an Entity
---

When user clicks 'Edit' button, the plugin sends GET request to url from <b>mof-edit-url</b> attribute. The answer should be HTML code with edit form and 'cancal' and 'confirm' buttons:
```html
<tr class="mofEntity" mof-edit-url="edit_entity_1_url">
    <td><input value="Entity 1" /></td>
    <td>
        <button class="mofEntityConfirmButton">Confirm</button>
        <button class="mofEntityCancelButton">Cancel</button>
    </td>
</tr>
```

If user clicks 'Confirm' button, the plugin sends POST request to url from <b>mof-edit-url</b> attribute. The answer should be the HTML code of a modified entity.

'Cancel' buttun return the entity to the normal state.

Delete an Entity
---

When user clicks 'Delete' button, MoF plugin changes a state of entity to 'deleting', hides 'Edit' and 'Delete' buttons and shows 'Confirm' and 'Cancel'.


The plugin does not send any requests until user clicks 'Confirm' button. When 'Confirm' button is clicked, POST requests is sent to url from 'mof-delete-url' attribute.
