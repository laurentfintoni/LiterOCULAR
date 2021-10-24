// Global Variables
var metadataViewerBox = document.getElementById("metadata-viewer");
var articleSources = {
  KMD: {
    metadata: "KMD_meta.html",
    articles: ["KMD_Source_1991.html", "KMD_Source_1994.html", "KMD_egotrip_98.html"],
  },
  Timnit: {
    metadata: "Timnit_meta.html",
    articles: ["Timnit_MITREVIEW_20.html", "Timnit_WAPO_20.html", "Timnit_NYT_21.html"],
  },
};
var mentionCategories = {
  KMD: [
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
  Timnit: [
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
var aboutColors = {
  "mention-person": "background-color: #FF2D00;",
  "mention-location": "background-color: #FFF000;",
  "mention-group": "background-color: #7CFF00;",
  "mention-organization": "background-color: #00FFC1;",
  "mention-track": "background-color: #00FFF7;",
  "mention-album": "background-color: #00ECFF;",
  "mention-sample": "background-color: #0074FF;",
  "mention-rhyme": "background-color: #8000FF;",
  "mention-character": "background-color: #F000FF;",
  "mention-genre": "background-color: #FF0055;",
  "mention-label": "background-color: #C70039;",
  "mention-subject": "background-color: #DAF7A6;",
  "mention-technology": "background-color: #00ECFF;",
  "mention-company": "background-color: #0074FF;",
  "mention-event": "background-color: #8000FF;",
};

// Theme switching
function switchTheme(btn) {
  // toggle transition
  const transitionEls = document.querySelectorAll(".anim-layer");
  for (const layer of transitionEls) {
    layer.classList.toggle("active");
  }

  // Core is default, then one, two, three
  let cssLink = document.getElementById("theme-style-tag");
  let basePath = "/static/css/";
  switch (btn.id) {
    case "theme-toggle-newspaper":
      cssLink.href = basePath + "newspaper.css";
      break;

    case "theme-toggle-deco":
      cssLink.href = basePath + "deco.css";
      break;

    case "theme-toggle-music":
      cssLink.href = basePath + "music.css";
      break;

    case "theme-toggle-ml":
      cssLink.href = basePath + "ML.css";
      break;

    case "theme-toggle-base":
      cssLink.href = basePath + "base.css";

    default:
      break;
  }
  // Save the choice to local storage: this is preserved for the same domain
  // so we can access the same variables from another page of the same website
  localStorage.setItem("theme", btn.id);
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
      // mention-type : {total: number, about1: number, about2: number}
      "mention-group": { total: 0 },
      "mention-person": { total: 0 },
      "mention-track": { total: 0 },
      "mention-rhyme": { total: 0 },
      "mention-album": { total: 0 },
      "mention-label": { total: 0 },
      "mention-location": { total: 0 },
      "mention-genre": { total: 0 },
      "mention-organization": { total: 0 },
      "mention-character": { total: 0 },
      "mention-sample": { total: 0 },
      "mention-subject": { total: 0 },
      "mention-technology": { total: 0 },
      "mention-company": { total: 0 },
      "mention-event": { total: 0 },
    };
    // Select all spans whose class contains "mention-*"
    let spanMentions = article.querySelectorAll("span[class*='mention']");
    // querySelector returns weird objects: cast into array
    let spanArray = Array.from(spanMentions);
    // array of mention names
    let mentions = Object.keys(mentionsCount);

    spanArray.forEach((span) => {
      span.classList.forEach((spanClass) => {
        about = span.getAttribute("about");
        // Span contains a mention-* class AND the "about" object already has a value
        if (mentions.includes(spanClass) && mentionsCount[spanClass][about] != undefined) {
          mentionsCount[spanClass][about]++;
          mentionsCount[spanClass]["total"]++;

          // Span contains a mention-* class and the "about" object doesn't exist yet
        } else if (mentions.includes(spanClass) && mentionsCount[spanClass][about] == undefined) {
          mentionsCount[spanClass][about] = 1;
          mentionsCount[spanClass]["total"]++;
        }
      });
    });

    var box;
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
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var sortedMentions = mentionsList.sort((first, second) => {
      let firstTotal = first[1]["total"];
      let secondTotal = second[1]["total"];
      if (firstTotal > secondTotal) {
        return -1;
      } else if (secondTotal > firstTotal) {
        return 1;
      } else {
        return 0;
      }
    });

    for (const [type, abouts] of sortedMentions) {
      if (abouts["total"] != 0) {
        // Accordion item: item[ h2[button] body[content] ]
        const item = setAttributes(document.createElement("div"), {
          class: "accordion-item",
          id: `metadata${articleCounter + 1}-${type}`,
        });
        const header = setAttributes(document.createElement("h3"), { class: "accordion-header", id: `${type}-header` });
        const btn = setAttributes(document.createElement("button"), {
          class: "accordion-button collapsed",
          type: "button",
          "data-bs-toggle": "collapse",
          "data-bs-target": `#${type}-collapse-${articleCounter + 1}`,
          "aria-expanded": "false",
          "aria-controls": `${type}-collapse`,
        });
        const body = setAttributes(document.createElement("div"), {
          id: `${type}-collapse-${articleCounter + 1}`,
          class: "accordion-collapse collapse",
          "data-bs-parent": `#metadata${articleCounter + 1}`,
        });

        const content = setAttributes(document.createElement("p"), { class: "accordion-body" });

        // mention-person -> Person (first letter capitalised + rest of the word)
        const mentionName = type.split("-")[1][0].toUpperCase() + type.split("-")[1].slice(1).toLowerCase();

        for (const aboutType of Object.keys(abouts)) {
          // Button creation (split btn type)
          let btnGroup = setAttributes(document.createElement("div"), { class: "btn-group m-1" });
          let mainBtn = setAttributes(document.createElement("button"), {
            type: "button",
            class: "btn btn-outline-secondary btn-sm",
            onclick: "focusMetadata(this);",
            id: `${type}/${aboutType}`,
            href: "#",
            "data-article": articleCounter + 1,
          });
          if (aboutType == "total") {
            mainBtn.innerText = "View all " + mentionsCount[type][aboutType];
          } else {
            mainBtn.innerText = aboutType + " " + mentionsCount[type][aboutType];
          }
          btnGroup.appendChild(mainBtn);

          if (aboutType != "total") {
            let splitBtn = setAttributes(document.createElement("btn"), {
              type: "button",
              class: "btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
            });
            // Dropdown menu (points to external source)
            let menuDrop = setAttributes(document.createElement("ul"), { class: "dropdown-menu" });
            let externalLink = setAttributes(document.createElement("li"), { class: "dropdown-item" });
            externalLink.innerHTML = `<a href="https://en.wikipedia.com/w/index.php?search=${aboutType}" target="_blank">Wikipedia</a>`;
            menuDrop.appendChild(externalLink);
            btnGroup.appendChild(splitBtn);
            btnGroup.appendChild(menuDrop);
          }
          content.appendChild(btnGroup);
          content.innerHTML += " ";
        }
        btn.innerHTML = `${mentionName}: ${abouts["total"]}`;

        header.appendChild(btn);
        item.appendChild(header);

        body.appendChild(content);
        item.appendChild(body);

        box.appendChild(item);
      }
    }
    articleCounter++;
  });
}

