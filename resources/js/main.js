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
    $("#employee-firstname").text(firstname);
    $("#employee-lastname").text(lastname);
    $("#employee-id").text(id);
  });

  // back button
  $("#back-button").click(() => {
    //
    $(".scrollable-content").show();
    $("#employee-card").hide();
  });

  // search button
  $("#search-button").click(() => {
    console.log("Search button clicked");
  });
});
