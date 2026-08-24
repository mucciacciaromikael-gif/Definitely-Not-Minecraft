// === 1. INITIALISATION DE LA SCÈNE ET DU RENDU ===
// La Scène contient tous nos objets 3D, lumières et caméras
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // Couleur du ciel (Sky Blue)

// La Caméra définit ce que le joueur voit (Champ de vision, Ratio, Plan proche, Plan distant)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// Le Render (Moteur de rendu WebGL) dessine la scène sur l'écran
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement) // Ajoute le canvas HTML à la page

// Éclairage
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffffff, 0.8)
sunLight.position.set(10, 20, 10) 
scene.add(sunLight)

// Un petit sol temporaire pour avoir des repères visuels
const grid = new THREE.GridHelper(50, 50, 0x00ff00, 0xffffff)
grid.position.y = 0
scene.add(grid)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({color: 0x557a2b})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0.5, -5) // Placé un peu plus loin devant nous
scene.add(cube)

// === 2. CONTROLE DE LA SOURIS ===
const controls = new THREE.PointerLockControls(camera, document.body)
const instructions = document.getElementById('instructions')

// Clic sur l'écran -> Verrouille la souris et démarre le jeu
instructions.addEventListener('click', () => { controls.lock() })

// Masque ou affiche l'overlay selon l'état du Pointer lock
controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
})

controls.addEventListener('unlock', () => {
    instructions.style.display = 'flex'
})

const playerHeight = 1.6 // Taille des yeux du joueur en mètres
camera.position.set(0, playerHeight, 0)

// Position initiale de la caméra 
camera.position.set(0, 1.6, 0)

// === 3. GESTION DES TOUCHES DU CLAVIER ===
const moveState = {
    forward: false,
    backward: false,
    left: false,
    right: false
}

// Variables de physique du saut
let velocityY = 0 // Vitesse verticale actuelle
const gravity = -30 // Force de la gravité (négative)
const jumpStrength = 10 // Force de la poussée lors du saut
let canJump = false // Vrai uniquement si le joueur touche le sol

// Détection de la pression d'une touche
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': moveState.forward = true; break
        case 'KeyZ': moveState.forward = true; break
        case 'KeyS': moveState.backward = true; break
        case 'KeyA': moveState.left = true; break
        case 'KeyQ': moveState.left = true; break
        case 'KeyD': moveState.right = true; break

        // Gestion du saut
        case 'Space': if (canJump) {
            velocityY = jumpStrength // Impulsion vers le haut
            canJump = false // Empêche le saut infini dans l'Éclairage
        } break
    }
})

// Détection du relâchement d'une touche
document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': moveState.forward = false; break
        case 'KeyZ': moveState.forward = false; break
        case 'KeyS': moveState.backward = false; break
        case 'KeyA': moveState.left = false; break
        case 'KeyQ': moveState.left = false; break
        case 'KeyD': moveState.right = false; break
    }
})

// === 4. BOUCLE DE RENDU (ANIMATION) ===
const clock = new THREE.Clock() // Sert à calculer le delta time
const speed = 10 // Vitesse de déplacement du joueur

function animate() {
    // Demande au navigateur de rappeler cette fonction à chaque rafraîchissement d'écran (~60 fps)
    requestAnimationFrame(animate)

    // delta = temps écoulé en secondes depuis la dernière image
    // Cela garantit que la vitesse est constante quel que soit le taux de rafraîchissement
    const delta = clock.getDelta()

    // Ne déplace le joueur que si la souris est vérrouillée dans le jeu
    if (controls.isLocked) {
        // Déplacement avant/arrière
        if (moveState.forward) controls.moveForward(speed * delta)
        if (moveState.backward) controls.moveForward(-speed * delta)
        // Déplacement latéral
        if (moveState.right) controls.moveRight(speed * delta)
        if (moveState.left) controls.moveRight(-speed * delta)

        // Application de la gravité
        velocityY += gravity * delta // La gravité réduit la vitesse verticale au fil du temps

        // Applique le déplacement vertical à la caméra
        camera.position.y += velocityY * delta

        // Collision basique avec le sol
        if (camera.position.y <= playerHeight) {
            velocityY = 0 // Arrête la chute
            camera.position.y = playerHeight // Replace le joueur exactement au sol
            canJump = true // Réautorise le saut
        }
    }

    // Rendu final de la scène vue par la caméra
    renderer.render(scene, camera)
}

// Lance la boucle
animate()

// === 5. GESTION DU REDIMENSIONNEMENT DE LA FENÊTRE ===
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
