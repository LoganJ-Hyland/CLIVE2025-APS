# Reimburesement Claims Process

|  **Overall Scenario – 9 Second Insurance: Reimbursement Claim Process** |
| ----------- |
| As a systems architect working for 9 Second Insurance, you are tasked with creating a process that will allow agents to create reimbursement claims on behalf of customers. Our process will need to find the customer and capture and verify claim specific data. Specifically, our process will include: |
| Selection mechanism to retrieve customer information in both APS and the 9SecondInsurance customer database. |
| A method to verify customer and claim information. |
| Perform logic to adjust a deductible based on claimed equipment value (Decision Table). |


### Lab 1. Create a Customer Selection and Retrieve Customer Values
1.	From the Alfresco home page, launch the Activiti App (Process Services) by clicking on the Activiti App hyperlink. 
    1.	Sign in with your provided username and password. You will be directed to the Activiti App home page.
2.	Select the App Designer tile to navigate to the Business Process Models page.
3.	To create a new process, press the Create Process button in the top right of the page.
4.	In the Create a new business process model popup, enter the following information:
    1.	Model name: ```[Your user #] New Claim``` (ex: U1 New Claim)
    2.	Description: Create a new claim.
    3.	Editor Type: Leave as BPMN editor
    4.	Stencil: Default BPMN
    5.	Press the Create new model button.
5.	With nothing selected on the stage, select the Variables attribute in the bottom configuration panel.
6.	Select the “+” icon below the chart to add new variables. We’ll add a few variables that will be used in this process. Create the following variables with this configuration:

|  VARIABLE NAME      |  VARIABLE TYPE    |
| -----------------   | ----------------- |
|  ```cAddress```     |  string           |
|  ```cCity```        |  string           |
|  ```cFirstName```   |  string           |
|  ```cLastName```    |  string           |
|  ```cState```       |  string           |
|  ```cZip```         |  string           |
|  ```deductible```   |  integer          |
|  ```lu_lastname```  |  string           |
|  ```recordCount```  |  integer          |
|  ```recordList```   |  string           |

8.	Create a new User Task connected to the start event.   
9.	Give the user task a name by double-clicking on the task to open a text field. Name this task ```Customer Search```.
10.	With the user task selected, notice that the Referenced form value in the bottom configuration window is No reference selected. To create an intake form for this task, click on the No reference selected value.
11.	In the Form reference popup window, select the New Form button.
12.	In the Create a new form window, enter the following values:
    1.	Form name: ```Customer Lookup```
    2.	Description: ```Gather customer information to retrieve records.```
    3.	Stencil: Default form
    4.	Select the Create form button. 
13.	Follow these steps to create the form:
    1.	From the left object menu, drag a Header onto the canvas. To edit, click on the pencil icon that appears when you hover your mouse over the header object. In the Label field, name it ```Enter the Customer’s Last Name:``` and click the Close button.
    2.	Drag a **People** object and dop it into the Header object.
    3.	Click on the pencil icon on the Display Value object to open the edit prompt. Configure the text field with the following options:
        1.	Label: ```Last Name:```
        2.	Override ID: check the box
        3.	ID: ```customer```
        4.	Required: check the box
        5.	Close the edit prompt.
    4.	Save and close the form editor by clicking on the save button.
    5.	On the Save form popup window, click the Save and close editor button to return to your process model
14.	Create a new script task connected to the Customer Search user task. In the bottom configuration panel, configure the following attributes:
    1.	Name: ```Get APS Customer```
    2.	Script format: groovy
    3.	Script:
enter this code in the popup script window:
```
import com.activiti.domain.idm.User;
import com.activiti.security.SecurityUtils;
import com.activiti.domain.idm.User;

out.println('Customer Details');

Long cId = execution.getVariable("customer");
User customer = userService.getUser(cId);

execution.setVariable("cCustomerId", cId);
execution.setVariable("cEmail", customer.getEmail());
execution.setVariable("cFirstName", customer.getFirstName());
execution.setVariable("cLastName", customer.getLastName());
execution.setVariable("cFullName", customer.getFirstName()+" "+customer.getLastName());

```
14. Create another **Script Task** and connect it to the _Get APS Customer_ script task. Give it the following configuration:
    - **Name:** ```Get DB Customer```
    - **Script Type:** ```groovy```
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

println( "=======================================\n=== DEBUG ===\n============================" );
println( "Get cust data where firstname=${cFirstName} & lastname=${cLastName}" );


