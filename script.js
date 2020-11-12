// USER INTERFACE
const UI = (function(){

	const DOMStrings = {
		budgetInput: ".location-input-2",
		itemType: ".expense-type-select",
		itemValue: ".monetaryAmount",
		form: ".form",
		outputSection: ".output-container",
		incomeTotal: ".income-total span",
		expenseTotal: ".expense-total span",
		grandTotal: ".grand-total span"
	}
	
	return {
		DOMStrings,
		getDataFromInputs(){
			let name = document.querySelector(DOMStrings.budgetInput).value;
			let type = document.querySelector(DOMStrings.itemType).value;
			let amount = document.querySelector(DOMStrings.itemValue).value;
			
			return{
				name,
				type,
				amount
			}
		},
		createItemComponent(name, type, value, id){
			if(type === "+"){
				return `
				<div class="item-container income" id="${id}">
					<div class="item income">
						<div class="item-type plus">+</div>
						<p class="description">${name}</p>
						<p class="amount">£${value}</p>
					</div>
				</div>
				`
			} else {
				return `
				<div class="item-container expense" id="${id}">
					<div class="item expense">
						<div class="item-type minus">-</div>
						<p class="description">${name}</p>
						<p class="amount-plus">£${value}</p>
					</div>
				</div>
				`
			}
		},
		updateUITotals(incomeTotal, expenseTotal, grandTotal){
			document.querySelector(DOMStrings.incomeTotal).textContent = incomeTotal;
			document.querySelector(DOMStrings.expenseTotal).textContent = expenseTotal;
			document.querySelector(DOMStrings.grandTotal).textContent = grandTotal;

		}
	}
	

})();

// Data Store
const Store = (function(){
	// Budget item class
	class BudgetItem{
		constructor(name, type, value, id){
			this.name = name;
			this.type = type;
			this.value = value;
			this.id = id;
		}
	}

	// Data Structure
	const data = {
		grandTotal: 0,
		totalIn: 0,
		totalOut: 0,
		incomes: [],
		expenses: []
		
	}

	
	


	return{
		// Dynamically generate an id for both incomes and expenses so there are no duplicates
		createID(type){
				let id;
				
				if(type === "+" && data.incomes.length > 0){
					id = data.incomes[data.incomes.length - 1].id + 1;
				} else if(type === "-" && data.expenses.length > 0){
					id = data.expenses[data.expenses.length - 1].id + 1;
				} else {
					id = 0;
				}

				return id;
			},

		createBudgetObject(name, type, value, id){

			let newBudgetObject = new BudgetItem(name, type, value, id);
			return newBudgetObject;
		},
		addObjToArray(type, obj){
			if(type === "+"){
				data.incomes.push(obj);
			} else {
				data.expenses.push(obj);
			}
		},
		addAmountToDataStructure(type, amount){
			if(type === "+"){
				data.totalIn += amount;
			} else {
				data.totalOut += amount;
			}
		},
		calculateGrandTotal(){
			return data.totalIn - data.totalOut;
		},
		// For testing purposes:
		data
	}

})()


// APP CONTROLLER
const App = (function(UI, Store){
	

	// App initialization function
	const init = function(){
		document.querySelector(UI.DOMStrings.form).addEventListener("submit", e => {
			// Prevent default behaviour 
			e.preventDefault();
			
			// Get data from UI
			let dataObj = UI.getDataFromInputs();

			// Get dynamically generated ID
			let id = Store.createID(dataObj.type);
		
			// Create New Budget object
			let budgetObj = Store.createBudgetObject(dataObj.name, dataObj.type, dataObj.amount, id);

			// Add object to income array or expense array
			Store.addObjToArray(dataObj.type, budgetObj)

			// HTML with dynamic data
			let HTML = UI.createItemComponent(budgetObj.name, budgetObj.type, budgetObj.value, budgetObj.id)

			// Add budget item to UI
			document.querySelector(UI.DOMStrings.outputSection).insertAdjacentHTML("beforeend", HTML);

			// Parse amount into number
			let amount = parseFloat(budgetObj.value);

			// Add amounts to data structure
			Store.addAmountToDataStructure(budgetObj.type, amount);

			// Calculate grand total
			let grandTotal = Store.calculateGrandTotal()

			// Update Data store with grand total
			Store.data.grandTotal = grandTotal;

			// Update UI with updated totals
			UI.updateUITotals(Store.data.totalIn, Store.data.totalOut, Store.data.grandTotal);

			// Parse 
			console.log(Store.data);

		});
	}

	return {
		init
	}
})(UI, Store);

App.init()
	

