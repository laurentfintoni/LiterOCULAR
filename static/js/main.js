
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
