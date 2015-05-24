/*!
 * BootstrapUpdateDialog allows to create/update model entry from Bootstrap Modal dialog.
 *
 * @author Vladimir Lysenko
 */
(function ($) {
    function BootstrapUpdateDialog(options) {
        this.options = $.extend({
            createLinks: 'a.update-dialog-create',
            updateLinks: 'div.grid-view a.update',
            gridSelector: 'div.grid-view',
            dialogContent: 'div.modal-body',
            updateDialogWithCallback: null,
            updateDialogActionBase: null,
            getFormData: null,
            createTitle:'Добавить запись',
            updateTitle:'Изменить запись',
            validate: function(){
                return true;
            },
            ajaxOptions:{
                'type': 'post',
                'dataType': 'json',
                'cache': false
            },
            hideDelay:500
        }, options);
        this.init();
    }

    BootstrapUpdateDialog.prototype = {
        init: function () {
            this.findAll();
            this.attachEvents();
            var self = this;
            this.validate = this.options.validate;
            var csrf = '';

            var csrfParam = $('meta[name="csrf-param"]');
            if(csrfParam.length)
            {
                this.csrfParam = csrfParam.attr('content');
                this.csrf = $('meta[name="csrf-token"]').attr('content');
            }

            var functions = ["updateDialogWithCallback","updateDialogActionBase","successUpdateDialog","getFormData"];
            for(var i = 0; i < functions.length; i++)
            {
                if(this.options[functions[i]] != null)
                    this[functions[i]] = this.options[functions[i]];
                this[functions[i]] = this[functions[i]].bind(this);
            }
        },
        updateDialogWithCallback: function (url, act) {
            var self = this;
            var params = self.getFormData(url, act);
            return $.ajax($.extend({
                'url': params.url,
                'data':params.data,
                'success': function (data) {
                    self.dialogContent.html(data.content);
                    if (data.status == 'success') {
                        self.successUpdateDialog(data);
                        setTimeout(function () {
                            self.closeUpdateDialog()
                        }, self.options.hideDelay);
                    }
                }
            },self.options.ajaxOptions));
        },
        updateDialogActionBase: function (element) {
            var self= this;
            this.dialogContent.empty();
            $.when(this.updateDialogWithCallback(element.attr('href'), false)).then(function () {
                if(element.is(self.options.createLinks))
                    self.dialog.find('.modal-title').text(self.options.createTitle);
                else{
                    self.dialog.find('.modal-title').text(self.options.updateTitle);
                }

                self.dialog.modal('show');
            });
        },
        successUpdateDialog: function (data) {
            var self = this;
            if (data.status == 'success') // Update all grid views on success
            {
                if (self.grids.size() > 0) {
                    self.grids.each(function () {
                        $.pjax.reload({container:'#' + $(this).attr('id')});
                    });
                }
                else {
                    location.reload();
                }
            }
        },
        getFormData: function(url, act)
        {
            var action = '';
            var form = this.dialogContent.find('form');
            if (url === false) {
                action = '&action=' + act;
                url = form.attr('action');
            }
            var data = form.serialize();
            if(this.hasOwnProperty('csrf'))
                data += '&' + this.csrfParam + '=' + this.csrf;
            return {data:form.serialize(),url:url};
        },
        findAll: function () {
            // find elements

            this.createLinks = $(this.options.createLinks);
            this.updateLinks = $(this.options.updateLinks);
            this.dialog = $(this.options.dialog);
            this.dialogContent = this.dialog.find(this.options.dialogContent);
            this.grids = $(this.options.gridSelector);


        },
        attachEvents: function () {
            var self = this;
            // flexible layout handling
            if (this.options.createLinks != '')
                $(document).on('click', this.options.createLinks, function (e) {
                    e.preventDefault();
                    self.updateDialogActionBase($(this));
                });
            if (this.options.updateLinks != '')
                $(document).on('click', this.options.updateLinks, function (e) {
                    e.preventDefault();
                    self.updateDialogActionBase($(this));
                });
            self.dialog.on('submit','form',function(e){
                e.preventDefault();
            });
            self.dialog.on('click','input[type="submit"],button[type="submit"]', function (e) {
                e.preventDefault();
                var element = $(this);
                if(self.validate()){
                    element.attr('disabled','disabled');
                    $.when(self.updateDialogWithCallback(false, $(this).attr('name'))).then(function(){
                        element.removeAttr('disabled');
                    }).fail(function(){
                        element.removeAttr('disabled');
                    });

                }

            });
        },
        closeUpdateDialog: function () {
            var self = this;
            self.dialog.modal('hide');
            self.dialogContent.empty();
        },
        destroy: function () {
            this.createLinks.undelegate();
            this.updateLinks.undelegate();
            this.dialog.modal('hide');
            this.dialogContent.empty();
        }
    };

    // jQuery plugin interface
    $.fn.updateDialogBootstrapExt = function (opt) {
        return this.each(function () {
            $(this).data('UpdateDialogBootstrapExt', new BootstrapUpdateDialog($.extend(opt, {dialog: this})));
        });
    };
}($));