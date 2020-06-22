var utilityFunctions = {
  getFormProgressMeterContaineParent: function(){
    var formProgressMeterContaineParent = document.querySelector("#form-progress-meter-container-parent");
    if(!formProgressMeterContaineParent){
      formProgressMeterContaineParent = document.createElement("div");
      formProgressMeterContaineParent.id = "form-progress-meter-container-parent";
      formProgressMeterContaineParent.innerHTML = `
      <div id="form-progress-meter-container">
        <div class="" id="form-progress-meter-bg"></div>
        <svg id="form-progress-meter-svg">
          <text _ngcontent-c11="" alignment-baseline="middle" id="form-progress-circle-text" style="font-size: 17px;" text-anchor="middle" x="50%" y="50%" stroke="#227a9f">0%</text>
          <path _ngcontent-c11="" fill="none" id="percentage-arc-2" stroke="#e9eaec" stroke-width="4" d="M 70.31088913245536 57.5 A 35 35 0 1 0 9.689110867544649 57.5"></path>
          <path _ngcontent-c11="" fill="none" id="form-progress-circle" stroke="#34768f" stroke-width="5" d="M 9.689110867544649 57.5 A 35 35 0 0 0 9.689110867544649 57.5"></path>
        </svg>
      </div>
      <div id="form-progress-meter-infos-container">
        <div id="form-progress-meter-infos-title1">Etape2 test</div>
        <div id="form-progress-meter-infos-title2">Rattachement des documents</div>
      </div>`;
      document.body.insertBefore(formProgressMeterContaineParent, document.body.firstElementChild);
    }
    return formProgressMeterContaineParent;
  },
  generateUibStyleSheet: function(){
    var uibStyleSheet = document.querySelector("#uib-stylesheet");
    if(!uibStyleSheet){
      uibStyleSheet = document.createElement("link");
      uibStyleSheet.id = "uib-stylesheet";
      uibStyleSheet.href="./styles/custom-login-styles/uib/style.css";
      uibStyleSheet.setAttribute("rel", "stylesheet");
      document.head.appendChild(uibStyleSheet);
    }
  },
  drawProgressMeter: function(formProgressMeterContaineParent, progressPercentage, pageNumber) {
    // function to draw an SVG percentage circle
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      //function to convert polar coordinates to cartesian coordinates
      let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
      //function for drawing the SVG percentage Arc

      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      let d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y
      ].join(" ");

      return d;
    }
    let percentageText = Math.round(progressPercentage);
    let endAngle = ((240/100)*progressPercentage) - 120;
    //console.log("endAngle = ", endAngle);
    document.getElementById("form-progress-circle")
    .setAttribute("d", describeArc(40, 40, 35, -120, endAngle));
    document.getElementById("percentage-arc-2")
    .setAttribute("d", describeArc(40, 40, 35, -120, 120));
     document.getElementById("form-progress-circle-text").textContent = percentageText + "%";
     document.getElementById("form-progress-circle").setAttribute("stroke", "#34768f");
     formProgressMeterContaineParent.querySelector("#form-progress-meter-infos-title1").innerHTML = "&Eacute;tape "+pageNumber;
  }
}
/**
 * General-purpose function to apply fixes on the DOM on form render
 * @param {Object} formContainer Formio Object (a form wizard)
 */
function formioFixes(formContainer){
  function callback1(domElement){
    let textareaElements = domElement.querySelectorAll(".formio-component-datagrid td textarea");
    //console.log("textareaElements = ", textareaElements);
    for(let index = 0; index < textareaElements.length; index++){
      let textareaElement = textareaElements[index];
      textareaElement.style.height= '0px';
      textareaElement.style.height = (textareaElement.scrollHeight + 1) + 'px';
    }
  }
  
  function callback2(){
    window.addEventListener("resize", function(event){
      let resizeId;
      clearTimeout(resizeId);
      resizeId = setTimeout(callback1(document, true), 750);  
    });
  }
  function callback3(){
    window['renderCount'] = ( (window['renderCount'] === undefined) ? 1 : (window['renderCount'] + 1) )
    window['clientName'] = window.parent.window["clientName"];
      if(window["clientName"]){
        switch(window["clientName"]){
          case("UIB"):
          console.log("adding uib stylesheet for formio !");
          utilityFunctions.generateUibStyleSheet();
          var formProgressMeterContaineParent = utilityFunctions.getFormProgressMeterContaineParent();
          //
          var pageNumber = formContainer.page + 1;
          var pages = formContainer.pages.length;
          //
          var percentage = Math.round(pageNumber*(100/pages));
          utilityFunctions.drawProgressMeter(formProgressMeterContaineParent, percentage, pageNumber);
          break;
        }
      }
      else{ //nothing yet..
      } 
    
  }
  formContainer.on("render", function(ev){ 
    callback1(document);
    callback2();
    callback3();
  });
}
// Applying data to the form
// ~applyDataDemo(requestExample.variables, formContainer, function() {
//	console.log("post apply data callback");
// })
var applyDataDemo = function (data, formioObject, callback) {
  extranet.applyData(data, formioObject, callback)
};

// validating the form
// ~validateFormDemo(formContainer)
var validateFormDemo = function (formioObject) {
  return extranet.validateForm(formioObject);
};

// Test is The Form In The Last Page
// ~isTheFormInTheLastPageDemo(formContainer)
var isTheFormInTheLastPageDemo = function (formioObject) {
  return extranet.isTheFormInTheLastPage(formioObject);
};

