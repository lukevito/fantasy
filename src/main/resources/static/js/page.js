var visElements= [];
var p5Elements= [];
var current_container_id = 0;

function getActiveFantasyVisId() {
    return "container_vis_" + current_container_id;
}
function getActiveFantasyConfigId() {
    return "container_config_" + current_container_id;
}

// Example GET method implementation:
let getMethodHeader = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    // mode: "no-cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrer: " no-referrer", // no-referrer, *client
    // body: JSON.stringify(data), // body data type must match "Content-Type" header
};

let getConfiguration  = async () => {
    const response =  await fetch("http://localhost:9000/neo4jConf", getMethodHeader);
    return await response.json();
};

let getOptions  = async () => {
    const response =  await fetch("http://localhost:9000/neo4jConf", getMethodHeader);
    return await response.json();
};

async function getConfig(id_vis_container, id_config_container, cypherQ = "MATCH p=(player:Player)-[r:PLAYED]->(team:Team) WHERE player.image is not null RETURN p limit 200") {
    let configuration_container = self.document.getElementById(id_config_container);

    let neo4jConf = await getConfiguration();
    neo4jConf["container_id"]  = id_vis_container;

    let options = {};

    options["options"] = {
        nodes: {
            shape: 'dot',
            "font": {
                "color": "rgba(0,0,0,1)",
                "size": 10,
                "face": "tahoma",
                "background": "rgba(44,23,48,0)",
                "strokeColor": "rgba(33,46,255,1)"
            },
            scaling: {
                label: {
                    enabled: true
                }
            }
        },
        groups: {
            diamonds: {
                color: {background: 'red', border: 'white'},
                shape: 'diamond'
            },
            dotsWithLabel: {
                label: "I'm a dot!",
                shape: 'dot',
                color: 'cyan'
            },
            mints: {color: 'rgb(0,255,140)'},
            Team: {
                shape: 'circularImage',
                color: "rgba(150,150,150,1)",
                size: 50,
                "font": {
                    "color": "rgba(30,30,30,1)",
                    "size": 16,
                    "face": "tahoma",
                    "background": "rgba(44,23,48,0)",
                    "strokeColor": "rgba(33,46,255,1)"
                },
                scaling: {
                    min: 0,
                    max: 100
                }
            },
            Player: {
                shape: 'image',

                scaling: {
                    min: 30,
                    max: 100
                }

            },

            "POINT GUARD": {
                shape: 'circularImage',
                font: {
                    "color": "rgba(130,130,130,1)",
                    "size": 16,
                    "face": "tahoma",
                    "background": "rgba(44,23,48,0)",
                    "strokeColor": "rgba(33,46,255,1)"
                },
                scaling: {
                    min: 30,
                    max: 100
                }
            },
            "POWER FORWARD": {
                shape: 'image',

                scaling: {
                    min: 30,
                    max: 100
                }

            },
            "SMALL FORWARD": {
                shape: 'image',

                scaling: {
                    min: 30,
                    max: 100
                }

            },
            "CENTER": {
                shape: 'circularImage',
                color: "rgba(255,20,150,1)",
                "font": {
                    "color": "rgba(130,130,130,1)",
                    "size": 25,
                    "bold" : true,
                    "face": "tahoma",
                    "background": "rgba(44,23,48,0)",
                    "strokeColor": "rgba(33,46,255,1)"
                },
                scaling: {
                    min: 30,
                    max: 100
                }

            },
            "SHOOTING GUARD": {
                shape: 'image',

                scaling: {
                    min: 30,
                    max: 100 //TODO:
                }

            }
        },
        physics: {
            stabilization: false
        },
        "interaction": {
            "hover": true,
            // "keyboard": {
            //     "enabled": true
            // },
            "multiselect": true,
            "navigationButtons": true
        },
        "manipulation": {
                "enabled": true,
                "initiallyActive": true
            }
    };
    options["options"]["configure"] =
        {
            enabled: true,
            filter: function (option, path) {
                return true;
                if (path.indexOf('physics') !== -1) {
                    return true;
                }
                if (path.indexOf('nodes') !== -1) {
                    return true;
                }
                if (path.indexOf('smooth') !== -1 || option === 'smooth') {
                    return true;
                }
                return false;
            },
            container: configuration_container
    };

    let lables = {
        labels: {
            //"Character": "name",
            Team: {
                caption: "name",
                //community: "position"//TODO:
                //"sizeCypher": "MATCH (n) WHERE id(n) = {id} RETURN (SIZE((n)--()) * 1.0)/30 AS v "

            },
            Player: {
                caption: "name",
                size: "age",//TODO:
                sizeCorrection: 50,
                community: "position"
                //"sizeCypher": "MATCH (n) WHERE id(n) = {id} MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
            }
        },
        relationships: {
            PLAYED: {
                thickness: "weight",//TODO:
                caption: false
            }
        }
    };

    let relationships=  {
        relationships: {
            PLAYED: {
                thickness: "weight",//TODO:
                caption: false
            }
        }
    };
    let cypQuery = {
        initial_cypher: cypherQ
    };
    return Object.assign({}, neo4jConf, options, lables, relationships, cypQuery);
}

function createVisDivElement() {
    var template = $('#template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template,
        {
            id: current_container_id,
        });

    let htmlElement = document.createElement("div");
    htmlElement.class = "row";
    $(htmlElement).html(rendered);

    var mainElement = document.getElementById("main");
    mainElement.insertAdjacentElement('beforeend', htmlElement.firstElementChild);
}

class Button {

    constructor(text, x, y, size, backgroundColor, processP5) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.backgroundColor= backgroundColor;
        this.processP5 = processP5;
    }

    create() {
        this.shape();
    }

    shape() {
        this.processP5.fill(this.backgroundColor);
        this.processP5.noStroke();
        this.processP5.rect(this.x, this.y, this.size, this.size, 10);
        if (this.processP5.focused) {
            this.processP5.fill(this.backgroundColor + 200);
        } else {
            this.processP5.fill(this.backgroundColor + 100);
        }

        if (this.isSelected()) {
            this.processP5.fill(this.backgroundColor + 150);
        }
        this.processP5.rect(this.x+5, this.y+5, this.size-10, this.size-10, 7);
        this.processP5.fill(0, 102, 153);

        this.processP5.textFont('Helvetica', 18);
        this.processP5.text(this.text, this.x + this.size/2/2, this.y + this.size/2 + 10);
        this.processP5.fill(this.backgroundColor);
    }

    isSelected() {
        return this.processP5.mouseX > this.x && this.processP5.mouseX < this.x + this.size
            && this.processP5.mouseY > this.y && this.processP5.mouseY < this.y + this.size;
    }

    mouseClicked() {}
}