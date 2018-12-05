let canvas;
let buttons = [];


let mouseMenu;

function createTopRightMenuP5(xPos, yPos, sizeX, sizeY) {
    var sketch = function (p) {
        p.setup = function () {
            canvas = p.createCanvas(sizeX, sizeY);
            canvas.position(xPos, yPos);

            let confBtn = new Button("cf", 5, 40, 40, 70, p);
            let fullBtn = new Button("fs", 5, 5, 40, 0, p);

            buttons.push(confBtn);
            buttons.push(fullBtn);

            fullBtn.mouseClicked = function () {
                if (this.isSelected()) {
                    this.processP5.fullscreen(!this.processP5.fullscreen());
                }
            };

            confBtn.mouseClicked = function () {
                if (this.isSelected()) {

                    let s = "#" + getCurrentFantasyConfigId();
                    let config = this.processP5.select(s);
                    let configElement = config.elt;

                    if (configElement.style.display === "none") {
                        configElement.style.display = "block";
                    } else {
                        configElement.style.display = "none";
                    }
                }
            }
        };

        p.draw = function () {
            p.clear();
            let selected;

            for (const button of buttons) {
                button.create();
                if (!selected && button.isSelected()) {
                    selected = true;
                }
            }

            if (selected) {
                p.cursor(p.HAND);
            } else {
                p.cursor(p.ARROW);
            }
        };

        p.mouseClicked = function () {
            for (const button of buttons) {
                button.mouseClicked();
            }
        };
    };

    return new p5(sketch, getNextFantasyConfigId());
}
function createMouseMenuP5(mouseX, mouseY, sizeX, sizeY) {
    let nodeMenu;
    let menuCanvas;

    var sketch = function (p) {
        p.setup = function () {
            menuCanvas = p.createCanvas(sizeX, sizeY);
            menuCanvas.position(mouseX, mouseY);

            nodeMenu = new NodeMenu("button", 5, 5, 40, 0, p);

            nodeMenu.mouseClicked = function () {
                if (this.isSelected()) {
                    this.processP5.fullscreen(!this.processP5.fullscreen());
                }
            };
        };

        p.draw = function () {
            p.clear();
            if (nodeMenu) {
                let selected;

                nodeMenu.create();

                if (!selected && nodeMenu.isSelected()) {
                    selected = true;
                }

                if (selected) {
                    p.cursor(p.HAND);
                } else {
                    p.cursor(p.ARROW);
                }
            }
        };

        p.mouseClicked = function () {
           nodeMenu.mouseClicked();
        };
    };

    return new p5(sketch, getNextFantasyConfigId());
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



class NodeMenu {

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
        this.processP5.fill(this.backgroundColor + 100);
        let x = this.x;
        let y = this.y;
        this.processP5.rect(x, y, this.size, this.size, 10);
        this.processP5.fill(this.backgroundColor + 200);

        this.processP5.rect(x+5, y+5, this.size-10, this.size-10, 7);
        this.processP5.fill(0, 102, 153);

        this.processP5.textFont('Helvetica', 18);
        this.processP5.text(this.text, x + this.size/2/2, y + this.size/2 + 10);
        this.processP5.fill(this.backgroundColor);
    }

    isSelected() {
        return this.processP5.mouseX > this.x && this.processP5.mouseX < this.x + this.size
            && this.processP5.mouseY > this.y && this.processP5.mouseY < this.y + this.size;
    }

    mouseClicked() {}
}