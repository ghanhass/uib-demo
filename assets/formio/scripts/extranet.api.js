/** 
 * @module formAPI FormAPI api to handle formio form
 * @author Abdelaziz Khabthani
 */
window.extranet = {
    
    /**
     * @private
     */
    _getComponentFromFormDefinition(theObject, key) {
        var result = null;
        if (Array.isArray(theObject)) {
            for (var i = 0; i < theObject.length; i++) {
                result = this._getComponentFromFormDefinition(theObject[i], key);
                if (result) {
                    break;
                }
            }
        } else {
            for (var prop in theObject) {
                if (prop == 'key') {
                    if (theObject[prop] == key) {
                        return theObject;
                    }
                }
                if (theObject[prop] instanceof Object || Array.isArray(theObject[prop])) {
                    result = this._getComponentFromFormDefinition(theObject[prop], key);
                    if (result) {
                        break;
                    }
                }
            }
        }
        return result;
    },

    /**
     * @private
     */
    _getComponentTypeAndMultipleByKey: function(key, formioObject, prefix) {
        if (formioObject.wizard) {
            // We are dealing with a wizard (EXPELLIARMUS!!!)
            var formDefinition = formioObject.wizard.components;
            var theComponent = this._getComponentFromFormDefinition(formDefinition, prefix + key);
            if (theComponent) {
                return {
                    'key': prefix + key,
                    'type': theComponent['type'],
                    'multiple': theComponent['multiple'] === undefined ? false : theComponent['multiple']
                };
            } else {
                return null;
            }
        } else {
            if (formioObject.getComponent(prefix + key) == null) {
                return null;
            }
            return {
                'key': prefix + key,
                'type': formioObject.getComponent(prefix + key)['component']['type'],
                'multiple': formioObject.getComponent(prefix + key)['component']['multiple'] === undefined ? false : formioObject.getComponent(prefix + key)['component']['multiple']
            };
        }
    },

    /**
     * @private
     */
    _arrayToCommaSeperated: function(array, ofObjects, secure) {
        if (!array) {
            return '';
        }
        var result = "";
        if (ofObjects) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] !== null) {
                    result += btoa(JSON.stringify(array[i])) + ",";
                }
            }
        } else {
            if (!secure) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] !== null) {
                        result += array[i].toString() + ",";
                    }
                }
            } else {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] !== null) {
                        result += btoa(array[i].toString()) + ",";
                    }
                }
            }
        }
        return result.substring(0, result.length - 1);
    },

    /**
     * @private
     */
    _b64DecodeUnicode: function(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    /**
     * @private
     */
    _initDataToPostRoutine: function(formConfig, prefix, dataToPost) {
        for (var key in formConfig) {
            if (formConfig.hasOwnProperty(key)) {
                if (typeof formConfig[key] == 'object' && formConfig[key] != null) {
                    if (key == 'components' && formConfig[key].length != 0) {
                        for (i = 0; i < formConfig[key].length; i++) {
                            if (formConfig[key][i]['key'].startsWith('var-')) {
                                if (formConfig[key][i]['type'] === 'group' || formConfig[key][i]['type'] === 'person' || formConfig[key][i]['type'] === 'ged' || formConfig[key][i]['type'] === 'priority') {
                                    console.warn(formConfig[key][i]['type'] + " is not supported in standalone mode.")
                                } else if(formConfig[key][i]['type'] === 'file') {
                                    dataToPost[formConfig[key][i]['key'].replace('var-', prefix)] = "[]";
                                } else {
                                    dataToPost[formConfig[key][i]['key'].replace('var-', prefix)] = "";
                                }
                            }
                        }
                    }
                    this._initDataToPostRoutine(formConfig[key], prefix, dataToPost);
                }
            }
        }
    },

    /**
     * @private
     */
    _initDataToPost: function(formConfig, dataToPost, prefix) {
        this._initDataToPostRoutine(formConfig, prefix, dataToPost);
    },

    /**
     * 
     * Check if the Form is a wizard
     * 
     * @function isWizard
     * 
     * @param {Object} formioObject the FormioForm object
     */
    isWizard: function(formioObject) {
        return ((!!formioObject) && (!!formioObject.wizard));
    },

    /**
     * 
     * Check if the Form is in the last page (applicable if the form is a wizard)
     * 
     * @function isTheFormInTheLastPage
     * 
     * @param {Object} formioObject the FormioForm object
     */
    isTheFormInTheLastPage(formioObject) {
        if (this.isWizard(formioObject)) {
            return formioObject.isFinalPage();
        }
        return true;
    },

    /**
     * Apply a given data to a Formio form
     * 
     * @function applyData
     * 
     * @param {Object} data The data to apply
     * @param {Object} formioObject the FormioForm object
     * @param {function} postApplyCallback callback function that will be called after the data has been fully applied
     */
    applyData: function(data, formioObject, postApplyCallback) {
        var dataToApply = {
            data: {}
        };
        var metaData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var current = data[key];
                // Check its specefic type
                metaData = this._getComponentTypeAndMultipleByKey(key, formioObject, 'var-');
                if (metaData && data[key] !== null && data[key] !== undefined && data[key] !== "") {
                    if (metaData['type'] === "survey" || metaData['type'] === 'datagrid' || metaData['type'] === 'signature') {
                        // Objects
                        if (!metaData['multiple']) {
                            dataToApply.data['var-' + key] = JSON.parse(current);
                        } else if (current.length > 0 && current.toString() !== '') {
                            // The code should never reach here
                            dataToApply.data['var-' + key] = [];
                            for (var i = 0; i < current.length; i++) {
                                dataToApply.data['var-' + key].push(JSON.parse(decodeURIComponent(escape(this._b64DecodeUnicode(current[i])))));
                            }
                        }
                    }
                    else if (metaData['type'] === "number") {
                        if (!metaData['multiple']) {
                            dataToApply.data['var-' + key] = Number(current);
                        } else {
                            dataToApply.data['var-' + key] = [];
                            if (Array.isArray(current)) {
                                if (current.length > 0 && current.toString() !== '') {
                                    for (var i = 0; i < current.length; i++) {
                                        dataToApply.data['var-' + key].push(Number(current[i]));
                                    }
                                }
                            }else if(current.includes(",")) {
                                var multiValue = current.split(",");
                                for (var i = 0; i < multiValue.length; i++) {
                                    dataToApply.data['var-' + key].push(multiValue[i]);
                                }

                            } 
                            else {
                                dataToApply.data['var-' + key].push(Number(current));
                            }
                        }
                    } else if (metaData['type'] === 'day') {
                        var date = new Date(current);
                        dataToApply.data['var-' + key] = "".concat(date.getDate(), '/', date.getMonth() + 1, '/', date.getFullYear());
                    } else if (metaData['type'] == 'group' || metaData['type'] == 'person' || metaData['type'] == 'ged' || metaData['type'] == 'priority') {
                        console.warn(metaData['type'] + " component is not supported in standalone mode.");
                    }else if(metaData['type'] == 'file'){
                        //dataToApply[key.replace('var-', realPrefix)] = JSON.stringify(current);
                        dataToApply.data['var-' + key] = JSON.parse(current);
					}  else {
                        if (metaData['multiple'] && current.length > 0 && current.toString() !== '') {
                            dataToApply.data['var-' + key] = [];
                            if (Array.isArray(current)) {
                                for (var i = 0; i < current.length; i++) {
                                    dataToApply.data['var-' + key].push(current[i]);
                                }
                            }else if(current.includes(",")) {
                                var multiValue = current.split(",");
                                for (var i = 0; i < multiValue.length; i++) {
                                    dataToApply.data['var-' + key].push(multiValue[i]);
                                }

                            }
                            else {
                                dataToApply.data['var-' + key].push(current);
                            }
                        } else {
                            dataToApply.data['var-' + key] = current;
                        }
                    }
                }
            }
        }

        var me = this;
        var dataClone = {};
        dataClone = jQuery.extend(true, {}, dataToApply);
        formioObject.setSubmission(dataClone).then(() => {
            if (formioObject.wizard) {
                formioObject.data = dataToApply['data'];
                formioObject.value = dataToApply['data'];
                formioObject._submission = dataToApply;
            }

            if (postApplyCallback) {
                postApplyCallback();
            }
        });
    },

    /**
     * Render the formio form inside a specefic div
     * 
     * @function renderForm
     * 
     * @param {string} wrapperDivId the div id, where to render to form
     * @param {Object} form the formio form object
     * @param {boolean} readOnly Read only mode     
     * @param {boolean} language language mode
     * 
     * @returns {Object} the FormioForm object
     */
    renderForm: function(wrapperDivId, form, readOnly,language) {
        let wizard = (form['display'] === 'wizard');
        if (wizard) {
            var formContainer = new FormioWizard(document.getElementById(wrapperDivId), {
                readOnly: readOnly,
                i18n: 
                    {
                        lng: language
                    }
            });
        } else {
            var formContainer = new FormioForm(document.getElementById(wrapperDivId), {
                readOnly: readOnly,
                i18n: 
                    {
                        lng: language
                    }
            });
        }
        formContainer.form = form;        
        formContainer.options.i18n.lng = language;
        window.language = language;
        return formContainer;
    },

    /**
     * Validate the form
     * 
     * @function validateForm
     * 
     * @param {Object} formioObject the FormioForm object
     * 
     * @returns {int 1|0} is the form valid or not
     */
    validateForm: function(formioObject) {
        var valide = true;
        // To check if datagrids are valids
        FormioUtils.eachComponent(formioObject.components, function(comp) {
            valide &= comp.checkValidity(formioObject.data, true);
        }, false);
        
        if (!valide) formioObject.showErrors();
        return valide;
    },
    
    /**
     * Extract the prefixed data from the form that will be send back to Averroes 
     * 
     * @function getDataToSubmit
     * 
     * @param {Object} formioObject the FormioForm object
     * @param {Object} formConfig the form definition
     * @param {prefix} prefix the process prefix, optional
     * 
     * @returns {Object} the data object to be submitted
     */
    getDataToSubmit: function(formioObject, formConfig, prefix) {
        var dataToPost = {};
        var metaData = {};
        var realPrefix = prefix ? prefix + '_' : '';
        this._initDataToPost(formConfig, dataToPost, realPrefix);
        var formioData = formioObject.getValue().data;

        for (var key in formioData) {
            var current = formioData[key];
            if (formioData.hasOwnProperty(key) && key.startsWith('var-') && current !== null && current !== '' && current !== undefined) {
                // Check its specefic type
                metaData = this._getComponentTypeAndMultipleByKey(key, formioObject, '');
                // Objects Types
                if (metaData['type'] === "survey" || metaData['type'] == 'datagrid' || metaData['type'] == 'signature') {
                    if (!metaData['multiple']) {
                        dataToPost[key.replace('var-', realPrefix)] = JSON.stringify(current);
                    } else {
                        // isNotEmpty, Code will NEVER reach here
                        if (current.length > 0) {
                            dataToPost[key.replace('var-', realPrefix)] = this._arrayToCommaSeperated(current, true, false);
                        }
                    }
                } else if (metaData['type'] === "number") {
                    if (!metaData['multiple']) {
                        // but not null
                        if (current !== null) {
                            dataToPost[key.replace('var-', realPrefix)] = current.toString();
                        }
                    } else {
                        if (current.length > 0) {
                            dataToPost[key.replace('var-', realPrefix)] = this._arrayToCommaSeperated(current, false, false);
                        }
                    }
                } else if (metaData['type'] == 'datetime') {
                    dataToPost[key.replace('var-', realPrefix)] = (new Date(current)).toISOString();
                } else if (metaData['type'] == 'day') {
                    dataToPost[key.replace('var-', realPrefix)] = (new Date(parseInt(current.split('/')[2]), parseInt(current.split('/')[1]) - 1, parseInt(current.split('/')[0]))).toISOString();
                } else if (metaData['type'] == 'group' || metaData['type'] == 'person' || metaData['type'] == 'ged' || metaData['type'] == 'priority') {
                    console.warn(metaData['type'] + " component is not supported in extranet mode.");
                }else if(metaData['type'] == 'file'){
                    dataToPost[key.replace('var-', realPrefix)] = JSON.stringify(current);
                } else {
                    if (metaData['multiple']) {
                        if (current.length > 0) {
                            dataToPost[key.replace('var-', realPrefix)] = this._arrayToCommaSeperated(current, false, false);
                        }
                    } else {
                        dataToPost[key.replace('var-', realPrefix)] = current.toString();
                    }
                }
            }
        }
        return dataToPost;
    }
};