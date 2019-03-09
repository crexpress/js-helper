const app = {};

app.debug = (function() {
    return {
        /**
         * Check if debugging is enabled
         *
         * 1 = All the result information will be displayed in console
         * 0 = Only informative data will be displayed
         *
         * @type {number}
         */
        enabled: function() {
            return 1;
        },
    };
})();

/**
 * It can accept element name or element directly, array of element names or elements,
 * object of element names or elements and perform the action accordingly.
 *
 * e.g.
 * app.element.disable('#element_id')
 * app.element.disable(['#element', $('#element2')])
 * app.element.disable({a: '#element1', b: '#element2'});
 *
 * @type {{disable, enable, extract}}
 */
app.element = (function() {
    return {
        disable: function(element) {
            if($.isArray(element) || element instanceof Object) {
                $.each(element, function(index, value) {
                    if (app.is.element(value)) {
                        value.prop('disabled', 'disabled');
                    } else if (app.is.elementName(value)) {
                        $(value).prop('disabled', 'disabled');
                    }
                });
            } else {
                if (app.is.element(value)) {
                    element.prop('disabled', 'disabled');
                } else if (app.is.elementName(value)) {
                    $(element).prop('disabled', 'disabled');
                }
            }
        },
        enable: function (element) {
            if($.isArray(element) || element instanceof Object) {
                $.each(element, function(index, value) {
                    if (app.is.element(value)) {
                        value.removeAttr('disabled');
                    } else if (app.is.elementName(value)) {
                        $(value).removeAttr('disabled');
                    }
                });
            } else {
                if (app.is.element(value)) {
                    element.removeAttr('disabled');
                } else if (app.is.elementName(value)) {
                    $(element).removeAttr('disabled');
                }
            }
        },
        extract: {
            /**
             * Extract value of an element
             *
             * @param element
             */
            value: function (element) {
                let value;

                if (app.is.element(element)) {
                    value = element.val();
                } else if (app.is.elementName(element)) {
                    value = $(element).val();
                } else {
                    return '';
                }

                if(app.is.empty(value)) {
                    value = '';
                } else if (app.is.element(value)) {
                    value = element.val();
                } else if (app.is.elementName(value)) {
                    value = $(value).val();
                }

                return value;
            }
        },
        remove: {
            parentClass: function (element, className) {
                if($.isArray(element) || element instanceof Object) {
                    $.each(element, function(index, value) {
                        if (app.is.element(value)) {
                            value.parent().removeClass(className);
                        } else if (app.is.elementName(value)) {
                            $(value).parent().removeClass(className);
                        }
                    });
                } else {
                    if (app.is.element(value)) {
                        value.parent().removeClass(className);
                    } else if (app.is.elementName(value)) {
                        $(value).parent().removeClass(className);
                    }
                }
            }
        },
        show: function(element) {
            if($.isArray(element) || element instanceof Object) {
                $.each(element, function(index, value) {
                    if (app.is.element(value)) {
                        value.show();
                    } else if (app.is.elementName(value)) {
                        $(value).show();
                    }
                });
            } else {
                if (app.is.element(element)) {
                    element.show();
                } else if (app.is.elementName(element)) {
                    $(element).show();
                }
            }
        },
        hide: function(element) {
            if($.isArray(element) || element instanceof Object) {
                $.each(element, function(index, value) {
                    if (app.is.element(value)) {
                        value.hide();
                    } else if (app.is.elementName(value)) {
                        $(value).hide();
                    }
                });
            } else {
                if (app.is.element(element)) {
                    element.hide();
                } else if (app.is.elementName(element)) {
                    $(element).hide();
                }
            }
        }
    };
})();

app.is = (function() {
    return {
        // Please note that a 0 value will also be treated as empty
        empty: function(element) {
            let isEmpty = false;

            if(typeof element === 'undefined') {
                isEmpty = true;
            } else if (element == 0) {
                isEmpty = true;
            } else if(element.length === 0) {
                isEmpty = true;
            } else if (element === null || element === '') {
                isEmpty = true;
            }

            return isEmpty;
        },
        element: function(value) {
            return value instanceof jQuery;
        },
        elementName: function(value) {
            if (typeof value === 'string') {
                if (value.substring(0, 1) === '.' || value.substring(0, 1) === '#') {
                    return true;
                }
            }

            return false;
        }
    };
})();

app.format = (function() {
    return {
        float: function (element) {
            let value = app.element.extract.value(element);

            if(app.is.empty(value)) {
                value = 0;
            } else if (!isNaN(element)) {   // If it's a number
                value = element;
            }

            return parseFloat(value);
        },
        decimal: function (element) {
            let value = app.format.float(element);
            if (value === 0) {
                return value;
            }

            return value.toFixed(2);
        },

        /**
         * Changes an input value in number format
         * e.g. 12536 will be converted to 12,536.00
         *
         * @param element
         * @returns {*}
         */
        number: function (element) {
            let value = app.element.extract.value(element);

            if(app.is.empty(value)) {
                // Should always return a 0 and not an empty value
                return 0;
            }

            return value.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        },
        ucwords: function (str) {
            let strVal = '';
            str = str.split(' ');
            for (let chr = 0; chr < str.length; chr++) {
                strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
            }

            return strVal.trim();
        }
    };
})();

/**
 * Input fields related functionality
 *
 * @type {{allow}}
 */
app.input = (function(){
    return {
        allow: {
            /**
             * Allow only decimal values in input box
             * Using this method will only allow numbers and dots in an input field and keystrokes will not work
             */
            decimal: function (element) {
                $(document).on('input', element, function (event) {
                    let self = $(this);
                    self.val(self.val().replace(/[^0-9\.]/g, ''));

                    if ((event.which !== 46 || self.val().indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
                        event.preventDefault();
                    }
                });
            }
        },
        date_picker: function(url) {
            $('input.date-format').daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: false,
                locale: {
                    format: 'DD-MM-YYYY',
                    cancelLabel: 'Clear'
                },
                onSelect: function() {
                    console.log('good one');
                    $(this).change();
                }
            });
        },
    }
})();

app.url = (function() {
    return {
        redirect: function(url) {
            window.location.href = SITE_URL + url;
        },
        site: function(url) {
            return SITE_URL + url;
        },
        admin: function(url) {
            return ADMIN_URL + url;
        }
    };
})();

app.loader = (function() {
    return {
        show: function() {
            $('#loading').show();
        },
        hide: function() {
            $('#loading').hide();
        },
        error: function() {
            app.loader.hide();
            alert('Something went wrong, please refresh the page and try again!');
        }
    };
})();

/**
 * Converts passed value in a number format
 * @param n
 */
function amount(n)
{
    return n.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

/**
 *
 * @param value
 * @returns {*}
 */
function clean(value)
{
    if(app.is.empty(value)) {
        value = '';
    }

    return value;
}

/**
 * Get value by taking care of undefined
 *
 * @param element
 * @returns {*}
 */
function val(element)
{
    return app.element.extract.value(element);
}

/**
 * Get value by taking care of undefined
 *
 * @param element
 * @returns {*}
 */
function value(element)
{
    return app.element.extract.value(element);
}

/**
 * Get admin URL
 *
 * @param url
 * @returns {*}
 */
function admin_url(url)
{
    return app.url.admin(url);
}

/**
 * Allowing all ajax post calls
 */
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
