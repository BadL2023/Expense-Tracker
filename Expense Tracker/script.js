document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart'); 

    let selectedMonth;
    let selectedYear;
    let myChart;

    // Generate year options dynamically
    for(let year = 2020; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // initialize expenses object with categories
    const expenses = {
        Janurary: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        Feburary: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        March: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        April: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        May: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        June: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        July: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        August: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        September: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        October: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        November: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
        December: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0},
    };

    // Load expenses 
    function getExpensesFromLocalStorage(month, year) {
        const key = `${month}-${year}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    // Save expenses
    function saveExpensesToLocalStoarge(month, year) {
        const key = `${month}-${year}`;
        localStorage.setItem(key, JSON.stringify(expenses[month]))
    }

    // Get Selected Month & Year
    function getSelectedMonthYear() {
        selectedMonth = monthSelect.value;
        selectedYear = yearSelect.value;

        if(!selectedMonth || !selectedYear) {
            alert('Month or Year not selected');
            return;
        }

        if(!expenses[selectedMonth]) {
            expenses[selectedMonth] = {Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0}
        }
    }

    // Update Chart 
    function updateChart() {
        getSelectedMonthYear();

        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        Object.assign(expenses[selectedMonth], expenseData);

        const ctx = expenseChart.getContext('2d');

        if(myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: Object.keys(expenses[selectedMonth]),
              datasets: [{
                data: Object.values(expenses[selectedMonth]),
                backgroundColor: [
                    '#FF6384', //Housing
                    '#4CAF50', // Food
                    '#FFC356', // Transportation
                    '#36A2EB', // Bills
                    '#FF9F40', // Miscellaneous
                ],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw}`;
                        }
                    }
                }
              }
            }
          });
    }

    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        getSelectedMonthYear();

        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        const currentAmount = expenses[selectedMonth][category] || 0;

        if(amount > 0) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else if(amount < 0 && currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else {
            alert('Invalid Amount: Cannot reduce the category below zero.')
        }

        saveExpensesToLocalStoarge(selectedMonth, selectedYear);
        updateChart();
        amountInput.value = '';
    }

    expenseForm.addEventListener('submit', handleSubmit);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('chart', updateChart)

    //  Set the default month and year based on current month and year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString('default', { month: 'long'});
        const  initialYear = now.getFullYear();
        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    }

    setDefaultMonthYear();
    updateChart()
});