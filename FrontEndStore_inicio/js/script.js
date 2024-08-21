let remeras = [
    {id: 1, img:"./img/1.jpg" , nombre: "vuejs", precio: 25, color: "gris"},
    {id: 2, img:"./img/2.jpg" , nombre: "angularjs", precio: 25, color: "gris"},
    {id: 3, img:"./img/3.jpg" , nombre: "react", precio: 40, color: "negro"},
    {id: 4, img:"./img/4.jpg" , nombre: "redux", precio: 25, color: "amarillo"},
    {id: 5, img:"./img/5.jpg" , nombre: "nodejs", precio: 35, color: "gris"},
    {id: 6, img:"./img/6.jpg" , nombre: "sass", precio: 25, color: "negro"},
    {id: 7, img:"./img/7.jpg" , nombre: "html5", precio: 15, color: "gris"},
    {id: 8, img:"./img/8.jpg" , nombre: "github", precio: 10, color: "violeta"},
    {id: 9, img:"./img/9.jpg" , nombre: "bulma", precio: 25, color: "rojo"},
    {id: 10, img:"./img/10.jpg" , nombre: "typescript", precio: 35, color: "blanco"},
    {id: 11, img:"./img/11.jpg" , nombre: "drupal", precio: 25, color: "azul"},
    {id: 12, img:"./img/12.jpg" , nombre: "javascript", precio: 45, color: "amarillo"},
    {id: 13, img:"./img/13.jpg" , nombre: "graphql", precio: 25, color: "negro"},
    {id: 14, img:"./img/14.jpg" , nombre: "wordpress", precio: 25, color: "rojo"}
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

            botonFiltroColor.addEventListener("click", (e) => filtrarPorColor(e, listaProductos, `${producto.color}`))

            contenedorFiltros.appendChild(botonFiltroColor)
        }
    })

    let botonTodos = document.getElementById("todos")
    let textoToast = "Filtro reseteado"
    botonTodos.addEventListener("click", (e) => filtrarPorColor(e, listaProductos, textoToast))
}

function filtrarPorNombre(productos, valorBusqueda) {
    let valorBusquedaLower = valorBusqueda.toLowerCase()
    let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorBusquedaLower))
    crearTarjetasProductos(productosFiltrados)
    alertaToast(`Busqueda realizada: ${valorBusqueda}`)
}

function filtrarPorColor(e, productos, texto) {
    let produtosFiltrados = productos.filter(producto => producto.color.includes(e.target.value))
    crearTarjetasProductos(produtosFiltrados)
    alertaToast(texto)
}

/**--------------------------------------------LOCALSTORAGE---------------------------------------------- */
function setearCarrito(carrito) {
    let carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito",carritoJSON)
}

function obtenerCarrito() {
    let carrito = []
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    return carrito
}

function setearTotal(total) {
    localStorage.setItem("total", total)
}

function obtenerTotal() {
    let total = localStorage.getItem("total");
    return total ? Number(total) : 0
}
/**------------------------------------------------CARRITO----------------------------------------------- */
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
    actualizarContadorCarrito()
    renderizarCarrito(carrito)
    calcularTotal(carrito)
    mostrarTotal()
    alertaToast('Producto agregado al carrito')
}

function renderizarCarrito(carrito) {
    let contenedorCarrito = document.getElementById("contenedorCarrito");
    contenedorCarrito.innerHTML = ""

    carrito.forEach(producto => {
        contenedorCarrito.innerHTML += `
            <div id="tc${producto.id}" class="tarjeta__producto__carrito">
                <img src="./img/${producto.id}.jpg" alt="Producto ${producto.nombre}">
                <p>ID: ${producto.id}</p>
                <p>Nombre: ${producto.nombre}</p>
                <p>Precio Unitario: $${producto.precioUnitario}</p>
                <div class="cantidades">
                    <button id="br${producto.id}" class="formulario__submit btn__cantidad">-</button>
                    <p>${producto.unidades}</p>
                    <button id="bs${producto.id}" class="formulario__submit btn__cantidad">+</button>
                </div>
                <p>Subtotal: $${producto.subtotal}</p>
                <button id="be${producto.id}" class="formulario__submit btn__cantidad">Eliminar</button>
            </div>
        `
    })

    carrito.forEach(producto => {
        let botonEliminar = document.getElementById(`be${producto.id}`)
        botonEliminar.addEventListener("click", (e) => eliminarProductoCarrito(e))

        let botonSumar = document.getElementById(`bs${producto.id}`)
        botonSumar.addEventListener("click", (e) => sumarUnidad(e))

        let botonRestar = document.getElementById(`br${producto.id}`)
        botonRestar.addEventListener("click", (e) => restarUnidad(e))
    });
}



