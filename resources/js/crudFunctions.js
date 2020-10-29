import {
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  allSearchFieldsBlank,
  handleCancelSave,
} from "./domFunctions.js";

/**
 *
 *
 *
 *
 *
 *
 * EMPLOYEE
 *
 *
 *
 *
 *
 *
 */

const getEmployees = url => {
  // Get employees
  $.ajax({
    url: url,
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
};

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

const deleteEmployee = () => {
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

/**
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
 * DEPARTMENTS
 *
 *
 *
 *
 *
 *
 *
 *
 */

const getDepartments = () => {
  $.ajax({
    url: "resources/php/getDepartments.php",
    type: "GET",
    dataType: "json",
    success(result) {
      let departments = result.data;
      console.log(departments);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the get departments request");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const updateDepartmentByID = (id, newName, newLocationID) => {
  //
  $.ajax({
    url: "resources/php/updateDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      name: newName,
      id: Number(id),
      locationID: Number(newLocationID),
    },
    success(result) {
      console.log(`Update for Department was successful.`);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(
        "There was something wrong with the update department request"
      );
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const insertDepartment = (name, locationID) => {
  //
  $.ajax({
    url: "resources/php/insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: name,
      locationID: Number(locationID),
    },
    success(result) {
      console.log(`department creation was successful.`);
      console.log(result);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(
        "There was something wrong with the insert department request"
      );
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const deleteDepartmentByID = id => {
  $.ajax({
    url: "resources/php/deleteDepartmentByID.php",
    type: "POST",
    data: {
      id: Number(id),
    },
    success(result) {
      console.log("Department successfully deleted");
      console.log(result);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(
        "There was something wrong with the delete department request"
      );
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

/**
 *
 *
 *
 *
 *
 * LOCATIONS
 *
 *
 *
 *
 *
 *
 */

const getLocations = () => {
  $.ajax({
    url: "resources/php/getLocations.php",
    type: "GET",
    dataType: "json",
    success(result) {
      let locations = result.data;
      console.log(locations);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the get locations request");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const insertLocation = name => {
  //
  $.ajax({
    url: "resources/php/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      name: name,
    },
    success(result) {
      console.log(`Location creation was successful.`);
      console.log(result);
      // run SQL query for all Locations
      getLocations();
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the insert location request");
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const updateLocationByID = (id, newName) => {
  //
  $.ajax({
    url: "resources/php/updateLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      name: newName,
      id: Number(id),
    },
    success(result) {
      console.log(`Update for location was successful.`);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the update location request");
      console.log(jqXHR.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const deleteLocationByID = id => {
  //
  $.ajax({
    url: "resources/php/deleteLocationByID.php",
    type: "POST",
    data: {
      id: Number(id),
    },
    success(result) {
      console.log("Location successfully deleted");
      console.log(result);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log("There was something wrong with the test request");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

// Exports

export {
  showSearchResults,
  clearSearchFields,
  clearEmployeeFields,
  allSearchFieldsBlank,
  updateEmployee,
  insertEmployee,
  handleCancelSave,
  getDepartments,
  updateDepartmentByID,
  insertDepartment,
  deleteDepartmentByID,
  getLocations,
  deleteLocationByID,
  insertLocation,
  updateLocationByID,
  getEmployees,
  deleteEmployee,
};