sql.query("SELECT ID, FIRSTNAME, LASTNAME, ADDRESSLINE1, CITY, STATE, ZIPCODE FROM CUSTOMERS WHERE FIRSTNAME=${cFirstName} AND LASTNAME=${cLastName}") { resultSet ->
  while (resultSet.next()) {
    println("RECORD 1: \n>>> "+resultSet.getString('ADDRESSLINE1'));
    execution.setVariable("cId", resultSet.getString('ID'));
    execution.setVariable("cAddress", resultSet.getString('ADDRESSLINE1'));
    execution.setVariable("cCity", resultSet.getString('CITY'));
    execution.setVariable("cState", resultSet.getString('STATE'));
    execution.setVariable("cZip", resultSet.getString('ZIPCODE'));
    println("IS RECORD SET? "+execution.getVariable("cAddress"));
  }
}

/*
sql.eachRow("SELECT ID, FIRSTNAME, LASTNAME, ADDRESSLINE1, CITY, STATE, ZIPCODE FROM CUSTOMERS WHERE FIRSTNAME=${cFirstName} AND LASTNAME=${cLastName}") { row ->
    //def r = new Record( recId: row.id, firstname:row.firstname, lastname:row.lastname, address:row.addressLine1, city:row.city, state:row.state, zip:row.zipcode)
    //recordList.add(r);
    execution.setVariable("cAddress", address:row.addressLine1);
    execution.setVariable("cCity", city:row.city);
    execution.setVariable("cState", state:row.state);
    execution.setVariable("cZip", zip:row.zipcode);
}

println new JsonBuilder( recordList ).toPrettyString()
execution.setVariable("recordList", new JsonBuilder( recordList ).toPrettyString())
*/
```
15. Create a new **User Task** and connect it to the script task. Name it: ```Verfiy Customer```.
16.	In the bottom configuration panel, select the Referenced Form attribute. 
17.	In the form popup window, select the New Form button.
18.	In the Create a new form window, enter the following values:
    1.	Form name: ```Verify Customer```
    2.	Description: ```Verify a customer's information.```
    3.	Stencil: ```Default form```
19.	Select the Create form button.
20.	Follow these steps to create the form:
    1.	From the left object menu, drag a Header onto the canvas. To edit, click on the pencil icon that appears when you hover your mouse over the header object. In the Label field, name it: ```Customer Information:```. Click the Close button.
    2.	Drag a **Display Text** object and dop it into the Header object. Select the pencil icon to edit.
        1.	In the _Text to display_ field enter the following text, then close the prompt.
code:
    ```
    Verify the Customer's information before proceeding:
    ${cFullName} - ${cId}
    ${cEmail}
    ${cAddress} ${cCity}, ${cState}  ${cZip}
    ```
    3. Close the prompt.
    4. Select the **save icon** in the top-left of the page and choose _Save and Close_ to return to your process.
21. Add an **End event** to your _Verify Customer_ user task.
22. Save and close the process.

---

### Lab2. Add the Claims Process to your Process Application
**Perform this lab if you already have a Process Application created.**
1.	From the Activiti home page, select the App Designer tile to navigate to the Business Process Models page.
2.	Select the Apps hyperlink in the top blue banner.
3.	Select the process application (in edit mode by using the pencil icon in the top, right corner of the tile) that you want to add your model to.
4.	Select the Edit Included Models button.
5.	In the Models included popup window, select the process you want to add. Note: a selected process will show a blue “+” icon in the corner of the thumbnail. Close the popup window once your process is selected.
6.	Click the save icon to save the App definition, then publish your application.

---

### Lab 3. Testing the Claims Process
1.	From the Alfresco home page, launch the Alfresco Digital Workspace and sign in with your provided credentials. 
2.	To start your process, select the Start Process button found in the top right of the page.
3.	In the New Process popup window, select your 9SecondInsurance application from the Application selector.
4.	Select your _New Claims_ process.
a.	OPTIONAL: You can change the name of the process that will run by editing the Process Name field. 
5.	Click on the START PROCESS hyperlink at the bottom right corner of the page.
6.	Select _My Tasks_ found under the Workflow dropdown on the left side of the page.
7.	Your _Customer Search_ task should appear. Click on it to perform the task.
8.	Use the form to select the customer 

---

|  **Next Steps: Decision to Edit or Continue With the Claim** |
| ----------- |
| Now that we have a method to retrieve a customer's information who is making a reimbursement claim, we need to be able to either go back to the customer search query (in the case we did not get the right customer) or proceed with the claim. |
| We also need to build a form that captures claim-specific information. |

