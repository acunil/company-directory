import {
  EmployeeTemp,
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  allSearchFieldsBlank,
  updateEmployee,
  insertEmployee,
  handleCancelSave,
  getDepartments,
  insertDepartment,
  deleteDepartmentByID,
  getLocations,
  deleteLocationByID,
  insertLocation,
  updateLocationByID,
} from "./functions.js";

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
  window.Temp = {};

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
  $(".cancel-button").click(handleCancelSave);

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
      // Fix header
      $("#employee-modal .modal-title").html("Employee info");

      // Enable edit/delete
      $("#back-button, #delete-button, #edit-button").prop("disabled", false);

      // Disable employee fields
      $("#employee-info input, #employee-info select").prop("disabled", true);
      $("#back-button, #delete-button, #edit-button").prop("disabled", false);

      // Rerun global search
      clearSearchFields();
      $("#search").click();
    }
    //
  });

  // Confirm delete button
  $("#confirm-delete").click(() => {
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
  $("#create-button").click(() => {
    // Show modal
    $("#employee-modal").modal({
      backdrop: "static",
      keyboard: true,
    });

    // Trigger edit state
    $("#edit-button").click();

    // Clear fields
    clearEmployeeFields();

    // Modify title to reflect create state
    $("#employee-modal .modal-title").html("Create new employee");
  });

  // Clear search button
  $("#clear-search").click(clearSearchFields);

  // Delete success button
  $("#delete-success-button").click(() => {
    //
    // Hide modal
    $("#employee-modal").modal("hide");

    // Clear search fields
    clearSearchFields();

    // Run search
    $("#search").click();
  });

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

  // Add event listener to search boxes for Enter to search
  $("#search-modal input").keyup(key => {
    //
    if (key.which == 13) {
      $("#search").click();
    }
  });

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

  // Testing
  getDepartments();
});
