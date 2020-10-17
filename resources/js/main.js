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

  // click a row to view employee card
  $("tr:not(:first)").click(row => {
    let firstname = row.currentTarget.children[0].innerText;
    let lastname = row.currentTarget.children[1].innerText;
    let id = row.currentTarget.children[2].innerText;
    console.log(`Firstname: ${firstname}\nLastname: ${lastname}\nID: ${id}`);

    // display card, hide search
    $(".scrollable-content").hide();
    $("#employee-card").show();

    // Populate data into fields
    $("#employee-firstname").val(firstname);
    $("#employee-lastname").val(lastname);
    $("#employee-id").val(id);
  });

  // back button
  $(".back-button").click(() => {
    //
    $(".scrollable-content").show();
    $("#employee-card").hide();
  });

  // search button
  $("#search-button").click(() => {
    console.log("Search button clicked");
  });

  // Edit button
  $("#edit-button").click(() => {
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
    )
      //
      $("#save-buttons").css({ display: "none" });
    $("#employee-info input, #employee-info select").prop("disabled", true);
    $("#back-button, #delete-button, #edit-button").prop("disabled", false);
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
    let invalid = $("#input:invalid");
    console.log(invalid);
  });
});
