<template>
    <div>

        <div class="card">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="card-title">Productos</h5>
                    </div>
                    <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                            data-bs-target="#modalProductos">
                            <i class="fa fa-plus"></i>
                            Nuevo
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Codigo</th>
                                <th>Costo</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in productos" :key="item">
                                <td>{{ item.id }}</td>
                                <td>{{ item.nombre }}</td>
                                <td>{{ item.codigo }}</td>
                                <td>{{ item.costo }}</td>
                                <td>{{ item.precio }}</td>
                                <td>{{ item.stock }}</td>
                                <td>
                                    <span v-if="item.estado" class="badge text-bg-success">Activo</span>
                                    <span v-else class="badge text-bg-danger">Inactivo</span>
                                </td>
                                <td>
                                    <!-- <a href="#" class="btn btn-primary btn-sm">
                                    <i class="fa fa-eye"></i>
                                </a> -->
                                    <button @click="seleccionar(item)" class="btn btn-warning btn-sm">
                                        <i class="fa fa-edit"></i>
                                    </button>

                                    <button v-if="item.estado" @click="estado(item.id)" class="btn btn-danger btn-sm">
                                        <i class="fa fa-ban"></i>
                                    </button>
                                    <button v-else @click="estado(item.id)" class="btn btn-primary btn-sm">
                                        <i class="fa fa-check"></i>
                                    </button>
                                    <button v-if="item.estado == 0" @click="eliminar(item.id)"
                                        class="btn btn-danger btn-sm">
                                        <i class="fa fa-trash"></i>
                                    </button>

                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <nav v-if="paginacion.total > 0" aria-label="Page navigation example">
                        <ul class="pagination justify-content-end">
                            <li v-if="paginacion.previous == null" class="page-item disabled">
                                <button class="page-link">Previous</button>
                            </li>
                            <li v-else class="page-item">
                                <button @click="obtenerDatos(paginacion.previous)" class="page-link">Previous</button>
                            </li>
                            
                            <li v-for="item in paginacion.pages" :key="item" class="page-item" :class="paginacion.current == item ? 'active' : ''">
                                <button @click="obtenerDatos(item)" class="page-link" >{{ item }}</button>
                            </li>                            

                            <li v-if="paginacion.next == null" class="page-item disabled">
                                <button class="page-link">Next</button>
                            </li>
                            <li v-else class="page-item">
                                <button @click="obtenerDatos(paginacion.next)" class="page-link">Next</button>
                            </li>
                        </ul>
                    </nav>

                </div>

            </div>
        </div>


        <!-- Modal -->
        <div class="modal fade" id="modalProductos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Datos del producto</h1>
                        <button type="button" @click="reset()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <form action="#" class="needs-validation" novalidate>
                        <div class="modal-body">

                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" v-model="nombre" id="nombre" class="form-control" required />
                            </div>

                            <div class="mb-3">
                                <label for="codigo" class="form-label">Codigo</label>
                                <input type="text" v-model="codigo" id="codigo" class="form-control"
                                    placeholder="Jhon Doe" required />
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="costo" class="form-label">Costo</label>
                                        <input type="number" v-model="costo" id="costo" class="form-control" required />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="precio" class="form-label">Precio</label>
                                        <input type="number" v-model="precio" id="precio" class="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="stock" class="form-label">Stock inicial</label>
                                <input type="number" v-model="stock" id="stock" class="form-control" />
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" @click="reset()" class="btn btn-secondary"
                                data-bs-dismiss="modal">Cerrar</button>
                            <button v-if="seleccionado && seleccionado.id == null" type="button" @click="registrar()"
                                class="btn btn-primary">Guardar</button>
                            <button v-else type="button" @click="actualizar()"
                                class="btn btn-primary">Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'

import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
const route = useRouter();

const productos = ref([]);
let baseURL = 'http://localhost:3000/productos';

const nombre = ref('');
const codigo = ref('');
const costo = ref(0);
const precio = ref(0);
const stock = ref(0);

const paginacion = ref({});

const seleccionado = ref({});

const token = localStorage.getItem('token') || '';
const header = {
    headers: {
        'authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

onMounted(() => {

    if (token == '' || token == null) {
        expirado();
    }

    obtenerDatos('p0');
});

const obtenerDatos = async (param) => {
    try {

        let url = baseURL;
        if (param != 'p0') {
            url = baseURL + '?page=' + param;
        }
        
        const { data } = await axios.get(url, header);
        console.log(data);

        productos.value = data.data;
        paginacion.value = data.pagination;

    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const registrar = async () => {
    if (nombre.value == '' || codigo.value == '' || costo.value == '' || precio.value == '' || stock.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        nombre: nombre.value,
        codigo: codigo.value,
        costo: costo.value,
        precio: precio.value,
        stock: stock.value,
        estado: 1
    }

    try {
        const { data } = await axios.post(baseURL + '/store', datos, header);
        console.log(data);
        obtenerDatos('p0');
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalProductos');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

// seelccionar
const seleccionar = (item) => {

    seleccionado.value = item;

    nombre.value = item.nombre;
    codigo.value = item.codigo;
    costo.value = item.costo;
    precio.value = item.precio;
    stock.value = item.stock;

    var myModalEl = document.getElementById('modalProductos');
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
}

// actualizar
const actualizar = async () => {

    if (nombre.value == '' || codigo.value == '' || costo.value == '' || precio.value == '' || stock.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        nombre: nombre.value,
        codigo: codigo.value,
        costo: costo.value,
        precio: precio.value,
        stock: stock.value,
        estado: seleccionado.value.estado
    }

    try {
        const { data } = await axios.put(baseURL + '/update/' + seleccionado.value.id, datos, header);
        console.log(data);
        obtenerDatos('p0');
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalProductos');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

// ESTADO
const estado = async (id) => {
    try {
        const { data } = await axios.get(baseURL + '/estado/' + id, header);
        obtenerDatos('p0');
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

// ELIMINAR
const eliminar = async (id) => {
    try {
        const { data } = await axios.delete(baseURL + '/delete/' + id, header);
        obtenerDatos('p0');
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const reset = () => {
    nombre.value = '';
    codigo.value = '';
    costo.value = '';
    precio.value = '';
    stock.value = '';
}

const expirado = () => {
    Swal.fire({
        icon: 'error',
        title: 'Sesión expirada',
        text: 'Debes iniciar sesión',
        timer: 1500
    });

    route.push({ path: '/login' });
}

</script>

<style scoped>
.pagination .page-item {
    display: inline-block;
}

.pagination .page-item:nth-child(n+4):nth-last-child(n+4):not(.active) {
    display: none;
}

</style>