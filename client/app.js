$("#crops").on("click", showCrops);
$("#crop-calc").on("click", cropCalc);
$("#add-crop").on("click", addCrop);
$("#update-crop").on("click", updateCrop);
$("#delete-crop").on("click", deleteCrop);
$("#next-crop").on("click", nextCrop);
$("#prev-crop").on("click", previousCrop);
$("#clear-crop").on("click", resetFields);
$("#run-calc").on("click", calculateCrops);

let cropArray = [];
let index = 0;

function showCrops() {
  $("#calc-page").addClass("hidden");
  $("#crop-page").removeClass("hidden");
  $.get(`/api/crops`, (data) => {
    cropArray = data;
    let crop = cropArray[index];
    setupFields(crop);
  });
}

function cropCalc() {
  $("#crop-page").addClass("hidden");
  $("#calc-page").removeClass("hidden");
}

function calculateCrops() {
  const season = $("#season-names option:selected").text();
  const day = $("#input-day").val();
  $("#item-table").empty();
  $.get(`/api/crops/${season}`, (data) => {
    let profitObj = {};
    for (let i = 0; i < data.length; i++) {
      let crop = data[i];
      let daysRemaining = 28 - day;
      let harvestAmount = 0;
      let profit = 0;
      if (crop.regrowth) {
        if (daysRemaining - crop.growth_time >= 0) {
          profit = crop.sell_price - crop.seed_price;
        }
        let daysAfterGrowth = daysRemaining - crop.growth_time;
        if (daysAfterGrowth > crop.regrowth_time) {
          harvestAmount = Math.floor(daysAfterGrowth / crop.regrowth_time);
          profit = profit + harvestAmount * crop.sell_price;
        }
      } else {
        harvestAmount = Math.floor(daysRemaining / crop.growth_time);
        profit = harvestAmount * (crop.sell_price - crop.seed_price);
      }
      profitObj[crop.name] = profit;
    }
    let sortProfits = [];
    for (let crop in profitObj) {
      sortProfits.push([crop, profitObj[crop]]);
    }
    sortProfits.sort(function (a, b) {
      return a[1] - b[1];
    });

    let sortedProfits = {};
    sortProfits.reverse().forEach(function (crop) {
      sortedProfits[crop[0]] = crop[1];
    });

    const thName = $("<th>").addClass("header-name").text("Crop");
    const thProfit = $("<th>").addClass("header-profit").text("Profit");
    const tr = $("<tr>").append(thName, thProfit);
    $("#item-table").append(tr);

    for (let crop in sortedProfits) {
      if (sortedProfits[crop] > 0) {
        createRow(crop, sortedProfits[crop]);
      }
    }
  });
}

function createRow(crop, profit) {
  const tdName = $("<td>").addClass("crop-name").text(crop);
  const tdProfit = $("<td>").addClass("profit").text(profit);
  const tr = $("<tr>").append(tdName, tdProfit);
  $("#item-table").append(tr);
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
      alert(`${newCrop.name} has been added!`);
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
      alert(`${updatedCrop.name} has been updated!`);
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
      alert(`${cropArray[index].name} has been deleted!`);
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
