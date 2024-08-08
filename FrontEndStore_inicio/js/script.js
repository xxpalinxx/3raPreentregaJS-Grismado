let remeras = [
    {id: 1, img:"./img/1.jpg" , nombre: "vuejs", precio: 25, color: "gris"},
    {id: 2, img:"./img/2.jpg" , nombre: "angularjs", precio: 25, color: "gris"},
    {id: 3, img:"./img/3.jpg" , nombre: "react", precio: 25, color: "negro"},
    {id: 4, img:"./img/4.jpg" , nombre: "redux", precio: 25, color: "amarillo"},
    {id: 5, img:"./img/5.jpg" , nombre: "nodejs", precio: 25, color: "gris"},
    {id: 6, img:"./img/6.jpg" , nombre: "sass", precio: 25, color: "negro"},
    {id: 7, img:"./img/7.jpg" , nombre: "html5", precio: 25, color: "gris"},
    {id: 8, img:"./img/8.jpg" , nombre: "github", precio: 25, color: "violeta"},
    {id: 9, img:"./img/9.jpg" , nombre: "bulma", precio: 25, color: "rojo"},
    {id: 10, img:"./img/10.jpg" , nombre: "typescript", precio: 25, color: "blanco"},
    {id: 11, img:"./img/11.jpg" , nombre: "drupal", precio: 25, color: "azul"},
    {id: 12, img:"./img/12.jpg" , nombre: "javascript", precio: 25, color: "amarillo"},
    {id: 13, img:"./img/13.jpg" , nombre: "graphql", precio: 25, color: "negro"},
    {id: 14, img:"./img/14.jpg" , nombre: "wordpress", precio: 10, color: "rojo"}
]

/**----------------------------------------------------PRODUCTOS---------------------------------------- */
function crearTarjetasProductos(remeras) {
    let contenedorProductos = document.getElementById("grid")
    contenedorProductos.innerHTML = `
        <div class="grafico grafico--camisas"></div>
        <div class="grafico grafico--node"></div>
    `
    remeras.forEach(remera => {
        let nodoRemera = document.createElement("div")
        nodoRemera.className = "producto" 
        nodoRemera.innerHTML = `
            <img class=producto__imagen src=${remera.img} alt=imagen_camisa>
            <div class="producto__informacion">
                <p class="producto__nombre">${remera.nombre}</p>
                <p class="producto__precio">$${remera.precio}</p>
                <button id=${remera.id} class="formulario__submit">Agregar Carrito</button>
            </div>
        `
        contenedorProductos.appendChild(nodoRemera)
        let botonAgregarCarrito = document.getElementById(remera.id)
        botonAgregarCarrito.addEventListener("click", (e) => agregarAlCarrito(e, remeras))
    })
}

function crearFiltrosPorColor(listaProductos) {
    let colores = []
    let contenedorFiltros = document.getElementById("filtros__color")
    listaProductos.forEach(producto => {
        if(!colores.includes(producto.color)){
            colores.push(producto.color)

            let botonFiltroColor = document.createElement("button")
            botonFiltroColor.innerText = producto.color
            botonFiltroColor.value = producto.color
            botonFiltroColor.className = "formulario__submit"

            botonFiltroColor.addEventListener("click", (e) => filtrarPorColor(e, listaProductos))

            contenedorFiltros.appendChild(botonFiltroColor)
            /* contenedorFiltros.innerHTML += `
                <button id=btn${producto.color} class='formulario__submit btnFiltros'>${producto.color}</button>
            ` */
        }
    })

    let botonTodos = document.getElementById("todos")
    botonTodos.addEventListener("click", (e) => filtrarPorColor(e, listaProductos))
}

function filtrarPorNombre(productos, valorBusqueda) {
    let productosFiltrados = productos.filter(producto => producto.nombre.includes(valorBusqueda))
    crearTarjetasProductos(productosFiltrados)
}

function filtrarPorColor(e, productos) {
    let produtosFiltrados = productos.filter(producto => producto.color.includes(e.target.value))
    crearTarjetasProductos(produtosFiltrados)
}

