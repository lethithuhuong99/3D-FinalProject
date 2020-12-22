// Start show name of game
function showGame() {
    var byline = document.getElementById('byline');   // Find the H2
    bylineText = byline.innerHTML;                    // Get the content of the H2
    bylineArr = bylineText.split('');                 // Split content into array
    byline.innerHTML = '';                            // Empty current content

    var span;         // Create variables to create elements
    var letter;
    var i=0;
    for(i=0;i<bylineArr.length;i++){                  // Loop for every letter
      span = document.createElement("span");          // Create a <span> element
      letter = document.createTextNode(bylineArr[i]); // Create the letter
      if(bylineArr[i] == ' ') {                       // If the letter is a space...
        byline.appendChild(letter);         // ...Add the space without a span
      } else {
        span.appendChild(letter);           // Add the letter to the span
        byline.appendChild(span);           // Add the span to the h2
      }
    }
    // click play game button 
    document.querySelector('#start-play').onclick = function() {playGame()};

    function playGame() {
        var starwars =document.querySelector('#name-game');     
        starwars.style.display = "none"; 
        app();
    };   
}
var app = function(){

    // start loading animation progress
    function progress(){
        var loadingSection = document.querySelector('#loading-screen')
        var percent = document.querySelector('.percent');
        var progress = document.querySelector('.progress');
        // var text = document.querySelector('.text');
        var count = 0;
        // var per = 0;
        // var loading = setInterval(animate, 50);

         // countdown PlayGame
         var timeleft = 2;
         var loading = setInterval(function(){
             if(timeleft < 0){
                 loadingSection.style.display= "none";
                 clearInterval(loading);
             }
             percent.textContent = timeleft;
             timeleft -= 1;
         }, 1000);

        loadingSection.style.display = "inline";
        // function animate(){
        //     if(count == 100){
        //     // percent.classList.add("text-blink");
        //     // text.style.display = "block";
        //     loadingSection.style.display= "none";
        //     clearInterval(loading);
        //     }else{
        //     // per = per + 4;
        //     count = count + 10;
        //     // progress.style.width = per + 'px';
        //     percent.textContent = count + '%';
        //     }
        // }
    }
    progress();
    // End loading animation progress

    // End game
    var animateButton = function(e) {

        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');
    
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },700);
        };
    
    var bubblyButtons = document.getElementsByClassName("bubbly-button");

    for (var i = 0; i < bubblyButtons.length; i++) {
    bubblyButtons[i].addEventListener('click', animateButton, false);
    }

    // --------------------------3D-------------------------
    // initiallize scene, camera, objects and renderer

    //initialize sence, camera, objects and renderer
    var scene, camera, renderer;
    var mixerPlane;
    const clock = new THREE.Clock();
    var positionPlane = new THREE.Vector3();
    var overGame = false;
    var point = 0;
    var starBackground = [];

    // random position
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    // background star
    var createStarBackground = function(){
        var starGeometry = new THREE.SphereGeometry(1.5, 1.5, 1.5);
        var starMaterial = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff, shininess:100, specular: Math.random() * 0xffffff});
        var star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.x = getRndInteger(-1000,1000);
        star.position.y = getRndInteger(-1000,1000);
        star.position.z = -1000;
        scene.add(star);
        starBackground.push(star);
    }

    //update background star position 
    var update_star = function(star , index){
        star.position.z += 5;
        if(star.position.z > positionPlane.z + 100){
            starBackground.splice(index,1);
            scene.remove(star);
        }
    }
    

    // create planet
    var createPlanet = function(){
        var sphereGeometry = new THREE.SphereGeometry(13,13,13);
        var textureLoader = new THREE.TextureLoader();
        var listTextures = ['data/textures/planet/sun.jpg','data/textures/planet/pluto.jpg','data/textures/planet/jupiter.jpg' ,'data/textures/planet/neptune.jpg','data/textures/planet/venus.jpg'  ];
        var texture = textureLoader.load(listTextures[Math.floor(Math.random()*listTextures.length)]);
        var material =  new THREE.MeshPhongMaterial({map: texture});   
        spherePlanet = new THREE.Mesh(sphereGeometry, material);  
        scene.add(spherePlanet);   
        spherePlanet.position.z = -2000;
        spherePlanet.position.x = getRndInteger(-200, 200);
        spherePlanet.position.y = 0;
    }
    
    // check game over
    var isGameOver= function(positionPlane){
        var distance = spherePlanet.position.distanceTo(positionPlane);
   
        // console.log("position",distance);
        if(distance < 30){
            overGame=true;
        }else{
            overGame=false;
        }
    }

    // start Play again button
    var playAgain = function(){
        document.querySelector('#play-again').onclick = function() {playGameAgain()};
        function playGameAgain() {
            var loadEndGameBox = document.querySelector('.end-game-box');
            loadEndGameBox.style.display= "none";
            location.reload();
        };
    }

    //Tạo model plane
    var createPlaneModel = function(){
        modelLoader = new THREE.GLTFLoader();
        modelLoader.load('models/plane1/scene.gltf', function(gltf){
            plane1 = gltf.scene;
            plane1.rotation.y = MY_LIBS.degToRad(90);
            plane1.position.z = 950;
            scene.add(plane1);
            mixerPlane = new THREE.AnimationMixer(plane1);
            gltf.animations.forEach((clip) => {
                mixerPlane.clipAction(clip).play();
            });
        });
    }
    
    var init_app = function(){

        // create the sence
        scene = new THREE.Scene();
        // create an the local camera
        var canvasWidth = window.innerWidth;
        var canvasHeight = window.innerHeight;
        var fieldfOfViewY = 30, aspectRatio = canvasWidth/ canvasHeight, near=1.0, far=5000;
        camera = new THREE.PerspectiveCamera(fieldfOfViewY, aspectRatio, near, far);
        scene.updateMatrixWorld(true);
        scene.background = new THREE.Color(0x000000);
        scene.background = new THREE.TextureLoader().load("data/textures/background.jpg");
        // camera.position.x = 300;
        // camera.position.y = 100;
        camera.position.z = 1000;
        camera.position.y = 5;


        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        document.body.appendChild(renderer.domElement);

        // cái này để điều khiển được model của mình. Phải tạo renderer trước ở trên để nó hiểu renderer.domElement
        // var controls = new THREE.OrbitControls( camera, renderer.domElement);
        // // controls.minDistance=-700;
        // // controls.maxDistance=2000;  
        // controls.update();
        // controls.addEventListener('change', renderer);

        // tạo đèn
        directionLight = new THREE.DirectionalLight(0xc4c4c4,2);
        directionLight.position.set(0,300,500);
        scene.add(directionLight);
        directionLight1 = new THREE.DirectionalLight(0xc4c4c4,2);
        directionLight1.position.set(0,300,-900);
        scene.add(directionLight1);
        // light3 = new THREE.PointLight(0xc4c4c4,2);
        // light3.position.set(0,100,-500);
        // scene.add(light3);
        // light4 = new THREE.PointLight(0xc4c4c4,2);
        // light4.position.set(-500,300,500);
        // scene.add(light4);

        //create plane
        createPlaneModel();
        // tạo planet đầu tiên
        createPlanet();
        spherePlanet.position.x = 400;
        //tao Planet sau mỗi lần qua máy bay   
     
    };
    

    // move the obj left
    var moveLeft=function(){
        plane1.position.x -= 5;

    }
    // move the obj right
    var moveRight=function(){
        plane1.position.x += 5;
        // isGameOver(plane1);
    }
    
    // move the obj down
    var moveDown=function(){
        plane1.position.y -= 5;
        // isGameOver(plane1);
    }
    
    // move the obj up
    var moveUp=function(){
        plane1.position.y += 5;
        // isGameOver(plane1);
    }

    // mover the object by keydown 
    document.addEventListener('keydown', function(e){
        if(e.keyCode == 37){
            moveLeft();
        } else 
            if(e.keyCode == 39){
                moveRight();
            }
            else 
            if(e.keyCode == 39){
                moveRight();
            }else 
            if(e.keyCode == 38){
                moveUp();
                
            }else 
            if(e.keyCode == 40){
                moveDown();
            }
    })

    // hàm animate
    function animate() {
        const delta = clock.getDelta();
        mixerPlane.update(delta);
      };

    var s = 1;
    var mainLoop = function(){
        if(spherePlanet.position.z > positionPlane.z - 500){
        s = s-0.01;
        spherePlanet.scale.set(s,s,s);
    }
        // Create sphere and count point
        if(spherePlanet.position.z > positionPlane.z + 100){
            point+=1;
            scene.remove(spherePlanet);
            createPlanet();
            s=1;
        }
        //game over
        if(overGame){
            document.getElementById("point").innerHTML = point;
            // add sound
            // addSound();
            // display end game box
            var loadEndGameBox = document.querySelector('.end-game-box');
            loadEndGameBox.style.display= "flex";
            // click to play game again
            playAgain();
            
        }else{
            isGameOver(positionPlane);
            requestAnimationFrame(mainLoop);
        }

        //get position plane model
        positionPlane.setFromMatrixPosition(plane1.matrixWorld);

        //random background star
        let rand = Math.random();
        if(rand < 1000){
            createStarBackground();
        }
        starBackground.forEach(update_star);
        //plane1 
        spherePlanet.position.z +=30;
        // countPoint();
        //animate function
        animate();
        // countPoint();
        // console.log("point" , point);
        renderer.render(scene,camera);
        spherePlanet.position.z += 0.02;
    };
    init_app();
    mainLoop();
    
}