
// Global Variables
var metadataViewerBox = document.getElementById("metadata-viewer");
var articleSources = {
    "KMD": [
        "KMD_egotrip_98.html",
        "KMD_Source_1991.html",
        "KMD_Source_1994.html",
    ],
    "Timnit": [
        "Timnit_MITREVIEW_20.html",
        "Timnit_NYT_21.html",
        "Timnit_WAPO_20.html"
    ]
}


// Theme switching
function switchTheme(btn) {
    let cssLink = document.getElementById("external-style-tag");
    switch (btn) {
        case "ancient":
            cssLink.href = "one.css"
            break;

        case "contemporary":
            cssLink.href = "two.css"
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

    
    var articles = [firstArticle, secondArticle, thirdArticle]
    const mentions = [
        "mention-group", "mention-person", "mention-track", "mention-rhyme", "mention-album", "mention-label", "mention-location", "mention-genre", "mention-organization", "mention-character", "mention-sample", "mention-subject",
        "mention-subject", "mention-location", "mention-person", "mention-organization", "mention-technology", "mention-company", "mention-group", "mention-event"
    ]
    var articleCounter = 0;
    articles.forEach( (article) => {
        console.log(`Analysing article... (${articleCounter + 1})`)

        const mentionsCount = {
            "mention-group": 0, "mention-person": 0, "mention-track": 0, "mention-rhyme": 0, "mention-album": 0, "mention-label": 0, "mention-location": 0, "mention-genre": 0, "mention-organization": 0, "mention-character": 0, "mention-sample": 0, "mention-subject": 0,
            "mention-subject": 0, "mention-location": 0, "mention-person": 0, "mention-organization": 0, "mention-technology": 0, "mention-company": 0, "mention-group": 0, "mention-event": 0
        }

        let spanMentions = article.querySelectorAll("span");
        console.log(spanMentions)
        let spanArray = Array.from(spanMentions);
        spanArray.forEach( (span) => {
            span.classList.forEach( (spanClass) => {
                if (mentions.includes(spanClass)) {
                    mentionsCount[spanClass] ++;
                }
            })
        })
        var box = "";
        if (articleCounter == 0) {box = firstMetadata}
        else if (articleCounter == 1) {box = secondMetadata}
        else if (articleCounter == 2) {box = thirdMetadata}

        for (const [type, num] of Object.entries(mentionsCount)) {
            if (num != 0) {
                console.log(`type, num: ${type}, ${num}`);
                const item = box.querySelector(`.${type}`);
                item.classList.remove("visually-hidden");
                item.innerHTML += " "+num;
            }

        }
        articleCounter ++;
    })
}



document.addEventListener("DOMContentLoaded", () => {
    const issue = window.location.href.split("issue=")[1];
    if (issue == "KMD") {
        $('#article1').load('KMD_egotrip_98.html');
        $('#article2').load('KMD_Source_1991.html');
        $('#article3').load('KMD_Source_1994.html');
        setTimeout(()=>{ fillMetadataBox();}, 500)
    } else if (issue == "Timnit") {
        $('#article1').load('Timnit_MITREVIEW_20.html');
        $('#article2').load('Timnit_NYT_21.html');
        $('#article3').load('Timnit_WAPO_20.html');
        setTimeout(()=>{ fillMetadataBox();}, 500)
    }
})