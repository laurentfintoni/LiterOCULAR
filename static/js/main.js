// Global Variables
var metadataViewerBox = document.getElementById("metadata-viewer");
var articleSources = {
  KMD: [
    "KMD_egotrip_98.html", 
    "KMD_Source_1991.html", 
    "KMD_Source_1994.html"],
  Timnit: [
    "Timnit_MITREVIEW_20.html",
    "Timnit_NYT_21.html",
    "Timnit_WAPO_20.html",]
};
var mentionCategories = {
  "KMD": [
    "mention-person",
    "mention-location",
    "mention-group",
    "mention-organization",
    "mention-track",
    "mention-album",
    "mention-sample",
    "mention-rhyme",
    "mention-character",
    "mention-genre",
    "mention-label",
    "mention-subject",
  ],
  "Timnit": [
    "mention-person",
    "mention-location",
    "mention-group",
    "mention-organization",
    "mention-subject",
    "mention-technology",
    "mention-company",
    "mention-event",
  ],
};

// Theme switching
function switchTheme(btn) {
  let cssLink = document.getElementById("external-style-tag");
  switch (btn) {
    case "ancient":
      cssLink.href = "one.css";
      break;

    case "contemporary":
      cssLink.href = "two.css";
      break;

    default:
      break;
  }
}

// Metadata viewer
function fillMetadataBox() {
  let firstArticle = document.getElementById("article1");
  let secondArticle = document.getElementById("article2");
  let thirdArticle = document.getElementById("article3");

  let firstMetadata = document.getElementById("metadata1");
  let secondMetadata = document.getElementById("metadata2");
  let thirdMetadata = document.getElementById("metadata3");

  var articles = [firstArticle, secondArticle, thirdArticle];

  var articleCounter = 0;
  articles.forEach((article) => {

    var mentionsCount = {
      "mention-group": 0,
      "mention-person": 0,
      "mention-track": 0,
      "mention-rhyme": 0,
      "mention-album": 0,
      "mention-label": 0,
      "mention-location": 0,
      "mention-genre": 0,
      "mention-organization": 0,
      "mention-character": 0,
      "mention-sample": 0,
      "mention-subject": 0,
      "mention-location": 0,
      "mention-organization": 0,
      "mention-technology": 0,
      "mention-company": 0,
      "mention-event": 0,
    };
    // Select all spans whose class contains "mention-*"
    let spanMentions = article.querySelectorAll("span[class*='mention']");
    let spanArray = Array.from(spanMentions);

    spanArray.forEach((span) => {
      span.classList.forEach((spanClass) => {
        let mentions = Object.keys(mentionsCount);
        if (mentions.includes(spanClass)) {
          mentionsCount[spanClass]++;
        }
      });
    });
    var box = "";
    if (articleCounter == 0) {
      box = firstMetadata;
    } else if (articleCounter == 1) {
      box = secondMetadata;
    } else if (articleCounter == 2) {
      box = thirdMetadata;
    }

    // Object contains all possible mentions. Sort that by number of mentions (descending)
    var mentionsList = Object.entries(mentionsCount);
    // custom function for comparison in sorting: arguments are two items to be compared, sort by 2nd value (number of mentions)
    var sortedMentions = mentionsList.sort((m1,m2)=>{return m1[1] < m2[1]}) 
    for (const [type, num] of sortedMentions) {
      if (num != 0) {
        const item = document.createElement("li");
        item.classList.add("list-group-item", type);
        let mentionName = type.split("-")[1][0].toUpperCase() + type.split("-")[1].slice(1).toLowerCase();
        item.innerHTML = `${mentionName}: ${num}`;
        box.appendChild(item)
      }
    }
    articleCounter++;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const issue = window.location.href.split("issue=")[1];
  if (issue == "KMD") {
    $("#article1").load("KMD_egotrip_98.html");
    $("#article2").load("KMD_Source_1991.html");
    $("#article3").load("KMD_Source_1994.html");
    setTimeout(() => {
      fillMetadataBox();
    }, 500);
  } else if (issue == "Timnit") {
    $("#article1").load("Timnit_MITREVIEW_20.html");
    $("#article2").load("Timnit_NYT_21.html");
    $("#article3").load("Timnit_WAPO_20.html");
    setTimeout(() => {
      fillMetadataBox();
    }, 500);
  }
});