/**------------------------------------------------CARRITO----------------------------------------------- */
function setearCarrito(carrito) {
    let carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito",carritoJSON)
}

function obtenerCarrito() {
    let carrito =[]
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    return carrito
}

function agregarAlCarrito(e, productos) {
    let carrito = obtenerCarrito()
    let idProducto = Number(e.target.id)
    let productoBuscado = productos.find(producto => producto.id === idProducto)
    let indiceProdCarrito = carrito.findIndex(producto => producto.id === idProducto)
    if(indiceProdCarrito != -1) {
        carrito[indiceProdCarrito].unidades++
        carrito[indiceProdCarrito].subtotal = carrito[indiceProdCarrito].precioUnitario * carrito[indiceProdCarrito].unidades
    }else{
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,
            subtotal: productoBuscado.precio
        })
    }
    setearCarrito(carrito)
    renderizarCarrito(carrito)
    actualizarContadorCarrito()
}

function renderizarCarrito(carrito) {
    let contenedorCarrito = document.getElementById("contenedorCarrito")
    contenedorCarrito.innerHTML = ""
    carrito.forEach(producto => {
        contenedorCarrito.innerHTML += `
            <div class="tarjeta__producto__carrito">
                <p>ID: ${producto.id}</p>
                <p>Nombre: ${producto.nombre}</p>
                <p>Precio Unitario: $${producto.precioUnitario}</p>
                <p>Unidades: ${producto.unidades}</p>
                <p>Subtotal: $${producto.subtotal}</p>
            </div>
        `
    })
}

function actualizarContadorCarrito() {
    let memoria = JSON.parse(localStorage.getItem("carrito")) || []
    let cuenta = memoria.reduce((acum, current) => acum + current.unidades, 0)
    let contadorCarrito = document.getElementById("cuenta-carrito")
    contadorCarrito.innerText = cuenta
}

/**---------------------------------------------COMPRAR---------------------------------------------- */
function finalizarCompra() {
    alert("GRACIAS POR SU COMPRA")
    localStorage.removeItem("carrito")
    renderizarCarrito([])
    actualizarContadorCarrito()
}

/**----------------------------------------VER PRODUCTOS CARRITO------------------------------------- */
function verOcultar(e) {
    let contenedorProductos = document.getElementById("grid")
    let contenedorCarrito = document.getElementById("paginaCarrito")

    if(contenedorCarrito.className === "oculto") {
        e.target.innerText = "PRODUCTOS"
    }else{
        e.target.innerText = "CARRITO"
    }
    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
}
// mostrarOcultar carrito es el equivalente a la funcion verOcultar, solo que no necesita del parametro e
function mostrarOcultarCarrito() {
    let contenedorProductos = document.getElementById("grid")
    let contenedorCarrito = document.getElementById("paginaCarrito")
    let botonCarrito = document.getElementById("btnCarrito")

    if (contenedorCarrito.className === "oculto") {
        botonCarrito.innerText = "PRODUCTOS"
    } else {
        botonCarrito.innerText = "CARRITO"
    }
    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
}
/** ---------------------------------------EJERCUCION SCRIPT---------------------------------------- */
function main(remeras){
    crearTarjetasProductos(remeras)
    crearFiltrosPorColor(remeras)
    
    let carrito = obtenerCarrito()
    renderizarCarrito(carrito)
    actualizarContadorCarrito()

    let inputFiltro = document.getElementById("inputFiltros")
    let btnBuscar = document.getElementById("btnBuscar")

    btnBuscar.addEventListener("click", () => filtrarPorNombre(remeras, inputFiltro.value))

    let btnVerCarrito = document.getElementById("btnCarrito")
    btnVerCarrito.addEventListener("click", (e) => verOcultar(e))

    let botonComprar = document.getElementById("btnComprar")
    botonComprar.addEventListener("click", () => finalizarCompra())

    let contadorCarritoCompras = document.getElementById("cart")
    contadorCarritoCompras.addEventListener("click", mostrarOcultarCarrito)
}

main(remeras)
