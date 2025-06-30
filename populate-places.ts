// import { readerFromStreamReader } from "https://deno.land/std/io/mod.ts";

// given a place object that contains `id` and `url` fields, write out a
// .qmd document to be rendered afterward by quarto
async function writePlaceDoc(place) {

  if (place.isit_label === undefined) {
    console.error("Unexpected place:")
    console.error(place)
  }

  // create folder inside /places/
  await Deno.mkdir("./places/" + place.slug, { recursive: true });

  // read template file and inject place id
  let placeDocText = await Deno.readTextFile("./places/_place-outer.qmd")

  let injectedDocText = placeDocText
    .replace("{{ID}}", place.id)
    .replace("{{NAME}}", place.isit_label);

  // write to places/safe-place-name/index.qmd
  await Deno.writeTextFile(
    "./places/" + place.slug + "/index.qmd",
    injectedDocText);
}

// 1. download locations from s3 bucket
console.log("Downloading IIHRN location list...")
const locationsReq = await fetch(
  "https://isithot-data.s3.fr-par.scw.cloud/www/" +
  "stats/stats_all.json");
const locationsObj = await locationsReq.json();

// shift station id keys to object properties and create slugs
console.log("Processing location list...")
const locations = []
Object
  .keys(locationsObj)
  .map((k, v) => locations.push({
    ...locationsObj[k],
    id: k,
    slug: locationsObj[k].isit_label
      .toLowerCase()
      .replaceAll(/\s-\s/g, "-")
      .replaceAll(/\s/g, "-")
      .replaceAll(/[()]/g, "")
  }));

console.log("Found " + locations.length + " places to add...");

// 2. write out a .qmd file for each place in locations.json
locations.map(writePlaceDoc);

console.log("Place files successfully created");
