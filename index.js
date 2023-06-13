// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const publishEl = document.getElementById("publish")
const endorsementsEl = document.getElementById("endorsements")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")
const endorsementsContainer = document.getElementById("endorsements-container")

const appSettings = {
    databaseURL: "https://playground-7f158-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database,"endorsements")

publishEl.addEventListener("click",function(){
    const content = endorsementsEl.value
    const fromText = fromEl.value
    const toText = toEl.value
    const endorsementObj = {
        "content":content,
        "from":fromText,
        "to": toText,
        "kudo":0
    }
    push(endorsementsInDB,endorsementObj)
    clearInput()
})

function clearInput() {
    endorsementsEl.value=""
    fromEl.value=""
    toEl.value=""
}

onValue(endorsementsInDB,function(snapshot){
    endorsementsContainer.innerHTML=""
    if(snapshot.exists()){
        const allEndorsements = Object.entries(snapshot.val())
        for(let i = allEndorsements.length - 1; i >= 0 ; i--) {
            addNewElement(allEndorsements[i])
        }
    }
})

function addNewElement(oneEndorsement) {
    const endorsementID = oneEndorsement[0]
    const endorsement = oneEndorsement[1]
    const content = endorsement.content
    const fromText = endorsement.from
    const toText = endorsement.to
    const kudo = endorsement.kudo
    const endorsementDiv = document.createElement("div")
    endorsementDiv.id = "outside-container"
    endorsementDiv.innerHTML = `
        <h4 id="display-to">To ${toText}<h4>
        <p>${content}</p>
        <div>
            <h4 id="display-from">From ${fromText}<h4>
            <button id="kudo">❤${kudo}</button>
        <div>
    `
    endorsementsContainer.append(endorsementDiv)
    addKudo(endorsementDiv,kudo,endorsementID)
}

function addKudo(element,kudo,id) {
    element.addEventListener("click", function(){
        kudo += 1
        set(ref(database,`endorsements/${id}/kudo`),kudo)
    })
}
