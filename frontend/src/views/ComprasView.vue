<template>
    <div>

        <div class="card">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="card-title">Compras</h5>
                    </div>
                    <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                            data-bs-target="#modalCompras">
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
                                <th>Proveedor</th>
                                <th>Fecha</th>
                                <th>Nro Comprobante</th>
                                <th>Total</th>
                                <!-- <th>Usuario</th> -->
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in compras" :key="item">
                                <td>{{ item.id }}</td>
                                <td>{{ item.proveedor }}</td>
                                <td>{{ new Date(item.fecha).toLocaleDateString() }}</td>
                                <td>{{ item.comprobante }}</td>
                                <td>{{ item.total }}</td>
                                <!-- <td>Jose Mamani</td> -->
                                <td>
                                    <button type="button" @click="verCompra(item)" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalVer">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <button type="button" @click="eliminar(item)" class="btn btn-danger btn-sm">
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


        <!-- Modal compras -->
        <div class="modal fade" id="modalCompras" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Datos de la compra</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="row">
                            <div class="col-md-6">
                                <!-- listado de productos  -->
                                <div class="card m-1">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <input type="text" id="buscar" class="form-control"
                                                    placeholder="Buscar...">
                                            </div>
                                        </div>

                                        <div class="table-responsive">
                                            <table class="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Costo</th>
                                                        <th>Stock actual</th>
                                                        <th>Agregar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="item in productos" :key="item">
                                                        <td>{{ item.codigo + ' - ' + item.nombre }}</td>
                                                        <td>{{ item.costo }}</td>
                                                        <td>{{ item.stock }}</td>
                                                        <td>
                                                            <button type="button" @click="agregar(item)"
                                                                class="btn btn-primary btn-sm">
                                                                <i class="fa fa-plus"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <!-- detalle de la compra  -->
                                <div class="card m-1">
                                    <div class="card-body">

                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="proveedor_id" class="form-label">Proveedor</label>
                                                    <select v-model="proveedor_id" id="proveedor_id" class="form-select"
                                                        required>
                                                        <option value="">Seleccione proveedor...</option>
                                                        <option v-for="item in proveedores" :key="item"
                                                            :value="item.id">{{ item.empresa }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="mb-3">
                                                    <label for="comprobante" class="form-label">Nro comprobante</label>
                                                    <input type="text" v-model="comprobante" id="comprobante"
                                                        class="form-control" required />
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="mb-3">
                                                    <label for="fecha" class="form-label">Fecha</label>
                                                    <input type="date" v-model="fecha" id="fecha" class="form-control"
                                                        required />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="table-responsive">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Costo</th>
                                                        <th width="15%">Cantidad</th>
                                                        <th>Subtotal</th>
                                                        <th>Quitar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(det, i) in detalles" :key="det">
                                                        <td>{{ det.nombre }}</td>
                                                        <td>{{ det.costo }}</td>
                                                        <td>
                                                            <input type="number" :value="det.cantidad"
                                                                @change="actualizarCantidad(i, $event.target.value)"
                                                                min="1" class="form-control">
                                                        </td>
                                                        <td>
                                                            {{ det.costo * det.cantidad }}
                                                        </td>
                                                        <td>
                                                            <button @click="quitar(i)" type="button"
                                                                class="btn btn-danger btn-sm">
                                                                <i class="fa fa-times"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th colspan="3" class="text-end">Total:</th>
                                                        <th colspan="2" align="left">{{ total }}</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        <div class="text-center">
                                            <button type="button" @click="registrar()"
                                                class="btn btn-primary">Guardar</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <!-- <button type="submit" class="btn btn-primary">Guardar</button> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal ver -->
        <div class="modal fade" id="modalVer" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
            role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered " role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitleId">
                            Informacion de la compra
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="seleccionado && seleccionado.id" class="modal-body">
                        <table class="table table-sm">
                            <tr>
                                <th>Proveedor</th>
                                <td>{{ seleccionado.proveedor }}</td>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <td>{{ seleccionado.total }}</td>
                            </tr>
                            <tr>
                                <th>Fecha</th>
                                <td>{{ seleccionado.fecha }}</td>
                            </tr>
                            <tr>
                                <th>Comprobante</th>
                                <td>{{ seleccionado.comprobante }}</td>
                            </tr>
                        </table>

                        <h5>Productos comprados</h5>

                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Costo</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in seleccionado.detalles" :key="item">
                                    <td>{{ item.producto }}</td>
                                    <td>{{ item.cantidad }}</td>
                                    <td>{{ item.costo }}</td>
                                    <td>{{ item.costo * item.cantidad }}</td>
                                </tr>
                            </tbody>
                        </table>    

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Cerrar
                        </button>
                    </div>
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

const compras = ref([]);
let baseURL = 'http://localhost:3000/';

const proveedores = ref([]);
const productos = ref([]);

const proveedor_id = ref('');
const total = ref('');
const fecha = ref('');
const comprobante = ref('');

const detalles = ref([]);

const seleccionado = ref({});
const paginacion = ref({});

const token = localStorage.getItem('token') || '';
const header = {
  headers: {
    'authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

onMounted(() => {

    if(token == '' || token == null){
        expirado();
    }

    obtenerDatos();
    obtenerProveedores();
    obtenerProductos();
})

const obtenerDatos = async (param = 'p0') => {
    try {
        let url = baseURL + 'compras';
        if (param != 'p0') {
            url = baseURL + 'compras?page=' + param;
        }

        const { data } = await axios.get(url, header);
        console.log(data);
        compras.value = data.data;
        paginacion.value = data.pagination;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
           expirado();
        }
    }
}

const obtenerProveedores = async () => {
    try {
        const { data } = await axios.get(baseURL + 'proveedores', header);
        console.log(data);
        proveedores.value = data.data;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
           expirado();
        }
    }
}

const obtenerProductos = async () => {
    try {
        const { data } = await axios.get(baseURL + 'productos', header);
        console.log(data);
        productos.value = data.data;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
           expirado();
        }
    }
}

