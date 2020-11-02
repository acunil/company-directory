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
  $("#employee-results-table").html("");

  // Loop through results array
  results.forEach(employee => {
    // template HTML
    let template = $(`<tr class='clickable-employee-row' id=${employee.id}>
    <td >${employee.id}</td>
    <td >${employee.firstName}</td>
    <td >${employee.lastName}</td>
  </tr>`);

    // add template to table
    $("#employee-results-table").append(template);

    // Attach employee object to HTML element using $.data() method
    $(`#${employee.id}`).data(employee);
    // $("#employee-results-table tr:last-child").data(employee);
  });

  // add callback function
  // Row click
  $(".clickable-employee-row").click(row => {
    // Get employee object from row using $.data()
    //
    //
    let id = row.currentTarget.id;
    let employee = $(`#${id}`).data();
    console.log(employee);

    // assign variables
    Temp = employee;

    // Fix Modal header
    $("#employee-modal .modal-title").html("Employee Info");

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
    $("#employee-location").val(employee.locationID);
  });
};

// Function to reset search fields
const clearSearchFields = () => {
  var searchFieldIds = [
    "#search-emp-firstname",
    "#search-emp-lastname",
    "#search-emp-id",
    "#search-emp-department",
    "#search-emp-location",
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
    "#employee-job",
  ];

  searchFieldIds.forEach(id => {
    $(id).val("");
  });
};

// Function to handle cancel save
const handleCancelSave = () => {
  try {
    // hide modal footer
    $("#employee-edit-footer, #department-edit-footer, #location-edit-footer")
      .removeClass("d-block")
      .addClass("d-none");

    $(
      "#employee-info input, #employee-info select, #location-location, #department-department, #department-location"
    ).prop("disabled", true);
    $(
      "#back-button, #employee-delete-button, #employee-edit-button, #department-delete-button, #department-edit-button, #location-delete-button, #location-edit-button"
    ).prop("disabled", false);

    // if on Create New Employee screen
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
  } catch (e) {
    //
  }
};

// Function to determine if all search fields are blank
const allSearchFieldsBlank = () => {
  //
  var searchFieldIds = [
    "#search-emp-firstname",
    "#search-emp-lastname",
    "#search-emp-id",
    "#search-emp-department",
    "#search-emp-location",
  ];

  var allBlank = true;

  searchFieldIds.forEach(id => {
    if ($(id).val() !== "") {
      allBlank = false;
    }
  });

  return allBlank;
};

// Function to populate dropdown with all locations
const populateLocationDropdown = (
  targetSelectElementId,
  arrayOfLocationObjects
) => {
  // Reset select HTML
  $(`#${targetSelectElementId}`).html(`<option
  value=""
  selected
  class="placeholder"
></option>`);
  //
  arrayOfLocationObjects.forEach(location => {
    // Make option template
    let option = $(
      `<option value="${location.id}" class="location${location.id}">${location.name}</option>`
    );

    $(`#${targetSelectElementId}`).append(option);

    // Attach object with $.data()
    $(`#location${location.id}`).data(location);
  });
};

// Function to populate dropdown with all departments
const populateDepartmentDropdown = (
  targetSelectElementId,
  arrayOfDepartmentObjects
) => {
  // Reset select HTML
  $(`#${targetSelectElementId}`).html(`<option
  value=""
  selected
  class="placeholder"
></option>`);
  //
  arrayOfDepartmentObjects.forEach(department => {
    // Make option template
    let option = $(
      `<option value="${department.name}" id="department${department.id}">${department.name}</option>`
    );

    $(`#${targetSelectElementId}`).append(option);

    // Attach object with $.data()
    $(`#department${department.id}`).data(department);
  });
};

// Function to populate department results in DOM table
const showDepartmentResults = results => {
  // clear current search results, if any
  $("#department-results-table").html("");

  // Loop through results array
  results.forEach(department => {
    // template HTML
    let template = $(`<tr class='clickable-department-row' id=department-result${department.id}>
    <td >${department.name}</td>
  </tr>`);

    // add template to table
    $("#department-results-table").append(template);

    // Attach department object to HTML element using $.data() method
    $(`#department-result${department.id}`).data(department);
  });

  // add callback function
  // Row click
  $(".clickable-department-row").click(row => {
    // Get department object from row using $.data()
    //
    //
    let id = row.currentTarget.id;
    let department = $(`#${id}`).data();
    console.log(department);
    Temp = department;

    // Fix title
    $("#department-modal .modal-title").html("Department Info");

    // assign variables

    // display card, hide search
    $("#department-modal").modal({
      backdrop: "static",
      keyboard: true,
    });

    // // Populate data into fields
    $("#department-department").val(department.name);
    $("#department-location").val(department.locationID);
    // $(
    //   `#department-location option[class='department${location.departmentID}']`
    // ).attr("selected", "selected");
  });
};

// Function to populate Location results in DOM table
const showLocationResults = results => {
  // clear current search results, if any
  $("#location-results-table").html("");

  // Loop through results array
  results.forEach(location => {
    // template HTML
    let template = $(`<tr class='clickable-location-row' id=location-result${location.id}>
    <td >${location.name}</td>
  </tr>`);

    // add template to table
    $("#location-results-table").append(template);

    // Attach location object to HTML element using $.data() method
    $(`#location-result${location.id}`).data(location);
  });

  // add callback function
  // Row click
  $(".clickable-location-row").click(row => {
    // Get employee object from row using $.data()
    //
    //
    let id = row.currentTarget.id;
    let location = $(`#${id}`).data();
    console.log(location);
    Temp = location;

    // Fix title
    $("#location-modal .modal-title").html("Location Info");

    // assign variables

    // display card, hide search
    $("#location-modal").modal({
      backdrop: "static",
      keyboard: true,
    });

    // // Populate data into field
    $("#location-location").val(location.name);
  });
};

export {
  EmployeeTemp,
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  handleCancelSave,
  allSearchFieldsBlank,
  populateLocationDropdown,
  populateDepartmentDropdown,
  showDepartmentResults,
  showLocationResults,
};
