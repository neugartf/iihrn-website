

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

  
// 3. create the search scheme json
const searchIndex = locations.map(d => ({
  objectID: d.id,
  href: "places/" + d.slug,
  title: d.isit_label + " (" + d.id + ")",
  section: null,
  text: null
}));

// put out array to overwrite _site/search.json
console.log("Replacing site search index...")
await Deno.writeTextFile("_site/search.json", JSON.stringify(searchIndex));
