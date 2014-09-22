(function ($) {
    var settings;

    $.fn.mofEntities = function (options) {
        var settings = $.extend({}, $.fn.mofEntities.defaults, options);

        return this.each(function () {
            var $this = $(this);

            $(settings.entitySelector, this).each(function () { addHandlersToEntity(this); });

            if ($this.attr(settings.createButtonIdAttributeName) !== undefined) {
                $("#" + $this.attr(settings.createButtonIdAttributeName)).click(function () {
                    var $btn = $(this);
                    $btn.addClass(settings.inProcessStateClass);
                    $.ajax({
                        url: settings.getFormForNewEntityUrl($this),
                        cache: false
                    })
                        .done(function (data, textStatus, jqXHR) {
                            var $data = $(data);
                            changeStateTo($data, settings.createStateClass);
                            settings.insertFormForNewEntity($this, $data);
                            addHandlersToEntity($data);
                        })
                        .fail(function (data) {
                            settings.onAjaxError(data);
                        })
                        .always(function () {
                            $btn.removeClass(settings.inProcessStateClass);
                        });

                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });

        function addHandlersToEntity(el) {
            if (!$(el).hasClass(settings.editStateClass) && !$(el).hasClass(settings.createStateClass))
                $(el).addClass(settings.viewStateClass);
            $(settings.editButtonSelector, el).click(function (event) {
                editButtonClickHandler(el);
                event.preventDefault();
                event.stopPropagation();
            });
            $(settings.deleteButtonSelector, el).click(function (event) {
                deleteButtonClickHandler(el);
                event.preventDefault();
                event.stopPropagation();
            });
            $(settings.confirmButtonSelector, el).click(function (event) {
                confirmButtonClickHandler(el);
                event.preventDefault();
                event.stopPropagation();
            });
            $(settings.cancelButtonSelector, el).click(function (event) {
                cancelButtonClickHandler(el);
                event.preventDefault();
                event.stopPropagation();
            });

            settings.rowPostProcessing(el);
        }

        function changeStateTo(el, newState) {
            var $el = $(el);
            $el.removeClass(settings.viewStateClass);
            $el.removeClass(settings.editStateClass);
            $el.removeClass(settings.deleteStateClass);
            $el.removeClass(settings.createStateClass);
            $el.addClass(newState);
        }

        function editButtonClickHandler(el) {
            var $el = $(el);
            $el.addClass(settings.inProcessStateClass);
            $.ajax({
                url: settings.getEditUrl($el),
                cache: false
            })
                .done(function (data, textStatus, jqXHR) {
                    var $data = $(data);
                    changeStateTo($data, settings.editStateClass);
                    $el.after($data);
                    addHandlersToEntity($data);
                    $el.hide();
                })
                .fail(function (data) {
                    settings.onAjaxError(data);
                })
                .always(function () {
                    $el.removeClass(settings.inProcessStateClass);
                });
        }

        function deleteButtonClickHandler(el) {
            changeStateTo(el, settings.deleteStateClass);
        }

        function sendEditRequest(el) {
            var $el = $(el);
            $el.addClass(settings.inProcessStateClass);
            var formData = getAllFormValues($el);
            $.post(settings.getEditUrl($el), formData)
                .done(function (data, textStatus, jqXHR) {
                    var $data = $(data);
                    if (settings.checkErrors($data))
                        changeStateTo($data, settings.editStateClass);
                    else
                        getHiddenViewElement($el).remove();
                    $el.after($data);
                    addHandlersToEntity($data);
                    $el.remove();
                })
                .fail(function (data) {
                    settings.onAjaxError(data);
                })
                .always(function () {
                    $el.removeClass(settings.inProcessStateClass);
                });
        }

        function sendCreateRequest(el) {
            var $el = $(el);
            $el.addClass(settings.inProcessStateClass);
            var formData = getAllFormValues();
            $.post(settings.getCreateUrl($el), formData)
                .done(function (data, textStatus, jqXHR) {
                    var $data = $(data);
                    if (settings.checkErrors($data))
                        changeStateTo($data, settings.createStateClass);
                    $el.after($data);
                    addHandlersToEntity($data);
                    $el.remove();
                })
                .fail(function (data) {
                    settings.onAjaxError(data);
                })
                .always(function () {
                    $el.removeClass(settings.inProcessStateClass);
                });
        }

        function sendDeleteRequest(el) {
            var $el = $(el);
            $el.addClass(settings.inProcessStateClass);
            var formData = getAllFormValues();
            $.post(settings.getDeleteUrl($el), formData)
                .done(function (data, textStatus, jqXHR) {
                    $el.remove();
                })
                .fail(function (data) {
                    settings.onAjaxError(data);
                })
                .always(function () {
                    $el.removeClass(settings.inProcessStateClass);
                });
        }

        function confirmButtonClickHandler(el) {
            var $el = $(el);
            if ($el.hasClass(settings.editStateClass))
                sendEditRequest(el);
            else if ($el.hasClass(settings.deleteStateClass))
                sendDeleteRequest(el);
            else if ($el.hasClass(settings.createStateClass))
                sendCreateRequest(el);
        }

        function getHiddenViewElement(el) {
            return $(el).prev();
        }

        function cancelButtonClickHandler(el) {
            var $el = $(el);
            if ($el.hasClass(settings.editStateClass)) {
                getHiddenViewElement($el).show();
                $el.remove();
            }
            else if ($el.hasClass(settings.createStateClass)) {
                $el.remove();
            }
            else if ($el.hasClass(settings.deleteStateClass)) {
                changeStateTo(el, settings.viewStateClass)
            }
        }

        function getAllFormValues(el) {
            var result = {};
            $(settings.formInputsSelector, el).each(function () {
                $this = $(this);
                if (result[$this.attr("name")] === undefined)
                    if ($this.attr("type") == "checkbox")
                        result[$this.attr("name")] = $this.is(":checked");
                    else
                        result[$this.attr("name")] = $this.val();
            });
            return result;
        }
    };


    $.fn.mofEntities.defaults = {
        entitySelector: ".mofEntity",

        viewStateClass: "__mofEntityView",
        editStateClass: "__mofEntityEdit",
        createStateClass: "__mofEntityCreate",
        deleteStateClass: "__mofEntityDelete",
        inProcessStateClass: "__mofEntityInProcess",

        createButtonIdAttributeName: "mof-create-button-id",

        editButtonSelector: ".mofEntityEdit",
        deleteButtonSelector: ".mofEntityDelete",
        confirmButtonSelector: ".mofEntityConfirm",
        cancelButtonSelector: ".mofEntityCancel",

        formInputsSelector: "input,textarea,select",

        getEditUrl: function (el) {
            return $(el).attr("mof-edit-url");
        },

        getDeleteUrl: function (el) {
            return $(el).attr("mof-delete-url");
        },

        getCreateUrl: function (el) {
            return $(el).attr("mof-create-url");
        },

        getFormForNewEntityUrl: function (el) {
            return $(el).attr("mof-get-new-entity-url");
        },

        insertFormForNewEntity: function (container, el) {
            $(container).prepend(el);
        },

        checkErrors: function (el) {
            return false;
        },

        rowPostProcessing: function (row) {
            return;
        },

        onAjaxError: function (data, textStatus) {
            // alert("Error! Please refresh the page");
        }
    };
}(jQuery));