function focusMetadata(element) {
  // Unpack id mention/name into two variables
  let [mentionType, mentionName] = element.id.split("/");

  if (mentionName != "total") {
    // Issue-wide highlight of that specific mentioned item
    console.log("Highlighting all mentions of ", mentionName);
    let selectedMentions = document.querySelectorAll(`span[about=${mentionName}]`);
    selectedMentions.forEach((mention) => {
      mention.classList.add("custom-highlight");
      // setTimeout(()=>{ mention.classList.remove("custom-highlight")}, 10000)
    });
  } else {
    // Article-wide highlight of a mention category
    let articleNumber = element.dataset.article;
    let article = document.getElementById("article" + articleNumber);
    console.log("Highlighting all", mentionType, "in article", articleNumber);
    let selectedMentions = article.querySelectorAll(`span.${mentionType}`);
    selectedMentions.forEach((mention) => {
      mention.classList.add("custom-highlight");
      // setTimeout(()=>{ mention.classList.remove("custom-highlight")}, 10000)
    });
  }

  // Disable offcanvas on text highlight
  // var offCanvas = document.getElementById("offcanvasBottom");
  // var bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offCanvas);
  // bsOffcanvas.hide();
}

function resetHighlight(ev) {
  let highlightedStuff = document.querySelectorAll(".custom-highlight");
  highlightedStuff.forEach((item) => {
    item.classList.remove("custom-highlight");
  });
}

// Utils
function setAttributes(el, attrs) {
  // element + dictionary of attribute:value pairs to speed up the creation of elements
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  // Homepage doesn't load articles
  if (window.location.href.indexOf("issue.html") != -1) {
    let issue = window.location.href.split("issue=")[1];
    $("#article1").load(articleSources[issue]["articles"][0]);
    $("#article2").load(articleSources[issue]["articles"][1]);
    $("#article3").load(articleSources[issue]["articles"][2]);
    $("#issue-meta").load(articleSources[issue]["metadata"]);
    setTimeout(() => {
      fillMetadataBox();
    }, 500);
  }

  // If the user chose a theme preserve their choice on page load by
  // accessing the variable and setting the desired theme
  let chosenTheme = localStorage.getItem("theme");
  if (chosenTheme) {
    // instead of passing the element we pass an object which has a propery of id
    switchTheme({ id: localStorage.getItem("theme") });
  }
});
