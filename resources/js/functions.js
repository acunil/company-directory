// Function to save snapshot of employee details, pre-editing
const EmployeeTemp = () => {
  return {
    "#employee-firstname": $("#employee-firstname").val(),
    "#employee-lastname": $("#employee-lastname").val(),
    "#employee-job": $("#employee-job").val(),
    "#employee-email": $("#employee-email").val(),
    "#employee-department": $("#employee-department").val(),
    "#employee-location": $("#employee-location").val(),
  };
};

// Function to populate search results in DOM
const showSearchResults = results => {
  // clear current search results, if any
  $("#results-table").html("");

  // Loop through results array
  results.forEach(employee => {
    // template HTML
    let template = $(`<tr class='clickable-row' id=${employee.id}>
    <td >${employee.id}</td>
    <td >${employee.firstName}</td>
    <td >${employee.lastName}</td>
  </tr>`);

    // add template to table
    $("#results-table").append(template);
    $(`#${employee.id}`).data(employee);
    // $("#results-table tr:last-child").data(employee);
  });

  // add callback function
  // Row click
  $(".clickable-row").click(row => {
    // Get employee object from row using $.data()
    //
    //
    let id = row.currentTarget.id;
    let employee = $(`#${id}`).data();
    console.log(employee);

    // assign variables

    // display card, hide search
    $("#employee-modal").modal({
      backdrop: "static",
      keyboard: true,
    });

    // // Populate data into fields
    $("#employee-firstname").val(employee.firstName);
    $("#employee-lastname").val(employee.lastName);
    $("#employee-id").val(employee.id);
    $("#employee-job").val(employee.jobTitle);
    $("#employee-email").val(employee.email);
    $("#employee-department").val(employee.department);
    $("#employee-location").val(employee.location);
  });
};

// Function to reset search fields
const clearSearchFields = () => {
  var searchFieldIds = [
    "#input-firstname",
    "#input-lastname",
    "#input-id",
    "#input-department",
    "#input-location",
  ];

  searchFieldIds.forEach(id => {
    $(id).val("");
  });

  $("#clear-search").hide();
  $("#search").click();
};

// Function to reset employee fields
const clearEmployeeFields = () => {
  var searchFieldIds = [
    "#employee-firstname",
    "#employee-lastname",
    "#employee-id",
    "#employee-department",
    "#employee-location",
    "#employee-email",
    "#employee-jobtitle",
  ];

  searchFieldIds.forEach(id => {
    $(id).val("");
  });
};

// Function to determine if all search fields are blank
const allSearchFieldsBlank = () => {
  //
  var searchFieldIds = [
    "#input-firstname",
    "#input-lastname",
    "#input-id",
    "#input-department",
    "#input-location",
  ];

  var allBlank = true;

  searchFieldIds.forEach(id => {
    if ($(id).val() !== "") {
      allBlank = false;
    }
  });

  return allBlank;
};

// Function to handle updating employee info
const updateEmployee = () => {
  $.ajax({
    url: "resources/php/updateEmployeeByID.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#employee-firstname").val(),
      lastName: $("#employee-lastname").val(),
      id: Number($("#employee-id").val()),
      jobTitle: $("#employee-job").val(),
      email: $("#employee-email").val(),
      departmentID: Number($("#employee-department").prop("selectedIndex")),
    },
    success(result) {
      console.log(
        `Update for employee ID ${$("#employee-id").val()} was successful.`
      );
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the update request");
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

// Function to handle inserting new employee
const insertEmployee = () => {
  //
  $.ajax({
    url: "resources/php/insertEmployee.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#employee-firstname").val(),
      lastName: $("#employee-lastname").val(),
      jobTitle: $("#employee-job").val(),
      email: $("#employee-email").val(),
      departmentID: Number($("#employee-department").prop("selectedIndex")),
    },
    success(result) {
      console.log(`Employee creation was successful.`);
      console.log(result);
      // run SQL query for max id
      getMaxId();
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the insert request");
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

// Function to retrieve highest id
const getMaxId = () => {
  //
  $.ajax({
    url: "resources/php/getMaxId.php",
    type: "GET",
    dataType: "json",
    success(result) {
      console.log(`Max ID retrieval was successful.`);
      console.log(result);
      // populate #employee-id with retrieved id
      let id = Number(result.data[0].id);
      $("#employee-id").val(id);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the max id request");
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

// Function to handle cancel save
const handleCancelSave = () => {
  // hide modal footer
  $("#edit-footer").removeClass("d-block").addClass("d-none");

  $("#employee-info input, #employee-info select").prop("disabled", true);
  $("#back-button, #delete-button, #edit-button").prop("disabled", false);

  // if on create new employee screen
  if ($("#employee-id").val() === "") {
    //
    $("#employee-modal").modal("hide");
  } else {
    // loop through temp keys and use jQuery to repopulate form elements with saved values
    try {
      for (let id in Temp) {
        $(id).val(Temp[id]);
      }
    } catch (e) {}
  }
};

export {
  EmployeeTemp,
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  allSearchFieldsBlank,
  updateEmployee,
  insertEmployee,
  handleCancelSave,
};
