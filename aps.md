<!-- image -->

# Alfresco Process Services: Intermediate Techniques
### Database Calls and Java Delegates


## Scenario

You're the APS Administrator for 9 Second Insurance, a fast-moving insurance company headquartered in Ohio that serves customers nationwide. Management has given you a new challenge: streamline how new customer forms are processed. The goal is to design a process in APS that kicks off automatically the moment an agent uploads a customer onboarding form into Alfresco Content Services (ACS). Once uploaded, ACS should immediately detect the document and send it to Amazon Textract to extract key customer details-name, address, policy type, and more. When Textract returns the results, the process will pause for a human verification step, giving an agent the chance to review and correct the extracted information. With the data confirmed, APS will then create a new customer record in the system, assigning a unique customer ID. Next, those details will be pushed into the company's external Oracle database so other business systems can access the information. Finally, you'll implement a JavaDelegate that automatically decides where the document should be stored based on the customer's location: Ohio customers go into the OH directory, while everyone else is routed to the Out-of-State directory. By the end, agents will be able to simply drop a form into ACS and let APS handle everything-from scanning and validation to database updates and smart document storage-with only one point of human interaction for verification which could be removed to completely automate the process.

## Logging into ACS

1.  Go to http://clive2025.alfdemo.com/
2.  Select **Alfresco Digital Workspace with AEV** under _Alfresco Enterprise Viewer and Content Accelerator_.
3.  Login with User:Password ```demo```:```demo```
4.  Select **My Libraries > 9 Second Insurance**.
5.  Open the **_Class Materials** folder.
6.  Select the **9SecondFoodForm\_Blank.pdf** and download the document.
7.  Select the **9 Second Insurance** breadcrumb at the top to go back into the root folder.
8.  Find your assigned folder **(User#)** and open it.
    - Ex. User 7 will use the User7 folder.
<br>

| There are three folders: Customer Policies, Intake, and Process. The Intake folder is where your agent will place the customer verification form. This folder has three rules: |
| --- |
| 1. When a document is added, it applies the 'Insurance' aspect to the metadata. |
| 2. Once that's applied, it runs a custom aiTextract JavaScript. |
| 3. After the script finishes, the document automatically moves to the Process folder. |
| When the document enters the Process folder, an onboarding JavaScript runs to automatically start the onboarding process. |

<br>

9.  Open the ```9SecondFoodForm\_Blank.pdf``` and fill out the form and save for later use.

REPLACE THE 'X' AT THE END OF THE POLICY/GROUP NUMBER WITH YOUR USER NUMBER.

## Logging into APS

1.  Go to http://clive2025.alfdemo.com/
2.  Select Activiti App under Alfresco Process Services.
3.  Login with User:Password - ```demo```:```demo```
4.  Select App Designer.
5.  Find your preconfigured onboarding# process. Ex. User 5 will use onboarding5
6.  Select the Visual Editor button.

# Mapping Data and Verify Form
## Mapping Data

1.  In your onboarding properties panel, review the preconfigured variables
2.  Select the Alfresco dropdown in the tools panel on the left and place a Retrieve Alfresco properties task to the process.
3.  Connect the start event to the task.
4.  Name the task Map Data .
5.  Open the Alfresco Properties in the task's properties panel.
6.  Open the File dropdown and select apsdocument.
7.  Add a property by selecting the + sign at the bottom of the table.
8.  In the File Property type, ins:FirstName.
9.  In the Property Type leave option as string.
10.  In the Value Type, select the Variables button, and select the firstName variable.
11.  Repeat the steps for the following properties (all Property Types will be string):
12.  Press the Save button.

| File Property     | Variable     |
|-------------------|--------------|
| ins:LastName      | lastName     |
| ins:StreetAddress | address      |
| ins:City          | city         |
| ins:State         | state        |
| ins:ZipCode       | zipCode      |
| ins:Email         | email        |
| ins:Phone         | phoneNumber  |
| ins:PolicyNumber  | policyNumber |

## Verify Form

1.  Select the Activities dropdown in the tools panel on the left and place a User Task to your process.
2.  Connect your task and name it Verify Data.
3.  Open the Referenced Form in the task's properties panel.
4.  Select and Open the Validate-Data-New form.
- a.  This preconfigured form will showcase the uploaded document as well as have the Personal and Policy Information prefilled with content that was retrieved from Textract.

<!-- image -->

5.  Press the Save icon.
6.  Press the Save and close editor button.

## Create App and Test Process

1.  Add an end event to the end of the Verify Data task.
2.  Validate and save the process by selecting the Check and Save icons.
3.  Select Save and close editor .
4.  Select the Apps tab located at the top of the window.
5.  Select the Create App button.
6.  Name the app onboarding#.
- a. Replace # with your User number.
8. Ex: User 6 = onboarding6.
7.  Select the Create new app definition button.
8.  Select the Edit included models button.
9.  Add your onboarding# model. Ex: User 9 would select onboarding9.
10.  Select Close .
11.  Change the Icon and Theme to your choosing.
12.  Select the Save icon.
13.  Select the checkbox next to Publish and save and close the editor .
14.  Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm\_Blank.pdf into your Intake folder.

Ex: User 8 = My Libraries &gt; 9 Second Insurance &gt; User8 &gt; Intake *This rule can take up to a few minutes to fully OCR and move into the processing folder.

15.  Go back into Activiti and open your application on the main page.
16.  Verify the data scanned correctly and press complete .

## Adding Customer to APS and Database

## Adding Customer to APS

1.  Open your onboarding# process.
- a.  Home &gt; App Designer &gt; onboarding#
2.  Delete the End event at the end of the Verify Data User Task.
3.  Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.
4.  Connect your task and name it Add Customer to APS.
5.  Select the Script format in the task's properties panel and type groovy .
6.  Select the Script in the task's properties panel and copy the following:

<!-- image -->

<!-- image -->

7.  Press Save .

## Create Customer Unique ID

1.  Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.
2.  Connect your task and name it Create Customer ID.
3.  Select the Script format in the task's properties panel and type groovy .
4.  Select the Script in the task's properties panel and copy the following:

## execution.setVariable('customerId', execution.getProcessInstanceId());

5.  Press Save .

<!-- image -->

## Write Customer Data to Database

1.  Select the Activities dropdown in the tools panel on the left place and add a Store Entity Task to your process.
2.  Connect your task and name it Write Data to DB.
3.  Select the Attribute Mapping in the task's properties panel.
4.  Press the dropdown for Mapped data model and select 9siCustomerNew .
5.  Press the dropdown for Mapped entity and select newCustomers .
6.  Type newCustomerdata in the New variable window.
7.  Select the first cell under Mapped value.
8.  Press the Variable button and select customerId .
9.  Repeat the steps for the following Attribute name:

| Attribute name   | Mapped value   |
|------------------|----------------|
| firstname        | firstName      |
| lastname         | lastName       |
| address          | address        |
| city             | city           |
| state            | state          |
| zip              | zipCode        |
| email            | email          |
| phone            | phoneNumber    |
| policynum        | policyNumber   |

## 10.  Press Save .

## Timer Event

1.  Select the Intermediate Catching Events dropdown in the tools panel on the left place and add an Intermediate timer catching event to your process.
2.  Connect your task and name it 5 sec delay.
3.  Select the Time duration in the task's properties panel and type PT5S .

## Rest call

1.  Select the Activities dropdown in the tools panel on the left place and add a Rest Call Task to your process.
2.  Connect your task and name it Get Users.
3.  Select Endpoint in the task's properties panel.
4.  Select GET on the HTTP method.
5.  Select aps on Base endpoint.
6.  Add /api/enterprise/users to the Rest URL.
7.  Press Test to test the Rest call.
8.  Press Save .
9.  Select Response mapping in the task's properties panel.
10.  Press the + sign to add a JSON Property.
11.  Enter data in the Property name.

<!-- image -->

12.  Enter userData in the Variable name.
13.  Press Save .

## Retrieve Users from Database

1.  Select the Activities dropdown in the tools panel on the left place and add a Script Task to your process.
2.  Connect your task and name it Get User from DB.
3.  Select the Script format in the task's properties panel and type groovy .
4.  Select the Script in the task's properties panel and copy the following:

<!-- image -->

<!-- image -->

5.  Press Save .

## Display APS and Database Users

1.  Select the Activities dropdown in the tools panel on the left and place a User Task to your process.
2.  Connect your task and name it Display User.
3.  Open the Referenced Form in the task's properties panel.
4.  Select and Open the Verify User data form.

<!-- image -->

5.  This preconfigured form will showcase the Database data of the customer uploaded from the form as well as the data from APS. This is a simple verification step to ensure both data matches.
6.  Press the Save icon.
7.  Press the Save and close editor button.

## Update App and Test Process

1.  Add an end event to the end of the Display User task.
2.  Validate and save the process by selecting the Check and Save icons.
3.  Select Save and close editor .
4.  Select the Apps tab located at the top of the window.
5.  Find and open your application.
6.  Select the Publish button.
7.  Select Publish app definition.
8.  Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm\_Blank.pdf into your Intake folder.
9.  Go back into Activiti and open your application on the main page.
10.  Verify the data scanned correctly and press complete .
- a.  Due to APS not being able to store duplicate Email's, change the email address by adding a number before the @ sign. Ex.test2@test.com
11.  Verify the data in the database matches the data from APS correctly and press complete .

## Java Delegates

## Java Delegate

1.  Open your onboarding# process.
- a.  Home &gt; App Designer &gt; onboarding#
2.  Delete the End event at the end of the Verify Data User Task.
3.  Select the Activities dropdown in the tools panel on the left place and add a Service Task to your process.
4.  Connect your task and name it KYC Delegate.
5.  Select the Class in the task's properties panel and type com.activiti.extension.bean.KYCJavaDelegate

## Automate Document Relocation

1.  Select the Gateways dropdown in the tools panel on the left place and add an Exclusive gateway to your process.
2.  Connect the gateway to the KYC Delegate task.
3.  Select the Alfresco dropdown in the tools panel on the left and place two Call Alfresco Action tasks to the process.

<!-- image -->

4.  Connect both to the exclusive task and name one Move to OH , and the other Move to Non-OH.
5.  Select the sequence flow line to Move to OH.
6.  Select the Flow condition in the task's properties panel.
7. In Condition type , select Simple .
8. In Depend on , select Variable .
9.  In the Select variable dropdown, select the stateVerify variable.
10.  In the Select operator dropdown, select equal and checked.
11. Press Save.
12.  Select the sequence flow line to Move to Non-OH.
13.  Check the box in the Default flow in the task's properties panel.

## Move Document to OH Folder

1.  Select the Move to OH task.
2.  Select the Repository in the task's properties panel.
3.  Press Save.
4.  Select the Action in the task's properties panel.
5.  In the Action dropdown, select Move .
6.  In the Action Parameters , select the Values column.
7.  In the Values section, replace &lt;ID&gt; with your specific OH folder node ID.
- a.  To find your node, go back into the Digital workspace. Open the Customer Policies &gt; OH based Policy Folder. In the address bar, you will find the folder node after (libraries/)
8.  Press Save.
9.  Select the Content in the task's properties panel.
10.  Select the Variable tab.
11.  Select the acsnodeid variable.
12.  Press Save.

## Move Document to Non-OH Folder

1.  Select the Move to Non-OH task.
2.  Select the Repository in the task's properties panel.
3.  Press Save.
4.  Select the Action in the task's properties panel.
5.  In the Action dropdown, select Move .
6.  In the Action Parameters , select the Values column.
7.  In the Values section, replace &lt;ID&gt; with your specific Non-OH folder node ID.
8.  Press Save.
9.  Select the Content in the task's properties panel.
10.  Select the Variable tab.

<!-- image -->

11.  Select the acsnodeid variable.
12.  Press Save.

## Update App and Test Process

1.  Add an end event to the end of both Alfresco tasks.
2.  Validate and save the process by selecting the Check and Save icons.
3.  Select Save and close editor .
4.  Select the Apps tab located at the top of the window.
5.  Find and open your application.
6.  Select the Publish button.
7.  Select Publish app definition.
8.  Go back into the Digital Workspace and drop/upload the filled 9SecondFoodForm\_Blank.pdf into your Intake folder.
9.  Go back into Activiti and open your application on the main page.
10.  Verify the data scanned correctly and press complete .
- a.  Due to APS not being able to store duplicate Email's, change the email address by adding a number before the @ sign. Ex.test2@test.com
11.  Verify the document moved to the correct folder.

## Your final Model should look similar to this.

<!-- image -->

<!-- image -->
