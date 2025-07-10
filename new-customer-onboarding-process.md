## New Customer Onboarding Process

|  **Overall Scenario – 9 Second Insurance: New Customer Process** |
| ----------- |
| As a systems architect working for 9 Second Insurance, you are tasked with creating a process that will allow agents to onboard new customers and add them to 9SI's customer database. The process should include: |
| Data intake mechanism to capture a customer's information. |
| Save the new customer's information to 9SI's external customer database. |
| Document generation and saving to content management system. |
| A Know-Your-Customer check to determine if an Out-of-State Waiver is applicable or not. |
| A custom email method that sends documents to the customer. |

### Lab 1. Create an Intake Task
1.	From the Alfresco home page, launch the Activiti App (Process Services) by clicking on the Activiti App hyperlink. 
    - Sign in with your provided username and password. You will be directed to the Activiti App home page.
2.	Select the App Designer tile to navigate to the Business Process Models page
3.	To create a new process, press the Create Process button in the top right of the page.
4.	In the Create a new business process model popup, enter the following information:
    -	Model name: ```[Your user #] New Customer Onboarding``` (ex: U1 New Customer Onboarding)
    -	Description: ```Add a new customer.```
    -	Editor Type: Leave as BPMN editor
    -	Stencil: Default BPMN
    -	Press the Create new model button.
5.	With nothing selected on the stage, select the Variables attribute in the bottom configuration panel.
6.	Select the “+” icon below the chart to add a new variabl- Give it the following information:
    -	Name: ```newCustomerId```
    -	Variable Type: string
    -	Save the variable
7.	Create a new script task connected to the start event. In the bottom configuration panel, configure  the following attributes:
    -	Name: ```Set Customer ID```
    -	Script format: ```groovy```
    -	Script: enter this code in the popup script window:
```
execution.setVariable('newCustomerId', execution.getProcessInstanceId());
```
8.	Create a new User Task connected to the script task.   
9.	Give the user task a name by double-clicking on the task to open a text field Name this task: ```Gather Customer Data```.
10.	With the user task selected, notice that the Referenced form value in the bottom configuration window is No reference selecte- To create an intake form for this task, click on the No reference selected value
11.	In the Form reference popup window, select the New Form button.
12.	In the Create a new form window, enter the following values:
    - Form name: ```Add New Customer Data```
    - Description: ```Gathers information about the new customer.```
    - Stencil: Default form
    - Select the Create form button. 
13.	Follow these steps to create the form you’ll need to intake a new customer:
    - Drag a Display Value object and dop it onto the canvas.
    - Click on the pencil icon on the Display Value object to open the edit prompt.
    - Select the blue Variable button. In the Dropdown below the button, select the **newCustomerId** variable. Notice that the label changes to match the variable name. Change the label to: ```Customer ID:```.
    - Drag a Header onto the canvas. To edit, click on the pencil icon that appears when you hover your mouse over the header object. In the Label field, name it ```Customer Information:``` and click the Close button.
    - Drag a Text object onto the canvas and drop it into the header object. Click the pencil to edit the text object and configure the following information: 
    - Label: ```First Name: ```
        - Select the Override ID check box.
        - Enter ```newCustomerFirstName``` into the ID fiele
        - Select the Required check box. 
        - Click on the Close button.
    - Perform the previous step again to create a Text object with the following information: 
        - Label: ```Last Name:```
        - ID: ```newCustomerLastName ```
        - Required: checked
    - Create another Text object with the following information:
        - Label: ```Address:```
        - ID: ```newCustomerAddress ```
        - Required: checked
    - Create another Text object with the following information:
        - Label: ```City:```
        - ID: ```newCustomerCity```
        - Required: checked
    - Create a Dropdown object with the following information:
        - Label: ```State:```
        - ID: ```newCustomerState```
        - Required: checked
        - Select the Options tab and Configure the following information:
            1.	Select the Rest Service button.
            2.	Rest URL: ```https://run.mocky.io/v3/0329674b-51fe-450f-90cf-be8f53cb68a6```
            3.	Path to array in JSON response: ```states```
            4.	ID property: ```abbreviation```
            5.	Label property: ```name```
            6.	Press the Test button. A popup window should appear showing a JSON string of states. Close the window.
            7.	Close the dropdown prompt.
    - Create another Text object with the following information:
        - Label: ```Zip Code:```
        - ID: ```newCustomerZipCode```
        - Required: checked
    - Create another Text object with the following information:
        - Label: ```Email Address:```
        - ID: ```newCustomerEmail```
        - Required: checked
    - Create another Text object with the following information:
        - Label: ```Phone Number:```
        - ID: ```newCustomerPhoneNumber```
        - Required: checked
    -	Click on the save button in the top left of the page to save and close the form and return to your process model.
    -	On the Save form popup window, click the Save and close editor button to return to your process model.
