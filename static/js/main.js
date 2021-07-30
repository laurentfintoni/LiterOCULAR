// Global Variables
var metadataViewerBox = document.getElementById("metadata-viewer");
var articleSources = {
  KMD: {
     metadata: "",
     articles: [
      "KMD_egotrip_98.html", 
      "KMD_Source_1991.html", 
      "KMD_Source_1994.html"]
  },
  Timnit: [
    "Timnit_MITREVIEW_20.html",
    "Timnit_NYT_21.html",
    "Timnit_WAPO_20.html",
  ],
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
var mentionColors = {
  "mention-person": "background-color: #FF2D00;",
  "mention-location": "background-color: #FFF000;",
  "mention-group": "background-color: #7CFF00;",
  "mention-organization":"background-color: #00FFC1;",
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
  "mention-event": "background-color: #8000FF;"
}


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
    let spanArray = Array.from(spanMentions);
    let mentions = Object.keys(mentionsCount);

    spanArray.forEach((span) => {
      span.classList.forEach((spanClass) => {
        about = span.getAttribute("about");
        // Span contains a mention-* class AND the "about" object already has a value
        if (
          mentions.includes(spanClass) &&
          mentionsCount[spanClass][about] != undefined
        ) {
          mentionsCount[spanClass][about]++;
          mentionsCount[spanClass]["total"]++;
          // Span contains a mention-* class and the "about" object doesn't exist yet
        } else if (
          mentions.includes(spanClass) &&
          mentionsCount[spanClass][about] == undefined
        ) {
          mentionsCount[spanClass][about] = 1;
          mentionsCount[spanClass]["total"]++;
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
    var sortedMentions = mentionsList.sort((first, second) => {
      let firstTotal = first[1]["total"];
      let secondTotal = second[1]["total"];
      if (firstTotal > secondTotal) { return -1 }
      else if (secondTotal > firstTotal) { return 1 }
      else {return 0}
    });

    for (const [type, abouts] of sortedMentions) {
      if (abouts['total'] != 0) {
        // Accordion item: item[ h2[button] body[content] ]
        const item = setAttributes(
          document.createElement("div"), 
          {"class":"accordion-item", 
          "id":`metadata${articleCounter+1}-${type}`}
        );
        const header = setAttributes(
          document.createElement("h3"),
          {"class":"accordion-header",
          "id": `${type}-header`}
        );
        const btn = setAttributes(
          document.createElement("button"), 
          {"class": "accordion-button collapsed",
          "type": "button",
          "data-bs-toggle": "collapse",
          "data-bs-target": `#${type}-collapse-${articleCounter+1}`,
          "aria-expanded": "false",
          "aria-controls": `${type}-collapse`}
        );
        const body = setAttributes(
          document.createElement("div"),
          {"id": `${type}-collapse-${articleCounter+1}`,
          "class": "accordion-collapse collapse",
          "data-bs-parent": `#metadata${articleCounter+1}`}
        );
        
        const content = setAttributes(
          document.createElement("p"),
          {"class": "accordion-body"}
        );

        const mentionName = type.split("-")[1][0].toUpperCase() + type.split("-")[1].slice(1).toLowerCase();
        let links = []
        for (const aboutType of Object.keys(abouts)) {
          // TODO: fede turn into buttons (split w/ "external source" dropdown)
          let el = setAttributes(document.createElement("a"), {"onclick":"focusMetadata(this);", "id": `${type}/${aboutType}`, "href":"#"});
          el.innerText = aboutType;
          content.appendChild(el)
          content.innerHTML += " ";
        }
        btn.innerHTML = `${mentionName}: ${abouts['total']}`
        
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
  var styleTag = document.getElementById("dynamic-styling");
  console.log(element.id)
  // TODO: fede Just one "highlighted style"
  // toggle class ->total: mention-*/ (article-specific)      
  //              ->fragment: about="*" (issue-wide)

  // TODO: laurent disable offcanvas
  // getElbyID() -> get or create instance
  // https://getbootstrap.com/docs/5.0/components/offcanvas/#methods
}

function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value)
  });
  return el;
}

document.addEventListener("DOMContentLoaded", () => {
  // TODO: Laurent load html issue metadata
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
