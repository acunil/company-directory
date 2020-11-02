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
      "#search-emp-firstname",
      "#search-emp-lastname",
      "#search-emp-id",
      "#search-emp-department",
      "#search-emp-location",
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

  // Go to employee tab
  $("#employee-tab").click();

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
    if (Object.keys(Temp).length === 2) {
      // Location
      console.log("Deleting location with id " + Temp.id);
      deleteLocationByID(Temp.id);
    } else if (Object.keys(Temp).length === 3) {
      // Department
      deleteDepartmentByID(Temp.id);
    } else {
      // Employee
      deleteEmployee();
    }
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

  // Location - Cancel save button
  $("#location-cancel-button").click(() => {
    // hide footer
    $("#location-edit-footer").removeClass("d-block").addClass("d-none");

    // Enable buttons
    $("#back-button, #location-delete-button, #location-edit-button").prop(
      "disabled",
      false
    );

    // Disable fields
    $("#location-location").prop("disabled", true);

    // Use Temp to redo fields
    $("#location-location").val(Temp.name);
  });

  // Location - Save button
  $("#location-save-button").click(() => {
    // hide footer
    $("#location-edit-footer").removeClass("d-block").addClass("d-none");

    // Check necessary info is filled in
    if ($("#location-location").val() === "") {
      console.error("One or more fields are blank!");
      return;
    } else {
      // Save is valid ---
      if (!Temp.id) {
        // Location does not exist so CREATE
      } else {
        // Location exists so UPDATE
        updateLocationByID(Temp.id, $("#location-location").val());
        Temp.name = $("#location-location").val();
      }
      // Fix header
      $("#location-modal .modal-title").html("Location info");

      // Enable edit/delete
      $("#location-delete-button, #location-edit-button").prop(
        "disabled",
        false
      );

      // Disable location field
      $("#location-location").prop("disabled", true);
      $("#location-delete-button, #location-edit-button").prop(
        "disabled",
        false
      );
    }
    //
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

  // Department - Save button
  $("#department-save-button").click(() => {
    // Check necessary info is filled in
    if ($("#department-location, #department-department").val() === "") {
      console.error("One or more fields are blank!");
      return;
    } else {
      // Save is valid ---
      // hide footer
      $("#department-edit-footer").removeClass("d-block").addClass("d-none");

      if (!Temp.id) {
        // Department does not exist so CREATE
      } else {
        // Department exists so UPDATE
        updateDepartmentByID(
          Temp.id,
          $("#department-department").val(),
          $("#department-location").val()
        );
        Temp.name = $("#department-department").val();
        Temp.locationID = $("#department-location").val();
      }
      // Fix header
      $("#department-modal .modal-title").html("Department info");

      // Enable edit/delete
      $("#department-delete-button, #department-edit-button").prop(
        "disabled",
        false
      );

      // Disable fields
      $("#department-department, #department-location").prop("disabled", true);
      $("#department-delete-button, #department-edit-button").prop(
        "disabled",
        false
      );
    }
    //
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
    if ($("#employee-department").val() === "") {
      // if blank, location is editable
      $(`#employee-location`).attr("disabled", false);
    } else {
      // if value, location is locked
      $(`#employee-location`).attr("disabled", true);
    }
    //
    // Retrieve object using $.data()
    let dept = $("#employee-department option:selected").data();

    // Access #employee-location with child class matching dept locationID
    let locationID = dept.locationID;
    $(`#employee-location`).val(locationID);
  });

  // onchange listener for #search-emp-department that auto changes relative location dropdown
  $("#search-emp-department").change(() => {
    if ($("#search-emp-department").val() === "") {
      // if blank, location is editable
      $(`#search-emp-location`).attr("disabled", false);
    } else {
      // if value, location is locked
      $(`#search-emp-location`).attr("disabled", true);
    }
    //
    // Retrieve object using $.data()
    let dept = $("#search-emp-department option:selected").data();

    // Access #search-emp-location with child class matching dept locationID
    let locationID = dept.locationID;
    $(`#search-emp-location`).val(locationID);
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

    getDepartments();
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

    getEmployees("resources/php/getAll.php");
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

    // Rerun search
    getLocations();
  });

  // Trigger loading of first results
  $("#employee-tab").click();

  //
  // Testing
  //
});
