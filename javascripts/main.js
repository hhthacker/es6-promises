
// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!
	// -no more var (let, const)
	//FAT ARROW

$(document).ready(function() {

const outputContainer = $("#output");

const writeToDOM = (humanArray) => {
  let domString = "";
  for (let i = 0; i < humanArray.length; i++) {
    domString += `<div class="human row">`;
    domString += `<div class="col-sm-4">`;
    domString += `<img src="${humanArray[i].image}">`;
    domString += `<p>${humanArray[i].name}</p>`;
    domString += `</div>`;
    domString += `<div class="col-sm-8 overflow-row">`;
    for (let j = 0; j < humanArray[i].matches.length; j++){
      domString += `<div class="animal">`;
      domString += `<img src="${humanArray[i].matches[j].image}">`;
      domString += `<p>${humanArray[i].matches[j].name}</p>`;
      domString += `<p>${humanArray[i].matches[j].description}</p>`;
      domString += `</div>`;
    }
    domString += `</div>`;
    domString += `</div>`;
  }
  outputContainer.append(domString);
};


	const loadHumans = () => {
		return new Promise((resolve, reject) => {
			$.ajax("./database/humans.JSON")
			.done((data1) => resolve(data1.humans))
			.fail((error1) => reject(error1));
		});
	};

	const loadDinos = () => {
		return new Promise((resolve, reject) => {
			$.ajax("./database/dinos.JSON")
			.done((data2) => resolve(data2.dinos))
			.fail((error2) => reject(error2));
		});
	};

	const loadDogs = () => {
		return new Promise((resolve, reject) => {
			$.ajax("./database/dogs.JSON")
			.done((data3) => resolve(data3.dogs))
			.fail((error3) => reject(error3));
		});
	};

	const loadCats = () => {
		return new Promise((resolve, reject) => {
			$.ajax("./database/cats.JSON")
			.done((data4) => resolve(data4.cats))
			.fail((error4) => reject(error4));
		});
	};

	const myHumans = [];
	const myAnimals = [];

	const checkForTypeMatch = (human, pet) => {
	 	const interestedInArray = human["interested-in"];
		const isMatchNumber = interestedInArray.indexOf(pet.type);
		if (isMatchNumber === -1) {
			return false;
		} else {
			return true;
		}
	};

	const checkForKidFriendly = (human, pet) => {
		const hasKids = human["has-kids"];
		const isKidFriendly = pet["kid-friendly"];
		let isMatched = true;
		if (hasKids && !isKidFriendly) {
			isMatched = false;
		}
		return isMatched;
	};



	loadHumans().then((humans) => {
		humans.forEach((human) => {
			human.matches = [];
			myHumans.push(human);
		});
		Promise.all([loadDogs(), loadCats(), loadDinos()])
		.then((result) => {
			result.forEach((xhrResult) => {
				xhrResult.forEach((animal) => {
					myAnimals.push(animal);
				});
			});

			for (let i = 0; i < myHumans.length; i++) {
				for (let j = 0; j < myAnimals.length; j++) {
					if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFriendly(myHumans[i], myAnimals[j])) {
						myHumans[i].matches.push(myAnimals[j]);
					}
				}
			}
			writeToDOM(myHumans);
		})
		.catch((animalErrors) => console.log(animalErrors));
	})
	.catch((humanError) => console.log(humanError));




});