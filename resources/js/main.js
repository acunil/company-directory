// Onload
$(() => {
  // make text unselectable
  {
    $.fn.extend({
      disableSelection: function () {
        this.each(function () {
          if (typeof this.onselectstart != "undefined") {
            this.onselectstart = function () {
              return false;
            };
          } else if (typeof this.style.MozUserSelect != "undefined") {
            this.style.MozUserSelect = "none";
          } else {
            this.onmousedown = function () {
              return false;
            };
          }
        });
      },
    });
    $("body").disableSelection();
  }

  // Global temp variable for editing employee info.
  var Temp = {};

  // Add event listeners to all input fields to watch on change, if all fields are empty then hide Clear button
  {
    var searchFieldIds = [
      "#input-firstname",
      "#input-lastname",
      "#input-id",
      "#input-department",
      "#input-location",
    ];

    searchFieldIds.forEach(id => {
      $(id).change(() => {
        if (allSearchFieldsBlank()) {
          $("#clear-search").hide();
        } else {
          $("#clear-search").show();
        }
      });
    });
  }

  // search button
  $("#search").click(() => {
    // php file path
    var searchFile = "resources/php/getAll.php";

    // Determine if all fields are not blank, then do full targeted search
    if (!allSearchFieldsBlank()) {
      searchFile = "resources/php/getSome.php";
    }

    // Get employees
    $.ajax({
      url: searchFile,
      type: "GET",
      dataType: "json",
      data: {
        firstName: $("#input-firstname").val(),
        lastName: $("#input-lastname").val(),
        id: $("#input-id").val(),
        department: $("#input-department").val(),
        location: $("#input-location").val(),
      },
      success(result) {
        // Array of results
        let results = result.data;
        console.log(results);

        // populate DOM
        showSearchResults(results);
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log("There was something wrong with the test request");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  // Trigger search on page load
  $("#search").click();

  // back button
  $(".back-button").click(() => {
    //
    $(".scrollable-content").show();
    $("#employee-card").hide();
    $("#search").click();
  });

  // Edit button
  $("#edit-button").click(() => {
    // show footer
    $("#edit-footer").removeClass("d-none").addClass("d-block");

    // save temporary snapshot
    Temp = EmployeeTemp();

    $("#save-buttons").css({ display: "flex" });
    $("#employee-info input:not(#employee-id), #employee-department").prop(
      "disabled",
      false
    );
    $("#back-button, #delete-button, #edit-button").prop("disabled", true);
  });

  // Delete button
  $("#delete-button").click(() => {
    //
  });

  // Cancel button
  $(".cancel-button").click(() => {
    // hide footer
    $("#edit-footer").removeClass("d-block").addClass("d-none");

    //
    $("#save-buttons").css({ display: "none" });
    $("#employee-info input, #employee-info select").prop("disabled", true);
    $("#back-button, #delete-button, #edit-button").prop("disabled", false);

    // if on create new employee screen
    if ($("#employee-id").val() === "") {
      //
      $(".scrollable-content").show();
      $("#employee-card").hide();
    } else {
      // loop through temp keys and use jQuery to repopulate form elements with saved values
      for (let id in Temp) {
        $(id).val(Temp[id]);
      }
    }
  });

  // Save button
  $("#save-button").click(() => {
    // hide footer
    $("#edit-footer").removeClass("d-block").addClass("d-none");

    // Check necessary info is filled in
    if (
      $("#employee-firstname").val() === "" ||
      $("#employee-lastname") === "" ||
      $("#employee-email") === "" ||
      $("#employee-department") === "" ||
      $("#employee-lastname") === ""
    ) {
      console.error("One or more fields are blank!");
      return;
    } else {
      // Save is valid ---
      if ($("#employee-id").val() === "") {
        // Employee does not exist so CREATE
        insertEmployee();
        // save temporary snapshot
        Temp = EmployeeTemp();
      } else {
        // Employee exists so UPDATE
        updateEmployee();
        Temp = EmployeeTemp();
      }
      // return to view
      $("#save-buttons").css({ display: "none" });
      $("#employee-info input, #employee-info select").prop("disabled", true);
      $("#back-button, #delete-button, #edit-button").prop("disabled", false);
    }
    //
  });

  // Confirm delete button
  $("#confirm-delete").click(() => {
    // clear search results, or completely fresh search boxes
    $.ajax({
      url: "resources/php/deleteEmployeeByID.php",
      type: "POST",
      data: {
        id: $("#employee-id").val(),
      },
      success(result) {
        console.log("Employee successfully deleted");
        console.log(result);
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log("There was something wrong with the test request");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  });

  // New Employee button
  $("#new-employee-button").click(() => {
    //
    // display card, hide search
    $(".scrollable-content").hide();
    $("#employee-card").show();

    $("#save-buttons").css({ display: "flex" });
    $("#employee-info input:not(#employee-id), #employee-info select")
      .prop("disabled", false)
      .val("");
    $("#employee-id").val("").prop("placeholder", "########");
    $("#back-button, #delete-button, #edit-button, #save-button").prop(
      "disabled",
      true
    );
  });

  // Clear search button
  $("#clear-search").click(clearSearchFields);

  // input boxes onchange check if required fields have all been filled
  $("#employee-info input, #employee-info select").change(() => {
    //
    let invalid = $(":invalid");
    if (invalid[0]) {
      console.warn("Required field not filled");
      $("#save-button").prop("disabled", true);
    } else {
      //
      $("#save-button").prop("disabled", false);
    }
  });
});

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
    <td>${employee.firstName}</td>
    <td>${employee.lastName}</td>
    <td>${employee.id}</td>
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
      keyboard: false,
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

// Function to automate location:department link in dropdown
$("#employee-department").change(() => {
  let location = "";
  //
  switch ($("#employee-department").val()) {
    case "Legal":
    case "Human Resources":
    case "Services":
      location = "London";
      break;
    case "Sales":
    case "Marketing":
      location = "New York";
      break;
    case "Research and Development":
    case "Product Management":
    case "Business Development":
      location = "Paris";
      break;
    case "Training":
    case "Support":
      location = "Munich";
      break;
    case "Engineering":
    case "Accounting":
      location = "Rome";
      break;
  }

  $("#employee-location").val(location);
});

// Function to handle cancel save
const handleCancelSave = () => {
  //
  $("#edit-footer").removeClass("d-block").addClass("d-none");

  //
  $("#save-buttons").css({ display: "none" });
  $("#employee-info input, #employee-info select").prop("disabled", true);
  $("#back-button, #delete-button, #edit-button").prop("disabled", false);

  // if on create new employee screen
  if ($("#employee-id").val() === "") {
    //
    $(".scrollable-content").show();
    $("#employee-card").hide();
  } else {
    // loop through temp keys and use jQuery to repopulate form elements with saved values
    try {
      for (let id in Temp) {
        $(id).val(Temp[id]);
      }
    } catch (e) {}
  }
};
