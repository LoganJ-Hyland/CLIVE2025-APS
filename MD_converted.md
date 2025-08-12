Alfresco Process Services: Intermediate Techniques

Database Calls and Java Delegates

Community Live 2025




Scenario



You’re the APS Administrator for 9 Second Insurance, a fast-moving insurance company headquartered in Ohio that serves customers nationwide. Management has given you a new challenge: streamline how new customer forms are processed. The goal is to design a process in APS that kicks off automatically the moment an agent uploads a customer form into Alfresco Content Services (ACS). Once uploaded, ACS should immediately detect the document and send it to Amazon Textract to extract key customer details—name, address, policy type, and more. When Textract returns the results, the process will pause for a human verification step, giving an agent the chance to review and correct the extracted information. With the data confirmed, APS will then create a new customer record in the system, assigning a unique customer ID. Next, those details will be pushed into the company’s external Oracle database so other business systems can access the information. Finally, you’ll implement a JavaDelegate that automatically decides where the document should be stored based on the customer’s location: Ohio customers go into the OH directory, while everyone else is routed to the Out-of-State directory. By the end, agents will be able to simply drop a form into ACS and let APS handle everything—from scanning and validation to database updates and smart document storage—with only one point of human interaction for verification.



Logging into ACS

Go to http://clive2025.alfdemo.com/

Select Alfresco Digital Workspace with AEV under Alfresco Enterprise Viewer and Content Accelerator.

Login with User:Password – Demo:Demo

Select My Libraries > 9 Second Insurance.

Open the _Class Materials folder.

Select the 9SecondFoodForm_Blank.pdf and download the document.

Select the 9 Second Insurance breadcrumb at the top to go back into the root folder.

