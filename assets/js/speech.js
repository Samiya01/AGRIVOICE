// constant definitions

const  aiNameEng = `Agrivoice`;
const  aiNameInd = `एआई-बॉट`;
const  farmerNameEng = `Farmer`;
const  farmerNameInd = `किसान`;

const  errorMessageHindi = `क्षमा करें। मैं केवल कृषि समस्याओं में मदद कर सकता हूं`;
const  errorMessageEng = `Sorry. I can only help with agriculture problems`;


const  prefixTextHindi = `निम्नलिखित एआई-बॉट और एक किसान के बीच बातचीत है। एआई-बॉट का उद्देश्य किसानों को कृषि विषयों के बारे में सलाह देने में मदद करना है। उपयोग की जाने वाली भाषा केवल हिंदी है।\nयदि किसान किसी अन्य विषय के बारे में बात करता है जो कृषि या भूगोल या कृषि विज्ञान से संबंधित नहीं है, तो एआई-बॉट एक संदेश के साथ प्रतिक्रिया करता है।: '${errorMessageHindi}'\n\n${farmerNameInd}: नमस्ते\n\n${aiNameInd}: नमस्ते, मैं आज आपकी सहायता कैसे करूं?\n\n${farmerNameInd}: `;
const  prefixTextEnglish = `The following is a conversation between an ${aiNameEng} and a ${farmerNameEng}. The purpose of the ${aiNameEng} is to help to provide advice to ${farmerNameEng}s about agriculture topics.\nThe language used is english only\nIf the ${farmerNameEng} talks about any other topic that is not related to agriculture or geography or agriculture science, the ${aiNameEng} responds with a message: '${errorMessageEng}'\n\n ${farmerNameEng}: Hello\n\n${aiNameEng}: Hello, how can I help you today?\n\n${farmerNameEng}:`;
const  starterTextEng = `Hello there 👋. How may I help you today?`;
const  StarterTextHindi = `नमस्ते. आज मैं आपकी कैसे मदद कर सकता हूँ?`;
const  surfixTextEnglish = `\n\n${aiNameEng}: `;
const  surfixTextHindi = `\n\n${aiNameInd}: `;




// variable ddeclaration and initialization
var spokenText = ""


function speak(statement){
  speechSynthesis.speak(new SpeechSynthesisUtterance(statement))
}

if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();
  
    recognition.continuous = true;
    recognition.interimResults = true;
  
    recognition.lang = "en-US";
    
  
    recognition.onresult = function(e) {
      // console.log(e)
      spokenText = e.results[0][0].transcript;
      document.querySelector("#spokenText").value = spokenText
      // console.log(spokenText)
      let timerI = undefined
      
      
    };

    recognition.addEventListener('end',recognition.stop)
    recognition.addEventListener('soundend',recognition.stop)
    recognition.addEventListener('speechend',() => {
      recognition.stop()
      if(spokenText !== ''){
        timerI = setTimeout(
          () => {
            stopSpeaking()
            getResponse(spokenText)
          },5000
        )
      }else{
        // clearTimeout(timerI)
      }
    })
    // recognition.onspeechend = function() {
    //   setTimeout(() => {
    //    stopSpeaking()
    //   },3000)
    // }

    recognition.onerror = function(e) {
      recognition.stop();
    }

    
  
}



function startSpeaking(){
  try{
    spokenText = ''
     recognition.start()
    // setTimeout(() => {
  //   stopSpeaking()
  // },3000)
  }catch(e){

  }
  
}

function stopSpeaking(){
  recognition.stop()
}

function handleSpeak(e){
  e.preventDefault()
  document.getElementById("spokenText").value = ""
  startSpeaking()
  document.getElementById("spokenText").placeholder="start speaking now"
}

function getResponse(txt){
  txt = prefixTextEnglish + txt
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin","*");

  // txt = "respond to this if an only if it relates to agriculture or geography or biology else do not answer :::" + txt
  var raw = JSON.stringify({
    "query": txt || "examples of diseases affecting cattle and their cure"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch("https://calm-forest-14149.herokuapp.com/web", requestOptions)
    .then(response => response.json())
    .then(result => {
      // document.querySelector("#responseText").value = result.message.question.split(':::')[1]+"?\t"+result.message.answer
      let data = result.message.answer
      document.querySelector("#responseText").value = data
      speak(data)
    })
    .catch(error => console.log('error', error));
}

function handleSend(e){
  e.preventDefault()
  document.querySelector("#responseText").value = "thinking..."
  getResponse(spokenText)
  spokenText = ""
  document.querySelector("#spokenText").value = ""
  
}

function typeText(e){
  spokenText = e.target.value
}



function generateImage(capt="rice leaf disease"){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "caption": capt || "soil pH"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://calm-forest-14149.herokuapp.com/image", requestOptions)
    .then(response => response.text())
    .then(result =>{
      console.log(result)
      document.querySelector("#generated").src = JSON.parse(result).url
    })
      
    .catch(error => console.log('error', error));
}


