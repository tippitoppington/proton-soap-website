// console.log(productList)
//POPULATE PRODUCT GRID
window.onload = function () {
	setTimeout(function () {
		scrollTo(0, 0);
	}, 10); //100ms for example
};
const grid = document.querySelector('.secondary');
const soapObj = JSON.parse(JSON.stringify(productList));
const filterContainer = document.querySelector('ul.filters');

grid.innerHTML = soapObj
	.map(
		(soap) =>
			`<div class= "feature-container ${soap.orientation}">
 <img src="img/${soap.image}" alt="${soap.name}" />
 <p class="category">${soap.tags}</p>
 <h3>${soap.name}</h3>
 <p>${soap.description}</p>
 </div>`
	)
	.join('');

//POPULATE FILTERS
//create a single array from all of the tags arrays
let allTags = [];
const tags = soapObj.map((soap) => {
	let tags = soap.tags;
	allTags.push(...tags);
});
//reduce the array to unique values
let unique = [...new Set(allTags)];
//populate the filters ul with tags
filterContainer.innerHTML =
	`<li data-tagName = "All Soaps" class="active allsoaps">All Soaps</li>` +
	unique.map((item) => `<li data-tagname ="${item}">${item}</li>`).join('');

$(function () {
	const splash = document.querySelector('.splash');
	const header = document.querySelector('.header-container');
	// const headerCue = document.querySelector('.header-cue');
	const soapSection = document.querySelector('.soap');
	const soapScroll = document.querySelectorAll('.feature-container');
	let headerHeight = header.scrollHeight;
	const filters = Array.from(document.querySelectorAll('.filters li'));
	const allSoapsFilter = document.querySelector('.allsoaps');
	const categories = Array.from(grid.querySelectorAll('.category'));
	const filterPanel = document.querySelector('.soap-options');
	let content = document.querySelector('.content');
	const top = document.querySelector('#top');

	//FILTERING CONTENT

	//Create an array filters for the filters.tags
	//addEventListners to detect click on filter buttons and capture it's tagname dataset

	filters.forEach(function (item) {
		item.addEventListener('click', updateContent);
	});
	//Listen for click on filters, and perform function updateContent:

	function updateProducts(name) {
		categories.forEach(function (item) {
			if (item.innerHTML.match(name)) {
				item.parentNode.classList.remove('noshow');
			} else {
				item.parentNode.classList.add('noshow');
			}
		});
		top.scrollIntoView({ behavior: 'smooth', offset: '1200' });
	}

	function updateContent(el) {
		let clickedItem = event.currentTarget; //list item that was clicked
		let clickedItemName = clickedItem.dataset.tagname; //list item's datatype-tagname to search in cat array

		// if clicked item is inactive Other
		if (
			!clickedItem.classList.contains('active') &&
			!(clickedItemName === 'All Soaps')
		) {
			filters.forEach(function (item) {
				item.classList.remove('active');
			});
			clickedItem.classList.add('active');
			updateProducts(clickedItemName);
		}

		// if clicked item is active Other
		else if (
			clickedItem.classList.contains('active') &&
			!(clickedItemName === 'All Soaps')
		) {
			clickedItem.classList.remove('active');
			top.scrollIntoView({ behavior: 'smooth', offset: '100' });

			allSoapsFilter.classList.add('active');
			//show all soaps
			categories.forEach(function (item) {
				item.parentNode.classList.remove('noshow');
			});
		}
		// if clicked item is Inactive All Soaps
		else if (
			!clickedItem.classList.contains('active') &&
			clickedItemName === 'All Soaps'
		) {
			filters.forEach(function (item) {
				item.classList.remove('active');
			});
			top.scrollIntoView({ behavior: 'smooth', offset: '100' });
			allSoapsFilter.classList.add('active');
			//show all soaps
			categories.forEach(function (item) {
				item.parentNode.classList.remove('noshow');
			});
		}
		// if clicked item is Active All Soaps
		else if (
			clickedItem.classList.contains('active') &&
			clickedItemName === 'All Soaps'
		) {
			return;
		}

		// console.log(clickedItemName)
		// console.log(filters)
		//var filterValue = event.currentTarget.dataset.tagname;
	}

	//ANIMATE ON SCROLL
	//Randomize the timing that soap images fade in
	soapScroll.forEach(
		(item) => (item.style.animationDelay = `${Math.random() * 0.6 + 0.2}s`)
	);

	function inViewPort(el) {
		let rect = el.getBoundingClientRect();
		return (
			(rect.top <= 0 && rect.bottom >= 0) ||
			(rect.bottom >= window.innerHeight && rect.top <= window.innerHeight) ||
			(rect.top >= 0 && rect.bottom <= window.innerHeight)
		);
	}

	function moveHeader() {
		let top = window.pageYOffset;
		let mainOnTop = soapSection.getBoundingClientRect().top - headerHeight;
		mainOnTop < 0
			? header.classList.add('in-body')
			: header.classList.remove('in-body');

		// let currentCuePosition = splash.getBoundingClientRect().top;

		// currentCuePosition < 0 ?
		//     headerCue.classList.add('d-none') :
		//     headerCue.classList.remove('d-none');

		splash.style.transform = `translateY(-${top / 1.5}px)`;
		splash.style.opacity = 1 - Math.max(top / (window.innerHeight * 0.8), 0);

		window.requestAnimationFrame(moveHeader);
	}
	window.requestAnimationFrame(moveHeader);

	//FADE IN PRODUCTS WHEN IN VIEW
	function showProducts() {
		let top = window.pageYOffset;
		let mainOnTop = soapSection.getBoundingClientRect().top - headerHeight;

		soapScroll.forEach((item) =>
			inViewPort(item)
				? item.classList.add('appear')
				: item.classList.remove('appear')
		);

		window.requestAnimationFrame(showProducts);
	}
	window.requestAnimationFrame(showProducts);

	let controller = new ScrollMagic.Controller();
	//STICKY FILTER TAB

	let on = new ScrollMagic.Scene({
		triggerElement: '.soap',
		triggerHook: 0,
		offset: 25,
		pushFollowers: false,
	})
		.setClassToggle('ul.filters', 'stick')
		.addTo(controller);

	let on2 = new ScrollMagic.Scene({
		triggerElement: '.content',
		triggerHook: 0,
		offset: 25,
		pushFollowers: false,
	})
		.setClassToggle('.soap', 'move')

		// .addIndicators({ name: 'soap' })
		.addTo(controller);

	let off = new ScrollMagic.Scene({
		triggerElement: '.tertiary',
		triggerHook: 0,
		offset: -100,
		pushFollowers: false,
	})
		.setClassToggle('ul.filters')
		// .setClassToggle('ul.filters', 'hideFilters')
		// .addIndicators({ name: 'nosoap' })
		.addTo(controller);
}); //when page loads
