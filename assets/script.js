requestUrl = 'https://www.dnd5eapi.co/api/classes'; //classes
requestUrl1 = 'https://www.dnd5eapi.co/api/races'; //Races
requestUrl2 = 'https://api.fungenerators.com/name/generate?category=dragon&limit=10'; //Names

var charButton = $("#classGen");
var raceButton = $("#raceGen");
var statButton = $("#statGen");
var nameButton = $("#nameGen");


let degreesToRotate = 90;

var progressValue = $('progress').val(); //getting a handle on progress bar value.
var charButton = $("#classGen");
var raceButton = $("#raceGen");
var rerollButton = $("#rerollButton")
var savedCharacter = $("#savedCharacter")
var saveButton = $(".savebtn");
var progressBar = {}; //evalutes if we have already updated the progress bar for this section.
var closedthebutton = false;


var strength; //creating varriables so we can use them outside of statgen scope.
var dexterity;
var constitution;
var intelligence;
var wisdom;
var charisma;


//Section for localStorage, need to change to an array later on.

var existingCharacters = localStorage.getItem('characters');
var characters = JSON.parse(existingCharacters) || [];



var characterClass = localStorage.getItem("characterClass"); //was using previously to setup localstorage.
var characterRace = localStorage.getItem("characterRace");
var characterName = localStorage.getItem("characterName");

var newCharacter = { //object for our name race class and skills.
  name: characterName,
  race: characterRace,
  class: characterClass,
  stats: {
    str: strength,
    dex: dexterity,
    con: constitution,
    int: intelligence,
    wis: wisdom,
    charis: charisma
  }
};







charClass = function(event) { //class random creation function.
fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

        var classes = data.results;
        var randomIndex = Math.floor(Math.random() * classes.length); 
        var chosenClass = classes[randomIndex];
        console.log(chosenClass.name);
        charButton.text("Reroll") //rename create to reroll
        var buttonText = $("#classText");
        buttonText.text(chosenClass.name);


        if (!progressBar[0]){ //We update the progress bar but only one time per section.
          incrementProgressBar();
          progressBar[0] = true;
        }

        newCharacter.class = chosenClass.name;

        
        if(progressValue == 100){
          characterOverview(newCharacter.class);
        }
  
        
       

  });
}


charRace = function(event) {

  fetch(requestUrl1)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

        
        var races = data.results;
        var randomIndex = Math.floor(Math.random() * races.length); 
        var chosenRace = races[randomIndex];
        console.log(chosenRace.name);
        raceButton.text("Reroll") //rename create to reroll
        var buttonText = $("#raceText");
        buttonText.text(chosenRace.name);

      if (!progressBar[1]){ //We update the progress bar but only one time per section.
        incrementProgressBar();
        progressBar[1] = true;
      }

      
      newCharacter.race = chosenRace.name;
      
      if(progressValue == 100){
        characterOverview();
      }

  });
}


 statRollCalc = function(event) { // Stat Roll Generator Function (4d6 drop lowest roll)

statButton.removeClass("btnfix"); //fix for buttons, we remove class on this one as this makes the container bigger than we want.
  var statArray  = new Array(5);
  for(var i = 0; i < 6; i++){
      statArray[i] = statRoll();
      console.log(statArray[i]);


      //Setting values here so we can put in localstorage.
      strength = statArray[0];
      dexterity = statArray[1];
      constitution = statArray[2];
      intelligence = statArray[3];
      wisdom = statArray[4];
      charisma = statArray[5];

      newCharacter.stats.str = strength; //setting values in our newCharacter object.
      newCharacter.stats.dex = dexterity;
      newCharacter.stats.con = constitution;
      newCharacter.stats.int = intelligence;
      newCharacter.stats.wis = wisdom;
      newCharacter.stats.charis = charisma;

      statButton.text("Reroll") //rename create to reroll

      if (!progressBar[3]){ //We update the progress bar but only one time per section.
        incrementProgressBar();
        progressBar[3] = true;
      }

     

    console.log(newCharacter);
      

  }
  //Renders the stat name and abilityScore
  for(var i = 0; i < 6; i++){

      var attributes = ["Strength: ", "Dexterity: ","Constitution: ", "Intelligence: ", "Wisdom: ", "Charisma: "];

      statIndex = i +1;
      var stat = $("#stat-" + statIndex);
      stat.text(attributes[i] + statArray[i]);

      
  }

 




  if(progressValue == 100){
    characterOverview(attributes);
  }
}

function statRoll() {

  var scores = new Array(3);
  for(var i = 0; i < 4; i++){
      var d6Roll  = (Math.floor((Math.random() * 6) + 1));
      scores[i] = (d6Roll);
      var rollNumber = i + 1;
      console.log("Roll " + rollNumber + ": " + scores[i]);
  }

  var lowestRoll = getLowRoll(scores);
  console.log("Lowest Roll Dropped: " + lowestRoll);

  var abilityScore = 0;

  for(var i = 0; i < 4; i++){
      abilityScore += scores[i];
  }

  abilityScore -= lowestRoll;
  
  return abilityScore;
};
  
function getLowRoll(scores){
  var lowestRoll = 6;
  var lowRoll;
  for(var i = 0; i <= 3; i ++){
      for(var j = 0; j <= 3; j++){
          if(scores[i] < scores[j]){
              lowRoll = scores[i];
              if (lowRoll < lowestRoll){
                  lowestRoll = lowRoll;
              }
          }
      }
  }

  return lowestRoll;
};