const agregar = (item) => {
    const det = {
        producto_id: item.id,
        nombre: item.codigo + ' - ' + item.nombre,
        costo: item.costo,
        cantidad: 1
    }

    detalles.value.push(det);

    calcularTotal();
}

const quitar = (i) => {
    detalles.value.splice(i, 1);

    calcularTotal();
}

const actualizarCantidad = (i, cant) => {
    const det = detalles.value[i];
    det.cantidad = cant;

    detalles.value.splice(i, 1, det);

    calcularTotal();
}

const calcularTotal = () => {
    total.value = detalles.value.reduce((total, item) => {
        return total + (item.costo * item.cantidad)
    }, 0);
}


const registrar = async () => {

    if(proveedor_id.value == '' || total.value == '' || fecha.value == '' || comprobante.value == '' || detalles.value.length == 0 ) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        proveedor_id: proveedor_id.value,
        total: total.value,
        fecha: fecha.value,
        comprobante: comprobante.value,
        detalles: detalles.value
    }

    try {
        const { data } = await axios.post(baseURL + 'compras/store', datos, header);
        console.log(data);
        obtenerDatos();
        obtenerProductos();
        // reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalCompras');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();

    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
           expirado();
        }
    }
}

const verCompra = async(item) => {
    seleccionado.value = item;

    // obtener el detalle
    try {
        const { data } = await axios.get(baseURL + 'compras/detalle/' + item.id, header);
        console.log(data);
        seleccionado.value.detalles = data.data;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
           expirado();
        }
    }
}

const eliminar = async(item) => {
    if(confirm('¿Deseas eliminar la compra ' + item.comprobante + '?')) {
        try {
            const { data } = await axios.delete(baseURL + 'compras/eliminar/' + item.id, header);
            console.log(data);
            obtenerDatos();
            obtenerProductos();
        } catch (error) {
            console.log(error);
            if (error.response.status == 403 || error.response.status == 401) {
            expirado();
            }
        }
    }
}

const expirado = () => {
      Swal.fire({
          icon: 'error',
          title: 'Sesión expirada',
          text: 'Debes iniciar sesión',
          timer: 1500
      });

      route.push({path: '/login'});
}

</script>

<style scoped></style>