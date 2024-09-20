let expense = parseFloat(localStorage.getItem("expense")) || 0;
let budget = parseFloat(localStorage.getItem("budget")) || 0.0;
let balance = parseFloat(localStorage.getItem("balance")) || 0.0;
let total = parseFloat(localStorage.getItem("total")) || 0;

const balanceElement = document.getElementById("balance");
const expenseElement = document.getElementById("expense");
const budgetElement = document.getElementById("budget");
const amount = document.getElementById("amount");
const inputname = document.getElementById("nameitems");
const inputpaid = document.getElementById("paid");
const inputdatebuy = document.getElementById("datebuy");
const inputremark = document.getElementById("remark");

const listbuy = document.getElementById("listbuy");
let listbuys = JSON.parse(localStorage.getItem("tasks")) || [];

window.onload = function () {
    listbuys.forEach(function (taskdata) {
        addItemBuy(taskdata.name, taskdata.datebuy, taskdata.paid, taskdata.remark);
    });
};

// Initialize display from localStorage
updateDisplay();

// Function to update display
function updateDisplay() {
    balanceElement.textContent = "Balance: " + balance.toFixed(2) + "$";
    expenseElement.textContent = expense.toFixed(2) + "$";
    budgetElement.textContent = budget.toFixed(2) + "$";
}

// Function to add balance
function addBalance() {
    const amountValue = parseFloat(amount.value);

    if (amountValue >= 0) {
        Swal.fire({
            title: "តើអ្នកប្រាកដទេ?",
            text: "តើអ្នកចង់បន្ថែមសមតុល្យរបស់អ្នកទេ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "បាទ បន្ថែម!",
            cancelButtonText: "ទេ រក្សាវា"
        }).then((result) => {
            if (result.isConfirmed) {
                balance += amountValue; // Update balance
                budget = balance;
                updateDisplay(); // Update display for balance and budget
                localSave();
                amount.value = ''; // Clear the input field
                Swal.fire('សមតុល្យបានធ្វើបច្ចុប្បន្នភាព!', 'សមតុល្យរបស់អ្នកត្រូវបានបន្ថែម!', 'ជោគជ័យ');
                head1.style.display = 'none';
            }
        });
    } else {
        Swal.fire("សូមបញ្ចូលចំនួនសមតុល្យដែលមានទឹកប្រាក់សិន!");
    }
}

function localSave() {
    localStorage.setItem("balance", balance);
    localStorage.setItem("expense", expense);
    localStorage.setItem("budget", budget);
    localStorage.setItem("tasks", JSON.stringify(listbuys)); // Save tasks in local storage
}

// Add event listener for the balance button
document.getElementById("addButton").onclick = addBalance;

function buyitem() {

    const name = inputname.value;
    const paid = parseFloat(inputpaid.value);
    const datebuy = inputdatebuy.value;
    const remark = inputremark.value;

    if (name === "" || paid == " " || datebuy === "" || remark === "") {
        Swal.fire("សូមបញ្ចូលព័ត៌មានទាំងអស់ឱ្យបានត្រឹមត្រូវ!");
        return;
    }

    if (balance > paid) {
        const taskdata = { name, paid, datebuy, remark };
        listbuys.push(taskdata);

        addItemBuy(name, datebuy, paid, remark);

        balance -= paid; // Update balance
        expense += paid; // Update expense
        updateDisplay(); // Update display

        localSave(); // Save changes in local storage

        box.style.display = 'none';
        // Clear input fields
        inputname.value = '';
        inputpaid.value = '';
        inputdatebuy.value = '';
        inputremark.value = '';
    }else{
        Swal.fire("ទឹកប្រាក់របស់អ្នកចំណាយលើសហើយ");
    }
}

document.getElementById("additems").onclick = buyitem;

// Function to add item to the buy list

function addItemBuy(name, datebuy, paid, remark) {
    // if (!listbuy) {
    //     console.error("listbuy element is not found in the DOM.");
    //     return; // Early exit if the listbuy is not found
    // }
    const li = document.createElement("li");

    // Create spans for each piece of information
    const cname = document.createElement("span");
    const cdatebuy = document.createElement("span");
    const cpaid = document.createElement("span");
    const cremark = document.createElement("span");

    cname.textContent = name;
    cdatebuy.textContent = datebuy;
    cpaid.textContent = paid.toFixed(2) + "$";
    cremark.textContent = remark;

    // Create delete button
    const deleteButton = document.createElement('button');

    deleteButton.textContent = 'លុបចោល';
    deleteButton.classList.add('delete');

    // Set delete button functionality
    deleteButton.onclick = () => {
        // Confirm deletionb
        Swal.fire({
            title: 'តើអ្នកប្រាកដទេ?',
            text: "ធាតុនេះនឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'បាទ លុបវាចោល!',
            cancelButtonText: 'ទេ រក្សាវា'
        }).then((result) => {
            if (result.isConfirmed) {
                // Remove the item from the list
                li.remove();
                removfromLocalstorage(name, datebuy, paid, remark);
                localSave(); // Save updated task list
                updateDisplay(); // Refresh display
                Swal.fire('បានលុប!', 'ធាតុរបស់អ្នកត្រូវបានលុប', 'success');
            }
        });
    };

    // Append spans and the delete button to the list item
    li.appendChild(cname);
    li.appendChild(cdatebuy);
    li.appendChild(cpaid);
    li.appendChild(cremark);
    li.appendChild(deleteButton);
    listbuy.appendChild(li);
}