charName = function(event) {

  fetch(requestUrl2)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    var names = data.contents.names;
    console.log(names);
        var randomIndex = Math.floor(Math.random() * names.length);
        var randomName = names[randomIndex];
        console.log(randomName);
      var buttonText = $("#nameText");
      buttonText.text(randomName);

      newCharacter.name = randomName;
      nameButton.text("Reroll") //rename create to reroll

      if (!progressBar[4]){ //We update the progress bar but only one time per section.
        incrementProgressBar();
        progressBar[4] = true;
      }

      if(progressValue == 100){
        characterOverview();
      }
});

}


saveFeature = function(){ //when we click save button. We save values to push into our character object.

  console.log(progressBar);

  if (progressBar[0] && progressBar[1] && progressBar[3] && progressBar[4]){ //once our progress bar is full (aka every entry has been filled) we will run the saving function!
  console.log("saving!")
  characters.push(newCharacter);

  
  var updatedCharacters = JSON.stringify(characters);
  
  localStorage.setItem('characters', updatedCharacters);
  location.reload();
}
};


savedCharacters = function(){ //beginging of saving characters. We need to add an array of things to append. Right now it will only append one item from our last. We also want to append a paragraph for each character.
  
  characters.forEach(function(character) {
    var savedCharacter = $("#savedCharacter")
   
    var paragraph = document.createElement('p');
    
    paragraph.innerHTML = " " + "<span class='highlight'>" + character.name + "</span>" + ", The " + "<span class='highlight1'>" + character.race +   "</span>" + " " + "<span class='highlight2'>" + character.class +  "</span>"  + " " + "<span class='highlight3'>" + " Stat's:" +  "</span>"  + " Strength: " + character.stats.str +  " Wisdom: " + character.stats.wis +  " Constituion: " + character.stats.con +  " Intelligence: " + character.stats.int +  " Charisma: " + character.stats.charis;

    
    paragraph.classList.add('is-size-5', 'savedCharacters', 'column');

    var deleteButton = document.createElement('button'); //creating a delete button for to be appended for each paragraph
    deleteButton.innerHTML = 'Delete';
    deleteButton.classList.add('deleteButton', 'button', 'is-danger', 'is-pulled-right'); //adding classes to the button.
  
  
  deleteButton.addEventListener('click', function() { //function within saved to handle deletion without grabbing out of scope.
    
    var index = characters.indexOf(character);
    if (index > -1) {
      characters.splice(index, 1);
    }
    
    paragraph.remove();
    localStorage.setItem('characters', JSON.stringify(characters));
  });
    
  paragraph.appendChild(deleteButton);
    
  savedCharacter.append(paragraph);

   
  });
}







reroll = function(event){
  console.log("rerolling")
  charClass(event);
  charRace(event);
  charName(event);
  statRollCalc(event);
  // Add your functions in here to run when we hit reroll.
}

function diceRoll(){
  
  degreesToRotate++;
  $(".rollDice").css({
    'transform': 'rotate(' + degreesToRotate + 'deg)'
  });
}

function incrementProgressBar() { //progress bar functionality, we call this after we generate.
  progressValue += 25;
  $('progress').val(progressValue);
  
}

var modal = $('.modal');

 function characterOverview(){
  modal.addClass('is-active');
  renderCharacterModal();
 };

function renderCharacterModal(){
  var modalHeader = $('#modalHeader'); //character Name
  var modalClass = $('#modalClass');
  var modalRace = $('#modalRace');
  var modalStat1 = $('#modalStat-1');
  var modalStat2 = $('#modalStat-2');
  var modalStat3 = $('#modalStat-3');
  var modalStat4 = $('#modalStat-4');
  var modalStat5 = $('#modalStat-5');
  var modalStat6 = $('#modalStat-6');

  modalHeader.text(newCharacter.name);
  modalClass.text("Class: " + newCharacter.class);
  modalRace.text("Race: " + newCharacter.race);
  
  modalStat1.text("Strength: " + newCharacter.stats.str);
  modalStat2.text("Dexterity: " + newCharacter.stats.dex);
  modalStat3.text("Constitution: " + newCharacter.stats.con);
  modalStat4.text("Intelligence: " + newCharacter.stats.int);
  modalStat5.text("Wisdom: " + newCharacter.stats.wis);
  modalStat6.text("Charisma: " + newCharacter.stats.charis);


var container = $('<div>').addClass('is-flex is-justify-content-space-evenly is-align-items-center mb-3'); //creating buttons.
var sveButton = $('<button>').addClass('button is-danger  is-rounded ').text('Save');
var rrButton = $('<button>').addClass('button is-danger   is-rounded  ').text('Reroll');
var closeButton = $('<button>').addClass('button is-danger  is-rounded  ').text('Close');



sveButton.on('click', function() {
 
  saveFeature();
});

closeButton.on('click', function() {
  modal.removeClass('is-active');
  
  
});

rrButton.on('click', function() {
  reroll();
  
  
});

if (!closedthebutton){ //statement only will append to the modal once.
container.insertAfter(modalStat6);
container.append(sveButton, rrButton, closeButton);
closedthebutton = true;
}


}



 var closeBtn = $('.modal-close')

 closeModal = function(event){
    modal.removeClass('is-active');
 }



  closeBtn.on("click", closeModal)
  nameButton.on("click", charName)

  charButton.on("click", charClass)
  raceButton.on("click", charRace)
  statButton.on("click", statRollCalc)
  rerollButton.on("click", reroll)
  saveButton.on("click", saveFeature)

  setInterval(diceRoll, 10);
  diceRoll();
  savedCharacters();



