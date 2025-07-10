## APS API Explorer Hands-On Demo

Being an open-source application, Alfresco contains open APIs that allow developers to extend its capabilities. The API Explorer is there to provide access to the core features of Process Services, allowing you to experiment and get familiar with the REST APIs.
- In the API Explorer you are able to run custom POST and GET commands to perform actions or retrieve data from the database.
- The API Explorer is your source of truth!
- This application is available for each version of APS.
- If you are confused about what API endpoints that are supported for a specific version of APS, then install the associated API Explorer and check if the API endpoint is available. If you are wondering about specific API endpoint details, and you cannot find any information about it anywhere, consult the API Explorer.

### Lab 1. Tour the API Explorer
1.	Launch the API Explorer by clicking the Process Services API Explorer link from the alfresco demo platform page.
2.	Click the Authorize button and sign in with the credentials provided. Close the popup window once authorized.
3.	Retrieve a list of Process Definitions:
    1.	Scroll down to and expand the process-definitions section.
    2.	Select the API titled: GET /activiti-app/enterprise/process-definitions. (Retrieve a list of process definitions)
    3.	Select the Try it out button.
    4.	Click the blue Execute button.
    5.	Review the JSON string reply in the Response body field. You should see an array of process-definitions in your environment. Notice each entry contains information regarding the process: name, description, id, etc. 
    6.	Find a process that you own using the name value. Select and copy the id of your process to the clipboard.
4.	Get forms associated with a specific process & look up form:
    1.	Find and expand the following API: GET /activiti-app/api/enterprise/process-definitions/{processDefinitionId}/forms.
    2.	Select the Try it out button.
    3.	Paste the copied process definition Id from the previous step into the processDefinitionId field.
    4.	Press the blue Execute button.
    5.	Review the JSON string reply in the Response body field. You should see an array of form objects associated with the process.
    6.	Copy the modelId from one of the forms associated with the process.
    7.	Find and expand the section titled: form-models.
    8.	Expand the API titled: GET /activiti-app/api/enterprise/form-models/{formId} Get a form model
    9.	Use the form modelId you copied above to retrieve the form here.
    10.	In the JSON string returned by your query, you should see the details of this form model, including all of the data associated with the fields, outcomes, metadata, and variables associated with the form. 
5.	Get a list of ACTIVE tasks, Get a Task Audit Log, Assign a User to a Task
    1.	Before performing this step, go into the activiti-app or ADW and start a process and arrive at a manual/human task. Do not complete the process further.
    2.	Find and expand the tasks Manage tasks section.
    3.	Expand the POST /activiti-app/api/enterprise/tasks/query List tasks API.
    4.	Select the Try it out button.
    5.	Notice that in the Request body contains a JSON string that can be used to specifiy a search query. We want to query only “active” tasks. Reduce the amount of JSON objects in this string to this string query:
query:
      ```
      {
        "state": "active"
      }
      ```
      6.	Press the Execute button.
      7.	Notice that the Response body should show a list of any active tasks. Copy the id of one of your active tasks.
      8.	Expand the API titled: GET /activiti-app/api/enterprise/tasks/{taskId}/audit Get the audit log for a task.
      9.	Select the Try it out button.
      10.	Paste the task id into the taskId field.
      11.	Press the Execute button.
      12.	Notice the task details returned in the ResponseBody field.
      13.	Note the taskId variable for later.
      14.	Navigate to and expand the users section.
      15.	Select the GET /activiti-app/api/enterprise/users Query users API.
      16.	Press the Try it out button.
      17.	Enter the text “user 0” into the filter field.
      18.	Press the Execute button.
      19.	You should get 1 returned user from the ResponseBody field. Copy that user’s id.
      20.	Navigate to and expand the task-actions section.
      21.	Expand the API: PUT /activiti-app/api/enterprise/tasks/{taskId}/action/delegate Delegate a task.
      22.	Select the Try it out button.
      23.	Enter the task id copied previously into the taskId field.
      24.	In the Request body field, enter the following text (entering the user id copied previously to replace the “XX”):
      ```
      {
        "email": "user0@example.com",
        "userId": "XX"
      }
      ```
      25.	Press the Execute button.
      26.	If no error in the responseBody, navigate back to the activiti-app and review the task in process view. Note that the task now belongs to User 0.



