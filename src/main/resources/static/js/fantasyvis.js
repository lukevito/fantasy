var current_container_id = 0;

function getActiveFantasyVisId() {
    return "fantasy_vis_" + current_container_id;
}
function getActiveFantasyConfigId() {
    return "fantasy_config_" + current_container_id;
}

var visElements= [];
var p5Elements= [];

function getConfig(id_vis_container, id_config_container, cypherQ = "MATCH p=(player:Player)-[r:PLAYED]->(team:Team) WHERE player.image is not null RETURN p limit 200") {
    let configuration_container = self.document.getElementById(id_config_container);
    let neo4jConf = {
        container_id: id_vis_container,
        server_url: "bolt://localhost:11004",
        server_user: "neo4j",
        server_password: "123",
    };
    //todo: api do pobierania tego co ponizej dla obiektow z cypherQ
    let options = {
        options: {
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
                    shape: 'image',
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
                        max: 200,
                        customScalingFunction: function (min,max,total,value) {
                            if (max === min) {
                                return 0.5;
                            }
                            else {
                                let scale = 1 / (max - min);
                                return Math.max(0,(value - min)*scale);
                            }
                        }
                    }
                },
                Player: {
                    shape: 'image',

                    scaling: {
                        min: 0,
                        max: 80,
                        customScalingFunction: function (min,max,total,value) {
                            if (max === min) {
                                return 0.5;
                            }
                            else {
                                let scale = 1 / (max - min);
                                return Math.max(0,(value - min)*scale);
                            }
                        }
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
            },
            configure: {
                enabled: true,
                filter: function (option, path) {
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
            }
        }
    };

    let lables = {
        labels: {
            //"Character": "name",
            Team: {
                caption: "name",
                size: "pagerank",//TODO:
                //"community": "diamonds"//TODO:
                //"sizeCypher": "MATCH (n) WHERE id(n) = {id} RETURN SIZE((n)--()) AS v "

            },
            Player: {
                caption: "name",
                //size: "pagerank",//TODO:
                //community: "blocks"//TODO:
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