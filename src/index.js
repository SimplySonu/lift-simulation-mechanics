const addFloor = document.getElementById("add-floor-button");
const floorContainer = document.getElementsByClassName("floor-container");
const initialUpButton = document.getElementById("0-up-button");
const initialDownButton = document.getElementById("0-down-button");
const initialFloor = document.getElementById("0-floor");
const lift = document.getElementsByClassName("lift");
const upButtons = document.getElementsByClassName("up-listener");
const downButtons = document.getElementsByClassName("down-listener");
const liftButton = document.getElementById("add-lift-button");

let liftCount = 0;
const queue = [];
const liftDetails = [{ liftId: 0, busyStatus: false, floorNo: 0 }];

liftButton.addEventListener("click", addLift);

addFloor.addEventListener("click", () => {
	addNewFloor();
});

initialUpButton.addEventListener("click", () => moveLift(0));
initialDownButton.addEventListener("click", () => moveLift(0));

function addListener(element) {
	const id = parseInt(element.id);
	upButtons[0].addEventListener("click", () => moveLift(id));
	downButtons[0].addEventListener("click", () => moveLift(id));
}

function addNewFloor() {
	const singleFloor = document.createElement("div");
	singleFloor.classList.add("single-floor");
	singleFloor.id = `${floorContainer[0].childElementCount}`;

	singleFloor.innerHTML = `
  <img
						src="./src/arrow.svg"
						alt=""
						class="button-width up-listener"
						id=${floorContainer[0].childElementCount + ""}
					/>
					<img
						src="./src/arrow.svg"
						alt=""
						class="button-width down-listener"
						id=${floorContainer[0].childElementCount + ""}
					/>`;
	floorContainer[0].insertBefore(singleFloor, floorContainer[0].children[0]);
	addListener(singleFloor);
}

function addLift() {
	if (liftDetails.length < 11) {
		const singleLift = document.createElement("div");
		singleLift.classList.add("lift");
		initialFloor.appendChild(singleLift);
		liftCount += 1;
		liftDetails.push({ liftId: liftCount, busyStatus: false, floorNo: 0 });
	} else {
		liftButton.disabled = true;
		liftButton.innerText = "Max Lifts added!";
	}
}

function moveLift(id) {
	queue.push(id);
	handleQueueRequests(id);
}

function handleQueueRequests(id) {
	const moveLiftNumber = nonBusyLift(id);
	if (moveLiftNumber !== null) {
		lift[moveLiftNumber].style.marginBottom = `${id * 200}px`;
	}
}

function nonBusyLift(id) {
	const alreadyAvailableLift = checkAlreadyAvailableLiftInThatFloor(id);
	if (alreadyAvailableLift !== null) {
		return alreadyAvailableLift;
	}
	return checkAvailableLift(id);
}

function checkAvailableLift(id) {
	let nearestLift = Number.MAX_SAFE_INTEGER;
	let nearestLiftAtIndex = null;
	let floorDifference = null;
	for (let i = 0; i < liftDetails.length; i++) {
		floorDifference = Math.abs(id - liftDetails[i].floorNo);
		if (
			!liftDetails[i].busyStatus &&
			floorDifference < nearestLift &&
			liftDetails[i].floorNo !== id
		) {
			nearestLift = floorDifference;
			nearestLiftAtIndex = i;
		}
	}
	if (nearestLiftAtIndex !== null) {
		liftDetails[nearestLiftAtIndex].busyStatus = true;
		liftDetails[nearestLiftAtIndex].floorNo = id;
		queue.splice(0, 1);
		setTimeout(() => {
			liftDetails[nearestLiftAtIndex].busyStatus = false;

			if (queue.length > 0) {
				handleQueueRequests(queue[0]);
			}
		}, floorDifference * 3000);
		return nearestLiftAtIndex;
	}
	return null;
}

function checkAlreadyAvailableLiftInThatFloor(id) {
	for (let i = 0; i < liftDetails.length; i++) {
		if (liftDetails[i].floorNo === id && !liftDetails[i].busyStatus) {
			liftDetails[i].busyStatus = true;
			queue.splice(0, 1);
			setTimeout(() => {
				liftDetails[i].busyStatus = false;
				if (queue.length > 0) {
					handleQueueRequests(queue[0]);
				}
			}, 3000);
			return liftDetails[i].liftId;
		}
	}
	return null;
}
