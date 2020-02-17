const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

//Get single meal
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const meal = (data.meals[0]);
            console.log(meal);
            addMealToDOM(meal);
        });
}

//add meal to dom
function addMealToDOM(meal) {
    const ingredients = [];

    //use api and format in other way
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    console.log(ingredients);
    

    single_mealEl.innerHTML = `
    <div>
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div>
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div>
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
    </div>
    `
}

//random meal fetch
function randomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}
//Search meal from api
function searchMeal(e) {
    e.preventDefault();

    single_mealEl.innerHTML = '';

    const term = search.value;

    //check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                resultHeading.innerHTML = `<h2>Results for ${term}</h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results.</p>`;
                } else {
                    mealsEl.innerHTML = data.meals.map(meal =>
                        `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                            </div>
                            `
                    ).join('');
                }
            });
        search.value = '';
    } else {
        alert('Please enter a search term');
    }
}
//Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);


mealsEl.addEventListener('click', e => {
     
    const mealInfo = e.composedPath().find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
        console.log(mealInfo);

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        console.log(mealID);
        getMealById(mealID);
    }
    
    
})