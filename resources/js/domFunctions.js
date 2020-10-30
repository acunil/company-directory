// Function to save snapshot of employee details, pre-editing
const EmployeeTemp = () => {
  return {
    "#employee-firstname": $("#employee-firstname").val(),
    "#employee-lastname": $("#employee-lastname").val(),
    "#employee-job": $("#employee-job").val(),
    "#employee-email": $("#employee-email").val(),
    "#select-department": $("#select-department").val(),
    "#select-location": $("#select-location").val(),
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

    // Attach employee object to HTML element using $.data() method
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
    $("#select-department").val(employee.department);
    $("#select-location").val(employee.location);
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
    "#select-department",
    "#select-location",
    "#employee-email",
    "#employee-jobtitle",
  ];

  searchFieldIds.forEach(id => {
    $(id).val("");
  });
};

// Function to handle cancel save
const handleCancelSave = () => {
  try {
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
  } catch (e) {
    //
  }
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
      `<option value="${location.name}" class="location${location.id}">${location.name}</option>`
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

// Function to watch onchange of #select-department and auto change #select-location according to locationID
const matchLocationToDepartment = 0;

export {
  EmployeeTemp,
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  handleCancelSave,
  allSearchFieldsBlank,
  populateLocationDropdown,
  populateDepartmentDropdown,
};
