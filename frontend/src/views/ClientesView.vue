<template>
    <div>

        <div class="card">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-6">
                        <h5 class="card-title">Clientes</h5>
                    </div>
                    <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-warning" data-bs-toggle="modal"
                            data-bs-target="#modalCliente">
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
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Documento</th>
                                <th>Tipo documento</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" :key="item">
                                <td>{{ item.id }}</td>
                                <td>{{ item.nombres }}</td>
                                <td>{{ item.apellidos }}</td>
                                <td>{{ item.documento }}</td>
                                <td>{{ item.tipo_documento }}</td>
                                <td>{{ item.telefono }}</td>
                                <td>{{ item.correo }}</td>
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
        <div class="modal fade" id="modalCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Datos del cliente</h1>
                        <button type="button" @click="reset()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <form action="#" class="needs-validation" novalidate>
                        <div class="modal-body">

                            <div class="mb-3">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" v-model="nombres" id="nombres" class="form-control" required />
                            </div>

                            <div class="mb-3">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" v-model="apellidos" id="apellidos" class="form-control" required />
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="documento" class="form-label">Documento</label>
                                        <input type="text" v-model="documento" id="documento" class="form-control"
                                            required />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="tipo_documento" class="form-label">Tipo documento</label>
                                        <select v-model="tipo_documento" id="tipo_documento" class="form-control">
                                            <option value="CI">CI</option>
                                            <option value="NIT">NIT</option>
                                            <option value="PASS">PASS</option>
                                            <option value="CEX">CEX</option>
                                        </select>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="telefono" class="form-label">Teléfono</label>
                                        <input type="text" v-model="telefono" id="telefono" class="form-control"
                                            placeholder="+591 XXXXXXXX" required />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="correo" class="form-label">Correo</label>
                                        <input type="email" v-model="correo" id="correo" class="form-control"
                                            placeholder="example@example.com" />
                                    </div>
                                </div>
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

const clientes = ref([]);
let baseURL = 'http://localhost:3000/clientes';

const nombres = ref('');
const apellidos = ref('');
const documento = ref('');
const tipo_documento = ref('');
const telefono = ref('');
const correo = ref('');

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
});

const obtenerDatos = async (param = 'p0') => {
    try {
        let url = baseURL;
        if (param != 'p0') {
            url = baseURL + '?page=' + param;
        }

        const { data } = await axios.get(url, header);
        console.log(data);

        clientes.value = data.data;
        paginacion.value = data.pagination;
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const registrar = async () => {

    if(nombres.value == '' || apellidos.value == '' || documento.value == '' || tipo_documento.value == '' || telefono.value == '' || correo.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        documento: documento.value,
        tipo_documento: tipo_documento.value,
        telefono: telefono.value,
        correo: correo.value,
        estado: 1
    }

    try {
        const { data } = await axios.post(baseURL + '/store', datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalCliente');
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

    nombres.value = item.nombres;
    apellidos.value = item.apellidos;
    documento.value = item.documento;
    tipo_documento.value = item.tipo_documento;
    telefono.value = item.telefono;
    correo.value = item.correo;
    var myModalEl = document.getElementById('modalCliente');
    var modal = new bootstrap.Modal(myModalEl);
    modal.show();
}

// actualizar
const actualizar = async () => {

    if(nombres.value == '' || apellidos.value == '' || documento.value == '' || tipo_documento.value == '' || telefono.value == '' || correo.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Todos los campos son obligatorios',
        });
        return;
    }

    const datos = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        documento: documento.value,
        tipo_documento: tipo_documento.value,
        telefono: telefono.value,
        correo: correo.value,
        estado: seleccionado.value.estado
    }

    try {
        const { data } = await axios.put(baseURL + '/update/' + seleccionado.value.id, datos, header);
        console.log(data);
        obtenerDatos();
        reset();
        // document.querySelector('button.btn-close').click();
        var myModalEl = document.getElementById('modalCliente');
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
        obtenerDatos();
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
        obtenerDatos();
    } catch (error) {
        console.log(error);
        if (error.response.status == 403 || error.response.status == 401) {
            expirado();
        }
    }
}

const reset = () => {
    nombres.value = '';
    apellidos.value = '';
    documento.value = '';
    tipo_documento.value = '';
    telefono.value = '';
    correo.value = '';
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