/*---------------------------------------------------BOTONES-------------------------------------------*/
function sumarUnidad(e) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let productoBuscado = carrito.find(producto => producto.id === id)
    
    if (productoBuscado) {
        productoBuscado.unidades++
        productoBuscado.subtotal = productoBuscado.unidades * productoBuscado.precioUnitario
        setearCarrito(carrito)
        renderizarCarrito(carrito)
        actualizarContadorCarrito()
        calcularTotal(carrito)
        mostrarTotal()
        alertaToast('Unidad agregada del carrito')
    }
}

function restarUnidad(e) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()
    let productoBuscado = carrito.find(producto => producto.id === id)
    
    if (productoBuscado && productoBuscado.unidades > 1) {
        productoBuscado.unidades--
        productoBuscado.subtotal = productoBuscado.unidades * productoBuscado.precioUnitario
        setearCarrito(carrito)
        renderizarCarrito(carrito)
        actualizarContadorCarrito()
        calcularTotal(carrito)
        mostrarTotal()
        alertaToast('Unidad quitada del carrito')
    } else if (productoBuscado.unidades === 1) {
        eliminarProductoCarrito(e)
    }
}

function eliminarProductoCarrito(e) {
    let id = Number(e.target.id.substring(2))
    let carrito = obtenerCarrito()

    carrito = carrito.filter(producto => producto.id !== id)
    
    setearCarrito(carrito)
    renderizarCarrito(carrito)
    actualizarContadorCarrito()
    calcularTotal(carrito)
    mostrarTotal()
    alertaToast('Producto eliminado del carrito')
}

function calcularTotal(carrito) {
    let total = carrito.reduce((acum, producto) => acum + producto.subtotal, 0)
    localStorage.setItem("total", total)
    mostrarTotal()
}

function mostrarTotal() {
    let total = obtenerTotal()
    let contenedorTotal = document.getElementById("total")
    contenedorTotal.innerHTML = total > 0 ? `<h3>TOTAL: $${total}</h3>` : ""
}

function actualizarContadorCarrito() {
    let memoria = JSON.parse(localStorage.getItem("carrito")) || []
    let cuenta = memoria.reduce((acum, current) => acum + current.unidades, 0)
    let contadorCarrito = document.getElementById("cuenta-carrito")
    contadorCarrito.innerText = cuenta
}

/**---------------------------------------------COMPRAR---------------------------------------------- */
function finalizarCompra() {
    let carrito = obtenerCarrito()

    if (carrito.length === 0){
        alertaToast("El carrito esta vacio")
    } else {
        alertaCartel()
        localStorage.removeItem("carrito")
        localStorage.removeItem("total")
        renderizarCarrito([])
        actualizarContadorCarrito()
        mostrarTotal()
    }
}

/**----------------------------------------VER PRODUCTOS CARRITO------------------------------------- */
function mostrarOcultarCarrito() {
    let contenedorProductos = document.getElementById("grid")
    let contenedorCarrito = document.getElementById("paginaCarrito")
    let botonCarrito = document.getElementById("btnCarrito")
    let busquedaReset = document.getElementById("busqueda__reset")
    let filtrosColor = document.getElementById("filtros__color")
    let contenedorFiltros = document.getElementById("filtros")

    if (contenedorCarrito.className === "oculto") {
        botonCarrito.innerText = "PRODUCTOS"
        contenedorFiltros.classList.add("rowReverse")
        alertaToast("Carrito mostrado")
    } else {
        botonCarrito.innerText = "CARRITO"
        contenedorFiltros.classList.remove("rowReverse")
        alertaToast("Productos mostrados")
    }
    contenedorCarrito.classList.toggle("oculto")
    contenedorProductos.classList.toggle("oculto")
    busquedaReset.classList.toggle("oculto")
    filtrosColor.classList.toggle("oculto")
}

/** ---------------------------------------SWEET ALERT----------------------------------------------- */
const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
})

function alertaToast(titulo) {
    Toast.fire({
        icon:'success',
        title: titulo
    })
}

function alertaCartel() {
    Swal.fire({
        title: 'Compra realizada con exito',
        text: 'Gracias por su compra',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#FFCE00',
        color: 'black'
    })
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
    btnVerCarrito.addEventListener("click", mostrarOcultarCarrito)

    let botonComprar = document.getElementById("btnComprar")
    botonComprar.addEventListener("click", () => finalizarCompra())

    let contadorCarritoCompras = document.getElementById("cart")
    contadorCarritoCompras.addEventListener("click", mostrarOcultarCarrito)
}

main(remeras)