// extracting the data from the form
// ~getDataToSubmitDemo(formContainer, JSON.parse(requestExample.form), requestExample.prefix)
var getDataToSubmitDemo = function (formioObject, formConfig, prefix) {
  return
};

var data;

var bootstrapStyle;

var requestId;

var language;

var connectedUsername;

var connectedUserRoles;

var connectedUserDetails; 

var connectedNumCorrespondance; 

var recaptchaSiteKey;

var callbacks = window.parent.window.callbacks;

var form;

var platform;

var formContainer;

window.parent.window.isLastPage = function (prefix) {
  if (isTheFormInTheLastPageDemo(formContainer) == 1)
    return {
      status: 200
    }
  else return {
    status: 400
  }
}

window.parent.window.validate = function (prefix) {
  
  if (validateFormDemo(formContainer) == 1)
    return {
      status: 200,
      body: extranet.getDataToSubmit(formContainer, JSON.parse(form), prefix)
    }
  else return {
    status: 400
  }

}

window.parent.window.saveTask = function (prefix) {
    return {
      body: extranet.getDataToSubmit(formContainer, JSON.parse(form), prefix)
    }
}

window.parent.window.render = function (params) {

  data = window.parent.window.data;
  bootstrapStyle = window.parent.window.bootstrapStyle;
  requestId = window.parent.window.requestId;
  language = window.parent.window.language;
  connectedUsername = window.parent.window.connectedUsername;
  connectedUserRoles = window.parent.window.connectedUserRoles;
  connectedUserDetails = window.parent.window.connectedUserDetails;
  connectedNumCorrespondance = window.parent.window.connectedNumCorrespondance;
  recaptchaSiteKey = window.parent.window.recaptchaSiteKey;
  platform =  window.parent.window.platform;
  
  if(language == undefined){
    language = localStorage.getItem('language');
  }

  window.parent.window.Alfresco = { constants: { JS_LOCALE : language}};

  if(bootstrapStyle == null) {
    bootstrapStyle = "bootstrap-default.css";
  }

  if(bootstrapStyle == "bootstrap-default.css" && language == "ar"){
    bootstrapStyle = "bootstrap-default-rtl.css"
  }
  
  document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",'<link rel="stylesheet" type="text/css" href="styles/bootstrap/' + bootstrapStyle + '">');

  if(language == "ar"){
    document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",'<link rel="stylesheet" type="text/css" href="styles/formio-rtl.full.css">');
  } else {
    document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",'<link rel="stylesheet" type="text/css" href="styles/formio.full.css">');
  }

  form = data.form.replace(/\\n/g, "\\n");
  form = form.replace(/\\'/g, "\\'");
  form = form.replace(/\\&/g, "\\&");
  form = form.replace(/\\r/g, "\\r");
  form = form.replace(/\\t/g, "\\t");
  form = form.replace(/\\b/g, "\\b");
  form = form.replace(/\\f/g, "\\f");


  formContainer = extranet.renderForm('formio', JSON.parse(form), data.readOnly,language);

  formioFixes(formContainer)

  formContainer.ready.then(function () {
    applyDataDemo(JSON.parse(data.variables), formContainer, function () {
      callbacks.ready();

      onFormioHeightChange(document.getElementById("formio"), function () {
        callbacks.resize();
      });
      onWizardFormioScroll();
    });
    this.initMap();
  });

}

function onFormioHeightChange(elm, callback) {
  var lastHeight = elm.clientHeight,
    newHeight;
  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight != newHeight)
      callback();
    lastHeight = newHeight;

    if (elm.onElementHeightChangeTimer)
      clearTimeout(elm.onElementHeightChangeTimer);

    elm.onElementHeightChangeTimer = setTimeout(run, 200);
  })();
}

function onWizardFormioScroll() {
  if(JSON.parse(form).display !== 'wizard') {
    return;
  }

  var lastScrollTop = 0;
  window.addEventListener('scroll',function(e) {
    var st = window.pageYOffset || document.documentElement.scrollTop; 
    if(st === 0) {
      document.body.classList.remove("wizard-scroll-down");
      document.body.classList.remove("wizard-scroll-up");
    } else 
    if (st < lastScrollTop){
      document.body.classList.add("wizard-scroll-down");
      document.body.classList.remove("wizard-scroll-up");
    } else {
      document.body.classList.remove("wizard-scroll-down");
      document.body.classList.add("wizard-scroll-up");
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });
}

function initMap() {
  if(formContainer != null) {
    var geoVneuron = formContainer.data["var-geoVneuron"];
    if(geoVneuron != null) {
      // The map
      var map = new google.maps.Map(document.getElementById('vneuronMap'));
      // custom positions
      var bounds = new google.maps.LatLngBounds();
      var positions = geoVneuron.split('+');
      positions.forEach(element => {
        var mark = element.split(',');
		
		    var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">' + mark[2] + '</h4>'+
            '<div id="bodyContent">'+
            '<h5>' + mark[3] +'</H5>'+
	          '<h5>' + mark[4] +'</H5>'+
	          '<h5>' + mark[5] +'</H5>'+
            '</div>'+
            '</div>';

		    var infowindow = new google.maps.InfoWindow({
		    	content: contentString
		    });
      
        var marker = new google.maps.Marker({position: {lat: Number(mark[0]), lng: Number(mark[1])},title: mark[2] , map: map});
		    marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
      
        marker.addListener('mouseout', function() {
          infowindow.close();
        });
      
        bounds.extend(new google.maps.LatLng(Number(mark[0]), Number(mark[1])));
      });
      // map zoom 
      map.fitBounds(bounds);
    }
  }
};

if(callbacks != null || callbacks != undefined){
  callbacks.init();
}
