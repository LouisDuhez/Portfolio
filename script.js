window.addEventListener('load', loader);

function loader() {
  const TLLOAD = gsap.timeline();
  TLLOAD
  .to('.images-container', {height: 400, duration: 1.3, delay: 0.4, ease : 'power2.out'})
  .to('.bloc-txt', {height: 'auto', duration: 0.6, delay: 0.6, ease : 'power2.out'}, '-=0.8')
 
  .to('.bloc-txt h2', {y: 0, ease : 'power2.out'}, '-=0.6')

  .to('.f2', {y: 0, duration : 0.4, ease : 'power2.out'})
  .add(() => {
    document.querySelector('.flip-img1').style.backgroundColor = "";
    // document.querySelector('.flip-img1').style.backgroundImage = "url('ressources/image1.jpg')";
    document.querySelector('.flip-img1 p').innerHTML = "<p>Création</p>";
  })
  .to('.f2', {y: '-100%'})

  .to('.load-container', {opacity: 0, duration: .8, delay: .7})
  .add(()=> {
    document.querySelector('.load-container').style.display = "none";
  })
  .to('.header-bloc', {x: -750, duration: 1.3, ease: 'power2.out'}, '-=1') 
  .to('.header-tache-yellow', {x: -250, duration: 1.3, ease: 'power2.out'}, '-=1.3') 
  .to('.header-tache-blue', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
  .to('.header-tache-green', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
  .to('.header-tache-red', {x: -250, duration: 1.3, ease: 'power2.out'}, '-=1.3')
  .to('.header-tache-orange', {x: 250, duration: 1.3, ease: 'power2.out'}, '-=1.3');
}

const tl = gsap.timeline({
  scrollTrigger: { 
    trigger: "header", 
    start: "top top", 
    end: "bottom bottom", 
    scrub: 1, 
  }
});

tl.to('.header-tache-yellow', { y: -300, duration: 1 }, 0)
  .to('.header-tache-blue', { y: -300,  duration: 1 }, 0)
  .to('.header-tache-green', { y: -300,   duration: 1 }, 0)
  .to('.header-tache-red', { y: -300,   duration: 1 }, 0)
  .to('.header-tache-orange', { y: -300,  duration: 1 }, 0);


const tlMe = gsap.timeline({
  scrollTrigger: { 
    trigger: ".me-container", 
    start: "top 80%",  
    end: "end",    
    scrub: false,       
  }
});

tlMe.to('.me-card', { x: 300, duration: 1 }, 0)
tlMe.to('.me-details', { x: -300, duration: 1 }, 0)



const navBar = document.querySelector('nav')
const openButton = document.getElementById('open-sidebar-button')
const closeButton = document.getElementById('close-sidebar-button')

const media = window.matchMedia("(max-width: 900px)");

media.addEventListener('change', (e)=> updateNavbar(e))

function updateNavbar (e) {
  const isMobile = e.matches
  if (isMobile) {
    navBar.setAttribute('inert','')
  } else {
    navBar.removeAttribute('inert')
  }
}

updateNavbar(media)

function openSidebar() {
  console.log('Opening sidebar');
  navBar.classList.add('show');
  openButton.setAttribute('aria-expanded', 'true');
  navBar.removeAttribute('inert');
}

function closeSidebar() {
  console.log('Closing sidebar');
  navBar.classList.remove('show');
  closeButton.setAttribute('aria-expanded', 'false');
  navBar.setAttribute('inert', '');
}

const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (media.matches) { // Vérifie si l'écran est en mode mobile (max-width: 900px)
      closeSidebar();
    }
    else {
      navBar.classList.remove('show');
      closeButton.setAttribute('aria-expanded', 'false');
    }
  });
});




function nextSlide(button) {
    let container = button.closest('.project-container').querySelector('.dev-container');
    const scrollAmount = container.offsetWidth + parseInt(getComputedStyle(container).gap);
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function previousSlide(button) {
    let container = button.closest('.project-container').querySelector('.dev-container');
    const scrollAmount = container.offsetWidth + parseInt(getComputedStyle(container).gap);
    container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}



// containerSkills = document.querySelector('.skills-container')

// const skillsData = [
//   {
//       "id": 1,
//       "title": "Créativité",
//       "image_class": "crea",
//       "image_name": "menu-ps",  // Nom de la première image
//       "image_name2": "photoshopcolor", // Nom de la deuxième image
//       "image_name3": "photoshop-toolBar",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae id optio quas, reprehenderit ipsum quos qui pariatur maiores sunt maxime.",
//       "format" : "jpg"
//   },
//   {
//       "id": 2,
//       "title": "Développement Web",
//       "image_class": "dev",
//       "image_name": "HTML5",  // Nom de la première image
//       "image_name2": "CSS3", // Nom de la deuxième image
//       "image_name3": "Javascript",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac urna nisi. Proin at neque et dui ultricies tincidunt.",
//       "format" :"svg"
//   },
//   {
//       "id": 3,
//       "title": "3D",
//       "image_class": "unreal",
//       "image_name": "ue5-tool",  // Nom de la première image
//       "image_name2": "ue5-dock", // Nom de la deuxième image
//       "image_name3": "ue5-file",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod justo vitae neque fringilla, ac pretium ligula condimentum.",
//       "format" : "png"
//   },
//   {
//       "id": 4,
//       "title": "Montage vidéo",
//       "image_class": "video",
//       "image_name": "toolbar",  // Nom de la première image
//       "image_name2": "timeline", // Nom de la deuxième image
//       "image_name3": "effect",  // Nom de la troisième image
//       "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet quos eveniet cupiditate tempora. Suscipit rerum commodi distinctio molestias.",
//       "format" : "png"
//   }
// ];

// const lengthData = skillsData.length; 
// for (let i = 0; i < lengthData; i++) {
//   const skill = skillsData[i];  // récupère l'élément actuel

//   // Construction des chemins des images avec les noms dynamiques
//   const imagePath1 = `img/${skill.image_name}.${skill.format}`;
//   const imagePath2 = `img/${skill.image_name2}.${skill.format}`;
//   const imagePath3 = `img/${skill.image_name3}.${skill.format}`;

//   const cardHTML = `
//       <div class="skills-card">
//           <div class="skills-card-background ${skill.image_class}">
//           <img src="${imagePath1}" alt="" class="${skill.image_name}">
//               <img src="${imagePath2}" alt="" class="${skill.image_name2}">
//               <img src="${imagePath3}" alt="" class="${skill.image_name3}">
//           </div>
//           <div class="skills-card-text">
//               ${skill.text}
//           </div>
              
//       </div>
//   `;

//   // Ajoute la carte générée au container
//   containerSkills.innerHTML += cardHTML;
// }