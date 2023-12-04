const fs = require("fs");

function saveToJsonFile(transformedArray, filename) {
  fs.writeFile(filename, JSON.stringify(transformedArray, null, 2), (err) => {
    if (err) {
      console.error("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
}

function transformArray(array) {
  return array.map((item) => {
    return {
      id: item.id,
      meta: {
        name: item.meta.name,
        high_res_img_url: item.meta.high_res_img_url,
        attributes: item.attributes,
      },
    };
  });
}

let transformedArray = transformArray(originalArray);

saveToJsonFile(transformedArray, "output.json");
