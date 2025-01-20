
let expenseListArray = [{price: "example" ,name: "example" , description: "example" }];
let incomeArray = [{incomename: "abdul",income:30}];
let deleteMode = false;
let editMode = false;

async function findUserIDByEmail(email,username) {
    try {
        const response = await fetch('http://localhost:3000/users/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username })
        });

        
        if (!response.ok) {
            throw new Error('Failed to find or create a new user'); 
        }

        const data = await response.json(); 
        return data.userID;
    } catch (error) {
        console.error('Error finding user by email:', error);
        alert('Error: Could not find user ID');
        throw error; 
    }
}


async function addExpense() {
    const nameInput = document.getElementById('name-input').value.trim();
    const priceInput = document.getElementById('price-input').value.trim();
    const descriptionInput = document.getElementById('category-input').value.trim();

    
    if (nameInput !== '' && priceInput !== '' && descriptionInput !== '') {
        
        if (!/^\d+$/.test(priceInput)) {
            alert('Price must be a valid integer above -1.');
            return;
        }
        const newExpense = {
            price: priceInput ,
            name: nameInput,
            description: descriptionInput
        };
        try {
            const response = await fetch('https://localhost:3000/addexpenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpense),
            });
            if (!response.ok) throw new Error('Failed to add expense');
            const addedExpense = await response.json();
            expenseListArray.push(addedExpense); 
            displayExpenses();
        } catch (error) {
            console.error('Error adding expense:', error);
        }   
       
        document.getElementById('name-input').value = '';
        document.getElementById('price-input').value = '';
        document.getElementById('category-input').value = '';

        
        
        displayExpenses();      
        
    } else {
        alert('Please fill in all fields.');
    }
}

async function fetchExpenses() {
    const currentPage = document.documentElement.getAttribute('data-page');
    if(currentPage === "index.html"){
        try {
           
            const response = await fetch('https://localhost:3000', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
           
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
    
            
            const fetchedExpenses = await response.json();
    
            expenseListArray = fetchedExpenses;
    
            displayExpenses();
        } catch (error) {
            
            console.error('Error fetching expenses:', error);
            alert('Could not fetch expenses from the server.');
        }
    }
}




async function addExpense_detailedVersion(name1,price1,reason1) {
    const nameInput = name1
    const priceInput = price1;
    const descriptionInput = reason1;
   
    

    
    if (nameInput  && priceInput  && descriptionInput) {
        
        if (!/^\d+$/.test(priceInput)) {
            alert('Price must be a valid integer above -1.');
            return;
        }
       
        const new_expense = {
            price: priceInput ,
            name: nameInput,
            description: descriptionInput
        };
        try{
            const response = await fetch('https://localhost:3000/addexpenses', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(new_expense),
            });
            if(!response.ok)throw new Error('Failed to add expense  ');

            const addedExpense = await response.json();

        
        const li = document.createElement('li');
        li.className = 'expense-item';
        
       
        const button = document.createElement('button');
        button.className = 'expense-description';
        
        button.onclick = () => alert(`You clicked: ${expenseText}`);
        
        
        li.appendChild(button);
        expenseListArray.push(new_expense);
        displayExpenses();
        
       
        nameInput.value = '';
        priceInput.value='';
        descriptionInput.value='';

        }catch (error){console.error('Error adding this expense',error);}
    }
         else {
        alert('Please enter a valid expense description.');
    }
}

function addDetailedExpense() {
    const name = prompt("Enter the name:").trim();
    const price = prompt("Enter the price:").trim();
    const description = prompt("Enter the description:").trim();
   
    
   
    if (name == null || name == "" || price == null || price == "" || description == null || description == "" ) {
      alert("User cancelled the prompt.");
    } else {
        
        addExpense_detailedVersion(name,price,description);
        
    }
}

