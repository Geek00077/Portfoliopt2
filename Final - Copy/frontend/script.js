fetch('/api/Slugcats')
  .then(res => res.json())
  .then(data => {
    const slugCatsDiv = document.getElementById("slugCats");

    for (let slugCat of data) {

      const slugCatDiv = document.createElement("div");
      slugCatDiv.id = slugCat.id; // assuming id exists

      const slugCatImg = document.createElement("img");
      slugCatImg.src = slugCat.imageUrl;
      slugCatImg.alt = slugCat.imageBackUp;

      const slugCatTitle = document.createElement("h1");
      slugCatTitle.textContent = slugCat.slugType;

      const slugCatDesc = document.createElement("h2");
      slugCatDesc.textContent = slugCat.description;

      slugCatDiv.appendChild(slugCatImg);
      slugCatDiv.appendChild(slugCatTitle);
      slugCatDiv.appendChild(slugCatDesc);
      slugCatsDiv.appendChild(slugCatDiv);
    }
  });

const hamburger = document.getElementById("menuIcon");
const navMenu = document.getElementById("nav");

hamburger.addEventListener("click", () => {
navMenu.classList.toggle("active");

});