14.	Create a connected end event by selecting the Gather Customer Data user task and clicking on the end event icon in the small popup menu.   
15.	Save the process model by clicking on the Save icon in the top left of the pag-   
16.	In the Save model popup window, press the Save and close editor button.

---

|  **Next Steps: Process Application** |
| ----------- |
| In APS, a process cannot deploy by itself; it needs to be included in a Process Application. The Process Application is the engine that deploys and drives processes.  |
| A process application can deploy mutliple processes. |
| A Process App is a container for handling a group of published processes and deploying them to a Process Engine. |
| [Creating a Process Application](https://docs.alfresco.com/process-services/latest/using/process/app-designer/#create-your-first-app) |

### Lab 2: Create a Process Application
1.	From the Activiti home page, select the App Designer tile to navigate to the Business Process Models page
2.	Select the Apps hyperlink in the top blue banner.
3.	Select the Create App button. 
4.	Give your application the App definition name: [Your User #] 9SecondInsurance (ex: U1 9SecondInsurance). 
    -	Optional: enter a description of your application describing it will do, ie: ```Deploys our claims processes.```
5.	Click the Create new ap definition button.
6.	OPTIONAL: On the App definition details page, you can change the color and icon of your application tile Use the Icon and Theme drop downs to customize your tile
7.	To add the process model you created, click on the Edit included models button below the tile 
8.	In the Models included in app definition popup window, select the process model you want to includ- NOTE: The selections toggle on and off when you click them, so be sure to click the one you want once and notice the blue + icon will appear to ensure it is selected 
9.	Click the Close button to close the popup window.
10.	Save the App definition by clicking on the save icon located in the top left of the page.
11.	In the Save app definition popup window, ensure you select the Publish? Checkbox, then click on the Save and close editor button.
12.	Navigate back to the home page by clicking the home button in the top, blue banner:  
13.	If your application already appears on the home page as a tile you are done.
    -	If not, deploy your new application by selecting the blank tile, depicted with a plus sign “+” (“Add a new app” appears when you hover your mouse over it. Select this tile, then select your application in the Add app to landing page popup window. Press the Deploy button on that window. Your application is now deployee

---

|  **Next Steps: Saving Information to 9 Second Insurance's Customer Database** |
| ----------- |
| We are capturing customer information, creating and saving a customer document, and now we need to save our customer's data to the 9SI customer database. |
| First, we'll need to create a Data Model that will allow us to specifiy the correct format of data that exists in the Database Table we want to map our process data to. |
| We'll then need to create a Service Task that implements the Data Model and allows us to map our process variables to the data model structure. |
| [BPMN Tasks](https://docs.alfresco.com/process-automation/latest/model/processes/bpmn/#tasks) |

### Lab 3: Create a Data Model
1. Access the data Model page within the App Designer.
2. Select the Create Data Model button.
3. Enter ```U[user #]9siCustomerData``` in the Data Model Name field and click the Create button.
4. In the Database Tab:
    -    Select ```aps-oracle-db``` from the Data Source dropdown.
    -    **DO NOT Click the Import button.**
    -    Click the Add Entity button. Enter the following information for the Entity:
            -	Entity Name: ```newCustomers```
            -	Entity Description: ```Details of all customers```
            -	Table Name: ```CUSTOMERS```
    -	**DO NOT Click the Import Attributes button.**
    -	Use the **Add Attribute** button to create new attributes. Use the chart below to add attributes and fill in the _attribute name_, _column name_, and select the correct _attribute type_. **Note:** the id variable should have the Primary key check box checked All others do not.

| Attribute name | Column name  | Attribute type |
| ----------     | ---------    | -------------- |
| id             | ID           | Number         |
| firstname      | FIRSTNAME    | String         |
| lastname       | LASTNAME     | String         |
| address        | ADDRESSLINE1 | String         |
| city           | CITY	        | String         |
| state          | STATE        | String         |
| zipCode        | ZIPCODE      | String         |

5. Select the Alfresco Tab Select alfresco1 in the Repository Source dropdown.
6. Save and Close the Model.


### Lab 4: Create a Store Entity Task / Save Values to Database
1. Enter your Customer Onboarding process in edit mode.    
2. Delete the end event.
3. Add a Store Entity Task to the process and connect it to the end of the process.
4. Select the new Store Entity Task and set the following configuration in the bottom panel:
    -	Name: ```Save Cust data to DB```
    -	Select Attribute Mapping to open the mapping popup window. Perform the following actions:
        -	Mapped Data model: ```9siCustomerDatabase```
        -	Mapped entity: ```newCustomers```
        -	New Variable: ```newCustomerdata```
        -	Configure the following attributes in the mapping table by selecting each Attribute Name and choosing the variable / form field it is associated with:
            1.	Id: newCustomerId (Variable)
            2.	Firstname: First Name (Form field)
            3.	Lastname: Last Name (Form field)
            4.	Address: Address (Form field)
            5.	City: City (Form field)
            6.	State: State - id (Form field)
            7.	zipCode: Zip Code (Form field)
        -	Press Save on the mapping window.
5. Save the process (Do not save a close - without an end event you may get a validation error, save anyway).

---

|  **Next Steps: Add the Customer as New User to APS** |
| ----------- |
| Now that we're saving our new user to the customer 9 Second Insurance database, we also need to add the customer as a new user to APS so we can easily access their data within the system. |
| To do this, we'll leverage a REST-Call Task and a Script Task. |

### Lab 5. Add a User to APS from Within onboarding Process
1. Enter your New Customer Onboarding process in edit mode.
2. Add a **Script Task** to your process (under Activities).
   - Name the task ```Add User to APS```.
3. Connect this task in the workflow **AFTER** the _Save Cust data to DB_ task.
4. In the bottom configuration panel configure the following:
   - **Script format:** ```groovy```
   - **Script:**
     ```
        import com.activiti.service.idm.UserServiceImpl;
        import com.activiti.security.SecurityUtils;
        import com.activiti.domain.idm.UserStatus;
        import com.activiti.domain.idm.AccountType;
        import com.activiti.domain.idm.User;
        import com.activiti.repository.idm.UserRepository;
        
        
        User currentUser = SecurityUtils.getCurrentUserObject();
        
        
        String email = execution.getVariable("newCustomerEmail");
        String firstName = execution.getVariable("newCustomerFirstName");
        String lastName = execution.getVariable("newCustomerLastName");
        String password = execution.getVariable("newCustomerPassword");
        String company = execution.getVariable("newCustomerCompany");
        String externalId = firstName + "" + lastName;
        externalId = externalId.toLowerCase();
        
        UserStatus initialStatus = UserStatus.ACTIVE;
        AccountType accountType = AccountType.ENTERPRISE;
        Long tenantId = currentUser.getTenantId();
        
        User newUser = userService.createNewUser(
                email,
                firstName,
                lastName,
                password,
                company,
                initialStatus,
                accountType,
                tenantId
            );
            
        println("newUser.getId() >>> "+newUser.getId());
        
        userRepository.save(newUser);
     ```
   - Save the script.
5. Save the process.

---

|  **Next Steps: Verify Customer Data was Saved** |
| ----------- |
| We're now saving our customer data in two places, in the 9SI customer database and as a new user in APS. Before we move on, we need to add a review mechanism that retrieves and displays those records so we can ensure that the data was saved correctly. This is standard functionality in database operations. |

### Lab 6. Add Data Retrieval and Verification Method
1. With your Onboarding Process in edit mode, add a new variable to your process by selecting the **Variables** parameter in the bottom configuration panel. Add the following variable:
   - **Variable name:** ```recordList```
   - **Variable type:** ```string```
2. Add a **Intermediate Timer Catching Event** to your process (found under the Intermediate Catching Events header) connected from the _Add User to APS_ script task.
   - Name it: ```Delay of 5 Seconds```
   - In the configuration panel, set the **Time Duration** parameter to: ```PT5S```.
3. Add a **REST-Call Task** to your process (under Activities).
   - Name the task ```Get All Users```.
4. Connect this task in the workflow **AFTER** the _Delay of 5 Seconds_ timer event.
5. With the Task selected, select the **Endpoint** paramter in the bottom configuration panel to open the _Change value for endpoint_ popup window. Use the following configuration:
   - **HTTP Method:** GET
   - **Base enpoint:** _choose aps from the drop-down_ and save the configuration.
   - **To add URL parameters...:** ```/api/enterprise/users```
   - Save the configuration.
6. Select the **Response Mapping** paramter to open the _Change value for Response mapping_ pop-up window and add a new variable with the following config:
   - **Property name:** ```data```
   - **Variable type:** ```string```
   - **Variable name:** ```userData```
   - Save the configuration.
7. Add a **Script Task** connected to the _Get All Users_ Task. Configure the following parameters in the bottom configuration panel:
   - **NAme:** ```Get Database User```
   - **Script format:** ```groovy```
   - **Script:**
     ```
        import groovy.sql.Sql;
        import groovy.json.*
        import groovy.json.JsonBuilder
        
        class Record {
            String recId
            String firstname
            String lastname
            String address
            String city
            String state
            String zip
        }
        
        def url = 'jdbc:oracle:thin:@//aps-custom-oracle-db.cp58lgpzkwpy.us-east-1.rds.amazonaws.com/ORCL'
        def user = 'admin'
        def password = 'administrator'
        def driver = 'oracle.jdbc.driver.OracleDriver'
        def sql = Sql.newInstance(url, user, password, driver)
        
        rowNum = 0;
        def recordList = [];
        
        sql.eachRow("SELECT ID, FIRSTNAME, LASTNAME, ADDRESSLINE1, CITY, STATE, ZIPCODE FROM CUSTOMERS WHERE FIRSTNAME=${newCustomerFirstName} AND LASTNAME=${newCustomerLastName}") { row ->
           
          def r = new Record( recId: row.id, firstname:row.firstname, lastname:row.lastname, address:row.addressLine1, city:row.city, state:row.state, zip:row.zipcode)
            recordList.add(r);
          
        }
        
          println new JsonBuilder( recordList ).toPrettyString()
          execution.setVariable("recordList", new JsonBuilder( recordList ).toPrettyString())
     ```
8. Create a new **User Task** connected to the _Get Database User_ script task.
   - Name the user task: ```Verify User Data```.
9. In the bottom config panel, select the **Form reference** parameter and choose Create Form on the form reference popup window. Name it: ```Verify User data```.
10. Follow these steps in the Form Editor to create a new form:
    - Drag a Dynamic Table onto the form stage. Select the pencil icon to go into edit mode.
    - Enter into Label field: ```Verify Database Data:```
    - Select the Override Id checkbox.
    - Enter into the ID field: ```recordList```
    - Select the Table Columns tab.
    - Press the "+" icon button to create new property mappings with the following values:
        - Column 1:
            1.	Property ID: ```recId```
            2.	Property Name: ```ID```
            3.	Property Type: ```string```
        - Column 2:
            1.	Property ID: ```firstname```
            2.	Property Name: ```First name```
            3.	Property Type: ```string```
        - Column 3:
            1.	Property ID: ```lastname```
            2.	Property Name: ```Last Name```
            3.	Property Type: ```string```
        - Column 4:
            1.	Property ID: ```address```
            2.	Property Name: ```Address```
            3.	Property Type: ```string```
        - Column 5:
            1.	Property ID: ```state```
            2.	Property Name: ```State```
            3.	Property Type: ```string```
        - Column 6:
            1.	Property ID: ```city```
            2.	Property Name: ```City```
            3.	Property Type: ```string```
        - Column 7:
            1.	Property ID: ```zip```
            2.	Property Name: ```Zip```
            3.	Property Type: ```string```
    - Close the edit prompt.
    - Add another **Dynamic Table** to the form.
    - Enter into Label field: ```Verify APS User Data:```
    - Select the Override Id checkbox.
    - Enter into the ID field: ```userData```
    - Select the Table Columns tab.
    - Press the "+" icon button to create new property mappings with the following values:
        - Column 1:
            1.	Property ID: ```id```
            2.	Property Name: ```ID```
            3.	Property Type: ```string```
        - Column 2:
            1.	Property ID: ```firstname```
            2.	Property Name: ```First Name```
            3.	Property Type: ```string```
        - Column 3:
            1.	Property ID: ```lastname```
            2.	Property Name: ```Last Name```
            3.	Property Type: ```string```
        - Column 4:
            1.	Property ID: ```company```
            2.	Property Name: ```Company```
            3.	Property Type: ```string```
        - Column 5:
            1.	Property ID: ```email```
            2.	Property Name: ```Email```
            3.	Property Type: ```string```
    - Close the edit prompt.
    - Save and close the form.
11. Add an end event to the _Verify User Data_ User task.
12. Save and close the process.
13. Deploy and test the process in ADW.

---

|  **Next Steps: Know-Your-Customer Logic for Out-of-State Documentation** |
| ----------- |
| 9 Second Insurance is a Ohio-based insurance company, and our leaders need to be able determine if a customer resides in-state or out-of-state. In order to meet state insurance regulations. We're already capturing a customer's state which allows us to implement the conditional logic we need to achieve this functionality. There are a few ways we could implement this, one of them a Script task, which we've already seen an example of. However, knowing that this KYC logic is likely to evolve in the near future to include additional conditions, we'll apply some forward thinking and use a Java Delegate in order to determine in or out of state. |
| [Java Delgates](https://support.hyland.com/r/Alfresco/Alfresco-Process-Services/24.3/Alfresco-Process-Services/Develop/Develop-extensions-for-Process-Services/Custom-Logic/Java-Delegates) |

### Lab 7: Create a Service Task with Java Delegate
1.	Enter your New Customer Onboarding process in edit mode.
2.	Select the Variables attribute in the configuration panel to add a new variable.
3.	Add a variable titled ```stateVerify``` as a ```string```
4.	From the left panel, under Activities, drag a Service Task into the stage. Connect it from the _Verify user Data_ user task.
5.	Select the Name attribute and give it the following name: ```KYC Delegate```
6.	Select the Class attribute and paste in the following text: ```com.activiti.extension.bean.KYCJavaDelegate```
7.  Add an **End Event** to the _KYC Delegate_ service task.
8.	Save and close the editor. 
9.	Navigate to the Process Application and publish your App so you may test the new additions.
10.	You may now test your process in the Digital Workspace. 
    -	*Note: To ensure the KYC Java Delegate task is working you can view the saved document and check the “out of state” box to ensure the true or false variable is being set by the Delegate.


|  **Next Steps: In-State and Out-of-State Impact on our Process** |
| ----------- |
| We're now using a Service Task to call a method that exists in our Java delegate to set a process variable to be true or false in relation to the customer being in or out of state. In the event our customer is Ohio-based, we need not do anything extra, however for all others 9SI would like a task to engage the team's manager and prompt them to reach out to the customer and send a Out-of-State waiver. |
| We'll add an exclusive gateway that will allow us to go down either path specified above. |
| Our Out-of-State path will include a User Task assigned to our Team's manager. |

### Lab 8: Add an Exclusive Gateway and Splitting Paths
1.	Open your New Customer process in edit mode.
2.	Delete the end event.
3.	From the left panel, under Gateways, add an Exclusive Gateway to your process. Connect it from the _KYC Delegate_ service task.
4.	Select the gateway and add a **User task** using the small menu that appears.
5.	Name the user task: ```Manager Follow-Up```
6.	With the user task selected, click on the Referenced form No reference selected value.
7.	In the Form reference popup window, select the New Form button.
8.	In the Create a new form window, enter the following values:
    - Form name: ```Manager Follow-Up```
    - Description: ```Allows manager to follow up with out-of-state customers.```
    - Stencil: ```Default form```
    - Select the Create form button. 
9.	Follow these steps in the Form Editor to create the form:
    - Add a Header to the page and go into edit mode. Configure with the following information:
        - Label: ```Customer Information:```
    - Add a Display Text field to the header. Configure with the following information:
      text:
        ```
        Out of State Customer Information:
                        
        ${newCustomerLastName}, ${newCustomerFirstName} - ${newCustomerId}
        ${newCustomerPhoneNumber}
        ${newCustomerEmail}
        
        Please follow up with customer regarding out-of-state insurance waiver.
        ```
    - Add a Header to the page below the first header and go into edit mode. Configure with the following information:
        - Label: ```Manager’s Notes:```
    - Add a Multi-line text object to the new header. Configure with the following information:
        - Label: ```Please indicate summary of conversation with customer or enter “No Contact”.```
        - Override ID: checked
        - ID: ```customerNotes```
        - Required: checked
  	- Save and close the form editor.
10.	Select the Manager Follow-Up task and select the Assignment attribute in the configuration panel. This will open an assignment popup window. Set the following configuration in the popup window:
    - Type: ```Identity Store```
    - Assignment: ```Assigned to group manager```
    - Source: ```Search```
    - Search for and select the Claims-Team group. The Group attribute should now show the Claims-Team value.
    - Press the Save button.
11.	Create an **End Event** from the _Exclusive gateway_ using the small menu that appears when the gateway is selected. 
    - Select the _Sequence Flow Line_ that connects the gateway toi the end event. Check the **Default Flow** check-box in the bottom configuration panel.
12. Select the sequence flow line from the Gateway event to the Manager Follow-Up Task and use the **Flow condition** parameter to configure the following flow:
    - Condition Type: ```Simple```
    - Depends on: ```Variable```
    - Variable Drop-down: ```stateVerify```
    - Operator: ```equal```
    - Value: ```false```
13.	Save your process, redeploy your application, and test the process.

---

|  **Next Steps: Creating and Saving a Customer Document** |
| ----------- |
| Since we are now capturing customer information we need to be able to create a real document for our customer and save it to our content management system (ACS). |
| In APS, generating and saving a document are two seperate steps. |
| [Generating a Document](https://docs.alfresco.com/process-automation/latest/model/connectors/generate/) |

### Lab 9: Generating and Saving a Document
1.	Enter your New Customer Onboarding process in edit mode.
3.	Remove the **End event** from the process. 
4.	From the left task menu under Activities, add a **Generate Document** task to the process in place of the deleted end event (connected from the _Exclusive Gateway_).
    -	Give the Generate Document task the following configuration:
        -	Name: ```Create NC Doc```
        -	Select the Document Variable attribute and enter the value ```newCustDoc``` into the field.
        -	Select the Template attribute to open the Change value for “Template” popup window.
            -	Select the Custom Template tab.
            -	Select the Choose File button to open a file browsing window. From the file package you received, navigate to the following file path and choose the file named: 
```Aps_documents/form_doc_templates/9si_newCustomer.docx```
            -	The name of the template file should now appear as the value of the Template attribute.
        -	Select the File name attribute to open the Change value for “File name” popup box.
        -	Enter the following file name: ```customer_${newCustomerLastName}_${newCustomerId}```
        -	Press the save button to close the popup window.
5.	From the left task menu under the Alfresco header, add a **Publish to Alfresco** task to the process connected from the _Create NC Doc_ document task.
6.	Name your _Publish to Alfresco task_: ```Save Doc to CMS```.
7.	To configure the Publish to Alfresco task select it to show its attribute values in the bottom configuration panel. Give it the following configuration:
    - Select the Alfresco Content attribute to open the Change Value popup window. Choose **Publish all content uploaded in process** from the dropdown menu and press the Save button.
    - Select the Alfresco Destination attribute to open the Change Value popup window.
    -	Next to **Destination**, click the _Select folder_ button to open the browse Alfresco popup window. The site you created previously should populate here. Choose your site, then navigate to and select the following folder path: _9SecondInsurance/documentLibrary/Customer Information_
-	Press the Save button on the Change Value popup window.
10.	Finally, add an end event to your process. Select the _Create NC Doc_ Publish to Alfresco task, then select the end event icon from the small popup menu.
11.	Save your process and close the editor.
12.	Navigate to your application and republish.
13.	Test your completed process in ADW.

---

