const carrito = JSON.parse(localStorage.getItem("carrito")) || []; 

const productos = [
    {
        id: "abrigo-01",
        titulo: "Top Malibu",
        precio: 5000,
        img: "./assets/topmalibu.jpg",
    },
    {
        id: "abrigo-02",
        titulo: "Outfit completo",
        precio: 35000,
        img: "./assets/summeroutfit.jpg",
    },
    {
        id: "abrigo-03",
        titulo: "Orange`s",
        precio: 3000,
        img: "./assets/topnaranja.jpg",
    }
];

const contenedorProductos = document.querySelector("#productos");//contiene a todos los productos
const carritoVacio = document.querySelector("#carrito-vacio"); //div
const carritoProductos = document.querySelector("#carrito-productos"); //agrego productos
const carritoTotal = document.querySelector("#carrito-total");//precio-total
const vaciarCarrito = document.querySelector("#vaciarCarrito");


productos.forEach((producto) => {

    let div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src="${producto.img}" alt="">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
    `;

    let button = document.createElement("button");
    button.classList.add("producto-btn");
    button.innerText = "Agregar al carrito";
    button.addEventListener("click", () => {
        agregarAlCarrito(producto);
    })

    div.append(button);
    contenedorProductos.append(div);
});

const agregarAlCarrito = (producto) => {
    let productoEnCarrito = carrito.find((item) => item.id === producto.id)
    
    if(productoEnCarrito ){
        productoEnCarrito.cantidad++;
    }else{
        carrito.push({...producto, cantidad: 1});
    }
    console.log(carrito);
    actualizarCarrito();

    Toastify({
        text: producto.titulo+ " agregado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        style: {
          background: "#1f1e1e",
          color: "#f2ebd9"
        },
      }).showToast();
}

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>${producto.cantidad}</p>
                <p>$${producto.cantidad * producto.precio}</p>
            `;

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "✖️";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            })

            div.append(button);
            carritoProductos.append(div);
        })
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
actualizarCarrito(); 

function borrarDelCarrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = "$" + total;
}
vaciarCarrito.addEventListener("click", () => {
    const cantidadTotal = carrito.reduce ((acc, prod) => acc + prod.cantidad, 0);
    Swal.fire({
        title: "¿Seguro de vaciar el carrito?",
        text: "Se eliminaran "+ cantidadTotal+ " productos",
        icon: "question",
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: "Si",
    }).then ((result) => {
        if(result.isConfirmed){
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                icon: "success",
                title: "Vaciado correctamente",
                showConfirmButton: false,
                timer: 1700
              });
        }
    })
    
})