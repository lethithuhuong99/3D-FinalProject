/**
 * Start show name of game
 */
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
    document.querySelector('#start-play').onclick = function() { playGame() };

    /**
     * play Game
     */
    function playGame() {
        var starwars =document.querySelector('#name-game');     
        starwars.style.display = "none"; 

        var scores =document.querySelector('#center');     
        scores.style.display = "inline";

        document.getElementById("myAudio").pause();

        app();
    };   
}

/**
 * app
 */
var app = function(){

    /**
     * loading animation progress
     */
    function progress(){
        var loadingSection = document.querySelector('#loading-screen')
        var percent = document.querySelector('.percent');

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
    }

    /**
     * End game button
     * @param {*} e 
     */
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
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var plane;
    var listPlanet = [];
    var speed = 2;
    var speedPlanet = 10;
    var speedCreateNewPlanet = -500
    var minPlanePos = -80;
    var maxPlanePos = 80;
    var isPlay = false;
    var planetInformation=[];
    var checkSound='';
    var listener = new THREE.AudioListener();
    var audioLoader = new THREE.AudioLoader();
    var playSound='';
    var sound = new THREE.Audio( listener );
    var listFlash = [];
    var listSlow = [];
    var isFlash = false;
    var isSlow = false;
    var createRandomSpeed;
    var speedArray = [
        {
            point: 50,
            speedPlanet : 35,
            speed : 3.5,
            speedCreateNewPlanet : -250,
        },
        {
            point: 40,
            speedPlanet : 30,
            speed : 3.5,
            speedCreateNewPlanet : -300
        },
        {
            point: 30,
            speedPlanet : 25,
            speed : 3.5,
            speedCreateNewPlanet : -350
        },
        {   
            point: 20,
            speedPlanet : 20,
            speed : 3,
            speedCreateNewPlanet : -400
        },
        {
            point: 10,
            speedPlanet : 15,
            speed : 2.5,
            speedCreateNewPlanet : -450
        },
        {
            point: 0,
            speedPlanet : 10,
            speed : 2,
            speedCreateNewPlanet : -500
        },
    ]

    /**
     * create Flash
     */
    var createFlash = function(){
        var flashCube = new THREE.BoxGeometry(15,15,15);
        var textureLoader = new THREE.TextureLoader();
        var flashTexture = textureLoader.load("data/textures/flash.jpg");
        var flashMaterial = new THREE.MeshPhongMaterial({map:flashTexture});
        flash = new THREE.Mesh(flashCube,flashMaterial);
        flash.position.z = -1500;
        flash.position.y = 50;
        flash.position.x = getRndInteger(minPlanePos, maxPlanePos);
        scene.add(flash);
        listFlash.push(flash);
    }

    /**
     * create Slow
     */
    var createSlow = function(){
        var slowCube = new THREE.BoxGeometry(15,15,15);
        var textureLoader = new THREE.TextureLoader();
        var slowTexture = textureLoader.load("data/textures/slow.jpg");
        var slowMaterial = new THREE.MeshPhongMaterial({map:slowTexture});
        slow = new THREE.Mesh(slowCube,slowMaterial);
        slow.position.z = -1500;
        slow.position.y = 50;
        slow.position.x = getRndInteger(minPlanePos, maxPlanePos);
        scene.add(slow);
        listSlow.push(slow);
    }

    /**
     * update Flash
     * @param {*} flash 
     * @param {*} index 
     */
    var update_flash = function(flash , index){
        flash.position.z += speedPlanet;
        flash.rotateY(0.01);
        flash.rotateX(0.01);
        if(listFlash.length >= 2 & flash.position.z > positionPlane.z + 100){
            listFlash.splice(index,1);
            scene.remove(flash);
        }
    }

    /**
     * update Slow
     * @param {*} slow 
     * @param {*} index 
     */
    var update_slow = function(slow , index){
        slow.rotateY(0.01);
        slow.rotateX(0.01);
        slow.position.z += speedPlanet;
        if(listSlow.length >= 2 && slow.position.z > positionPlane.z +100){
            listSlow.splice(index,1);
            scene.remove(slow);
        }
    }

    /**
     * function create random slow or flash speed
     */
    var randomFlashOrSlow = function(){
        var flashAndSlow = ['Flash','Slow'];    
        setInterval(function(){
            createRandomSpeed = flashAndSlow[Math.floor(Math.random()*flashAndSlow.length)];
            eval('create' + createRandomSpeed + '()');
        }, 10000);      
    }

    /**
     * check flash or slow
     */
    var checkFlashOrSlow = function(){
        var distance;
        if(createRandomSpeed == 'Flash'){
            listFlash.forEach(flash => {
                distance = flash.position.distanceTo(positionPlane);
                if(distance <30){
                    isFlash = true;
                    var goFlash = setInterval(function(){
                        if (isFlash == false) {
                            clearInterval(goFlash);
                        }
                        isFlash = false;
                    }, 3000); 
                }
            });
        }
        if (createRandomSpeed == "Slow"){
            listSlow.forEach(slow => {
                distance = slow.position.distanceTo(positionPlane);
                if(distance <30 ){
                    isSlow = true;
                    var goSlow = setInterval(function(){
                        if (isSlow == false) {
                            clearInterval(goSlow);
                        }
                        isSlow = false;
                    }, 3000); 
                }
            });
        }
    }

    /**
     * random munber between min and max
     * @param {*} min 
     * @param {*} max 
     */
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    /**
     * create background star
     */
    var createStarBackground = function(){
        var starGeometry = new THREE.SphereGeometry(1.5, 10, 10);
        var starMaterial = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff, shininess:100, specular: Math.random() * 0xffffff});
        var star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.x = getRndInteger(-1000,1000);
        star.position.y = getRndInteger(-1000,1000);
        star.position.z = -1000;
        scene.add(star);
        starBackground.push(star);
    }

    /**
     * update background star position 
     * @param {*} star 
     * @param {*} index 
     */
    var update_star = function(star , index){
        star.position.z += 5;
        if(star.position.z > positionPlane.z + 100){
            starBackground.splice(index,1);
            scene.remove(star);
        }
    }

    /**
     *create planet
    */ 
    var createPlanet = function(){
        var sphereGeometry = new THREE.SphereGeometry(13,13,13);
        var textureLoader = new THREE.TextureLoader();
        var listTextures = ['data/textures/planet/sun.jpg','data/textures/planet/pluto.jpg','data/textures/planet/jupiter.jpg' ,'data/textures/planet/neptune.jpg','data/textures/planet/venus.jpg'  ];
        var texture = textureLoader.load(listTextures[Math.floor(Math.random()*listTextures.length)]);
        var material =  new THREE.MeshPhongMaterial({map: texture});   
        spherePlanet = new THREE.Mesh(sphereGeometry, material);  
        scene.add(spherePlanet);   
        spherePlanet.position.z = -2000;
        spherePlanet.position.x = getRndInteger(minPlanePos, maxPlanePos);
        spherePlanet.position.y = 50;
        listPlanet.push(spherePlanet);
    }

    /**
     * update planet
     * @param {*} planet 
     * @param {*} index 
     */
    var update_planet = function(planet , index){
        planet.position.z += speedPlanet;
        // count point and remove planet when plane go over one planet
        if(planet.position.z > positionPlane.z + 100){
            point+=1;
            document.getElementById("score").innerHTML ='<i class="fas fa-globe-asia"></i> ' + point ;
            listPlanet.splice(index,1);
            scene.remove(planet);
        }
    }

    /**
     * create model plane
     */
    var createPlaneModel = function(){
        modelLoader = new THREE.GLTFLoader();
        modelLoader.load('models/plane1/scene.gltf', function(gltf){
            plane = gltf.scene;
            plane.rotation.y = MY_LIBS.degToRad(90);
            plane.position.z = 800;
            plane.position.y = 50;
            plane.scale.set(5,5,5);
            // plane.position.x = 6050;
            scene.add(plane);
            mixerPlane = new THREE.AnimationMixer(plane);
            gltf.animations.forEach((clip) => {
                mixerPlane.clipAction(clip).play();
            });
        });
    }

    /**
     * add planet information in end game box
     */
    var addInforPlanet = function(){
        planetInformation=[
            "Mercury is the smallest and closest planet to the sun in the Solar System. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets in the Solar System. It is named after the Greek god Hermes (Ερμής), translated into Latin Mercurius Mercury, god of commerce, messenger of the gods, mediator between gods and mortals.",
            "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in Earth's night sky after the Moon, Venus can cast shadows and can be, on rare occasion, visible to the naked eye in broad daylight.",
            "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands. The remaining 71% is covered with water, mostly by oceans but also by lakes, rivers and other fresh water, which together constitute the hydrosphere.",
            "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. In English, Mars carries the name of the Roman god of war and is often referred to as the 'Red Planet'. The latter refers to the effect of the iron oxide prevalent on Mars's surface, which gives it a reddish appearance distinctive among the astronomical bodies visible to the naked eye.",
            "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky and has been known to ancient civilizations since before recorded history.",
            "Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus."
        ]

        // get point
        document.getElementById("point").innerHTML = point;
        // get infor planet
        document.getElementById("information").innerHTML = planetInformation[Math.floor(Math.random()*planetInformation.length)];
    } 
    
    /**
     * check game over
     */
    var isGameOver= function(){
        var distance = listPlanet[0].position.distanceTo(positionPlane);
        if(distance < 30){
            overGame=true;
        }else{
            overGame=false;
        }
    }

    /**
     * handling Play again button
     */
    var playAgain = function(){
        document.querySelector('#play-again').onclick = function() {playGameAgain()};
        function playGameAgain() {
            var loadEndGameBox = document.querySelector('.end-game-box');
            loadEndGameBox.style.display= "none";
            location.reload();
        };
    }

    /**
     * model animate
     */
    function animate() {
        const delta = clock.getDelta();
        // mixerPlane.update(delta);
    };

    /**
     * move the obj left
     */
    var moveL=function(){
        plane.position.x-= speed;
        plane.rotateZ(0.01);
    }
    
    /**
     * move the obj right
     */
    var moveR=function(){
            plane.position.x+= speed;
            plane.rotateZ(-0.01);
    }

    /**
     * move the obj backward
     */
    var moveF=function(){
        plane.position.z -= speed;
    }

    /**
     * move the obj forward
     */
    var moveB=function(){
        plane.position.z += speed;
    }

    /**
     * on Key Down
     * @param {*} event 
     */
    var onKeyDown = function ( event ) {
        isPlay = true;
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; 
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
        }
    };

    /**
     * on key up
     * @param {*} event 
     */
    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                plane.position.x += speed;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                plane.position.x -= speed;
                break;
        }
    };
    document.addEventListener( 'keyup', onKeyUp, false );
    document.addEventListener('keydown', onKeyDown, false);

    /**
     * update speed of planet and plane after 10 point
     */
    var updateSpeed = function(){
        checkFlashOrSlow();
        if (isFlash){
            for(i=0; i<=speedArray.length-1;i++){
                if(point >= speedArray[i].point){
                    speedPlanet = speedArray[i].speedPlanet + 10;
                    speed = speedArray[i].speed;
                    speedCreateNewPlanet = speedArray[i].speedCreateNewPlanet;
                    break;
                }
            }
        }
        if (isSlow){
            for(i=0; i<=speedArray.length-1;i++){
                if(point >= speedArray[i].point){
                    speedPlanet = speedArray[i].speedPlanet - 5;
                    speed = speedArray[i].speed;
                    speedCreateNewPlanet = speedArray[i].speedCreateNewPlanet;
                    break;
                }
            }
        }
        if (!isSlow && !isFlash){    
            for(i=0; i<=speedArray.length-1;i++){
                if(point >= speedArray[i].point){
                    speedPlanet = speedArray[i].speedPlanet;
                    speed = speedArray[i].speed;
                    speedCreateNewPlanet = speedArray[i].speedCreateNewPlanet;
                    break;
                }
            }
        }
    }
    
    /**
     * add sound
     */
    var addSound = function(){
        // create an AudioListener and add it to the camera
        camera.add( listener );
        // create a global audio source
        var startSound = 'data/sounds/starGame.ogg';
        var playGameSound = 'data/sounds/playGame.ogg';
        var endSound = 'data/sounds/startGame.ogg';
        
        switch (checkSound) {
            case 'start':
                playSound = startSound;
                break;
            case 'play':
                playSound = playGameSound;
                break;
            case 'end':
                playSound = endSound;
                break;
            default:
        }
        // load a sound and set it as the Audio object's buffer
        audioLoader.load(playSound , function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });
    }

    /**
     * stop sound
     */
    var stopSound =  function(){
        audioLoader.load(playSound , function( buffer ){
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.stop();
        });
    }
    
    /**
     * init app
     */
    var init_app = function(){
        checkSound = 'play';
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
        camera.position.z = 1080;
        camera.position.y = 70;


        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(canvasWidth, canvasHeight);
        document.body.appendChild(renderer.domElement);

        // cái này để điều khiển được model của mình. Phải tạo renderer trước ở trên để nó hiểu renderer.domElement
        // var controls = new THREE.OrbitControls( camera, renderer.domElement);
        // // controls.minDistance=-700;
        // // controls.maxDistance=2000;  
        // controls.update();
        // controls.addEventListener('change', renderer);

        // create light
        directionLight = new THREE.DirectionalLight(0xc4c4c4,2);
        directionLight.position.set(0,300,500);
        scene.add(directionLight);
        directionLight1 = new THREE.DirectionalLight(0xc4c4c4,2);
        directionLight1.position.set(0,300,-900);
        scene.add(directionLight1);

        //create plane
        createPlaneModel();
        // create first planet
        createPlanet();  
        //sound
        addSound();   
    };
    
    /**
     * main loop
     */
    var mainLoop = function(){

        // update speed
        updateSpeed();

        // create new planet
        if(listPlanet[listPlanet.length-1].position.z > speedCreateNewPlanet){
            createPlanet();
        }
       

        // update planet
        if(isPlay){
            listPlanet.forEach(update_planet);
            listFlash.forEach(update_flash);
            listSlow.forEach(update_slow);
        }
        
        // check game over
        if(overGame){
            addInforPlanet();
            //stop sound of playGameSound
            stopSound();
            // add sound of endGame
            checkSound = 'end';
            addSound();
            // disable score box
            var scores =document.querySelector('#center');     
            scores.style.display = "none";
            // display end game box
            var loadEndGameBox = document.querySelector('.end-game-box');
            loadEndGameBox.style.display= "flex";
            // click to play game again
            playAgain();
            
        }else{
            isGameOver();
            requestAnimationFrame(mainLoop);
        }

        //get position plane model
        positionPlane.setFromMatrixPosition(plane.matrixWorld);

        //random background star
        let rand = Math.random();
        if(rand < 1000){
            createStarBackground();
        }

        // update background
        starBackground.forEach(update_star);
        
        //animate function
        animate();
        renderer.render(scene,camera);
        spherePlanet.position.z += 0.02;

        // moving plane
        if (plane.position.x >= minPlanePos && plane.position.x <= maxPlanePos) {
            // if ( moveForward ) {
            //     moveF();
            // };
            // if ( moveBackward ) {
            //     moveB();
            // };
            if ( moveLeft ) {
                moveL();
            };
            if ( moveRight ) {
                moveR();
            };
        }
    };

    progress();
    init_app();
    randomFlashOrSlow();
    mainLoop();
}
