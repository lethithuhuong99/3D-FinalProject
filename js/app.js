
var app = function(){

    // start loading animation progress
    function progress(){
        var loadingSection = document.querySelector('#loading-screen')
        var percent = document.querySelector('.percent');
        var progress = document.querySelector('.progress');
        // var text = document.querySelector('.text');
        var count = 0;
        // var per = 0;
        var loading = setInterval(animate, 50);

        loadingSection.style.display = "inline";
        function animate(){
            if(count == 100){
            // percent.classList.add("text-blink");
            // text.style.display = "block";
            loadingSection.style.display= "none";
            clearInterval(loading);
            }else{
            // per = per + 4;
            count = count + 10;
            // progress.style.width = per + 'px';
            percent.textContent = count + '%';
            }
        }
    }
    // End loading animation progress

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
        var timeleft = 10;
        setInterval(function(){
          timeleft -= 10;
          if(timeleft == 0){
            var starwars =document.querySelector('#name-game');     
            starwars.style.display = "none"; 
            progress();
          }
        }, 5000);
       
    }
    showGame();
    // End show name of game
    

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
    var positionPlane = new THREE.Vector3();
    var overGame = false;


   
    // random position
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
      }

    // create planet
    var createPlanet = function(){
        var sphereGeometry = new THREE.SphereGeometry(40,40,40);
        var textureLoader = new THREE.TextureLoader();

        var listTextures = ['data/textures/planet/sun.jpg','data/textures/planet/pluto.jpg','data/textures/planet/jupiter.jpg' ,'data/textures/planet/neptune.jpg','data/textures/planet/venus.jpg'  ];
        var texture = textureLoader.load(listTextures[Math.floor(Math.random()*listTextures.length)]);
        var material =  new THREE.MeshBasicMaterial({map: texture});   
        spherePlanet = new THREE.Mesh(sphereGeometry, material);  
        scene.add(spherePlanet);   
        spherePlanet.position.z = -3000;
        spherePlanet.position.x = getRndInteger(-500, 500);
        spherePlanet.position.y = 0;
    }
    
    // check game over
    var isGameOver= function(positionPlane){
        var distance = spherePlanet.position.distanceTo(positionPlane);
   
        console.log("position",distance);
        if(distance < 100){
            overGame=true;
        }else{
            overGame=false;
        }
    }

    // start Play again button
    var playAgain = function(){
        document.querySelector('.bubbly-button').onclick = function() {playGameAgain()};

        function playGameAgain() {
            var loadEndGameBox = document.querySelector('.end-game-box');
            loadEndGameBox.style.display= "none";
            location.reload();
        };
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
        // camera.position.x = 300;
        // camera.position.y = 100;
        camera.position.z = 1000;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(canvasWidth, canvasHeight);
        document.body.appendChild(renderer.domElement);

        // cái này để điều khiển được model của mình. Phải tạo renderer trước ở trên để nó hiểu renderer.domElement
        // var controls = new THREE.OrbitControls( camera, renderer.domElement);
        // controls.minDistance=-700;
        // controls.maxDistance=2000;  
        // controls.update();
        // controls.addEventListener('change', renderer);

        // tạo đèn
        hlight = new THREE.AmbientLight (0x404040,0.2);
        scene.add(hlight);
        light = new THREE.PointLight(0xc4c4c4,5);
        light.position.set(0,300,500);
        scene.add(light);
        light2 = new THREE.PointLight(0xc4c4c4,5);
        light2.position.set(500,100,0);
        scene.add(light2);
        light3 = new THREE.PointLight(0xc4c4c4,5);
        light3.position.set(0,100,-500);
        scene.add(light3);
        light4 = new THREE.PointLight(0xc4c4c4,5);
        light4.position.set(-500,300,500);
        scene.add(light4);

        //Tạo model plane1
        plane1 = new THREE.GLTFLoader();
            plane1.load('plane1/scene.gltf', function(gltf){
            plane1 = gltf.scene;
            plane1.scale.set(0.5,0.5,0.5);
            plane1.rotateY(1.8);  
            scene.add(plane1);
            animate();
        });
        // tạo planet đầu tiên
        createPlanet();
        //tao Planet sau mỗi lần qua máy bay
        setInterval(function(){
            scene.remove(spherePlanet);
            createPlanet();
        }, 3000);
        
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
        requestAnimationFrame(animate);
        renderer.render( scene, camera );
    };

    var mainLoop = function(){
        //    console.log("distanceA", distance);
        if(overGame){
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
        
        positionPlane.setFromMatrixPosition(plane1.matrixWorld);
        
        // Muốn điều khiển thì chỉ ở trong hàm main viết trực tiếp trong tạo model k sử dụng được :position, rotation ...
        //plane1 
        spherePlanet.position.z +=30;
          
        renderer.render(scene,camera);
        spherePlanet.position.z += 0.02;
    };
    init_app();
    mainLoop();
    
}