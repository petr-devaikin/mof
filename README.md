jQuery Modify on the Fly plugin
===
Edit list of entities on single page.

Plugin allows to add new entities to a list, edit and remove existing objects. It works with tables, lists and other structures.

Quickstart
==
Create a table and add some attributes and classes:
```
<button id="createButton">Add new Entity</button>

<table mof-create-button-id="createButton" mof-get-new-entity-url="get-new-entity-form-url">
    <tr class="mofEntity" mof-edit-url="get-edit-entity-1-form-url" mof-delete-url="delete-entity-1-url">
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
