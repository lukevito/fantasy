var visElements= [];
var p5Elements= [];
var configScrollPos= [];
var current_container_id = 0;

let selectedNode;

function focusOnNode(nodeId, visNetwork) {
    var options = {
        // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
        scale: 1.0,
        offset: {x:0,y:0},
        animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad"
        }
    };
    visNetwork.focus(nodeId, options);
}

async function createNeoVis(jQuery) {
    createVisDivElement();

    const config = await getConfig(getNextFantasyVisId(), getNextFantasyConfigId(), jQuery);
    let newVisElement = new NeoVis.default(config);
    current_container_id++;
    newVisElement.renderNeoVis();

    newVisElement.clOnCompleted = function () {
        newVisElement._network.on( 'doubleClick', function(properties) {
            if (properties.nodes.length === 1) {
                let newSelection = properties.nodes[0];
                // focusOnNode(newSelection, newVisElement._network);

                if (mouseMenu) {
                    mouseMenu.remove();
                }
                mouseMenu = createMouseMenuP5(properties.pointer.DOM.x, properties.pointer.DOM.y, 100, 100);
                selectedNode = newSelection;

            } else {
                if (mouseMenu) {
                    mouseMenu.remove();
                }
            }

            console.log('clicked node ' + properties.nodes);
        });
        newVisElement._network.on( 'dragStart', function(properties) {
                if (mouseMenu) {
                    mouseMenu.remove();
                }
        });
        newVisElement._network.on( 'click', function(properties) {
                if (mouseMenu) {
                    mouseMenu.remove();
                }
        });
    };

    return newVisElement;
}

async function getConfig(id_vis_container, id_config_container, cypherQ) {
    let configuration_container = self.document.getElementById(id_config_container);

    let neo4jConf = await getConfiguration();
    neo4jConf["container_id"]  = id_vis_container;

    let options = {};

    options["options"] = {
        nodes: {
            shape: 'dot',
            font: {
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
        edges: {
            "arrows": {
                "middle": {
                    "enabled": true,
                    "scaleFactor": 1
                }
            },
            "color": {
                "color": "#009DDE",
                "highlight": "#002864",
                "hover": "#009DDE",
                "inherit": false
            },
            "selectionWidth": 3,
            "font": {
                "size": 45
            },
            "hoverWidth": 4,
            "smooth": {
                "forceDirection": "vertical",
                "roundness": 0.15
            },
            "width": 3
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

            Bean: {
                shape: 'image',
                size: 50,
                icon: {
                    face: 'FontAwesome',
                    code: '\uf573',
                    size: 100,  //50,
                    color:'#009DDE'
                },
                shadow: {
                    "enabled": true,
                    "color": "rgba(30,30,30,0.5)",
                },
                "font": {
                    "size": 12,
                    "color": "#001C54",
                    "face": "tahoma",
                    "strokeColor": "#000000",
                    "strokeWidth": 0.25,
                    "vadjust": 2
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
        "physics": {
            "barnesHut": {
                "gravitationalConstant": -23750,
                "centralGravity": 1.65,
                "springLength": 285
            },
            "minVelocity": 0.75
        },
        "interaction": {
            "hover": true,
            // "keyboard": {
            //     "enabled": true
            // },
            "multiselect": true,
            "navigationButtons": true,
            "tooltipDelay": 2675
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
                return false;
            },
            container: configuration_container
    };

    let lables = {
        labels: {
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
            },
            Bean: {
                caption: "beanName",
                size: 50,//TODO:
                //sizeCorrection: 50,
                //community: "position"
                //"sizeCypher": "MATCH (n) WHERE id(n) = {id} MATCH (n)-[r]-() RETURN sum(r.weight) AS c"
            }
        }
    };

    let relationships=  {
        relationships: {
            PLAYED: {
                thickness: "weight",//TODO:
                caption: false
            },
            DEPENDS_ON: {
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
    let element = mainElement.insertAdjacentElement('afterbegin', htmlElement.firstElementChild);
    let myInputElements = element.querySelectorAll("#" + getCurrentFantasyConfigId());

    Array.from(myInputElements).forEach(el => {
        el.addEventListener('change', function (event) {
            console.log(event.target.value);
            configScrollPos[current_container_id] = el.firstElementChild.scrollTop;
        }, true)
    });
    Array.from(myInputElements).forEach(el => {
        el.addEventListener('change', function (event) {
            console.log(event.target.value);
            el.firstElementChild.scrollTop = configScrollPos[current_container_id];
        })
    });
}

let getConfiguration  = async () => {
    const response =  await fetch("http://localhost:8080/neo4jConf", getMethodHeader);
    return await response.json();
};

let getOptions  = async () => {
    const response =  await fetch("http://localhost:8080/neo4jConf", getMethodHeader);
    return await response.json();
};

function getNextFantasyVisId() {
    return "container_vis_" + current_container_id;
}
function getNextFantasyConfigId() {
    return "container_config_" + current_container_id;
}

function getCurrentFantasyVisId() {
    return "container_vis_" + (current_container_id - (current_container_id === 0?0:1));
}
function getCurrentFantasyConfigId() {
    return "container_config_" + (current_container_id - (current_container_id === 0?0:1));
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