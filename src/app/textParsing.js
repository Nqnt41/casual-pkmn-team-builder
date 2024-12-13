export const formatName = (name) => {
    const parts = name.split("-");
    const maintainNames = ["jangmo-o", "hakamo-o", "kommo-o", "ho-oh", "chi-yu", "chien-pao", "wo-chien", "ting-lu", "porygon-z"]
    const exceptions = ["-mega", "-alola", "-galar", "-hisui", "-gmax", "-eternamax", "-crowned", "-altered", "-cap",
        "-primal", "-origin", "-black", "-white", "-therian", "-terastal", "stellar", "-resolute", "-mr", "lycanroc-", "nidoran-m", "nidoran-f"]

    const capitalizedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));

    if (capitalizedParts.length === 1) {
        return capitalizedParts[0];
    }
    else if (maintainNames.some(exception => name.includes(exception))) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    else if (exceptions.some(exception => name.includes(exception))) {
        if (name.includes("mr-")) {
            capitalizedParts[0] = "Mr.";
            if (name.includes("-galar")) {
                return "Galarian Mr. Mime";
            }
            return capitalizedParts.join(" ");
        }
        else if (name.includes("jr-")) {
            return "Mime Jr.";
        }
        else if (name.includes("nidoran-m")) {
            return "Male Nidoran";
        }
        else if (name.includes("nidoran-f")) {
            return "Female Nidoran";
        }
        else if (name.includes("ogerpon") || name.includes("urshifu") || name.includes("-cap")) {
            if (name.includes("-gmax")) {
                return "Gigantamax " + [capitalizedParts[1], capitalizedParts[2], capitalizedParts[0]].join(" ")
            }
            return [capitalizedParts[1], capitalizedParts[2], capitalizedParts[0]].join(" ");
        }
        else if (name.includes("-alola")) {
            capitalizedParts[1] = "Alolan";
        }
        else if (name.includes("-galar")) {
            capitalizedParts[1] = "Galarian"
        }
        else if (name.includes("-hisui")) {
            capitalizedParts[1] = "Hisuian"
        }
        else if (name.includes("-gmax")) {
            capitalizedParts[1] = "Gigantamax"
        }
        return [capitalizedParts[1], capitalizedParts[0], ...capitalizedParts.slice(2)].join(" ");
    }
    else {
        return capitalizedParts.join(" ");
    }
}

export const convertToName = (member) => {
    const parts = member.toLowerCase().split(" ");

    const exceptions = ["alolan", "galarian", "hisuian", "gigantamax", "mr.", "mr", "jr.", "jr", "porygon z", "rotom"];

    if (parts.length === 1) {
        return parts[0];
    }

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "form" || parts[i] === "forme") {
            parts.splice(i, 1);
        }
    }

    if (exceptions.some(exception => member.includes(exception))) {
        const name = member.toLowerCase();
        if (name.includes("mr") || name.includes("mr.")) {
            if (name.includes("galarian")) {
                return "mr-mime-galar";
            }
            else {
                return "mr" + "-" + parts[1];
            }
        }
        else if (name.includes("jr") || name.includes("jr.")) {
            return parts[0] + "-jr";
        }
        else if (name.includes("porygon z")) {
            return "porygon-z";
        }
        else if (name.includes("alolan")) {
            return parts[1] + "-alola";
        }
        else if (name.includes("galarian")) {
            return parts[1] + "-galar";
        }
        else if (name.includes("hisuian")) {
            return parts[1] + "-hisui";
        }
        else if (name.includes("gigantamax")) {
            return parts[1] + "-gmax";
        }
        else if (name.includes("rotom")) {
            return parts[0] + "-" + parts[1];
        }
        else {
            return parts[1] + "-" + parts[0];
        }
    }
    else if (parts.length === 2) {
        return parts[1] + "-" + parts[0];
    }
    else if (parts.length === 3) {
        return parts[1] + "-" + parts[0] + "-" + parts[2];
    }
    return parts[0];
}