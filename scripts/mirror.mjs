import fs from "fs";

/**
 * The wiki hosts both the Polkadot Wiki and the Kusama User Guide. This means
 * that we can "mirror" the same document between the two. However, due to
 * a peculiarity in Docusaurus, when we put the same document into both sub-wikis
 * in `website/sidebars.json` only the most recent entry is read.
 *
 * To solve this, we create an explicit mirror of the document. The process for
 * adding content to both wikis is as follows:
 *
 * 1) Create the source document and put it under the relevant sidebar in the
 *    Polkadot wiki configuration in `sidebars.json`.
 * 2) Add the source document's name to the `mirrored` array below.
 * 3) Run `node mirror.js`.
 * 4) Add `mirror-DOCUMENT_NAME` to the sidebar for Kusama in `sidebars.json`.
 *
 */

// List of mirrored files that should be in both the Polkadot wiki and the Kusama
// user guide.
const mirrored = [
  "build-build-with-polkadot",
  "learn-identity",
  "ens",
  "learn-governance",
  "learn-treasury",
  "learn-registrar",
  "maintain-guides-how-to-nominate-kusama",
  "maintain-guides-how-to-validate-kusama",
  "maintain-errors",
  "thousand-validators",
];

for (const file of mirrored) {
  const doc = "./docs/" + file + ".md";
  const mirror = "./docs/mirror-" + file + ".md";
  if (!fs.existsSync(doc)) {
    throw new Error(`${doc} doesn't exist!`);
  }

  const content = fs.readFileSync(doc, { encoding: "utf-8" });
  const mirroredContent = content
    .split("\n")
    .map((line) => {
      if (line.startsWith("id:")) {
        const [before, after] = line.split(" ");
        return before + " mirror-" + after;
      } else return line;
    })
    .join("\n");

  fs.writeFileSync(mirror, mirroredContent);
}

const langDirectories = fs.readdirSync("./website/translated_docs");
for (const lang of langDirectories) {
  for (const file of mirrored) {
    const doc = `./website/translated_docs/${lang}/${file}.md`;
    const mirror = `./website/translated_docs/${lang}/mirror-${file}.md`;
    // console.log(mirror);
    if (!fs.existsSync(doc)) {
      // Disable for now, tends to fail due to unmerged crowdin
      //throw new Error(`${doc} doesn't exist!`);
      continue;
    }

    const content = fs.readFileSync(doc, { encoding: "utf-8" });
    const mirroredContent = content
      .split("\n")
      .map((line) => {
        if (line.startsWith("id:")) {
          const [before, after] = line.split(" ");
          return `${before} mirror-${after}`;
        } else return line;
      })
      .join("\n");

    fs.writeFileSync(mirror, mirroredContent);
  }
}
