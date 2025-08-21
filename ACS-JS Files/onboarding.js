// Code to invoke an APS Workflow from ACS along with passing the document.
// The variables meant to receive the ACS document has to be FORM UI elements in the START FORM.


function ExecuteValidation() {

	logger.system.out('*** Starting APS Workflow ***');
	
	document.name = (document.id + "-" + document.name);

	var formvariables = '{' + '"acsnodeid":"'+document.id+'"' +  '}'; // acsNodeId is the id of a 'Text' UI element in the Start-Form. Hence it is the variable to receive the node-id passed from ACS.
	logger.system.out(formvariables);


	var dataObj = eval('(' + formvariables + ')');

	var processToInvoke = 'onboarding'; // Name of process/workflow to invoke.
	var instanceToCreate = 'Created from ACS'; // Name of the instance that gets created.

	var receivingDocumentList = ["apsdocument"];  // apsdocument is the id of an 'Attach File' UI element in the Start-Form. Hence it is the variable to receive the document passed from ACS.

	logger.system.out('*** processToInvoke >>> '+processToInvoke);


	try{
		res = activiti.startDocumentProcess(processToInvoke, instanceToCreate, dataObj, receivingDocumentList, [document]);
		logger.system.out("Instance ID = "+res.id);
	}
	catch(ex){
		logger.system.out('*** Exception >>> ***'+ex.message);
	}

	logger.system.out('*** Ending APS Workflow ***');
}

ExecuteValidation();

