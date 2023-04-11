$("#crops").on("click", showCrops);
let cropArray = [];
let index = 0;
$("#next-crop").on("click", nextCrop);
$("#prev-crop").on("click", previousCrop);

function showCrops() {
  $.get(`/api/crops`, (data) => {
    cropArray = data;
    let crop = cropArray[index];
    setupFields(crop);
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
