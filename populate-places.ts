// given a place object that contains `id` and `url` fields, write out a
// .qmd document to be rendered afterward by quarto
async function writePlaceDoc(place) {

  // create folder: places/url
  await Deno.mkdir("./places/" + place.url, { recursive: true });

  // read template file and inject place id
  let placeDocText = await Deno.readTextFile("./places/_place-outer.qmd")

  let injectedDocText = placeDocText
    .replace("{{ID}}", place.id)
    .replace("{{NAME}}", place.label);

  // write to places/safe-place-name/index.qmd
  await Deno.writeTextFile(
    "./places/" + place.url + "/index.qmd",
    injectedDocText);

}

// 1. get locations.json
let locationsText = await Deno.readTextFile("./assets/locations.json");
let locations = JSON.parse(locationsText);
console.log("Found " + locations.length + " places to add");

// 2. write out a .qmd file for each place in locations.json
locations.map(writePlaceDoc);

console.log("Place files successfully created");
