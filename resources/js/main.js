// Onload
$(() => {
  // make text unselectable
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

  // Global temp variable for editing employee info.
  var Temp = {};

  // search button
  $("#search").click(() => {
    // Determine if all fields are blank, then do full global search.
    var searchFieldIds = [
      "input-firstname",
      "input-lastname",
      "input-id",
      "input-department",
      "input-location",
    ];

    var searchFile = "resources/php/getAll.php";

    searchFieldIds.forEach(id => {
      let notBlank = Boolean($(`#${id}`).val());
      if (notBlank) {
        searchFile = "resources/php/getSome.php";
      }
    });

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

  // back button
  $(".back-button").click(() => {
    //
    $(".scrollable-content").show();
    $("#employee-card").hide();
  });

  // Edit button
  $("#edit-button").click(() => {
    // save temporary snapshot
    Temp = EmployeeTemp();

    $("#save-buttons").css({ display: "flex" });
    $("#employee-info input:not(#employee-id), #employee-info select").prop(
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
      if ($("#employee-id").val() === "") {
        // run SQL command to create new entry.
        // then run second command to access generated ID of new employee.
        // use jquery .val() to change ID shown.
        $("#employee-id").val("0000001");
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

  // input boxes onchange check boolean for
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
  // click a row to view employee card
  $(".clickable-row").click(row => {
    // Get employee object from row using $.data()
    //
    //
    let id = row.currentTarget.id;
    let employee = $(`#${id}`).data();
    console.log(employee);

    // assign variables

    // display card, hide search
    $(".scrollable-content").hide();
    $("#employee-card").show();

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

// Function to handle row click, populate Employee Card.
