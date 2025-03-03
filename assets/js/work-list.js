import { galleryItems } from "../data/datas.js";

document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const blurryPrev = document.querySelector(".blurry-prev");
  const projectPreview = document.querySelector(".project-preview");
  const itemCount = galleryItems.length;

  let activeItemIndex = 0;
  let isAnimating = false;

  function createSplitText(element) {
    const splitText = new SplitType(element, { types: "lines" });
    element.innerHTML = "";
    splitText.lines.forEach((line) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "line";
      const lineSpan = document.createElement("span");
      lineSpan.textContent = line.textContent;
      lineDiv.appendChild(lineSpan);
      element.appendChild(lineDiv);
    });
  }

  const initialInfoText = document.querySelector(".info p");
  if (initialInfoText) {
    createSplitText(initialInfoText);
  }

  const elementsToAnimate = document.querySelectorAll(
    ".title h2, .info p .line span, .credits p, .director div, .cinematographer p, .ressources div"
  );
  gsap.set(elementsToAnimate, {
    y: 0,
  });

  for (let i = 0; i < itemCount; i++) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    if (i === 0) itemDiv.classList.add("active");

    const img = document.createElement("img");
    img.src = `./assets/img/img${i + 1}.jpg`;
    img.alt = galleryItems[i].title;

    itemDiv.appendChild(img);
    itemDiv.dataset.index = i;
    itemDiv.addEventListener("click", () => handleItemClick(i));
    gallery.appendChild(itemDiv);
  }

  function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
  }

  function createProjectDetails(activeItem, index) {
    const newProjectDetails = createElementWithClass("div", "project-details");

    const detailsStructure = [
        { className: "title", tag: "h2", content: activeItem.title },
        { className: "info", tag: "p", content: activeItem.content },
        {
          className: "director",
          tag: "div",
          content: activeItem.tags
            ? activeItem.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")
            : ""
        },        
        {
            className: "cinematographer",
            tag: "p",
            content: `Auteur: ${activeItem.author}`,
        },
        {
            className: "ressources",
            tag: "div",
            content: activeItem.ressources
                ? Object.entries(activeItem.ressources)
                    .map(([key, url]) => `<a href="${url}" target="_blank">${key}</a>`)
                    .join(" | ")
                : "",
        }
    ];

    detailsStructure.forEach(({ className, tag, content }) => {
      const div = createElementWithClass("div", className);
      const element = document.createElement(tag);
    
      // Utilisation de innerHTML uniquement pour les contenus HTML
      if (className === "ressources" || className === "director") {
        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    
      div.appendChild(element);
      newProjectDetails.appendChild(div);
    });
    

    // Ajout de l'image du projet
    const newProjectImg = createElementWithClass("div", "project-img");
    const newImg = document.createElement("img");
    newImg.src = `./assets/img/img${index + 1}.jpg`;
    newImg.alt = activeItem.title;
    newProjectImg.appendChild(newImg);

    return {
        newProjectDetails,
        newProjectImg,
        infoP: newProjectDetails.querySelector(".info p"),
    };
}


  function handleItemClick(index) {
    if (index === activeItemIndex || isAnimating) return;

    isAnimating = true;

    const activeItem = galleryItems[index];

    gallery.children[activeItemIndex].classList.remove("active");
    gallery.children[index].classList.add("active");
    activeItemIndex = index;

    const elementsToAnimate = document.querySelectorAll(
      ".title h2, .info p .line span, .credits p, .director div, .cinematographer p, .ressources div"
    );

    const currentProjectImg = document.querySelector(".project-img");
    const currentProjectImgElem = currentProjectImg.querySelector("img");

    const newBlurryImg = document.createElement("img");
    newBlurryImg.src = `./assets/img/img${index + 1}.jpg`;
    newBlurryImg.alt = activeItem.title;
    gsap.set(newBlurryImg, {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    });
    blurryPrev.insertBefore(newBlurryImg, blurryPrev.firstChild);

    const currentBlurryImg = blurryPrev.querySelector("img:nth-child(2)");
    if (currentBlurryImg) {
      gsap.to(currentBlurryImg, {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => blurryPrev.removeChild(currentBlurryImg),
      });
    }

    gsap.to(newBlurryImg, {
      delay: 0.5,
      opacity: 1,
      duration: 1,
      ease: "power2.inOut",
    });

    gsap.to(elementsToAnimate, {
      y: -60,
      duration: 1,
      ease: "power4.in",
      stagger: 0.05,
    });

    gsap.to(currentProjectImg, {
      onStart: () => {
        gsap.to(currentProjectImgElem, {
          scale: 2,
          duration: 1,
          ease: "power4.in",
        });
      },
      scale: 0,
      bottom: "10em",
      duration: 1,
      ease: "power4.in",
      onComplete: function () {
        document.querySelector(".project-details")?.remove();
        currentProjectImg.remove();

        const { newProjectDetails, newProjectImg, infoP } =
          createProjectDetails(activeItem, index);

        projectPreview.appendChild(newProjectDetails);
        projectPreview.appendChild(newProjectImg);

        createSplitText(infoP);

        const newElementsToAnimate = newProjectDetails.querySelectorAll(
          ".title h2, .info p .line span, .credits p, .director div, .cinematographer p, .ressources div"
        );

        gsap.fromTo(
          newElementsToAnimate,
          { y: 40 },
          {
            y: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.05,
          }
        );

        gsap.fromTo(
          newProjectImg,
          { scale: 0, bottom: "-10em" },
          {
            scale: 1,
            bottom: "1em",
            duration: 1,
            ease: "power4.out",
          }
        );

        gsap.fromTo(
          newProjectImg.querySelector("img"),
          { scale: 2 },
          {
            scale: 1,
            duration: 1,
            ease: "power4.out",
            onComplete: () => {
              isAnimating = false;
            },
          }
        );
      },
    });
  }
});
