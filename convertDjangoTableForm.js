function convertDjangoTableForm() {
    return Object.create({
        bootstrapFormFields: function($form, id) {
            var $tr = $form.find("#" + id).closest("tr"),
                errors = [],
                html = '<div class="control-group ',
                inputType = $tr.find("td input:first").attr("type");

            $tr.find(".errorlist").find("li").each(function() {
                errors.push($(this).html());
            })
            $tr.find(".errorlist").remove();
            if (errors.length) {
                html = html + " error "
            }
            html = html + '" id="div_' + id + '">';
            if (inputType === "checkbox") {
                var $input = $tr.find("td input:first");
                html = html + '<div class="controls">' + $tr.find("th").html().replace("</label>", $input[0].outerHTML + "</label>");
                $input.remove();
                html = html + $tr.find("td").html().replace("<br><span", "<span").replace("<span", "<p").replace("</span>", "</p>") + '</div></div>';
            } else {
                html = html + $tr.find("th").html();
                html = html + '<div class="controls">' + $tr.find("td").html().replace("<span", "<p").replace("</span>", "</p>");
            }
            if (errors.length) {
                html = html + '<span class="help-inline"><strong>' + errors.join(" ") + '</strong></span>';
            }
            html = html + '</div></div>';
            return html;
        },

        bootstrapFormLayout: function($form, layoutObj) {
            var html = "",
                self = this;
            for(let data of layoutObj) {
                if (typeof data === "object") {
                    if (data.type == "fieldset") {
                        html = html + "<fieldset><legend>" + data.legend + "</legend>" + self.bootstrapFormLayout($form, data.fields) + "</fieldset>";
                    }
                    else if(data.type === "html") {
                        html = html + data.htmlStart + self.bootstrapFormLayout($form, data.fields) + data.htmlEnd;
                    }
                } else if (typeof data === "string") {
                    html = html + self.bootstrapFormFields($form, data);
                }
            }
            return html;
        },

        bootstrapForm: function(formID, layoutObj) {
            $form = $("form#" + formID);
            $form.find("div.div-marker:first").before(this.bootstrapFormLayout($form, layoutObj));
            $form.find("div.control-group > label").addClass("control-label");
            $form.find("div.controls > label").addClass("checkbox");
            $form.find(".helptext").addClass("help-block");
            $form.find("table:last").remove();
        }
    });
}