// Initial display of values
updateDisplay();
function removfromLocalstorage(name, datebuy, paid, remark) {
    let index = listbuys.findIndex(task => task.name === name && task.datebuy === datebuy && task.paid === paid && task.remark === remark);
    if (index > -1) {
        listbuys.splice(index, 1);
        localSave();
        updateDisplay();
        Swal.fire('បានលុប!', 'ធាតុរបស់អ្នកត្រូវបានលុប', 'success');
    } else {
        Swal.fire('សូមពេញចិត្តឱ្យបានលុបធាតុនេះ');
    }

}
function removeAllvalue() {
    if (balance <= 0) {
        Swal.fire({
            title: 'តើអ្នកប្រាកដទេ?',
            text: "អ្នកដាក់ប្រាក់ថ្មីរបស់អ្នកទៅកាន់លំនាំដោយស្វ័យប្រវត្តិ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'បាទ ចាក់សមតុល្យ!',
        })
            .then((result) => {
                if (result.isConfirmed) {
                    balance = 0;
                    expense = 0;
                    budget = 0;
                    listbuys = [];
                    updateDisplay();
                    localStorage.clear(); // Clear local storage
                    Swal.fire('វាត្រូវបានលុប', 'ជោគជ័យ');
                }

            })
    } else {
        Swal.fire('ទឹកប្រាក់របស់អ្នកមិនទាន់អស់ទេ?')
    }


}

document.getElementById("removeall").onclick = removeAllvalue;

//search section
// Assuming HTML structure has an element with id "searchInput" and "resultContainer"
// Search function
function search() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultContainer = document.getElementById("listbuy");
    resultContainer.innerHTML = ""; // Clear previous results

    // Filter through the listbuys array
    const filteredData = listbuys.filter(item =>
        item.name.toLowerCase().includes(input) ||
        item.datebuy.includes(input) ||
        item.paid.toString().toLowerCase().includes(input) ||  // Convert to string for comparison
        item.remark.toLowerCase().includes(input)
    );

    // Display filtered results
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const li = document.createElement("li"); // Create a new list item

            // Create spans for each piece of information
            const cname = document.createElement("span");
            const cdatebuy = document.createElement("span");
            const cpaid = document.createElement("span");
            const cremark = document.createElement("span");

            cname.textContent = item.name; // Fix here
            cdatebuy.textContent = item.datebuy; // Fix here
            cpaid.textContent = item.paid.toFixed(2) + "$"; // Fix here
            cremark.textContent = item.remark; // Fix here

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'លុបចោល';
            deleteButton.classList.add('delete');

            // Set delete button functionality
            deleteButton.onclick = () => {
                // Confirm deletion
                Swal.fire({
                    title: 'តើអ្នកជឿជាក់ទេ?',
                    text: "ធាតុនេះនឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'បាទ លុបវាចោល!',
                    cancelButtonText: 'ទេ រក្សាវា'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Remove the item from the list
                        li.remove();
                        removfromLocalstorage(item.name, item.datebuy, item.paid, item.remark);
                        localSave(); // Save updated task list
                        updateDisplay(); // Refresh display
                        Swal.fire('បានលុប!', 'ធាតុរបស់អ្នកត្រូវបានលុប', 'success');
                    }
                });
            };

            // Append spans and the delete button to the list item
            li.appendChild(cname);
            li.appendChild(cdatebuy);
            li.appendChild(cpaid);
            li.appendChild(cremark);
            li.appendChild(deleteButton);
            resultContainer.appendChild(li); // Append to result container
        });
    } else {
        resultContainer.innerHTML = "<p>រកមិនឃើញសម្រាប់ការស្វែងរកនេះ</p>";
    }
}

// Attach event listener to the search button
document.getElementById("searchButton").addEventListener("click", search);
//display 
const head1 = document.getElementById('head1');
function displayhead1() {
    // const head1 = document.getElementById('head1'); // Correctly use document.getElementById

    if (head1.style.display === 'none' || head1.style.display === '') {
        head1.style.display = 'flex'; // Set display to flex
    } else {
        head1.style.display = 'none'; // Set display to none
    }
}
document.getElementById("addmoney").addEventListener("click", displayhead1);
const box = document.getElementById('box'); // Correctly use document.getElementById
function displayhead2() {

    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'flex'; // Set display to flex
    } else {
        box.style.display = 'none'; // Set display to none
    }
}
document.getElementById("addform").addEventListener("click", displayhead2);
function intro() {
    Swal.fire({
        title: 'SA APPសូមស្វាគមន៍',
        text: 'មុខងារគឺការកត់ត្រាការចំណាយប្រចាំខែនិងសប្តាហ៍',
        cancelButtonText: 'បោះបង់'
    })
}
document.getElementById("intro").addEventListener("click", intro);