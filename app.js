let db = firebase.firestore();

function savePlaceToFirebase(event) {
  event.preventDefault();
  let place = {};

  place.name = event.target[0].value;
  place.description = event.target[1].value;
  place.clue = event.target[2].value;
  place.hint = event.target[3].value;
  place.longitude = event.target[4].value;
  place.latitude = event.target[5].value;
  console.log(place);

  db.collection("places").add(place);
}

// Get the data whenever it changes
db.collection("places").onSnapshot((querySnapshot) => {
  var places = [];
  querySnapshot.forEach((doc) => {
    places.push({ ...doc.data(), id: doc.id });
  });
  console.log(places);
  updatePlacesList(places);
});

function updatePlacesList(places) {
  placeList.innerHTML = "";
  for (let place of places) {
    let placeItem = `
              <li class="list-group-item d-flex justify-content-between align-items-center">
              ${place.name}
              <button class="btn btn-warning btn-sm" onClick="editPlace('${place.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onClick="deletePlace('${place.id}')">X</button>
              </li>
              `;
    placeList.insertAdjacentHTML("beforeend", placeItem);
  }
}

function deletePlace(place) {
  //alert("You clicked on delete for: " + place)
  if (confirm("Are you sure you want to delete?")) {
    db.collection("places").doc(place).delete();
  }
}

function submitEditPlace(event) {
  event.preventDefault();
  let place = {};

  place.name = event.target[0].value;
  place.description = event.target[1].value;
  place.clue = event.target[2].value;
  place.hint = event.target[3].value;
  place.latitude = event.target[4].value;
  place.longitude = event.target[5].value;
  console.log(place);

  db.collection("places").doc(event.target[6].value).update(place);
}

function createNewForm() {
  editArea.innerHTML = "";

  editArea.insertAdjacentHTML(
    "beforeend",
    `
    <h1 class="mb-3">Create Place</h1>
    <form onsubmit="savePlaceToFirebase(event)">
          <div class="mb-3">
            <input
              required
              type="text"
              class="form-control"
              id="placeName"
              placeholder="Place Name" 
            />
          </div>
          <div class="mb-3">
            <textarea required
            type="text" class="form-control" id="placeDescription" rows="3" placeholder="Place Description"></textarea>
        </div>
        <div class="mb-3">
          <textarea required
          type="text" class="form-control" id="placeClue" rows="3" placeholder="Place Clue"></textarea>
      </div>
      <div class="mb-3">
        <textarea required
        type="text" class="form-control" id="placeHint" rows="3" placeholder="Place Hint"></textarea>
      </div>
      <div class="row mb-3">
        <div class="col">
            <input
            required
            type="number"
            class="form-control"
            id="placeLatitude"
            placeholder="Latitude" 
            step="any"
          />
        </div>
        <div class="col">
            <input
            required
            type="number"
            class="form-control"
            id="placeLongitude"
            placeholder="Longitude" 
            step="any"
          />
        </div>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-primary">Submit</button>
      </div>
    </form>`
  );
}

function editPlace(id) {
  editArea.innerHTML = "";

  db.collection("places")
    .doc(id)
    .get()
    .then((doc) => {
      let place = doc.data();
      let editFormHTML = `

          <h1 class="mb-3">Edit Place</h1>
          <form onsubmit="submitEditPlace(event)">
           
          <div class="mb-3">
            <input
              required
              type="text"
              class="form-control"
              id="placeName"
              placeholder="Place Name" 
              value="${place.name}"
            />
          </div>
          <div class="mb-3">
            <textarea required
            type="text" class="form-control" id="placeDescription" rows="3" placeholder="Place Description">${place.description}</textarea>
        </div>
        <div class="mb-3">
          <textarea required
          type="text" class="form-control" id="placeClue" rows="3" placeholder="Place Clue">${place.clue}</textarea>
      </div>
      <div class="mb-3">
        <textarea required
        type="text" class="form-control" id="placeHint" rows="3" placeholder="Place Hint">${place.hint}</textarea>
      </div>
      <div class="row mb-3">
        <div class="col">
            <input
            required
            type="number"
            class="form-control"
            id="placeLatitude"
            placeholder="Latitude" 
            step="any"
            value="${place.latitude}"
          />
        </div>
        <div class="col">
            <input
            required
            type="number"
            class="form-control"
            id="placeLongitude"
            placeholder="Longitude" 
            step="any"
            value="${place.longitude}"
          />
        </div>
      </div>
      <div class="mb-3">
            <input
              required
              type="text"
              class="form-control"
              id="placeId"
              disabled
              value="${doc.id}"
            />
          </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button class="btn btn-primary">Submit</button>
      </div>
    </form>
          `;
      editArea.insertAdjacentHTML("beforeend", editFormHTML);
    });
}