async function addIncome(){
    const income = prompt("Please enter the income you obtained: ");
    const source = prompt("From where: ");

    if(income && source){
        const newincome = {
            incomename: source,
            income: income
        }
        try {
            const response = await fetch('https://localhost:3000/users/:userId/addincome', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newincome),
                
            });
            if (!response.ok) throw new Error('Failed to add income');
            const addedIncome = await response.json();


        incomeArray.push(newincome);
        latestIncome(newincome);
        } catch(error){console.error('Error adding income:',error)}
    }else alert('Please insert valid income details');
}


function latestIncome(newincome){
    document.getElementById("latest-income").textContent = newincome.incomename +" "+ newincome.income+"$";

}

function navigateTo(page) {
    window.location.href = page; 
}



async function login_Button() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    if (username && email) {
        
        const userID = await findUserIDByEmail(email, username);
        
        localStorage.setItem('username', username);     
        localStorage.setItem('email', email);
        localStorage.setItem('UserId',userID);
       
        navigateTo('index.html');
        
        alert('Login information stored in localStorage!');
    } else {
        alert('Please fill in both fields.');
    }
}


window.onload = async function() {
    const currentPage = document.documentElement.getAttribute('data-page');
   
    if(currentPage === "index"){
        const storedUsername = localStorage.getItem('username'); 
             
             if (storedUsername) {document.getElementById('displayName').textContent = `Welcome , ${storedUsername}!`;displayExpenses();await fetchExpenses()}
             else document.getElementById('displayName').textContent = 'null';
          
    }
}

function logoutFunction(){
    localStorage.setItem("username","");
    localStorage.setItem("email","");
    navigateTo("TrackME_login_page.html");
}

 

function deleteExpense(){
        
    deleteMode = !deleteMode; 
       
    if (deleteMode) {
            alert("Delete mode is active. Click an item to delete it.");
        } else {
            alert("Delete mode deactivated.");
        }

    
    };


function editExpenses(){

    editMode = !editMode;
    if (editMode) {
        alert("Edit mode is active. Click an item to edit its values.");
    } else {
        alert("Edit mode deactivated.");
    }
    
}


async function displayExpenses() {
        const expenseDisplay = document.getElementById('expense-ArrayList');
        expenseDisplay.innerHTML = ''; 
    
        expenseListArray.forEach((expense, index) => {
            const button = document.createElement('button');
            button.className = 'expense-description';
            button.textContent = `${expense.name} - ${expense.price} - ${expense.description}`;
    
            button.onclick = async () => {
                if (deleteMode) {
                    const confirmed = confirm(`Are you sure you want to delete ${expense.name}?`);
                    if (confirmed) {
                        
                        try {
                            const response = await fetch(`https://localhost:3000/expenses/${expense.id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                            });
    
                            if (!response.ok) {
                                throw new Error('Failed to delete expense');
                            }
    
                            
                            expenseListArray.splice(index, 1);
                            displayExpenses();  
                        } catch (error) {
                            console.error('Error deleting expense:', error);
                            alert('Failed to delete expense.');
                        }
    
                        
                        deleteMode = false;
                    }
                } else if (editMode) {

                    const newName = prompt("Edit Name:", expense.name);
                    const newPrice = prompt("Edit Price:", expense.price);
                    const newDescription = prompt("Edit Description:", expense.description);
    
                    if (newName !== null && newPrice !== null && newDescription !== null) {
                        const updatedExpense = {
                            name: newName.trim() || expense.name,
                            price: newPrice.trim() || expense.price,
                            description: newDescription.trim() || expense.description,
                        };
    
                        
                        try {
                            const response = await fetch(`https://your-backend.com/expenses/${expense.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedExpense),
                            });
    
                            if (!response.ok) {
                                throw new Error('Failed to update expense');
                            }
    
                            
                            const updatedExpenseFromServer = await response.json();
                            expenseListArray[index] = updatedExpenseFromServer;  
                            displayExpenses();  
                        } catch (error) {
                            console.error('Error updating expense:', error);
                            alert('Failed to update expense.');
                        }
                    }
                } else {
                    alert(`You clicked: ${expense.name}\nPrice: ${expense.price}\nDescription: ${expense.description}`);
                }
            };
    
            expenseDisplay.appendChild(button);
        });
    }
 