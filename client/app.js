$("#crops").on("click", showCrops);
$("#add-crop").on("click", addCrop);
$("#update-crop").on("click", updateCrop);
$("#delete-crop").on("click", deleteCrop);
$("#next-crop").on("click", nextCrop);
$("#prev-crop").on("click", previousCrop);
$("#clear-crop").on("click", resetFields);
let cropArray = [];
let index = 0;

function showCrops() {
  $.get(`/api/crops`, (data) => {
    cropArray = data;
    let crop = cropArray[index];
    setupFields(crop);
  });
}

function addCrop() {
  let newCrop = {
    name: $("#cropName").val(),
    growth_time: Number($("#growthTime").val()),
    regrowth_time: Number($("#regrowthTime").val()),
    seed_price: Number($("#seedPrice").val()),
    sell_price: Number($("#sellPrice").val()),
    season: $("#season").val(),
  };
  index = cropArray.length;
  $.ajax({
    url: `/api/crops/`,
    type: "POST",
    data: JSON.stringify(newCrop),
    contentType: "application/json",
    success: function (result) {
      showCrops();
    },
  });
}

function updateCrop() {
  let cropId = cropArray[index].id;
  console.log(cropId);
  let updatedCrop = {
    name: $("#cropName").val(),
    growth_time: Number($("#growthTime").val()),
    regrowth_time: Number($("#regrowthTime").val()),
    seed_price: Number($("#seedPrice").val()),
    sell_price: Number($("#sellPrice").val()),
    season: $("#season").val(),
  };
  $.ajax({
    url: `/api/crops/${cropId}`,
    type: "PUT",
    data: JSON.stringify(updatedCrop),
    contentType: "application/json",
    success: function (result) {
      showCrops();
    },
  });
}

function deleteCrop() {
  let cropId = cropArray[index].id;
  $.ajax({
    url: `/api/crops/${cropId}`,
    type: "DELETE",
    success: function (result) {
      showCrops();
    },
  });
}

function nextCrop() {
  if (index !== cropArray.length - 1) {
    index++;
  }
  let crop = cropArray[index];
  setupFields(crop);
}

function previousCrop() {
  if (index !== 0) {
    index--;
  }
  let crop = cropArray[index];
  setupFields(crop);
}

function setupFields(crop) {
  $("#cropName").val(crop.name);
  $("#growthTime").val(crop.growth_time);
  $("#regrowthTime").val(crop.regrowth_time);
  $("#seedPrice").val(crop.seed_price);
  $("#sellPrice").val(crop.sell_price);
  $("#season").val(crop.season);
}

function resetFields() {
  $("#cropName").val("");
  $("#growthTime").val("");
  $("#regrowthTime").val("");
  $("#seedPrice").val("");
  $("#sellPrice").val("");
  $("#season").val("");
}
