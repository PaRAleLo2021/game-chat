import Card from '../helpers/card';

export default class voteScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'voteScene'
        });
    }

    init(data){
        /**   Game   **/
        this.socket = data.server;
        this.id = data.id;
        this.cardNumbers = data.cardNumbers;
        this.story = data.story;
    }

    preload() {
        this.load.image('button','src/assets/button-start-game.png');
    }

    create() {
        /**   Game   **/
        let self = this;
        let selectedCard = null;

        console.log("Printed cardNumbers - " + this.cardNumbers.length + " : " + this.cardNumbers);
        for (let j = 0; j < 2; j++)
            for (let i = 0; i < 3; i++) {
                let number = this.cardNumbers.pop();
                let playerCard = new Card(self);
                playerCard.render(150 + (i * 225), 230 + 340 * j, number, true);
            }

        var style = { 
            fontSize: 34,
            fontFamily: 'Arial',
            align: "left",
            color: '#413b45',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };
        var styleWarning = { 
            fontSize: 24,
            fontFamily: 'Arial',
            align: "left",
            color: 'red',
            wordWrap: { width: 250, useAdvancedWrap: true }
        };

        this.add.text(750, 300, 'Vote for the picture that describes the story best', style);
        this.add.text(750, 450, 'The story: ' + this.story, style).setFontSize(40);
        this.errorMissingCard = this.add.text(750, 200, 'Please choose a Card!', styleWarning).setVisible(false);

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if(gameObject.texture.key!='button'){
                if(selectedCard != null){
                    selectedCard.setTint(0x7885cb);
                    selectedCard.setScale(1.3, 1.3);
                }
                selectedCard = gameObject;
                self.children.bringToTop(gameObject);
                gameObject.setTint();
            }
        })

        this.input.on('gameobjectover', function (pointer, gameObject) {
            if(gameObject.texture.key!='button'){
                gameObject.setScale(1.8, 1.8);
            }
        })

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if(gameObject.texture.key!='button'){
                gameObject.setScale(1.3, 1.3);
            }
        })

        const buttonSubmitStory = this.add.image(850,605, "button").setScale(0.5,0.5);
        buttonSubmitStory.setInteractive();
        buttonSubmitStory.on('pointerdown', () => {
            if (selectedCard == null) {
                this.errorMissingCard.setVisible(true);
            }

            else {
                console.log('My card: ' + selectedCard.texture.key);
                //self.socket.emit("gatherCards", selectedCard.texture.key);
                //self.scene.start("waitForCards", { server: self.socket, id: self.id, cardNumbers: cards, story: this.story, cardChoice: selectedCard.texture.key});
            }
        });
    }
}