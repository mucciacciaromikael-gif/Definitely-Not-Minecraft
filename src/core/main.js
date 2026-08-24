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

// === 2. ÉCLAIRAGE ===
// Lumière ambiante : éclaire tous les objets de manière égale (évite le noir complet à l'ombre)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

// Lumière directionnelle : simule le soleil avec des ombres
const sunLight = new THREE.DirectionalLight(0xffffff, 0.8)
sunLight.position.set(10, 20, 10) // Positionne le soleil en haut à droite
scene.add(sunLight)

// === 3. CRÉATION DU BLOC MINECRAFT ===
// Géométrie : Définit la forme du bloc (1x1x1 unité)
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Matériau : Définit l'aspect visuel et la réactivité à la lumière
const material = new THREE.MeshLambertMaterial({color: 0x557a2b})

// Le Mesh combine la forme (geometry) et l'apparence (material)
const cube = new THREE.Mesh(geometry, material)
scene.add(cube) // Ajoute le cube à notre monde

// Positionne la caméra légèrement en arrière et en haut pour voir le cube
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0) // La caméra pointe vers le centre du monde

// === 4. BOUCLE DE RENDU (ANIMATION) ===
function animate() {
    // Demande au navigateur de rappeler cette fonction à chaque rafraîchissement d'écran (~60 fps)
    requestAnimationFrame(animate)

    // Petite animation : fait tourner le cube sur lui-même
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

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
