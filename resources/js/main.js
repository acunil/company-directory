import {
  getEmployees,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
  insertDepartment,
  updateDepartmentByID,
  deleteDepartmentByID,
  getLocations,
  insertLocation,
  updateLocationByID,
  deleteLocationByID,
} from "./crudFunctions.js";

import {
  EmployeeTemp,
  clearSearchFields,
  clearEmployeeFields,
  handleCancelSave,
  allSearchFieldsBlank,
  populateLocationDropdown,
  populateDepartmentDropdown,
  showDepartmentResults,
} from "./domFunctions.js";

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

  // employee search button
  $("#search").click(() => {
    // php file path
    var searchFile = "resources/php/getAll.php";

    // Determine if all fields are not blank, then do full targeted search
    if (!allSearchFieldsBlank()) {
      searchFile = "resources/php/getSome.php";
    }

    // Get employees
    getEmployees(searchFile);
  });

  // Trigger search on page load
  $("#search").click();

  // back button
  $(".back-button").click(() => {
    $("#search").click();
  });

  /**
   *
   *
   *
   * Employee Modal
   *
   *
   *
   *
   */

  // Employee - Edit button
  $("#employee-edit-button").click(() => {
    // show footer
    $("#employee-edit-footer").removeClass("d-none").addClass("d-block");

    // save temporary snapshot
    Temp = EmployeeTemp();

    $("#employee-save-buttons").css({ display: "flex" });
    $("#employee-info input:not(#employee-id), #employee-department").prop(
      "disabled",
      false
    );
    $("#back-button, #employee-delete-button, #employee-edit-button").prop(
      "disabled",
      true
    );
  });

  // Employee - Delete button
  $("#employee-delete-button").click(() => {
    //
  });

  // Cancel buttons
  $(".cancel-button, .close").click(handleCancelSave);

  // Employee - Save button
  $("#employee-save-button").click(() => {
    // hide footer
    $("#employee-edit-footer").removeClass("d-block").addClass("d-none");

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
      $("#back-button, #employee-delete-button, #employee-edit-button").prop(
        "disabled",
        false
      );

      // Disable employee fields
      $("#employee-info input, #employee-info select").prop("disabled", true);
      $("#back-button, #employee-delete-button, #employee-edit-button").prop(
        "disabled",
        false
      );

      // Rerun global search
      clearSearchFields();
      $("#search").click();
    }
    //
  });

  // Confirm delete button
  $("#confirm-delete").click(() => {
    deleteEmployee();
  });

  /***
   *
   *
   *
   *
   *
   * Location Modal
   *
   *
   *
   *
   *
   *
   *
   */

  // Location - Edit button
  $("#location-edit-button").click(() => {
    // show footer
    $("#location-edit-footer").removeClass("d-none").addClass("d-block");

    // save temporary snapshot eg. "New York"
    Temp.name = $("#location-location").val();

    $("#location-save-buttons").css({ display: "flex" });
    $("#location-location").prop("disabled", false);
    $("#back-button, #location-delete-button, #location-edit-button").prop(
      "disabled",
      true
    );
  });

  /***
   *
   *
   *
   *
   *
   *
   *
   * Department Modal
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */
  // Department - Edit button
  $("#department-edit-button").click(() => {
    // show footer
    $("#department-edit-footer").removeClass("d-none").addClass("d-block");

    // save temporary snapshot
    Temp.department = $("#department-department").val();
    Temp.locationID = $("#department-location").val();

    $("#department-save-buttons").css({ display: "flex" });
    $("#department-department, #department-location").prop("disabled", false);
    $("#back-button, #department-delete-button, #department-edit-button").prop(
      "disabled",
      true
    );
  });

  // Department - Cancel save button
  $("#department-cancel-button").click(() => {
    // hide footer
    $("#department-edit-footer").removeClass("d-block").addClass("d-none");

    // Enable buttons
    $("#back-button, #department-delete-button, #department-edit-button").prop(
      "disabled",
      false
    );

    // Disable fields
    $("#department-department, #department-location").prop("disabled", true);

    // Use Temp to redo fields
    $("#department-department").val(Temp.department);
    $("#department-location").val(Temp.locationID);
  });

  /***
   *
   *
   *
   *
   *
   *
   *
   *
   * Other
   *
   *
   *
   *
   *
   *
   *
   */

  // New Employee button
  $("#create-button").click(() => {
    // Show modal
    $("#employee-modal").modal({
      backdrop: "static",
      keyboard: true,
    });

    // Trigger edit state
    $("#employee-edit-button").click();

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
      $("#employee-save-button").prop("disabled", true);
    } else {
      //
      $("#employee-save-button").prop("disabled", false);
    }
  });

  // Add event listener to search boxes for Enter to search
  $("#search-modal input").keyup(key => {
    //
    if (key.which == 13) {
      $("#search").click();
    }
  });

  // Populate departments and locations in dropdowns

  getDepartments();
  getLocations();

  // onchange listener for #employee-department that auto changes relative location dropdown
  $("#employee-department").change(() => {
    // Retrieve object using $.data()
    let dept = $("#employee-department option:selected").data();

    // Access #employee-location with child class matching dept locationID
    let locationID = dept.locationID;
    $(`#employee-location .location${locationID}`).attr("selected", "selected");
  });

  // onchange listener for #input-department that auto changes relative location dropdown
  $("#input-department").change(() => {
    // Retrieve object using $.data()
    let dept = $("#input-department option:selected").data();

    // Access #employee-location with child class matching dept locationID
    let locationID = dept.locationID;
    $(`#input-location .location${locationID}`).attr("selected", "selected");
  });

  // Tab functionality

  $("#department-tab").click(() => {
    //
    $("#employee-table, #location-table").hide();

    $("#department-table").show();

    $("#employee-tab, #location-tab").removeClass("font-weight-bold");

    $("#department-tab").addClass("font-weight-bold");

    $("#department-tab").css({
      "border-left": "2px solid white",
      "border-top": "2px solid white",
      "border-right": "2px solid white",
    });
    $("#employee-tab, #location-tab").css("border", "none");
  });

  $("#employee-tab").click(() => {
    //
    $("#department-table, #location-table").hide();

    $("#employee-table").show();

    $("#department-tab, #location-tab").removeClass("font-weight-bold");

    $("#employee-tab").addClass("font-weight-bold");

    $("#employee-tab").css({
      "border-left": "2px solid white",
      "border-top": "2px solid white",
      "border-right": "2px solid white",
    });
    $("#department-tab, #location-tab").css("border", "none");
  });

  $("#location-tab").click(() => {
    //
    $("#department-table, #employee-table").hide();

    $("#location-table").show();

    $("#department-tab, #employee-tab").removeClass("font-weight-bold");

    $("#location-tab").addClass("font-weight-bold");

    $("#location-tab").css({
      "border-left": "2px solid white",
      "border-top": "2px solid white",
      "border-right": "2px solid white",
    });
    $("#department-tab, #employee-tab").css("border", "none");
  });

  // Trigger employee tab to show
  $("#employee-tab").click();

  //
  // Testing
  //
});
