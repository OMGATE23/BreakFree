(async function () {
  var link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute(
    "href",
    "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  );
  document.head.appendChild(link);
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    let videoId = obj.videoId;

    console.log(videoId);
    console.log(typeof videoId);

    let isSocialMediaSite = checkForSocialMediaApp( extractMainNameFromURL(videoId + ""));
    console.log(checkForSocialMediaApp(videoId));
    console.log(isSocialMediaSite);

    let modal = document.createElement("h6");

    console.log({ isSocialMediaSite, videoId });

    
    modal.style.color = "black";
    modal.style.position = "fixed";
    modal.style.zIndex = 2147483647;
    modal.style.backgroundColor = "white";
    modal.style.padding = "1rem 2rem";
    modal.style.top = "1rem";
    modal.style.right = "calc(0% + 1rem)";
    modal.style.width = "fit-content"
    modal.style.height = "5vw";
    
    modal.style.fontSize = "3rem"
    modal.style.outline = "1px solid black";
    modal.style.fontFamily = 'Poppins'
    modal.style.display = "flex"
    modal.style.justifyContent = "center"
    modal.style.alignItems = "center"
    
    let closeModal = document.createElement('button')

    closeModal.textContent = " X "
    closeModal.style.position = "absolute"
    closeModal.style.border = "none"
    closeModal.style.top = '5px'
    closeModal.style.left  = '5px'

    closeModal.addEventListener('click' , () => {
      modal.style.display = 'none'
    })

    modal.prepend(closeModal)

    

    modal.className = "THIS_IS_SOCIAL_DETOX_APP_MODAL";
    console.log(document.body);

    if (isSocialMediaSite) {
      console.log("HEEEREEEE");
      if (!document.body.querySelector(".THIS_IS_SOCIAL_DETOX_APP_MODAL")) {
        document.body.prepend(modal);
      }
      modal.innerText = "10 : 00 : 00";
    } else {
      console.log(isSocialMediaSite);
      modal.style.display = "have a good day!"
      modal.style.display = "none";
    }


    

    console.log("Hello from Om");

    function checkForSocialMediaApp(url) {
      let socialMediaSites = [
        "twitter",
        "instagram",
        "facebook",
        "linkedin",
        "threads",
      ];

      for (let i = 0; i < socialMediaSites.length; i++) {
        if (url.includes(socialMediaSites[i])) {
          return true;
        }
      }

      return false;
    }

    function extractMainNameFromURL(url) {
      // Remove the protocol part (http:// or https://)
      let mainName = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    
      // Remove text after the main name (e.g., query parameters, hash)
      mainName = mainName.replace(/\/.*$/, '');
    
      return mainName;
    }
  });
})();
