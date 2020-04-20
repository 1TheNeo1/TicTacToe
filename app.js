const gameBoard = ((doc) => {
    let gameboard = [['','', ''],['','', ''],['','', '']];
    const createFields = () => {
        const container = doc.querySelector('#container')
        for (let index = 0;index < gameboard.length; index++) {
            for (let y = 0; y < gameboard[index].length; y++) {
                const div = doc.createElement('div')
                div.setAttribute('class', 'field')
                div.setAttribute('id', `${index}${y}`)
                container.appendChild(div)
            }
        }
    }
    createFields()
    const editFields = (shape,id) => {
        let divField = document.getElementById(id)
            divField.innerText = shape;
    }

    const clearField = () => {
        let fields = document.querySelectorAll('.field');
        gameBoard.gameboard = [['','', ''],['','', ''],['','', '']];
        fields.forEach(field => {field.innerText = gameboard[0][0]})
    }

    const reset = () => {
        const resetBtn =  doc.querySelector('#restart')
        resetBtn.addEventListener('click', () => {
            const x = doc.querySelector('#x')
            const o = doc.querySelector('#o')
            x.innerText = 0
            o.innerText = 0
            clearField()
       })
    }


    reset()
    return{
        editFields,
        gameboard,
        clearField
    }
})(document);



const Player = (shape) => {

    const displayingInfoHelper = () => { // helper function
        if(shape == 'x'){
            return document.querySelector('#player1')
            
        }else if(shape == 'o'){
            return document.querySelector('#player2')
        }
    }
    const getName = () => {
        const name = prompt(`Hey ${shape} Player.Input your name, please: `, 'Player')
        return name
    }
    const name = getName()
    let score = 0
    const displayingInfo = () => {
        let playerDiv = displayingInfoHelper()
        const namePara = document.createElement('p')
        namePara.innerText = `${name}`
        const scorePara = document.createElement('p')
        scorePara.setAttribute('id',`${shape}`)
        scorePara.setAttribute('class', 'shapes')
        scorePara.innerText = `${score}`
        playerDiv.appendChild(namePara)
        playerDiv.appendChild(scorePara)
    }
    
    return{shape, name, displayingInfo}
}

const game = ((document) => {
    const player1 = Player('x')
    const player2 = Player('o')

    player1.displayingInfo()
    player2.displayingInfo()

    const whoShouldPlay = (player1,player2) => {
        let arr = [];
        gameBoard.gameboard.forEach((e) => {
            e.forEach((el) => {
                arr.push(el)
            })
        })
        let counts = {}
        arr.forEach((x) => {
            counts[x] = (counts[x] || 0)+1;
        })
        if((counts['x'] == undefined) || (counts['x'] == counts['o']))
            return player1
        else if((counts['x'] > counts['o']) || (counts['o'] == undefined)) 
            return player2
    }
    const stringToNumbers = (str) => {//helper function for transfering id to nubers
        let arr = str.split('')
        for (let i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i])      
        }
        return arr
    }

    const isGameOver = (gameboard) => {
        let isOver = false

        const winner = (shape) => {
            const getPara = document.querySelector(`#${shape}`)
            getPara.innerText = parseInt(getPara.innerText) +1
        }

        const areEqual = (row) => {
            if ((row.every((v) => v === row[0] && v.length > 0))) {
                isOver = true
                alert('Winner is ' + row[0])
                winner(row[0])
            }   
        }
        gameboard.forEach(row => {
            areEqual(row)//check if rows are equals
        })

        let firstEl = [[],[],[]]
        for (let i = 0; i < gameboard.length; i++) {
            for (let y = 0; y < gameboard[i].length; y++) {
                firstEl[i].push(gameboard[y][i])
            }
        }
        firstEl.forEach(column => {
            areEqual(column)//check if columns are equal
        })

        let crossEl = [[],[]]
        for (let i = 0; i < gameboard.length; i++) {
            crossEl[0].push(gameboard[i][i])
            crossEl[1].push(gameboard[i][2-i])
        }
        crossEl.forEach(cross => {
            areEqual(cross)//check if elements are cross equal
        })
        let helperArr = []
        gameboard.forEach(el => el.forEach(x => helperArr.push(x)))
        if (helperArr.every(el => el.length > 0) && isOver == false){
            alert('TIE')
            isOver = true
        }
        if(isOver == true){
            isOver = false
            gameBoard.clearField()
        }
    }
    
    const playTurn = () => {
        let fields = document.querySelectorAll('.field');
        let isOver  = false
        fields.forEach(field => {
            field.addEventListener('click', ()=>{
                if((field.innerText.length < 1) && isOver == false){//checking to se if the field is already taken
                    let player = whoShouldPlay(player1.shape,player2.shape)
                    const idArr = stringToNumbers(field.id)
                    gameBoard.gameboard[idArr[0]][idArr[1]] = player
                    gameBoard.editFields(player,field.id);//sending id to the editFields
                    isGameOver(gameBoard.gameboard)

                }
            })
        });
    }
    const newMatch = () => {
        gameBoard.clearField()
        const newBtn = document.querySelector('#start')
        newBtn.addEventListener('click',() => {playTurn()})
    }    
    return {newMatch}
})(document);

game.newMatch()