### Lab 4. Create a Form Outcome with Exclusive Pathing & Claim Form
1.	Access the App Designer tile from the homepage of the Activiti App (Process Services).
2.	Enter your New Claims process in edit mode by selecting the edit icon when hovering your mouse over its tile.
3.	Select the _Verfiy Customer_ user task and open the form.
4.	In the form editor, select the **Outcomes** tab. Enter the following configuration:
    - **Use custom outcomes for this form:** _Selected_
    - **Add TWO outcomes to the form:** _Enter text into the provided field then TAB out of the field_
      - ```Back```
      - ```Continue```   
5.  Save and close the form.
6.  Add an **Exclusive gateway** to the process and connect it from the _Verify Customer_ user task.
7.  Create a **Sequence Flow line** from the _gateway_ to the _Customer Search_ user task.
8.  Select the _Sequence Flow Line_ and access the **Flow Condition** property. Enter the following configuration:
    - **Condition Type:** _Simple_
    - **Depends On:** _Form outcome_
    - **Form:** _Verify Customer_
    - **Operator:** _equal_
    - **Value:** ```Back```
10. Save the configuration.
11. Select the exclusive gateway event, then select the **End Event** icon to add an end event to the process.
12. Select the **Sequence Flow Line** connected to the gateway and the end event.
13. Check the **Default Flow** check-box in the bottom configuration panel.
14. Save and close the process.
15. Republish your process under the **Apps** page and test in ADW.
16. **NOTE:** You should now be able to use the back button in the form to return to the Customer Selector form in order to retrieve a different customer from the database.

---

|  **Next Steps: Capture the Claim Information** |
| ----------- |
| With a method to either return to the Customer Selector or continue with the claim, we're now ready to add a method to capture the customer's claim information. |
| We'll do this by adding a new User Task and a Form. |

### Lab 5. Add a Claim Capture Task
1. Enter your New Claims process in edit mode by selecting the edit icon when hovering your mouse over its tile.
2. Select and delete the **End Event** from the process.
3. Drag a **User Task** onto the stage and connect it to the Sequence Flow line stemming from the Gateway Event. 
4. Select the new user task and give it a name of: ```Create Claim```.
5. Select the Referenced form attribute from the bottom configuration panel, open the referenced form popup window and choose the New Form button. 
6. Give the form a name of: ```New Claim``` and select the Create Form button.
7. In the form editor, perform the following steps to create a new claim form:
    1.	Add a **Header object** to the page and select the pencil icon to go into edit mode. Give it a label of ```Customer Information:```. Close the edit popup.
    2.	Add a **Display Text** object into the Customer Information Header object. Give it the following configuration:
        - **Text to Display:**
           ```
            Creating Claim for:
            ${cFullName} - ${cId}
            ${cEmail}
            ${cAddress} ${cCity}, ${cState}  ${cZip}
           ```
        - Close the edit popup window.
       
    8.	Add another Header object to the page and select the pencil icon to go into edit mode. Give it a label of ```Claim Information:```. Close the edit popup.
        1.	Add a Date object to the Claim Information header and go into edit mode. Give it the following configuration:
        2.	**Label:** Incident Date:
        3.	**Required:** checked
        4.	Select the Advanced tab.
        5.	Enter MM-DD-YYYY into the Date display format field.
        6.	Close the edit prompt.
    9.	Add a Dropdown object to the Header and go into edit mode. Give it the following configuration:
        1.	**Label:** Incident Type:
        2.	**Required:** checked
        3.	Select the Options tab. Enter the following configuration.

    |        Label        |        ID        |
    | ------------        | ----------       |
    |        Damage       |    Damage        |
    |        Lost         |    Lost          |
    |        Stolen       |    Stolen        |
    |        Other        |    Other         |

    10.	Add an Amount object to the Header and go into edit mode. Give it the following configuration:
        1.	**Label:** Claim Amount:
        2.	Select the Override ID checkbox.
        3.	**ID:** value
        4.	Check the Required checkbox.
        5.	Close the edit prompt.
8.	Save and close the form editor and return to your process.
9.	Add an end event to your process connected to the _Create Claim_ user task.
10.	Save and close your process.
11.	Navigate to the Apps page and republish your application.
12.	Open the Digital Workspace and test your updated process.

---

