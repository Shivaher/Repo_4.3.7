// Input

const searchInput = document.querySelector('.inputBlock') 
const inputBox = searchInput.querySelector('.inputSrc')
const autocom = searchInput.querySelector('.autocomplete')
const repoResult = document.querySelector('.repositories')

// Fetch

async function getPost(inp) {
    let response;
    let objects;
    response = await fetch(`https://api.github.com/search/repositories?q=${inp.target.value}&per_page=5`)
    objects = await response.json()
    objects = objects.items;
            createActiveRepoList(objects)
            createRepo()

    };

function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
}

function createActiveRepoList(arr) {
    searchInput.classList.add('active');
    autocom.innerHTML = '';
    for (let element of arr) {
        let { name, owner: { login }, stargazers_count } = element;
        autocom.insertAdjacentHTML('afterbegin',
            `<li
                    data-name = '${name}'
                    data-owner = '${login}'
                    data-stars = '${stargazers_count}'>
                    ${name}
                </li>`);
    }
}

function createRepo() {
    let itemsList = autocom.querySelectorAll('li');
    for (let i = 0; i < itemsList.length; i++) {
        itemsList[i].addEventListener('click', () => {
            inputBox.value = '';
            repoResult.insertAdjacentHTML('afterbegin',
                `<li class = 'repositories_result'>
                        <b>Name:</b> ${itemsList[i].dataset.name}<br>
                        <b>Owner:</b> ${itemsList[i].dataset.owner}<br>
                        <b>Starts:</b> ${itemsList[i].dataset.stars}
                        <button class = 'delete_button'>X</button>
                    </li>`);
            searchInput.classList.remove('active');
        });
    }
}

function removeItem(e) {
    if (e.target.className === 'delete_button') {
        e.target.closest('.repositories_result').remove();
    }
}

inputBox.addEventListener('keyup', debounce(getPost, 500))

repoResult.addEventListener('click', removeItem);