var renderFormBuilder = function (form) {
  extranetFormBuilder.renderFormBuilder(form);
};

var data;

var callbacks = window.parent.window.callbacks;

var form;

var language;

var formContainer;

window.parent.window.renderFormBuilder = function (params) {  

    data = window.parent.window.data;
    language = window.parent.window.language;

    if(language == undefined){
      language = localStorage.getItem('language');
    }
  
    if(language == 'fr' || language == 'ar') {
      language = 'fr_FR';
    }
    
    window.parent.window.Alfresco = { constants: { JS_LOCALE : language, PLATFORM : "EXTRANET"}};
  
     form = data.form;
    form = form.replace(/\\'/g, "\\'");
    form = form.replace(/\\&/g, "\\&");
    form = form.replace(/\\r/g, "\\r");
    form = form.replace(/\\t/g, "\\t");
    form = form.replace(/\\b/g, "\\b");
    form = form.replace(/\\f/g, "\\f");
  
    formContainer = renderFormBuilder(JSON.parse(form));

    callbacks.ready();
  
  }


 window.parent.window.savePageDesigner = function (params) { 
    var returnedForm = JSON.parse(extranetFormBuilder.getDataToSubmit());
    // remove button Submit
    jQuery(returnedForm.components).each(function (index){
      if(returnedForm.components[index].type === "button"){
        returnedForm.components.splice(index,1);
          return false;
      }
    });
    return {
      status: 200,
      body: JSON.stringify(returnedForm)
    }
 }

  callbacks.init();

  