|  **Next Steps: Configure the Deductible Logic and Verify the Claim** |
| ----------- |
| We are now capturing a customer's claim information. Based on that we'll need logic implemented that will dictate the amount of their deductible. We also want to finalize our claim with a method that will allow our agents to read back and confirm the claim and deductible information to the customer. |
| At 9 Second Insurance, we use a scaffolding approach to set a deductible that is relational to the claimed equipment value. |
| We'll use a Decision Table to determine the deductibale amount. |
| Finally, we'll finish the process with a User Task and Form that will display the final claim information. |

### Lab 6. Adding Decision Logic (Decision Table) and Claim Verification
1.	Access the App Designer tile from the homepage of the Activiti App (Process Services).
2.	Enter your New Claims process in edit mode by selecting the edit icon when hovering your mouse over its tile.    
3.	Delete the end event from the process.
4.	From the left panel, add a script task to the process and connect it in place of the end event deleted in the previous step. Using the bottom config panel, give the task the following configuration:
    1.	Name: ```Assign Deductible```
    2.	Script Format: ```groovy```
    3.	Enter the following text into the Script popup window:
script:
```
execution.setVariable("deductible", 200);
```
5.	From the left panel, drag and place a Decision Task after the Script task and connect it.
6.	Name the Decision task: Configure Deductible
7.	In the bottom configuration panel, select the Referenced decision table attribute to open the decision table popup window. Select the New Decision Table button. Name it: ```U[Your User #] Configure Deductible```. Ex: ```U3 Configure Deductible```.
8.	In the top blue header, click the [ Undefined ] title, which opens the Edit input popup. Configure the popup with the following information:
    1.	Column Label: ```Equipment Value```
    2.	Variable Type: ```Form field```
    3.	Form Field: Claim Amount – value
    4.	Save the popup.
9.	In the top green header, click the [ Undefined ] title, which opens the Edit output popup. Configure the popup with the following information:
    1.	Column label: ```Deductible```
    2.	Column type: Existing
    3.	Variable Type: Variable
    4.	Variable: deductible
    5.	Save the popup.
10.	In the blue cell underneath the blue header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Operator: Less than
    2.	Variable type: Number
    3.	Number: 100
    4.	Click OK.
11.	In the green cell underneath the green header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Variable type: Variable
    2.	Variable: deductible
    3.	Method: Subtract
    4.	Number: 200
    5.	Click OK.
12.	Create a new Rule by pressing the Add Rule button.
13.	In the second blue cell underneath the blue header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Operator: Less than
    2.	Variable type: Number
    3.	Number: 500
    4.	Click OK.
14.	In the second green cell underneath the green header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Variable type: Variable
    2.	Variable: deductible
    3.	Method: Subtract
    4.	Number: 150
    5.	Click OK.
15.	Create a new Rule by pressing the Add Rule button.
16.	In the third blue cell underneath the blue header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Operator: Less than
    2.	Variable type: Number
    3.	Number: 1000
    4.	Click OK.
17.	In the third green cell underneath the green header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Variable type: Variable
    2.	Variable: deductible
    3.	Method: Subtract
    4.	Number: 100
    5.	Click OK.
18.	Create a new Rule by pressing the Add Rule button.
19.	In the fourth blue cell underneath the blue header, select the pencil icon to open the Edit rule expression popup window. Configure with the following information:
    1.	Operator: Greater than or equal
    2.	Variable type: Number
    3.	Number: 1000
    4.	Click OK.
20.	_We will leave the fourth green cell blank so the deductible remains at it's default value of 200_.
21.	Save and close the decision table to return to your process.
22.	Add a new User task to your process and connect it to the decision table task.
23.	Name the user task: Verify Claim
24.	Select the Referenced form attribute from the bottom configuration panel, open the referenced form popup window and choose the New Form button. 
25.	Give the form a name of: Verify Claim and select the Create Form button.
26.	In the form editor, perform the following steps to create a new claim form:
    1.	Add a Header object to the page and select the pencil icon to go into edit mode. Give it a label of Verify Claim Information: Close the edit popup.
    2.	Add a Display Text field to the Header and select the pencil icon to go into edit mode.
    3.	In the Text to display field, enter the following text:
text:
```
Mr. or Ms. ${cLastName}, your claim has been submitted with the peril type of ${incidenttype}.
The approximate claim value is $${value}. Due to this amount the cost of your deductible will be $${deductible}.
Thank you for being a loyal customer of 9 Second Insurance!
```
27.	Save and close the form editor to return to your process.
28.	Save and close the process editor.
29.	Navigate to the applications page and publish your application.
30.	Test the new process changes.
    1.	The decision table logic should scale the deductible down based on the value entered into the claim form. Test by submitting different values.