Find your assigned folder (User#) and open it.



There are three folders: Customer Policies, Intake, and Process. The Intake folder is where your agent will place the customer verification form. This folder has three rules:

	1.	When a document is added, it applies the “Insurance” aspect to the metadata.

	2.	Once that’s applied, it runs a custom aiTextract JavaScript.

	3.	After the script finishes, the document automatically moves to the Process folder.

When the document enters the Process folder, an onboarding JavaScript runs to automatically start the onboarding process.

There are three folders: Customer Policies, Intake, and Process. The Intake folder is where your agent will place the customer verification form. This folder has three rules:

	1.	When a document is added, it applies the “Insurance” aspect to the metadata.

	2.	Once that’s applied, it runs a custom aiTextract JavaScript.

	3.	After the script finishes, the document automatically moves to the Process folder.

When the document enters the Process folder, an onboarding JavaScript runs to automatically start the onboarding process.Ex. User 7 will use the User7 folder.

















Open the 9SecondFoodForm_Blank.pdf and fill out the form and save for later use.

 REPLACE THE “X” AT THE END OF THE POLICY/GROUP NUMBER WITH YOUR USER NUMBER.

Loggin into APS

Go to http://clive2025.alfdemo.com/

Select Activiti App under Alfresco Process Services.

Login with User:Password – Demo:Demo

Select App Designer.

Find your preconfigured onboarding# process.

Ex. User 5 will use onbarding5.

Mapping Data and Verify Form

Mapping Data

In your onboarding properties panel, review the preconfigured variables

Select the Alfresco dropdown in the tools panel on the left and place a Retrieve Alfresco properties task to the process.

Connect the start event to the task.

Name the task Map Data.

Open the Alfresco Properties in the task’s properties panel.

Open the File dropdown and select apsdocument.

Add a property by selecting the + sign at the bottom of the table.

In the File Property type, ins:FirstName.

In the Property Type leave option as string.

In the Value Type, select the Variables button, and select the firstName variable.

Repeat the steps for the following properties (all Property Types will be string):

File Property

Variable

ins:LastName

lastName

ins:StreetAddress

address

ins:City

city

ins:State

state

ins:ZipCode

zipCode

ins:Email

email

ins:Phone

phoneNumber

ins:PolicyNumber

policyNumber

Press the Save button.

Verify Form

Select the Activities dropdown in the tools panel on the left and place a User Task to your process.

Connect your task and name it Verify Data.

Open the Referenced Form in the task’s properties panel.

Select and Open the Validate-Data-New form.

This preconfigured form will showcase the uploaded document as well as have the Personal and Policy Information prefilled with content that was retrieved from Textract.

Press the Save icon.

Press the Save and close editor button.

Create App and Test Process

Add an end event to the end of the Verify Data task.

Validate and save the process by selecting the Check and Save icons.

Select Save and close editor.

Select the Apps tab located at the top of the window.

Select the Create App button.

Name the app onboarding#.

Replace # with your User number.
Ex: User 6 = onboarding6.

Select the Create new app definition button.

Select the Edit included models button.

Add your onboarding# model.
Ex: User 9 would select onboarding9.

Select Close.

Change the Icon and Theme to your choosing.

Select the Save icon.

Select the checkbox next to Publish and save and close the editor.

Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm_Blank.pdf into your Intake folder.

Ex: User 8 = My Libraries > 9 Second Insurance > User8 > Intake

*This rule can take up to a few minutes to fully OCR and move into the processing folder.

Go back into Activiti and open your application on the main page.

Verify the data scanned correctly and press complete.

Adding Customer to APS and Database

Adding Customer to APS

Open your onboarding# process.

Home > App Designer > onboarding#

Delete the End event at the end of the Verify Data User Task.

Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.

Connect your task and name it Add Customer to APS.

Select the Script format in the task’s properties panel and type groovy.

Select the Script in the task’s properties panel and copy the following:






   import com.activiti.service.idm.UserServiceImpl;

   import com.activiti.security.SecurityUtils;

   import com.activiti.domain.idm.UserStatus;

   import com.activiti.domain.idm.AccountType;

   import com.activiti.domain.idm.User;

   import com.activiti.repository.idm.UserRepository;

     

   User currentUser = SecurityUtils.getCurrentUserObject();

     

   String firstName = execution.getVariable("firstName");

   String lastName = execution.getVariable("lastName");

   String email = execution.getVariable("email");

   String password = "demo";

   String company = "na";

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



Press Save.

Create Customer Unique ID

Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.

Connect your task and name it Create Customer ID.

Select the Script format in the task’s properties panel and type groovy.

Select the Script in the task’s properties panel and copy the following:

  execution.setVariable('customerId', execution.getProcessInstanceId());



Press Save.







Write Customer Data to Database

Select the Activities dropdown in the tools panel on the left place and add a Store Entity Task to your process.

Connect your task and name it Write Data to DB.

Select the Attribute Mapping in the task’s properties panel.

Press the dropdown for Mapped data model and select 9siCustomerNew.

Press the dropdown for Mapped entity and select newCustomer.

Type newCustomerdata in the New variable window.

Select the first cell under Mapped value.

Press the Variable button and select customerId.

Repeat the steps for the following Attribute name:

Attribute name

Mapped value

firstname

firstName

lastname

lastName

address

address

city

city

state

state

zip

zipCode

email

email

phone

phoneNumber

policynum

policyNumber



Press Save.

Timer Event

Select the Intermediate Catching Events dropdown in the tools panel on the left place and add a Intermediate timer catching event to your process.

Connect your task and name it 5 sec delay.

Select the Time duration in the task’s properties panel and type PT5S.

Rest call

Select the Activities dropdown in the tools panel on the left place and add a Rest Call Task to your process.

Connect your task and name it Get Users.

Select Endpoint in the task’s properties panel.

Select GET on the HTTP method.

Select aps on Base endpoint.

At /api/enterprise/users to the Rest URL.

Press Test to test the Rest call.

Press Save.

Select Response mapping in the task’s properties panel.

Press the + sign to add a JSON Property.

Enter data in the Property name.

Enter userData in the Variable name.

Press Save.

Retrieve Users from Database

Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.

Connect your task and name it Get User from DB.

Select the Script format in the task’s properties panel and type groovy.

Select the Script in the task’s properties panel and copy the following:






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

       String email

       String phone

       String policy

   }

   

   def url = 'jdbc:oracle:thin:@//aps-custom-oracle-db.cp58lgpzkwpy.us-east-1.rds.amazonaws.com/ORCL'

   def user = 'admin'

   def password = 'administrator'

   def driver = 'oracle.jdbc.driver.OracleDriver'

   def sql = Sql.newInstance(url, user, password, driver)

   

   rowNum = 0;

   def recordList = [];

   

   out.println('Query Customer: '+execution.getVariable("customerId"));

   

   sql.eachRow("SELECT * FROM NINESI WHERE ID = ${customerId}") { row ->

      

     def r = new Record( recId:row.id, firstname:row.firstname, lastname:row.lastname, address:row.streetaddress, city:row.city, state:row.state, zip:row.zipcode, email:row.email, phone:row.phone, policy:row.policy)

       recordList.add(r);

     

   }

   

 println new JsonBuilder( recordList ).toPrettyString()

 out.println('Customer Details: '+recordList);

 execution.setVariable("recordList", new JsonBuilder( recordList ).toPrettyString())





Press Save.

Display APS and Database Users

Select the Activities dropdown in the tools panel on the left and place a User Task to your process.

Connect your task and name it Display User.

Open the Referenced Form in the task’s properties panel.

Select and Open the Verify User data form.

This preconfigured form will showcase the Database data of the customer uploaded from the form as well as the data from APS. This is a simple verification step to ensure both data matches.

Press the Save icon.

Press the Save and close editor button.

Update App and Test Process

Add an end event to the end of the Display User  task.

Validate and save the process by selecting the Check and Save icons.

Select Save and close editor.

Select the Apps tab located at the top of the window.

Find and open your application.

Select the Publish button.

Select Publish app definition.

Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm_Blank.pdf into your Intake folder.

Go back into Activiti and open your application on the main page.

Verify the data scanned correctly and press complete.

Due to APS not being able to store duplicate Email’s, change the email address by adding a number before the @ sign. Ex.test2@test.com

Verify the data in the database matches the data from APS correctly and press complete.



Java Delegates

Java Delegate

Open your onboarding# process.

Home > App Designer > onboarding#

Delete the End event at the end of the Verify Data User Task.

Select the Activities dropdown in the tools panel on the left place and add a Service Task to your process.

Connect your task and name it KYC Delegate.

Select the Class in the task’s properties panel and type com.activiti.extension.bean.KYCJavaDelegate

Automate Document Relocation

Select the Gateways dropdown in the tools panel on the left place and add an Exclusive gateway to your process.

Connect the gateway to the KYC Delegate task.

Select the Alfresco dropdown in the tools panel on the left and place two Call Alfresco Action tasks to the process.

Connect both to the exclusive task and name one Move to OH, and the other Move to Non-OH.

Select the sequence flow line to Move to OH.

Select the Flow condition in the task’s properties panel.

In Condition type, select Simple.

In Depend on, select Variable.

In the Select variable dropdown, select the stateVerify variable.

In the Select operator dropdown, select equal and checked.

 Press Save.

Select the sequence flow line to Move to Non-OH.

Check the box in the Default flow in the task’s properties panel.

Move Document to OH Folder

Select the Move to OH task.

Select the Repository in the task’s properties panel.

Press Save.

Select the Action in the task’s properties panel.

In the Action dropdown, select Move.

In the Action Parameters, select the Values column.

In the Values section, replace <ID> with your specific OH folder node ID.

To find your node, go back into the Digital workspace. Open the Customer Policies > OH based Policy Folder. In the address bar, you will find the folder node after (libraries/)

Press Save.

Select the Content in the task’s properties panel.

Select the Variable tab.

Select the acsnodeid variable.

Press Save.

Move Document to Non-OH Folder

Select the Move to Non-OH task.

Select the Repository in the task’s properties panel.

Press Save.

Select the Action in the task’s properties panel.

In the Action dropdown, select Move.

In the Action Parameters, select the Values column.

In the Values section, replace <ID> with your specific Non-OH folder node ID.

Press Save.

Select the Content in the task’s properties panel.

Select the Variable tab.

Select the acsnodeid variable.

Press Save.

Update App and Test Process

Add an end event to the end of both Alfresco tasks.

Validate and save the process by selecting the Check and Save icons.

Select Save and close editor.

Select the Apps tab located at the top of the window.

Find and open your application.

Select the Publish button.

Select Publish app definition.

Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm_Blank.pdf into your Intake folder.

Go back into Activiti and open your application on the main page.

Verify the data scanned correctly and press complete.

Due to APS not being able to store duplicate Email’s, change the email address by adding a number before the @ sign. Ex.test2@test.com

Verify the document moved to the correct folder.





Your final Model should look similar to this.








 © Hyland Software, Inc. All rights reserved.



 © Hyland Software, Inc. All rights reserved.





 © Hyland Software, Inc. All rights reserved.



 © Hyland Software, Inc. All rights reserved.